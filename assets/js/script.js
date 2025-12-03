// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {

  // Mobile Menu Toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Image Slider Functionality
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const nextButton = document.getElementById('nextSlide');
  const prevButton = document.getElementById('prevSlide');

  function showSlide(index) {
    // Hide all slides
    slides.forEach(function(slide, i) {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });

    // Update dots
    dots.forEach(function(dot, i) {
      dot.classList.remove('active');
      if (i === index) {
        dot.classList.add('active');
      }
    });

    currentSlide = index;
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  // Event listeners for navigation
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      nextSlide();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', function() {
      prevSlide();
    });
  }

  // Dot navigation
  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      showSlide(index);
    });
  });

  // Auto-slide functionality
  let autoSlideInterval = setInterval(nextSlide, 5000);

  // Pause auto-slide on hover
  const sliderContainer = document.querySelector('.slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', function() {
      clearInterval(autoSlideInterval);
    });

    sliderContainer.addEventListener('mouseleave', function() {
      autoSlideInterval = setInterval(nextSlide, 5000);
    });
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Initialize first slide
  showSlide(0);
});