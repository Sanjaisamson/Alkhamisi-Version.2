// Header functionality
function initializeHeader() {
  // Add the fixed header class to body
  document.body.classList.add('has-fixed-header');

  // Set active navigation link based on current page
  const currentPage = getCurrentPageName();
  setActiveNavLink(currentPage);

  // Set correct navigation URLs based on current location
  setNavigationUrls();

  // Initialize mobile menu
  initializeMobileMenu();

  // Initialize Lucide icons in header
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function getCurrentPageName() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();

  // Map filenames to page identifiers
  const pageMap = {
    'index.html': 'index',
    'about.html': 'about',
    'services.html': 'services',
    'career.html': 'career',
    'contact.html': 'contact',
    '': 'index' // Handle root path
  };

  return pageMap[filename] || 'index';
}

function setActiveNavLink(currentPage) {
  // Remove active class from all nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Add active class to current page links
  document.querySelectorAll(`[data-page="${currentPage}"]`).forEach(link => {
    link.classList.add('active');
  });
}

function setNavigationUrls() {
  const isInPagesDir = window.location.pathname.includes('/pages/');

  // URL mappings for different locations
  const urlMappings = {
    home: isInPagesDir ? '../index.html' : 'index.html',
    about: isInPagesDir ? 'about.html' : 'pages/about.html',
    services: isInPagesDir ? 'services.html' : 'pages/services.html',
    career: isInPagesDir ? 'career.html' : 'pages/career.html',
    contact: isInPagesDir ? 'contact.html' : 'pages/contact.html',
    logo: isInPagesDir ? '../assets/images/alkhamisi_logo-2_page-0001.jpg' : 'assets/images/alkhamisi_logo-2_page-0001.jpg'
  };

  // Set href for all navigation links
  document.querySelectorAll('[data-route]').forEach(element => {
    const route = element.getAttribute('data-route');
    if (urlMappings[route]) {
      if (element.tagName === 'IMG') {
        element.setAttribute('src', urlMappings[route]);
      } else {
        element.setAttribute('href', urlMappings[route]);
      }
    }
  });
}

function initializeMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });

    // Close mobile menu when window is resized to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        mobileMenu.classList.add('hidden');
      }
    });
  }
}

// Function to load header into page
function loadHeader() {
  // Determine the correct path based on current location
  const isInPagesDir = window.location.pathname.includes('/pages/');
  const headerPath = isInPagesDir ? '../components/header.html' : 'components/header.html';

  return fetch(headerPath)
    .then(response => response.text())
    .then(html => {
      // Find header placeholder or body start
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = html;
      } else {
        // Insert after opening body tag
        document.body.insertAdjacentHTML('afterbegin', html);
      }

      // Initialize header functionality
      initializeHeader();
    })
    .catch(error => {
      console.error('Error loading header:', error);
    });
}

// Function to load footer into page
function loadFooter() {
  // Determine the correct path based on current location
  const isInPagesDir = window.location.pathname.includes('/pages/');
  const footerPath = isInPagesDir ? '../components/footer.html' : 'components/footer.html';

  return fetch(footerPath)
    .then(response => response.text())
    .then(html => {
      // Find footer placeholder or body end
      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = html;
      } else {
        // Insert before closing body tag
        document.body.insertAdjacentHTML('beforeend', html);
      }

      // Initialize Lucide icons in footer
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    })
    .catch(error => {
      console.error('Error loading footer:', error);
    });
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if header should be loaded dynamically
  if (document.getElementById('header-placeholder') || !document.querySelector('header')) {
    loadHeader();
  } else {
    // Header is already in page, just initialize
    initializeHeader();
  }

  // Check if footer should be loaded dynamically
  if (document.getElementById('footer-placeholder') || !document.querySelector('footer')) {
    loadFooter();
  }
});