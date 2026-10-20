document.addEventListener('DOMContentLoaded', function() {

  // Countdown Timer Evergreen 24h
  (function() {
    const STORAGE_KEY = 'nails_countdown_expiry';
    const DURATION = 24 * 60 * 60 * 1000; // 24 horas
    
    let expiryTime = localStorage.getItem(STORAGE_KEY);
    
    if (!expiryTime || Date.now() > parseInt(expiryTime)) {
      expiryTime = Date.now() + DURATION;
      localStorage.setItem(STORAGE_KEY, expiryTime);
    }
    
    function updateCountdown() {
      const now = Date.now();
      const diff = Math.max(0, expiryTime - now);
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      document.getElementById('hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

      if (diff === 0) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  })();

  // Lite YouTube Embed
  document.querySelectorAll('.lite-youtube').forEach(container => {
    const playButton = container.querySelector('.play-button');
    const iframeContainer = container.querySelector('.video-iframe-container');
    const videoId = container.dataset.videoid;
    const isShort = container.dataset.isShort === 'true';
    
    if (!playButton || !iframeContainer || !videoId) return;

    playButton.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      
      if (isShort) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      } else {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      }
      
      iframe.setAttribute('title', 'YouTube video player');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      
      iframeContainer.innerHTML = '';
      iframeContainer.appendChild(iframe);
      
      container.querySelector('img').style.display = 'none';
      playButton.style.display = 'none';
      
      if (isShort) {
        container.style.aspectRatio = '9/16';
        container.style.maxWidth = '500px';
        container.style.margin = '0 auto';
      }
    });
  });

  // Accordion
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');
      
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion-content').style.maxHeight = '0';
      });
      
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Floating CTA - Siempre visible una vez que aparece
  const bonosSection = document.getElementById('bonos-section');
  const floatingCta = document.getElementById('floating-cta');
  const garantiaSection = document.getElementById('garantia-section');
  let floatingButtonShown = false;

  if (bonosSection && floatingCta && garantiaSection && 'IntersectionObserver' in window) {
    const showButtonObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !floatingButtonShown) {
          floatingCta.classList.add('visible');
          floatingButtonShown = true;
        }
      });
    }, { threshold: 0.2 });

    const hideButtonObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (floatingButtonShown) {
          if (entry.isIntersecting) {
            floatingCta.classList.remove('visible');
          } else {
            floatingCta.classList.add('visible');
          }
        }
      });
    }, { threshold: 0.1 });

    showButtonObserver.observe(bonosSection);
    hideButtonObserver.observe(garantiaSection);
  }

  // Carrusel de Testimonios
  (function() {
    const track = document.getElementById('testimonialCarousel');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const slides = track.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
    
    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }
    
    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }
    
    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    setInterval(nextSlide, 5000);
  })();

});