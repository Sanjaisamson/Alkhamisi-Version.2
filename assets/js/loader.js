// Load Loader Component
function loadLoaderComponent() {
  // Determine the correct path based on current location
  const path = window.location.pathname;
  const loaderPath = path.includes('/pages/') 
    ? '../components/loader.html' 
    : './components/loader.html';
  
  fetch(loaderPath)
    .then(response => response.text())
    .then(html => {
      const loaderPlaceholder = document.getElementById('loader-placeholder');
      if (loaderPlaceholder) {
        loaderPlaceholder.innerHTML = html;
        // Initialize PageLoader after component is loaded
        if (!window.pageLoader) {
          window.pageLoader = new PageLoader();
        }
      }
    })
    .catch(error => console.error('Error loading loader component:', error));
}

// Check if loader placeholder exists and load component
if (document.getElementById('loader-placeholder')) {
  loadLoaderComponent();
}

// Page Loader Functionality
class PageLoader {
  constructor() {
    this.loader = document.getElementById('page-loader');
    this.isLoading = true;
    this.minimumLoadTime = 1200; // Minimum time to show loader (in ms)
    this.startTime = Date.now();

    this.init();
  }

  init() {
    // Immediately scroll to top and show loader
    this.scrollToTop();
    this.showLoader();

    // Handle page load complete
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.handlePageLoad());
    } else {
      // Page already loaded
      this.handlePageLoad();
    }

    // Handle navigation clicks
    this.handleNavigationClicks();

    // Setup scroll restoration
    this.setupScrollRestoration();

    // Handle hash changes (anchor links)
    this.handleHashChanges();
  }

  showLoader() {
    if (this.loader) {
      document.body.classList.add('loading');
      this.loader.classList.remove('hidden');
    }
  }

  hideLoader() {
    if (this.loader) {
      // Calculate remaining time to meet minimum load time
      const elapsedTime = Date.now() - this.startTime;
      const remainingTime = Math.max(0, this.minimumLoadTime - elapsedTime);

      setTimeout(() => {
        this.loader.classList.add('hidden');
        document.body.classList.remove('loading');

        // Add fade-in animation to main content
        const mainContent = document.querySelector('main');
        if (mainContent) {
          mainContent.classList.add('content-fade-in');
        }

        this.isLoading = false;
      }, remainingTime);
    }
  }

  // Immediate hide for anchor links
  hideLoaderImmediate() {
    if (this.loader) {
      this.loader.classList.add('hidden');
      document.body.classList.remove('loading');
      this.isLoading = false;
    }
  }

  handlePageLoad() {
    // Wait for all resources to load
    window.addEventListener('load', () => {
      // Check if header/footer components are loaded
      this.waitForComponents();
    });

    // Fallback in case load event doesn't fire
    setTimeout(() => {
      if (this.isLoading) {
        this.hideLoader();
      }
    }, 3000);
  }

  waitForComponents() {
    const checkComponents = () => {
      const hasHeader = document.querySelector('header') ||
                       document.querySelector('#header-placeholder .header-content');
      const hasFooter = document.querySelector('footer') ||
                       document.querySelector('#footer-placeholder footer');

      if (hasHeader && hasFooter) {
        // Components are loaded, hide loader
        setTimeout(() => {
          this.hideLoader();
        }, 500);
      } else {
        // Check again after a short delay
        setTimeout(checkComponents, 100);
      }
    };

    checkComponents();
  }

  handleNavigationClicks() {
    // Add loading on navigation clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');

      if (link && this.shouldShowLoaderForLink(link)) {
        const href = link.getAttribute('href');

        // Only show loader for actual page navigation (not anchor links)
        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
          // Show loader for page navigation
          this.showNavigationLoader();
        }
        // For anchor links, immediately hide the loader if it's showing
        else if (href && href.startsWith('#')) {
          if (this.isLoading) {
            this.hideLoaderImmediate();
          }
        }
      }
    });
  }

  shouldShowLoaderForLink(link) {
    const href = link.getAttribute('href');

    // Don't show loader for:
    // - External links (http/https)
    // - mailto/tel links
    // - Links with target="_blank"
    // - JavaScript links
    if (!href ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        link.target === '_blank') {
      return false;
    }

    // Allow processing of anchor links (they'll be handled differently)
    return true;
  }

  showNavigationLoader() {
    // Reset start time for navigation
    this.startTime = Date.now();
    this.isLoading = true;
    this.showLoader();
  }

  scrollToTop() {
    // Immediately scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  setupScrollRestoration() {
    // Disable automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Force scroll to top on page show
    window.addEventListener('pageshow', (event) => {
      this.scrollToTop();
    });

    // Force scroll to top on beforeunload
    window.addEventListener('beforeunload', () => {
      this.scrollToTop();
    });

    // Force scroll to top after DOM content loaded
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        this.scrollToTop();
      }, 0);
    });

    // Additional scroll to top when loader hides
    const originalHideLoader = this.hideLoader.bind(this);
    this.hideLoader = () => {
      this.scrollToTop();
      originalHideLoader();
    };
  }

  handleHashChanges() {
    // Handle hash changes (anchor navigation)
    window.addEventListener('hashchange', () => {
      // If loader is showing and this is just a hash change, hide it immediately
      if (this.isLoading) {
        this.hideLoaderImmediate();
      }
    });

    // Handle initial hash on page load
    if (window.location.hash && this.isLoading) {
      // Small delay to let the page load first
      setTimeout(() => {
        if (this.isLoading) {
          this.hideLoaderImmediate();
        }
      }, 100);
    }
  }
}

// Initialize loader when script loads (only if loader exists directly in page)
if (document.getElementById('page-loader') && !window.pageLoader) {
  const pageLoader = new PageLoader();
  window.pageLoader = pageLoader;
}

// Handle browser back/forward navigation
window.addEventListener('pageshow', (event) => {
  // Hide loader if page is shown from cache
  if (event.persisted) {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }
  }
});

// Handle visibility change (when user switches tabs)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Ensure loader is hidden when user returns to tab
    setTimeout(() => {
      const loader = document.getElementById('page-loader');
      if (loader && !pageLoader.isLoading) {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
      }
    }, 100);
  }
});