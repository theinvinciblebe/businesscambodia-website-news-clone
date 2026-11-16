/**
 * BUSINESS CAMBODIA - Interactive Features & UI Enhancements
 * Includes Light/Dark theme switching with persistence, trending ticker controls,
 * sidebar tab switcher, search modal, responsive mobile drawer, and back-to-top.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. THEME SWITCHER (Light / Dark) ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const themeText = themeToggleBtn ? themeToggleBtn.querySelector('.theme-text') : null;
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('bc-theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (metaColorScheme) metaColorScheme.setAttribute('content', 'dark');
      if (themeIcon) themeIcon.className = 'fas fa-sun';
      if (themeText) themeText.textContent = 'Light Mode';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      if (metaColorScheme) metaColorScheme.setAttribute('content', 'light');
      if (themeIcon) themeIcon.className = 'fas fa-moon';
      if (themeText) themeText.textContent = 'Dark Mode';
    }
  }

  // Initialize Theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('bc-theme', newTheme);
      applyTheme(newTheme);
    });
  }

  // Listen to OS theme changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('bc-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --- 2. BREAKING NEWS / TRENDING TICKER ---
  const tickerItems = document.querySelectorAll('.ticker-item');
  const prevBtn = document.getElementById('tickerPrev');
  const nextBtn = document.getElementById('tickerNext');
  let currentTickerIdx = 0;
  let tickerInterval = null;

  function showTicker(index) {
    tickerItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }

  function nextTicker() {
    if (tickerItems.length === 0) return;
    currentTickerIdx = (currentTickerIdx + 1) % tickerItems.length;
    showTicker(currentTickerIdx);
  }

  function prevTicker() {
    if (tickerItems.length === 0) return;
    currentTickerIdx = (currentTickerIdx - 1 + tickerItems.length) % tickerItems.length;
    showTicker(currentTickerIdx);
  }

  function startTicker() {
    if (!tickerInterval && tickerItems.length > 1) {
      tickerInterval = setInterval(nextTicker, 4500);
    }
  }

  function stopTicker() {
    if (tickerInterval) {
      clearInterval(tickerInterval);
      tickerInterval = null;
    }
  }

  if (tickerItems.length > 0) {
    showTicker(0);
    startTicker();

    const tickerContainer = document.querySelector('.ticker-track-container');
    if (tickerContainer) {
      tickerContainer.addEventListener('mouseenter', stopTicker);
      tickerContainer.addEventListener('mouseleave', startTicker);
    }
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { stopTicker(); nextTicker(); startTicker(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { stopTicker(); prevTicker(); startTicker(); });

  // --- 3. SIDEBAR TABS (Popular / Latest / Opinion) ---
  const tabButtons = document.querySelectorAll('.sidebar-tabs-nav .tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // --- 4. SEARCH MODAL ---
  const searchModal = document.getElementById('searchModal');
  const openSearchBtns = document.querySelectorAll('.open-search-trigger');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('mainSearchInput');
  const searchTagPills = document.querySelectorAll('.search-tag-pill');

  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { if (searchInput) searchInput.focus(); }, 150);
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openSearchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', closeSearch);
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  searchTagPills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = pill.textContent.trim();
        searchInput.focus();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeDrawer();
    }
  });

  // --- 5. RESPONSIVE MOBILE DRAWER ---
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });
  }

  // --- 6. BACK TO TOP BUTTON ---
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 7. NEWSLETTER FORM FEEDBACK ---
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        const originalText = newsletterForm.querySelector('button').textContent;
        const btn = newsletterForm.querySelector('button');
        btn.textContent = '✓ បានចុះឈ្មោះជោគជ័យ!';
        btn.style.backgroundColor = '#16a34a';
        input.value = '';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
        }, 3000);
      }
    });
  }
});
