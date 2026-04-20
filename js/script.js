/// Hapus tombol toggle (opsional)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.remove(); // atau sembunyikan saja jika butuh tetap ada
    // themeToggle.style.display = 'none';
}

// Paksa set tema ke 'dark'
const body = document.body;
const theme = 'dark';
body.setAttribute('data-theme', theme);

// Simpan ke localStorage untuk konsistensi jika reload
localStorage.setItem('theme', theme);

// Optional: kalau sebelumnya kamu pakai icon, kita bisa set manual (kalau tidak dihapus)
function updateToggleIcon() {
    const icon = themeToggle?.querySelector('i');
    if (!icon) return;
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}
const contactForm = document.getElementById('contactForm');

    // Mobile Menu Toggle - Diperbaiki
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });
    
    // Smooth scrolling dengan memperhatikan mobile menu - Diperbaiki
    document.querySelectorAll('.nav-links a, .footer-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Tutup mobile menu jika terbuka
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#')) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Tambahkan animasi tambahan jika diperlukan
                    targetElement.classList.add('highlight-section');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight-section');
                    }, 1000);
                }
            }
            // Biarkan link eksternal berperilaku normal
        });
    });
    
    // Intersection Observer untuk animasi
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }
    });
}
    // Update tahun di footer
    document.getElementById('year').textContent = new Date().getFullYear();

function setupProjectSlider() {
  const projectsTrack = document.querySelector('.projects-track');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (!projectsTrack || projectCards.length === 0) return;

  const cardWidth = projectCards[0].offsetWidth + 32; // 32 = margin gap
  const totalCards = projectCards.length;

  // Clone cards untuk seamless scroll
  projectCards.forEach(card => {
    const clone = card.cloneNode(true);
    projectsTrack.appendChild(clone);
  });

  let currentIndex = 0;
  const slideInterval = 3000;
  let intervalId = setInterval(slideNext, slideInterval);

  function slideNext() {
    currentIndex++;
    projectsTrack.style.transition = 'transform 0.5s ease-in-out';
    projectsTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    if (currentIndex >= totalCards) {
      setTimeout(() => {
        projectsTrack.style.transition = 'none';
        projectsTrack.style.transform = 'translateX(0)';
        currentIndex = 0;
      }, 500); // Tunggu animasi selesai
    }
  }

  projectsTrack.addEventListener('mouseenter', () => {
    clearInterval(intervalId);
  });

  projectsTrack.addEventListener('mouseleave', () => {
    intervalId = setInterval(slideNext, slideInterval);
  });

  // Swipe gesture support
  let startX = 0;
  let isSwiping = false;

  projectsTrack.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    clearInterval(intervalId);
  }, { passive: true });

  projectsTrack.addEventListener('touchmove', e => {
    isSwiping = true;
  }, { passive: true });

  projectsTrack.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const deltaX = startX - endX;
    if (deltaX > 50) slideNext(); // swipe left
    if (deltaX < -50) {
      currentIndex = Math.max(0, currentIndex - 1);
      projectsTrack.style.transition = 'transform 0.5s ease-in-out';
      projectsTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
    intervalId = setInterval(slideNext, slideInterval);
    isSwiping = false;
  }, { passive: true });
}
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setupProjectSlider);
