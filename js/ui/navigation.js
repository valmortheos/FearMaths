/**
 * navigation.js — Hash Routing & Tab Navigation
 * Handles hash-based SPA routing and tab switching.
 */

const VALID_TABS = ['learn', 'stats', 'achievements', 'settings'];

/**
 * Initializes hash routing listener and tab switching logic.
 * @param {Function} onTabChange Callback when active tab changes
 */
export function initNavigation(onTabChange) {
  function handleHashChange() {
    let hash = window.location.hash.replace('#', '').trim();
    if (!VALID_TABS.includes(hash)) {
      hash = 'learn';
    }

    // Update Tab Content Visibility
    document.querySelectorAll('.tab-content').forEach(tabEl => {
      tabEl.classList.remove('tab-content--active');
    });

    const activeTabEl = document.getElementById(`tab-${hash}`);
    if (activeTabEl) {
      activeTabEl.classList.add('tab-content--active');
    }

    // Update Bottom Navigation Links Active State
    document.querySelectorAll('.bottom-nav__item').forEach(navEl => {
      if (navEl.getAttribute('data-tab') === hash) {
        navEl.classList.add('bottom-nav__item--active');
      } else {
        navEl.classList.remove('bottom-nav__item--active');
      }
    });

    if (typeof onTabChange === 'function') {
      onTabChange(hash);
    }
  }

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange(); // Initial route trigger
}
