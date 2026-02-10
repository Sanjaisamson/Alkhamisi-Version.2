// Gallery Functionality
class Gallery {
  constructor() {
    this.galleryGrid = document.getElementById('gallery-grid');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.currentImageIndex = 0;
    
    // Total number of images - update this when you add more images
    this.totalImages = 12;
    
    // Generate image paths automatically
    this.galleryImages = this.generateImagePaths();

    this.init();
  }

  generateImagePaths() {
    const images = [];
    for (let i = 1; i <= this.totalImages; i++) {
      images.push({
        id: i,
        image: `../assets/images/project_Images/project_img_${i}.jpeg`,
        alt: `Project Image ${i}`
      });
    }
    return images;
  }

  init() {
    this.renderGallery();
    this.setupLightbox();
  }

  renderGallery() {
    if (!this.galleryGrid) return;

    this.galleryGrid.innerHTML = '';
    
    this.galleryImages.forEach((item, index) => {
      const galleryItem = this.createGalleryItem(item, index);
      this.galleryGrid.appendChild(galleryItem);
    });

    // Initialize Lucide icons for new elements
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  createGalleryItem(item, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.setAttribute('data-index', index);

    div.innerHTML = `
      <div class="gallery-item-image">
        <img src="${item.image}" alt="${item.alt}" loading="lazy">
        <div class="gallery-item-overlay">
          <div class="gallery-item-icon">
            <i data-lucide="zoom-in"></i>
          </div>
        </div>
      </div>
    `;

    div.addEventListener('click', () => this.openLightbox(index));

    return div;
  }

  setupLightbox() {
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeLightbox());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.previousImage();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextImage();
      });
    }

    // Close lightbox when clicking outside image
    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) {
          this.closeLightbox();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.lightbox && this.lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
          this.closeLightbox();
        } else if (e.key === 'ArrowLeft') {
          this.previousImage();
        } else if (e.key === 'ArrowRight') {
          this.nextImage();
        }
      }
    });
  }

  openLightbox(index) {
    this.currentImageIndex = index;
    this.updateLightboxImage();
    
    if (this.lightbox) {
      this.lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  updateLightboxImage() {
    const currentItem = this.galleryImages[this.currentImageIndex];
    
    if (currentItem && this.lightboxImg && this.lightboxCaption) {
      this.lightboxImg.src = currentItem.image;
      this.lightboxImg.alt = currentItem.alt;
      this.lightboxCaption.textContent = `Image ${this.currentImageIndex + 1} of ${this.galleryImages.length}`;
    }
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryImages.length;
    this.updateLightboxImage();
  }

  previousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
    this.updateLightboxImage();
  }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const gallery = new Gallery();
  window.gallery = gallery;
});
