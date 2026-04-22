# Gunakan image Nginx ringan
FROM nginx:alpine

# Salin seluruh isi folder ke direktori default Nginx
COPY . /usr/share/nginx/html

# Konfigurasi Nginx untuk menangani SPA (jika pakai routing client-side)
RUN echo "server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files \$uri /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Ekspose port 80
EXPOSE 80

# Jalankan nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
