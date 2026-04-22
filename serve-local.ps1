param(
    [int]$Port = 8080
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = New-Object System.IO.StreamReader(
                $stream,
                [System.Text.Encoding]::ASCII,
                $false,
                1024,
                $true
            )

            $requestLine = $reader.ReadLine()
            while (($line = $reader.ReadLine()) -ne "") { }

            if (-not $requestLine) {
                $client.Close()
                continue
            }

            $parts = $requestLine.Split(" ")
            $pathPart = if ($parts.Length -ge 2) { $parts[1] } else { "/" }
            $pathOnly = $pathPart.Split("?")[0]
            $reqPath = [System.Uri]::UnescapeDataString($pathOnly.TrimStart("/"))

            if ([string]::IsNullOrWhiteSpace($reqPath)) {
                $reqPath = "index.html"
            }

            $safePath = $reqPath -replace "/", "\"
            $fullPath = Join-Path $root $safePath

            if ((Test-Path -LiteralPath $fullPath) -and -not (Get-Item -LiteralPath $fullPath).PSIsContainer) {
                $ext = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
                $contentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css" { "text/css; charset=utf-8" }
                    ".js" { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".png" { "image/png" }
                    ".jpg" { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".gif" { "image/gif" }
                    ".svg" { "image/svg+xml" }
                    ".ico" { "image/x-icon" }
                    default { "application/octet-stream" }
                }

                $body = [System.IO.File]::ReadAllBytes($fullPath)
                $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
            } else {
                $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
            }

            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($body, 0, $body.Length)
            $stream.Flush()
        } finally {
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
}
