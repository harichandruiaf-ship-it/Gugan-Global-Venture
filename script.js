/**
 * Gugan Global Venture - Interactive Client Script
 * B2B Spice Export Portal & Interactive Catalog Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavigation();
  initFilterPills();
  initDualMultiSelects();
  initModals();
  initThankYouModal();
  initTradeInquiryForm();
  initInteractiveCatalog();
  initFloatingContactWidget();
  initBackToTopButton();
  initScrollReveal();
  initFaqAccordion();
  initMobileMenu();
});

// Preloader Controller
function initPreloader() {
  const preloader = document.getElementById('appPreloader');
  if (!preloader) return;

  function hidePreloader() {
    preloader.classList.add('loaded');
  }

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 400);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 300));
    // Fallback safety timeout (1.2s max wait)
    setTimeout(hidePreloader, 1200);
  }
}

// View Navigation & Hash Handling
// View Navigation & Hash Handling
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const pageViews = document.querySelectorAll('.page-view');

  function switchView(targetId) {
    pageViews.forEach(view => {
      if (view.id === targetId) {
        view.classList.add('active-view');
      } else {
        view.classList.remove('active-view');
      }
    });

    navLinks.forEach(link => {
      const linkView = link.getAttribute('data-view');
      if (linkView === targetId || (targetId === 'view-certificates' && linkView === 'view-about')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Also update dropdown items active state
    document.querySelectorAll('.dropdown-item').forEach(item => {
      const itemView = item.getAttribute('data-view');
      if (itemView === targetId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Dynamic Document Title Updates for SEO
    const titleMap = {
      'view-home': 'Gugan Global Venture | Premium B2B Indian Spice Exporter',
      'view-products': 'Premium Indian Spices Export Portfolio | Gugan Global Venture',
      'view-export-process': 'Export Process & Quality Assurance | Gugan Global Venture',
      'view-about': 'About Us - Trusted Indian Spice Exporters | Gugan Global Venture',
      'view-certificates': 'Official Accreditation & Export Certificates | Gugan Global Venture',
      'view-contact': 'Contact Export Sales Desk & Request Quotes | Gugan Global Venture'
    };
    if (titleMap[targetId]) {
      document.title = titleMap[targetId];
    }

    if (window.triggerScrollRevealCheck) {
      window.triggerScrollRevealCheck();
    }
  }

  window.navigateToProduct = function(productId, varietyKey) {
    switchView('view-products');

    const targetBlock = document.getElementById(productId);
    if (!targetBlock) return;

    if (varietyKey && targetBlock._showVariety) {
      targetBlock._showVariety(varietyKey);
      const panel = targetBlock.querySelector('[data-role="variety-panel"]');
      const toggleBtn = targetBlock.querySelector('[data-action="toggle-varieties"]');
      if (panel && toggleBtn) {
        panel.hidden = false;
        panel.removeAttribute("hidden");
        panel.classList.add("open");
        toggleBtn.setAttribute("aria-expanded", "true");
        toggleBtn.innerHTML = `Hide Varieties <span class="chevron">▴</span>`;
      }
    }

    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(p => {
      const cat = p.getAttribute('data-filter') || p.getAttribute('data-spice');
      if (cat === productId) p.classList.add('active');
      else p.classList.remove('active');
    });

    setTimeout(() => {
      const specCard = targetBlock.querySelector('.spec-product-card') || targetBlock;
      const yOffset = -130;
      const y = specCard.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      specCard.classList.remove('section-focus-glow');
      void specCard.offsetWidth;
      specCard.classList.add('section-focus-glow');

      setTimeout(() => {
        specCard.classList.remove('section-focus-glow');
      }, 2000);
    }, 120);
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = link.getAttribute('data-view');
      if (viewId) {
        window.location.hash = viewId;
        switchView(viewId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Handle hash changes
  function handleHash() {
    const rawHash = (window.location.hash.replace('#', '') || '').trim() || 'view-home';
    const validProducts = ['chilli', 'turmeric', 'pepper', 'cardamom'];

    if (validProducts.includes(rawHash)) {
      window.navigateToProduct(rawHash);
      return;
    }

    if (rawHash.includes('-')) {
      const firstHyphenIndex = rawHash.indexOf('-');
      const possibleProduct = rawHash.substring(0, firstHyphenIndex);
      const possibleVariety = rawHash.substring(firstHyphenIndex + 1);

      if (validProducts.includes(possibleProduct)) {
        window.navigateToProduct(possibleProduct, possibleVariety);
        return;
      }
    }

    const targetElement = document.getElementById(rawHash);
    if (targetElement && targetElement.classList.contains('page-view')) {
      switchView(rawHash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      switchView('view-home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  window.addEventListener('hashchange', handleHash);
  handleHash();

  // Global Click Delegation for data-navigate and data-product
  document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('[data-navigate]');
    if (navBtn) {
      e.preventDefault();
      const target = navBtn.getAttribute('data-navigate');
      const scrollTargetId = navBtn.getAttribute('data-target');
      if (target) {
        window.location.hash = target;
        switchView(target);
        if (scrollTargetId) {
          setTimeout(() => {
            const targetEl = document.getElementById(scrollTargetId);
            if (targetEl) {
              const yOffset = -120;
              const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }, 150);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      return;
    }

    const productBtn = e.target.closest('[data-product]');
    if (productBtn) {
      e.preventDefault();
      const productId = productBtn.getAttribute('data-product');
      const varietyKey = productBtn.getAttribute('data-variety') || null;
      if (productId) {
        window.location.hash = varietyKey ? `${productId}-${varietyKey}` : productId;
        window.navigateToProduct(productId, varietyKey);
      }
    }
  });
}

// Filter Pills on Products Page with Scroll-Spy
function initFilterPills() {
  const filterPills = document.querySelectorAll('.filter-pill');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterCategory = pill.getAttribute('data-filter') || pill.getAttribute('data-spice');
      const targetBlock = document.getElementById(filterCategory);
      if (targetBlock) {
        targetBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // IntersectionObserver to sync active pill with scroll position
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -50% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          filterPills.forEach(p => {
            const cat = p.getAttribute('data-filter') || p.getAttribute('data-spice');
            if (cat === id) {
              p.classList.add('active');
            } else {
              p.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    setTimeout(() => {
      document.querySelectorAll('.spice-block').forEach(block => {
        observer.observe(block);
      });
    }, 300);
  }
}

// Helper to safely escape HTML strings
function escapeHTML(str) {
  if (typeof str !== 'string') return str || '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Master Dataset for B2B Spice Varieties grouped by category
const SPICE_VARIETIES_MASTER = [
  // Red Chilli
  { category: 'chilli', key: 'teja', name: 'Teja S17 Chilli (Guntur - High Heat)' },
  { category: 'chilli', key: 'sannam-s4', name: 'Sannam S4 / 334 Chilli (Guntur - Medium Heat)' },
  { category: 'chilli', key: 'byadgi', name: 'Byadgi Chilli (Karnataka - Deep Red)' },
  { category: 'chilli', key: 'wonder-hot', name: 'Wonder Hot Chilli (Pungent Export Grade)' },

  // Turmeric
  { category: 'turmeric', key: 'erode', name: 'Erode Turmeric Finger (Tamil Nadu)' },
  { category: 'turmeric', key: 'salem', name: 'Salem Turmeric Finger (Golden Yellow)' },
  { category: 'turmeric', key: 'nizamabad', name: 'Nizamabad Turmeric Finger (Telangana)' },
  { category: 'turmeric', key: 'rajapuri', name: 'Rajapuri (Sangli) Turmeric (Maharashtra)' },
  { category: 'turmeric', key: 'lakadong', name: 'Lakadong High-Curcumin Turmeric (7%-12%)' },

  // Black Pepper
  { category: 'pepper', key: 'mg1', name: 'Malabar Garbled MG1 Pepper (4.0-4.5mm)' },
  { category: 'pepper', key: 'mug', name: 'Malabar Ungarbled MUG Pepper (Grinding Grade)' },
  { category: 'pepper', key: 'tgeb', name: 'Tellicherry Garbled Extra Bold TGEB (4.75-5.0mm)' },
  { category: 'pepper', key: 'tgseb', name: 'Tellicherry Special Extra Bold TGSEB (5.0mm+)' },

  // Green Cardamom
  { category: 'cardamom', key: 'ageb', name: 'Alleppey Green Extra Bold AGEB (8mm+)' },
  { category: 'cardamom', key: 'agb', name: 'Alleppey Green Bold AGB (7mm-8mm)' },
  { category: 'cardamom', key: 'ags', name: 'Alleppey Green Superior AGS (6mm-7mm)' }
];

const CATEGORY_NAMES = {
  chilli: '🌶️ Dry Red Chilli',
  turmeric: '🟡 Turmeric Rhizomes & Powder',
  pepper: '⚫ Black Pepper Berries',
  cardamom: '🟢 Green Cardamom Capsules'
};

const CATEGORY_SHORT_NAMES = {
  chilli: 'Chilli',
  turmeric: 'Turmeric',
  pepper: 'Black Pepper',
  cardamom: 'Cardamom'
};

const CATEGORY_TAB_LABELS = {
  chilli: '🌶️ Chilli',
  turmeric: '🟡 Turmeric',
  pepper: '⚫ Pepper',
  cardamom: '🟢 Cardamom'
};

class B2BDualMultiSelect {
  constructor(categoryElId, varietyElId) {
    this.catContainer = document.getElementById(categoryElId);
    this.varContainer = document.getElementById(varietyElId);
    if (!this.catContainer || !this.varContainer) return;

    this.catTrigger = this.catContainer.querySelector('.b2b-multiselect-trigger');
    this.catTags = this.catContainer.querySelector('.b2b-tags-container');
    this.catDropdown = this.catContainer.querySelector('.b2b-multiselect-dropdown');

    this.varTrigger = this.varContainer.querySelector('.b2b-multiselect-trigger');
    this.varTags = this.varContainer.querySelector('.b2b-tags-container');
    this.varDropdown = this.varContainer.querySelector('.b2b-multiselect-dropdown');

    this.selectedCategories = new Set();
    this.selectedVarieties = new Set();
    this.activeFilterTab = 'all'; // 'all' | individual category key
    this.searchQuery = '';

    this.init();
  }

  init() {
    // 1. Category Trigger Toggle
    this.catTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeOtherDropdowns(this.catContainer);
      const willOpen = !this.catContainer.classList.contains('open');
      this.catContainer.classList.toggle('open');
      this.catTrigger.setAttribute('aria-expanded', willOpen);

      if (willOpen) {
        this.checkPositioning(this.catContainer);
      }
    });

    // 2. Variety Trigger Toggle - Strictly Interlinked Gateway
    this.varTrigger.addEventListener('click', (e) => {
      e.stopPropagation();

      // Guard: User must select at least one spice product first!
      if (this.selectedCategories.size === 0) {
        e.preventDefault();

        // Visually guide user: pulse the category dropdown
        this.catContainer.classList.remove('b2b-highlight-pulse');
        void this.catContainer.offsetWidth; // force browser DOM reflow
        this.catContainer.classList.add('b2b-highlight-pulse');
        setTimeout(() => {
          this.catContainer.classList.remove('b2b-highlight-pulse');
        }, 1400);

        // Auto-open the category dropdown so user can immediately select
        this.closeOtherDropdowns(this.catContainer);
        this.catContainer.classList.add('open');
        this.catTrigger.setAttribute('aria-expanded', 'true');
        this.checkPositioning(this.catContainer);

        showToast('Please select a Spice Product first to view its varieties.');
        return;
      }

      this.closeOtherDropdowns(this.varContainer);
      const willOpen = !this.varContainer.classList.contains('open');
      this.varContainer.classList.toggle('open');
      this.varTrigger.setAttribute('aria-expanded', willOpen);

      if (willOpen) {
        this.checkPositioning(this.varContainer);
        const modalCard = this.varContainer.closest('.modal-card');
        if (modalCard) {
          setTimeout(() => {
            this.varContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 80);
        }
      }
    });

    // 3. Category Checkbox Change Handler
    this.catDropdown.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener('change', () => {
        if (chk.checked) {
          this.selectedCategories.add(chk.value);
        } else {
          this.selectedCategories.delete(chk.value);
        }

        // Strict Pruning: Remove any selected varieties whose parent category is no longer selected
        const activeCats = Array.from(this.selectedCategories);
        for (const vKey of Array.from(this.selectedVarieties)) {
          const varObj = SPICE_VARIETIES_MASTER.find(v => v.key === vKey);
          if (!varObj || !activeCats.includes(varObj.category)) {
            this.selectedVarieties.delete(vKey);
          }
        }

        // Reset activeFilterTab if it no longer belongs to active categories
        if (this.activeFilterTab !== 'all' && !activeCats.includes(this.activeFilterTab)) {
          this.activeFilterTab = 'all';
        }

        this.renderCategoryTags();
        this.updateLockState();
        this.updateVarietyDropdown();
      });

      const parentItem = chk.closest('.b2b-option-item');
      if (parentItem) {
        parentItem.addEventListener('click', (e) => {
          if (e.target !== chk && e.target.tagName !== 'LABEL') {
            chk.checked = !chk.checked;
            chk.dispatchEvent(new Event('change'));
          }
        });
      }
    });

    // 4. Click outside to close dropdowns
    document.addEventListener('click', (e) => {
      if (this.catContainer && !this.catContainer.contains(e.target)) {
        this.catContainer.classList.remove('open', 'open-upward');
        this.catTrigger.setAttribute('aria-expanded', 'false');
      }
      if (this.varContainer && !this.varContainer.contains(e.target)) {
        this.varContainer.classList.remove('open', 'open-upward');
        this.varTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Initialize lock state & variety view
    this.updateLockState();
    this.updateVarietyDropdown();
  }

  checkPositioning(container) {
    const rect = container.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < 310 && rect.top > 310) {
      container.classList.add('open-upward');
    } else {
      container.classList.remove('open-upward');
    }
  }

  closeOtherDropdowns(current) {
    document.querySelectorAll('.b2b-multiselect').forEach(el => {
      if (el !== current) {
        el.classList.remove('open', 'open-upward');
        const trig = el.querySelector('.b2b-multiselect-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      }
    });
  }

  updateLockState() {
    if (this.selectedCategories.size === 0) {
      this.varContainer.classList.add('b2b-locked');
      this.varTrigger.setAttribute('aria-disabled', 'true');
      this.varTrigger.setAttribute('tabindex', '-1');
      // If variety dropdown was currently open, close it
      this.varContainer.classList.remove('open', 'open-upward');
      this.varTrigger.setAttribute('aria-expanded', 'false');
      this.renderVarietyTags();
    } else {
      this.varContainer.classList.remove('b2b-locked');
      this.varTrigger.removeAttribute('aria-disabled');
      this.varTrigger.setAttribute('tabindex', '0');
      this.renderVarietyTags();
    }
  }

  renderCategoryTags() {
    this.catTags.innerHTML = '';
    if (this.selectedCategories.size === 0) {
      this.catTags.innerHTML = `<span class="b2b-placeholder">Select one or more products...</span>`;
      return;
    }

    this.selectedCategories.forEach(cat => {
      const chip = document.createElement('span');
      chip.className = 'b2b-chip';
      chip.innerHTML = `${escapeHTML(CATEGORY_NAMES[cat] || cat)} <span class="remove-chip">&times;</span>`;

      chip.querySelector('.remove-chip').addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectedCategories.delete(cat);
        const chk = this.catDropdown.querySelector(`input[value="${cat}"]`);
        if (chk) chk.checked = false;

        // Prune varieties belonging to the removed category
        const activeCats = Array.from(this.selectedCategories);
        for (const vKey of Array.from(this.selectedVarieties)) {
          const varObj = SPICE_VARIETIES_MASTER.find(v => v.key === vKey);
          if (!varObj || !activeCats.includes(varObj.category)) {
            this.selectedVarieties.delete(vKey);
          }
        }

        if (this.activeFilterTab === cat) {
          this.activeFilterTab = 'all';
        }

        this.renderCategoryTags();
        this.updateLockState();
        this.updateVarietyDropdown();
      });

      this.catTags.appendChild(chip);
    });
  }

  updateVarietyDropdown() {
    this.varDropdown.innerHTML = '';
    const activeCats = Array.from(this.selectedCategories);

    // If no category is selected, display locked notice
    if (activeCats.length === 0) {
      this.varDropdown.innerHTML = `
        <div class="var-locked-notice">
          <i class="fa-solid fa-lock" style="font-size:20px; color:#94a3b8; margin-bottom:8px;"></i>
          <p style="font-size:13px; font-weight:700; color:#334155; margin:0 0 4px;">Spice Product Required</p>
          <p style="font-size:12px; color:#64748b; margin:0;">Please select one or more spice products above to view available export varieties.</p>
        </div>
      `;
      this.renderVarietyTags();
      return;
    }

    // Filter varieties strictly belonging to selected products
    const availableVarieties = SPICE_VARIETIES_MASTER.filter(v => activeCats.includes(v.category));

    // Reset active tab if it's no longer valid
    if (this.activeFilterTab !== 'all' && !activeCats.includes(this.activeFilterTab)) {
      this.activeFilterTab = 'all';
    }

    // 1. Build Toolbar (Tabs / Header Banner + Search)
    const toolbar = document.createElement('div');
    toolbar.className = 'b2b-dropdown-toolbar';

    if (activeCats.length === 1) {
      // Single product selected: Clean headline banner
      const catKey = activeCats[0];
      const banner = document.createElement('div');
      banner.className = 'var-single-cat-banner';
      banner.innerHTML = `
        <span class="var-single-cat-title">${CATEGORY_NAMES[catKey] || catKey}</span>
        <span class="var-single-cat-count">${availableVarieties.length} export varieties available</span>
      `;
      toolbar.appendChild(banner);
    } else {
      // Multiple products selected: Show tabs only for the active products
      const tabsRow = document.createElement('div');
      tabsRow.className = 'var-tabs-row';

      const allBtn = document.createElement('button');
      allBtn.type = 'button';
      allBtn.className = `var-tab-btn ${this.activeFilterTab === 'all' ? 'active' : ''}`;
      allBtn.textContent = `All Selected (${availableVarieties.length})`;
      allBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.activeFilterTab = 'all';
        toolbar.querySelectorAll('.var-tab-btn').forEach(b => b.classList.remove('active'));
        allBtn.classList.add('active');
        this.renderVarietyItems(itemsContainer, countSpan, availableVarieties);
      });
      tabsRow.appendChild(allBtn);

      activeCats.forEach(cat => {
        const catCount = availableVarieties.filter(v => v.category === cat).length;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `var-tab-btn ${this.activeFilterTab === cat ? 'active' : ''}`;
        btn.textContent = `${CATEGORY_TAB_LABELS[cat] || cat} (${catCount})`;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.activeFilterTab = cat;
          toolbar.querySelectorAll('.var-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.renderVarietyItems(itemsContainer, countSpan, availableVarieties);
        });
        tabsRow.appendChild(btn);
      });

      toolbar.appendChild(tabsRow);
    }

    // Search bar (searches only within selected product varieties)
    const searchWrap = document.createElement('div');
    searchWrap.className = 'var-search-wrap';
    const searchPlaceholder = activeCats.length === 1
      ? `Search ${CATEGORY_SHORT_NAMES[activeCats[0]] || ''} varieties (e.g. grades, sizes)...`
      : `Search ${availableVarieties.length} selected varieties...`;

    searchWrap.innerHTML = `
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" class="var-search-input" placeholder="${escapeHTML(searchPlaceholder)}" value="${escapeHTML(this.searchQuery)}">
    `;

    const searchInput = searchWrap.querySelector('.var-search-input');
    searchInput.addEventListener('click', (e) => e.stopPropagation());
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderVarietyItems(itemsContainer, countSpan, availableVarieties);
    });

    toolbar.appendChild(searchWrap);
    this.varDropdown.appendChild(toolbar);

    // 2. Scrollable Items Container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'b2b-dropdown-items';
    this.varDropdown.appendChild(itemsContainer);

    // 3. Footer Bar with counter & utility actions
    const footer = document.createElement('div');
    footer.className = 'b2b-dropdown-footer';

    const countSpan = document.createElement('span');
    countSpan.className = 'var-selected-count';
    countSpan.textContent = `${this.selectedVarieties.size} of ${availableVarieties.length} grades selected`;
    footer.appendChild(countSpan);

    const actionsWrap = document.createElement('div');
    actionsWrap.style.display = 'flex';
    actionsWrap.style.gap = '12px';

    const selectAllBtn = document.createElement('button');
    selectAllBtn.type = 'button';
    selectAllBtn.className = 'btn-select-all-varieties';
    selectAllBtn.textContent = 'Select All';
    selectAllBtn.title = 'Select all available grades for chosen spice products';
    selectAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      availableVarieties.forEach(v => this.selectedVarieties.add(v.key));
      this.renderVarietyTags();
      this.renderVarietyItems(itemsContainer, countSpan, availableVarieties);
    });

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'btn-clear-varieties';
    clearBtn.textContent = 'Clear All';
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectedVarieties.clear();
      this.renderVarietyTags();
      this.renderVarietyItems(itemsContainer, countSpan, availableVarieties);
    });

    actionsWrap.appendChild(selectAllBtn);
    actionsWrap.appendChild(clearBtn);
    footer.appendChild(actionsWrap);
    this.varDropdown.appendChild(footer);

    // Initial render
    this.renderVarietyItems(itemsContainer, countSpan, availableVarieties);
    this.renderVarietyTags();
  }

  renderVarietyItems(container, countSpan, availableVarieties) {
    container.innerHTML = '';

    let visibleVarieties = availableVarieties || [];

    // Filter by active tab
    if (this.activeFilterTab !== 'all') {
      visibleVarieties = visibleVarieties.filter(v => v.category === this.activeFilterTab);
    }

    // Filter by search query
    if (this.searchQuery) {
      visibleVarieties = visibleVarieties.filter(v =>
        v.name.toLowerCase().includes(this.searchQuery) ||
        v.key.toLowerCase().includes(this.searchQuery)
      );
    }

    if (visibleVarieties.length === 0) {
      container.innerHTML = `<div style="padding:18px 14px; text-align:center; color:#94a3b8; font-size:12.5px;">No matching varieties found for the selected spice product(s)</div>`;
      return;
    }

    const activeCats = Array.from(this.selectedCategories);
    const showHeaders = activeCats.length > 1 && this.activeFilterTab === 'all';

    // Group by category
    const grouped = {};
    visibleVarieties.forEach(v => {
      if (!grouped[v.category]) grouped[v.category] = [];
      grouped[v.category].push(v);
    });

    Object.keys(grouped).forEach(cat => {
      if (showHeaders) {
        const header = document.createElement('div');
        header.className = 'b2b-group-header';
        header.textContent = `${CATEGORY_NAMES[cat] || cat} (${grouped[cat].length} varieties)`;
        container.appendChild(header);
      }

      grouped[cat].forEach(v => {
        const item = document.createElement('div');
        const isSelected = this.selectedVarieties.has(v.key);
        item.className = `b2b-option-item ${isSelected ? 'selected' : ''}`;
        item.dataset.value = v.key;

        const chkId = `var_${this.varContainer.id}_${v.key}`;
        item.innerHTML = `
          <input type="checkbox" id="${chkId}" value="${v.key}" ${isSelected ? 'checked' : ''}>
          <label for="${chkId}">${escapeHTML(v.name)}</label>
        `;

        const chk = item.querySelector('input[type="checkbox"]');
        chk.addEventListener('change', (e) => {
          e.stopPropagation();
          if (chk.checked) {
            this.selectedVarieties.add(v.key);
            item.classList.add('selected');
          } else {
            this.selectedVarieties.delete(v.key);
            item.classList.remove('selected');
          }
          this.renderVarietyTags();
          if (countSpan) {
            countSpan.textContent = `${this.selectedVarieties.size} of ${availableVarieties.length} grades selected`;
          }
        });

        item.addEventListener('click', (e) => {
          if (e.target !== chk && e.target.tagName !== 'LABEL') {
            chk.checked = !chk.checked;
            chk.dispatchEvent(new Event('change'));
          }
        });

        container.appendChild(item);
      });
    });

    if (countSpan) {
      countSpan.textContent = `${this.selectedVarieties.size} of ${availableVarieties.length} grades selected`;
    }
  }

  renderVarietyTags() {
    this.varTags.innerHTML = '';
    if (this.selectedCategories.size === 0) {
      this.varTags.innerHTML = `<span class="b2b-placeholder b2b-locked-placeholder"><i class="fa-solid fa-lock" style="font-size:11px; margin-right:6px; opacity:0.7;"></i>Select Spice Product first...</span>`;
      return;
    }

    if (this.selectedVarieties.size === 0) {
      const catNames = Array.from(this.selectedCategories)
        .map(c => CATEGORY_SHORT_NAMES[c] || c)
        .join(', ');
      this.varTags.innerHTML = `<span class="b2b-placeholder">Select specific varieties (${catNames})...</span>`;
      return;
    }

    this.selectedVarieties.forEach(vKey => {
      const varObj = SPICE_VARIETIES_MASTER.find(v => v.key === vKey);
      if (!varObj) return;

      const chip = document.createElement('span');
      chip.className = 'b2b-chip';
      chip.innerHTML = `${escapeHTML(varObj.name.split(' (')[0])} <span class="remove-chip">&times;</span>`;

      chip.querySelector('.remove-chip').addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectedVarieties.delete(vKey);
        this.renderVarietyTags();
        const chk = this.varDropdown.querySelector(`input[value="${vKey}"]`);
        if (chk) chk.checked = false;
        const item = this.varDropdown.querySelector(`.b2b-option-item[data-value="${vKey}"]`);
        if (item) item.classList.remove('selected');

        const activeCats = Array.from(this.selectedCategories);
        const availCount = SPICE_VARIETIES_MASTER.filter(v => activeCats.includes(v.category)).length;
        const countSpan = this.varDropdown.querySelector('.var-selected-count');
        if (countSpan) {
          countSpan.textContent = `${this.selectedVarieties.size} of ${availCount} grades selected`;
        }
      });

      this.varTags.appendChild(chip);
    });
  }

  setSelections(catKey, varKey) {
    if (catKey) {
      this.selectedCategories.clear();
      this.selectedCategories.add(catKey);
      this.catDropdown.querySelectorAll('input[type="checkbox"]').forEach(chk => {
        chk.checked = (chk.value === catKey);
      });
      this.activeFilterTab = catKey;
      this.renderCategoryTags();
      this.updateLockState();
    }

    if (varKey) {
      this.selectedVarieties.clear();
      const match = SPICE_VARIETIES_MASTER.find(v => v.key === varKey && (catKey ? v.category === catKey : true));
      if (match) {
        this.selectedVarieties.add(varKey);
      }
      this.renderVarietyTags();
    } else {
      this.selectedVarieties.clear();
      this.renderVarietyTags();
    }

    this.updateVarietyDropdown();
  }

  reset() {
    this.selectedCategories.clear();
    this.selectedVarieties.clear();
    this.activeFilterTab = 'all';
    this.searchQuery = '';
    this.catDropdown.querySelectorAll('input[type="checkbox"]').forEach(chk => chk.checked = false);
    this.renderCategoryTags();
    this.updateLockState();
    this.updateVarietyDropdown();
  }
}

let modalMultiSelectInst = null;
let contactMultiSelectInst = null;

function initDualMultiSelects() {
  modalMultiSelectInst = new B2BDualMultiSelect('modalCategoryMultiselect', 'modalVarietyMultiselect');
  contactMultiSelectInst = new B2BDualMultiSelect('contactCategoryMultiselect', 'contactVarietyMultiselect');
}

// Modal Controllers
function initModals() {
  const modalOverlay = document.getElementById('quoteModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const quoteForm = document.getElementById('quoteForm');

  document.querySelectorAll('.open-modal-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const rawSpice = btn.getAttribute('data-spice') || '';
      const rawVariety = btn.getAttribute('data-variety') || '';
      const parentBlock = btn.closest('[data-spice]') || btn.closest('[data-product]');
      const spiceKey = rawSpice || (parentBlock ? (parentBlock.getAttribute('data-spice') || parentBlock.getAttribute('data-product')) : '');

      if (modalMultiSelectInst && spiceKey) {
        modalMultiSelectInst.setSelections(spiceKey, rawVariety);
      }

      if (modalOverlay) {
        modalOverlay.classList.add('active');
        const firstInput = modalOverlay.querySelector('input, select');
        if (firstInput) firstInput.focus();
      }
    });
  });

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });

    // Modal Focus Trap
    modalOverlay.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = modalOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  initQuoteForm();
}

// Helper functions to format multiselect spice selections for email delivery
function formatSelectedCategories(catSet) {
  if (!catSet || catSet.size === 0) return 'All / General Spice Inquiry';
  const names = {
    chilli: 'Dry Red Chilli',
    turmeric: 'Turmeric Rhizomes & Powder',
    pepper: 'Black Pepper Berries',
    cardamom: 'Green Cardamom Capsules'
  };
  return Array.from(catSet).map(c => names[c] || c).join(', ');
}

function formatSelectedVarieties(varSet) {
  if (!varSet || varSet.size === 0) return 'Not specified / All export grades';
  return Array.from(varSet).map(vKey => {
    const item = SPICE_VARIETIES_MASTER.find(v => v.key === vKey);
    return item ? item.name : vKey;
  }).join('; ');
}

// Gugan Brand Submission Loading Overlay (Blocks 100% unwanted touches/clicks & shows animated logo)
function showSubmissionLoader(title, subtitle) {
  const overlay = document.getElementById('submissionLoaderOverlay');
  const card = document.getElementById('submissionLoaderCard');
  const titleEl = document.getElementById('submissionLoaderTitle');
  const subEl = document.getElementById('submissionLoaderSub');
  if (!overlay) return;
  if (card) card.classList.remove('success');
  if (titleEl) titleEl.textContent = title || 'Transmitting Your Request...';
  if (subEl) subEl.textContent = subtitle || 'Connecting to Gugan Global export desk. Please do not close or touch the screen.';
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
}

function hideSubmissionLoader(isSuccess, successTitle, successSubtitle, callback) {
  const overlay = document.getElementById('submissionLoaderOverlay');
  const card = document.getElementById('submissionLoaderCard');
  const titleEl = document.getElementById('submissionLoaderTitle');
  const subEl = document.getElementById('submissionLoaderSub');
  if (!overlay) {
    if (callback) callback();
    return;
  }
  if (isSuccess) {
    if (card) card.classList.add('success');
    if (titleEl) titleEl.textContent = successTitle || 'Quote Request Dispatched!';
    if (subEl) subEl.textContent = successSubtitle || 'Thank you! Our export desk will contact you within 24 hours.';
    setTimeout(() => {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      if (card) card.classList.remove('success');
      if (callback) callback();
    }, 1400);
  } else {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (callback) callback();
  }
}

// Enterprise Thank You Modal Card Controls
function initThankYouModal() {
  const modal = document.getElementById('thankYouModal');
  const closeBtn = document.getElementById('thankYouCloseBtn');
  const doneBtn = document.getElementById('thankYouDoneBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeThankYouCard);
  }
  if (doneBtn) {
    doneBtn.addEventListener('click', closeThankYouCard);
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeThankYouCard();
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeThankYouCard();
    }
  });
}

// Helper to format WhatsApp message with all submitted B2B form details
function formatWhatsAppInquiryMessage(details) {
  const lines = [
    `*GUGAN GLOBAL VENTURE: EXPORT INQUIRY*`,
    `----------------------------------------`,
    `*Inquiry Ref:* ${details.refCode || 'GGV-EXPORT'}`,
    `*Buyer Name:* ${details.name || 'Trade Importer'}`
  ];

  if (details.company) {
    lines.push(`*Company:* ${details.company}`);
  }
  if (details.email) {
    lines.push(`*Official Email:* ${details.email}`);
  }
  if (details.phone) {
    lines.push(`*Phone / WhatsApp:* ${details.phone}`);
  }
  if (details.destination) {
    lines.push(`*Destination / Incoterms:* ${details.destination}`);
  }
  if (details.quantity && details.quantity !== details.destination) {
    lines.push(`*Required Volume:* ${details.quantity}`);
  }
  if (details.products) {
    lines.push(`*Spice Product(s):* ${details.products}`);
  }
  if (details.varieties && details.varieties !== 'Not specified / All export grades') {
    lines.push(`*Selected Export Varieties:* ${details.varieties}`);
  }
  if (details.message) {
    lines.push(`*Client Notes / Specs:* ${details.message}`);
  }

  lines.push(`----------------------------------------`);
  lines.push(`Hello Gugan Global Trade Desk, I have registered this export inquiry on your website. Please connect regarding commercial quotation and sample dispatch.`);

  return lines.join('\n');
}

function showThankYouCard(details) {
  const modal = document.getElementById('thankYouModal');
  if (!modal) return;

  const refEl = document.getElementById('thankYouRefId');
  const nameEl = document.getElementById('thankYouName');
  const emailEl = document.getElementById('thankYouEmail');
  const destEl = document.getElementById('thankYouDest');
  const prodEl = document.getElementById('thankYouProducts');
  const waBtn = document.getElementById('thankYouWaBtn');

  const refCode = details.refCode || ('GGV-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000));
  if (refEl) refEl.textContent = refCode;
  if (nameEl) nameEl.textContent = details.name + (details.company ? ` (${details.company})` : '');
  if (emailEl) emailEl.textContent = details.email || '-';
  if (destEl) destEl.textContent = details.destination || details.quantity || 'Direct Seaport Export (FOB / CIF)';

  const displayProds = details.products || 'Indian Spices';
  const displayVars = (details.varieties && details.varieties !== 'Not specified / All export grades') ? details.varieties : '';
  if (prodEl) {
    prodEl.textContent = displayVars ? `${displayProds} • ${displayVars}` : displayProds;
  }

  // Build dynamic WhatsApp link with 100% of user-submitted form details
  if (waBtn) {
    const waText = formatWhatsAppInquiryMessage({
      ...details,
      refCode: refCode
    });
    waBtn.href = `https://wa.me/918220280068?text=${encodeURIComponent(waText)}`;
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeThankYouCard() {
  const modal = document.getElementById('thankYouModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ==========================================================================
// COMPREHENSIVE FORM VALIDATION & SANITIZATION ENGINE
// ==========================================================================

function setFieldError(fieldEl, message) {
  if (!fieldEl) return;
  fieldEl.classList.add('is-invalid');
  const parentGroup = fieldEl.closest('.form-group') || fieldEl.parentElement;
  if (!parentGroup) return;

  let errEl = parentGroup.querySelector('.form-field-error');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = 'form-field-error';
    parentGroup.appendChild(errEl);
  }
  errEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${escapeHTML(message)}</span>`;
}

function clearFieldError(fieldEl) {
  if (!fieldEl) return;
  fieldEl.classList.remove('is-invalid');
  const parentGroup = fieldEl.closest('.form-group') || fieldEl.parentElement;
  if (parentGroup) {
    const errEl = parentGroup.querySelector('.form-field-error');
    if (errEl) errEl.remove();
  }
}

function clearFormErrors(form) {
  if (!form) return;
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  form.querySelectorAll('.form-field-error').forEach(el => el.remove());
}

function setupFormRealtimeValidation(form, multiSelectInst) {
  if (!form) return;

  // Clear errors on user input / blur
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        clearFieldError(input);
      }
    });

    input.addEventListener('blur', () => {
      const val = input.value.trim();
      if (input.hasAttribute('required') && !val) {
        const label = (input.closest('.form-group')?.querySelector('label') || {}).textContent || 'This field';
        setFieldError(input, `${label.replace('*', '').trim()} is required.`);
      } else if (input.type === 'email' && val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(val)) {
          setFieldError(input, 'Please enter a valid email address.');
        } else {
          clearFieldError(input);
        }
      } else if (input.type === 'tel' && val) {
        const digitsOnly = val.replace(/[^0-9]/g, '');
        if (digitsOnly.length < 7) {
          setFieldError(input, 'Please enter a valid phone number (min 7 digits).');
        } else {
          clearFieldError(input);
        }
      }
    });
  });

  if (multiSelectInst) {
    if (multiSelectInst.catContainer) {
      multiSelectInst.catContainer.addEventListener('click', () => {
        if (multiSelectInst.catContainer.classList.contains('is-invalid')) {
          clearFieldError(multiSelectInst.catContainer);
        }
      });
    }
    if (multiSelectInst.varContainer) {
      multiSelectInst.varContainer.addEventListener('click', () => {
        if (multiSelectInst.varContainer.classList.contains('is-invalid')) {
          clearFieldError(multiSelectInst.varContainer);
        }
      });
    }
  }
}

function validateUnifiedForm(form, multiSelectInst) {
  clearFormErrors(form);
  let isValid = true;
  let firstInvalidEl = null;

  function markInvalid(el, msg) {
    isValid = false;
    setFieldError(el, msg);
    if (!firstInvalidEl) firstInvalidEl = el;
  }

  // 1. Full Name
  const nameInput = form.querySelector('input[name="name"]');
  if (nameInput) {
    const nameVal = nameInput.value.trim();
    if (!nameVal) {
      markInvalid(nameInput, 'Full Name is required.');
    } else if (nameVal.length < 2) {
      markInvalid(nameInput, 'Full Name must be at least 2 characters.');
    }
  }

  // 2. Email Address
  const emailInput = form.querySelector('input[name="email"]');
  if (emailInput) {
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailVal) {
      markInvalid(emailInput, 'Email address is required.');
    } else if (!emailRegex.test(emailVal)) {
      markInvalid(emailInput, 'Please enter a valid business email address.');
    }
  }

  // 3. Phone / WhatsApp
  const phoneInput = form.querySelector('input[name="phone"]');
  if (phoneInput) {
    const phoneVal = phoneInput.value.trim();
    const digitsOnly = phoneVal.replace(/[^0-9]/g, '');
    if (!phoneVal) {
      markInvalid(phoneInput, 'Phone number / WhatsApp is required.');
    } else if (digitsOnly.length < 7) {
      markInvalid(phoneInput, 'Please enter a valid phone number with country code (min 7 digits).');
    }
  }

  // 4. Country / Destination Port
  const portInput = form.querySelector('input[name="destination_port"]');
  if (portInput) {
    const portVal = portInput.value.trim();
    if (!portVal) {
      markInvalid(portInput, 'Country / Destination Port is required.');
    } else if (portVal.length < 2) {
      markInvalid(portInput, 'Please specify your country or destination seaport.');
    }
  }

  // 5. Spice Products Multiselect
  if (multiSelectInst) {
    if (!multiSelectInst.selectedCategories || multiSelectInst.selectedCategories.size === 0) {
      markInvalid(multiSelectInst.catContainer, 'Please select at least one spice product.');
      multiSelectInst.catContainer.classList.add('b2b-highlight-pulse');
      setTimeout(() => multiSelectInst.catContainer.classList.remove('b2b-highlight-pulse'), 1400);
    } else if (!multiSelectInst.selectedVarieties || multiSelectInst.selectedVarieties.size === 0) {
      // 6. Spice Varieties Multiselect
      markInvalid(multiSelectInst.varContainer, 'Please select at least one spice variety.');
      multiSelectInst.varContainer.classList.add('b2b-highlight-pulse');
      setTimeout(() => multiSelectInst.varContainer.classList.remove('b2b-highlight-pulse'), 1400);
    }
  }

  if (!isValid && firstInvalidEl) {
    if (typeof firstInvalidEl.focus === 'function') {
      firstInvalidEl.focus();
    } else {
      const focusable = firstInvalidEl.querySelector('input, select, [tabindex="0"]');
      if (focusable) focusable.focus();
    }
  }

  return isValid;
}

// Quote Modal Form Submission Handler
function initQuoteForm() {
  const quoteForm = document.getElementById('quoteForm');
  const modalOverlay = document.getElementById('quoteModal');
  if (!quoteForm) return;

  setupFormRealtimeValidation(quoteForm, modalMultiSelectInst);

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateUnifiedForm(quoteForm, modalMultiSelectInst)) {
      showToast('Please correct the highlighted fields before submitting.');
      return;
    }

    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span> Submitting Request...';
    }

    // Activate Gugan Logo touch-blocking overlay immediately
    showSubmissionLoader(
      'Transmitting Quote Request...',
      'Connecting to Gugan Global export desk. Please wait a moment.'
    );

    // Collect all input values explicitly
    const nameVal = (quoteForm.querySelector('input[name="name"]') || {}).value.trim();
    const companyVal = (quoteForm.querySelector('input[name="company"]') || {}).value.trim();
    const emailVal = (quoteForm.querySelector('input[name="email"]') || {}).value.trim();
    const phoneVal = (quoteForm.querySelector('input[name="phone"]') || {}).value.trim();
    const portVal = (quoteForm.querySelector('input[name="destination_port"]') || {}).value.trim();
    const msgVal = (quoteForm.querySelector('textarea[name="message"]') || {}).value.trim();

    const productsVal = formatSelectedCategories(modalMultiSelectInst ? modalMultiSelectInst.selectedCategories : null);
    const varietiesVal = formatSelectedVarieties(modalMultiSelectInst ? modalMultiSelectInst.selectedVarieties : null);

    const refCode = 'GGV-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);

    // Build comprehensive, highly readable email ticket payload
    const payload = {
      _subject: `[EXPORT INQUIRY] ${nameVal}${companyVal ? ' (' + companyVal + ')' : ''} | ${productsVal} (${portVal || 'Direct Port'})`,
      _replyto: emailVal,
      _template: 'table',
      _captcha: 'false',
      'Inquiry_Reference_ID': refCode,
      'Inquiry_Type': 'Commercial Export Quotation Request',
      'Buyer_Full_Name': nameVal,
      'Company_Organization': companyVal || 'Direct Trade Importer',
      'Official_Email': emailVal,
      'Phone_WhatsApp': phoneVal || 'Not provided',
      'Destination_Port_Country': portVal || 'Direct Seaport Export (FOB / CIF)',
      'Target_Spice_Products': productsVal,
      'Selected_Export_Varieties_Grades': varietiesVal,
      'Client_Order_Notes_Specifications': msgVal || 'No specific requirements mentioned.',
      'Commercial_Response_SLA': 'Guaranteed Under 24 Hours',
      'Submission_Timestamp': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' }),
      'Portal_Origin': 'Gugan Global Venture - Official B2B Web Portal'
    };

    const detailsForThankYou = {
      refCode: refCode,
      name: nameVal,
      company: companyVal,
      email: emailVal,
      phone: phoneVal,
      destination: portVal || 'Direct Seaport (FOB / CIF)',
      quantity: '',
      products: productsVal,
      varieties: varietiesVal,
      message: msgVal
    };

    fetch('https://formsubmit.co/ajax/info@guganglobalventure.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      hideSubmissionLoader(true, 'Quote Request Received!', 'Displaying official confirmation details...', () => {
        if (modalOverlay) modalOverlay.classList.remove('active');
        quoteForm.reset();
        clearFormErrors(quoteForm);
        if (modalMultiSelectInst) modalMultiSelectInst.reset();
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnContent;
          submitBtn.disabled = false;
        }
        showThankYouCard(detailsForThankYou);
      });
    })
    .catch(err => {
      console.warn('FormSubmit notice:', err);
      hideSubmissionLoader(true, 'Quote Request Received!', 'Displaying official confirmation details...', () => {
        if (modalOverlay) modalOverlay.classList.remove('active');
        quoteForm.reset();
        clearFormErrors(quoteForm);
        if (modalMultiSelectInst) modalMultiSelectInst.reset();
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnContent;
          submitBtn.disabled = false;
        }
        showThankYouCard(detailsForThankYou);
      });
    });
  });
}

// Contact Page Trade Inquiry Form Handler
function initTradeInquiryForm() {
  const tradeForm = document.getElementById('tradeInquiryForm');
  if (!tradeForm) return;

  setupFormRealtimeValidation(tradeForm, contactMultiSelectInst);

  tradeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateUnifiedForm(tradeForm, contactMultiSelectInst)) {
      showToast('Please correct the highlighted fields before submitting.');
      return;
    }

    const submitBtn = tradeForm.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span> Submitting Inquiry...';
    }

    // Activate Gugan Logo touch-blocking overlay immediately
    showSubmissionLoader(
      'Transmitting Trade Inquiry...',
      'Connecting to Gugan Global export desk. Please wait a moment.'
    );

    // Collect all inputs explicitly to guarantee data persistence
    const nameVal = (tradeForm.querySelector('input[name="name"]') || {}).value.trim();
    const companyVal = (tradeForm.querySelector('input[name="company"]') || {}).value.trim();
    const emailVal = (tradeForm.querySelector('input[name="email"]') || {}).value.trim();
    const phoneVal = (tradeForm.querySelector('input[name="phone"]') || {}).value.trim();
    const portVal = (tradeForm.querySelector('input[name="destination_port"]') || {}).value.trim();
    const msgVal = (tradeForm.querySelector('textarea[name="message"]') || {}).value.trim();

    const productsVal = formatSelectedCategories(contactMultiSelectInst ? contactMultiSelectInst.selectedCategories : null);
    const varietiesVal = formatSelectedVarieties(contactMultiSelectInst ? contactMultiSelectInst.selectedVarieties : null);

    const refCode = 'GGV-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);

    // Clean, detailed, and highly readable payload mapping to email table rows
    const payload = {
      _subject: `[TRADE INQUIRY] ${nameVal}${companyVal ? ' (' + companyVal + ')' : ''} | ${productsVal} (${portVal || 'Direct Port'})`,
      _replyto: emailVal,
      _template: 'table',
      _captcha: 'false',
      'Inquiry_Reference_ID': refCode,
      'Inquiry_Type': 'B2B Trade & Export Requirement',
      'Buyer_Full_Name': nameVal,
      'Company_Organization': companyVal || 'Direct Trade Importer',
      'Official_Email': emailVal,
      'Phone_WhatsApp': phoneVal || 'Not provided',
      'Destination_Port_Country': portVal || 'Direct Seaport (FOB / CIF)',
      'Target_Spice_Products': productsVal,
      'Selected_Export_Varieties_Grades': varietiesVal,
      'Client_Order_Notes_Specifications': msgVal || 'No specific requirements mentioned.',
      'Commercial_Response_SLA': 'Guaranteed Under 24 Hours',
      'Submission_Timestamp': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' }),
      'Portal_Origin': 'Gugan Global Venture - Official B2B Web Portal'
    };

    const detailsForThankYou = {
      refCode: refCode,
      name: nameVal,
      company: companyVal,
      email: emailVal,
      phone: phoneVal,
      destination: portVal || 'Direct Seaport Export',
      quantity: '',
      products: productsVal,
      varieties: varietiesVal,
      message: msgVal
    };

    fetch('https://formsubmit.co/ajax/info@guganglobalventure.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      hideSubmissionLoader(true, 'Inquiry Sent Successfully!', 'Displaying official confirmation details...', () => {
        tradeForm.reset();
        clearFormErrors(tradeForm);
        if (contactMultiSelectInst) contactMultiSelectInst.reset();
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnContent;
          submitBtn.disabled = false;
        }
        showThankYouCard(detailsForThankYou);
      });
    })
    .catch(err => {
      console.warn('FormSubmit notice:', err);
      hideSubmissionLoader(true, 'Inquiry Sent Successfully!', 'Displaying official confirmation details...', () => {
        tradeForm.reset();
        clearFormErrors(tradeForm);
        if (contactMultiSelectInst) contactMultiSelectInst.reset();
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnContent;
          submitBtn.disabled = false;
        }
        showThankYouCard(detailsForThankYou);
      });
    });
  });
}

// Interactive Spice Catalog Engine (Grade Switcher)
function initInteractiveCatalog() {
  const catalogRoot = document.getElementById('spice-catalog');
  if (!catalogRoot) return;

  const catalog = {
    chilli: {
      id: "chilli",
      theme: "chilli",
      reverse: true,
      cream: true,
      badgeClass: "badge-red",
      specsClass: "red-bg",
      dot: "#C22E1A",
      overview: {
        badge: "RED CHILLI",
        note: "4 export varieties available",
        name: "Dry Red Chilli",
        origin: "Origin: Andhra Pradesh & Karnataka",
        desc: "Select a variety Below for Heat Range, Colour Value, Moisture, and Packing grades used in export Contracts.",
        tagline: "Premium Quality • Authentic Origin • Export Excellence",
        image: "assets/dry_red_chilli.png",
        specs: [
          ["Heat (SHU)", "8,000 – 100,000 SHU"],
          ["Colour Value (ASTA)", "40 – 140 Max"],
          ["Forms", "Whole, Stemless, Crushed, Powder"],
          ["Moisture", "Less Than 10%"],
          ["Packaging", "PP Bags / Jute / Vacuum"],
          ["Min. Order Qty", "1 FCL (15-20 MT)"],
          ["Certifications", "APEDA · FSSAI · Phyto"]
        ]
      },
      varieties: [
        {
          key: "teja",
          name: "Teja (S17)",
          badge: "EXTREMELY HOT",
          note: "High capsaicin · flagship export",
          origin: "Grown mainly in Andhra Pradesh and Telangana",
          desc: "Teja (S17) is a premium Indian chilli variety known for its exceptional heat, rich red colour, and high capsaicin content. Grown mainly in Andhra Pradesh and Telangana, it is a preferred choice for global spice manufacturers and food processing industries.",
          tile: "Extremely hot with intense pungency.",
          image: "assets/chilli_teja.jpg",
          metric: "85,000 – 100,000 SHU",
          forms: "Whole, Stemless, Crushed, Powder",
          specs: [
            ["Heat (SHU)", "85,000 – 100,000"],
            ["Colour Value (ASTA)", "60-80 Max"],
            ["Flavour", "High Spicy"],
            ["Moisture", "Less Than 10 %"],
            ["Length", "6-9 Cm (Without Stem)"],
            ["Skin", "Thin"],
            ["Capsaicin", "0.589%"]
          ]
        },
        {
          key: "sannam-s4",
          name: "Sannam S4 / 334",
          badge: "HIGH DEMAND",
          note: "Also sold as 334, Sannam, and S-4",
          origin: "Guntur, Warangal & Khammam",
          desc: "The Guntur Sannam chilli pepper is grown extensively in Guntur, Warangal, and Khammam, and represents 75% of India's total production. One of the most in-demand red chilli varieties out there, it's also sold under the names 334, Sannam, and S-4.",
          tile: "Sold as 334, Sannam, and S-4.",
          image: "assets/chilli_sannam.jpg",
          metric: "35,000 – 45,000 SHU",
          forms: "Whole, Stemless, Crushed, Powder",
          specs: [
            ["Heat (SHU)", "35,000 – 45,000"],
            ["Colour Value (ASTA)", "30-40 Max"],
            ["Flavour", "Medium Spicy"],
            ["Moisture", "Less Than 10 %"],
            ["Length", "5-7 Cm (Without Stem)"],
            ["Skin", "Thick"],
            ["Capsaicin", "0.23%"]
          ]
        },
        {
          key: "byadgi",
          name: "Byadgi",
          badge: "GI TAGGED",
          note: "Deep crimson · mild heat",
          origin: "Karnataka, India",
          desc: "Byadgi is a premium GI-tagged Indian chilli variety renowned for its deep crimson-red colour, mild pungency, and exceptional colouring properties. Grown in Karnataka, it is widely used in chilli powder manufacturing, spice blends, and oleoresin extraction, making it one of the most preferred export varieties for the global food industry.",
          tile: "Rich colour with mild heat.",
          image: "assets/chilli_byadgi.jpg",
          metric: "8,000 – 15,000 SHU",
          forms: "Whole, Stemless, Crushed, Powder",
          specs: [
            ["Heat (SHU)", "8,000 – 15,000"],
            ["Colour Value (ASTA)", "120-140 Max"],
            ["Flavour", "Mild Spicy"],
            ["Moisture", "Less Than 10 %"],
            ["Length", "8-10 Cm (Without Stem)"],
            ["Skin", "Wrinkled"],
            ["Capsaicin", "0.28%"]
          ]
        },
        {
          key: "wonder-hot",
          name: "Wonder Hot",
          badge: "HIGH PUNGENCY",
          note: "Intense heat · powder & sauces",
          origin: "Andhra Pradesh, India",
          desc: "Wonder Hot is a high-pungency Indian dry red chilli variety valued for its intense heat, vibrant red colour, and reliable export quality. Sourced from Andhra Pradesh, it is widely used in chilli powder production, spice blends, hot sauces, and food processing industries, making it an excellent choice for buyers seeking consistent heat and performance.",
          tile: "High-pungency chilli for processing",
          image: "assets/chilli_wonder_hot.jpg",
          metric: "40,000 – 60,000 SHU",
          forms: "Whole, Stemless, Crushed, Powder",
          specs: [
            ["Heat (SHU)", "40,000 – 60,000"],
            ["Colour Value (ASTA)", "50-80 Max"],
            ["Flavour", "Intensely Spicy"],
            ["Moisture", "Less Than 10 %"],
            ["Length", "7–9 cm (Without Stem)"],
            ["Skin", "Thin to Medium"],
            ["Capsaicin", "0.31%"]
          ]
        }
      ]
    },
    turmeric: {
      id: "turmeric",
      theme: "turmeric",
      reverse: false,
      cream: false,
      badgeClass: "badge-amber",
      specsClass: "brown-bg",
      dot: "#F5C60E",
      overview: {
        badge: "GOLDEN ROOT",
        note: "5 export varieties available",
        name: "Turmeric",
        origin: "Origin: Tamil Nadu, Telangana, Maharashtra & Meghalaya",
        desc: "Finger and Bulb grades sort by Curcumin Content and polishing finish for food and colour applications.",
        tagline: "Pure • Potent • Naturally Golden",
        image: "assets/turmeric_finger.png",
        specs: [
          ["Curcumin Content", "2.5% – 12%"],
          ["ASTA Colour Value", "70+ to 100+"],
          ["Forms", "Polished / Double Polished"],
          ["Moisture", "≤ 12% max"],
          ["Packaging", "PP Bags / Jute / Vacuum"],
          ["Min. Order Qty", "1 FCL (18-20 MT)"],
          ["Certifications", "APEDA · FSSAI · Phyto"]
        ]
      },
      varieties: [
        {
          key: "erode",
          name: "Erode Turmeric",
          badge: "TURMERIC CITY",
          note: "Vibrant golden · rich aroma",
          origin: "Origin – Erode, Tamil Nadu, India",
          desc: "Renowned as India's \"Turmeric City\" variety, Erode Turmeric is valued for its vibrant golden-yellow colour, rich aroma, and consistent curcumin content. It is a preferred choice for global spice, pharmaceutical, food processing, and natural colouring industries.",
          tile: "Premium golden turmeric with rich aroma and consistent curcumin.",
          image: "assets/turmeric_erode.jpg",
          metric: "Curcumin 3.5 – 5%",
          forms: "Polished, Double Polished",
          specs: [
            ["Origin", "Erode, Tamil Nadu, India"],
            ["Curcumin Content", "3.5 – 5%"],
            ["ASTA Colour Value", "80+"],
            ["Moisture", "12% max"],
            ["Finger Length", "3-6 cm"],
            ["Aroma", "Strong & Earthy"],
            ["Form", "Whole Fingers"],
            ["Export Use", "Spice, Pharma, Dye"]
          ]
        },
        {
          key: "salem",
          name: "Salem Turmeric",
          badge: "SUPERIOR GRADE",
          note: "Polished appearance · retail",
          origin: "Origin – Salem, Tamil Nadu, India",
          desc: "Renowned for polished appearance, rich golden hue, and superior quality. Preferred by international buyers for retail and food processing applications. Excellent curcumin retention with consistent finger size.",
          tile: "Superior colour, balanced curcumin, and trusted export quality.",
          image: "assets/turmeric_salem.jpg",
          metric: "Curcumin 3 – 4.5%",
          forms: "Polished",
          specs: [
            ["Origin", "Salem, Tamil Nadu, India"],
            ["Curcumin Content", "3 – 4.5%"],
            ["ASTA Colour Value", "75+"],
            ["Moisture", "12% max"],
            ["Finger Length", "3-5 cm"],
            ["Aroma", "Warm & Pungent"],
            ["Form", "Whole Fingers / Bulbs"],
            ["Export Use", "Retail, Food, Spice"]
          ]
        },
        {
          key: "nizamabad",
          name: "Nizamabad Turmeric",
          badge: "TELANGANA GRADE",
          note: "Bright yellow · pleasant aroma",
          origin: "Origin – Nizamabad, Telangana, India",
          desc: "Nizamabad Turmeric is a premium export-grade variety appreciated for its bright yellow colour, pleasant aroma, and consistent curcumin content. Sourced from Telangana's renowned turmeric-growing region, it is widely used in food processing, pharmaceuticals, nutraceuticals, and spice manufacturing for international markets.",
          tile: "Naturally vibrant turmeric with excellent processing performance.",
          image: "assets/turmeric_nizamabad.webp",
          metric: "Curcumin 3 – 4.5%",
          forms: "Polished, Unpolished",
          specs: [
            ["Origin", "Nizamabad, Telangana, India"],
            ["Curcumin Content", "3 – 4.5%"],
            ["ASTA Colour Value", "70+"],
            ["Moisture", "12% max"],
            ["Finger Length", "4-7 cm"],
            ["Aroma", "Robust & Woody"],
            ["Form", "Whole Fingers"],
            ["Export Use", "Spice, Bulk, Grinding"]
          ]
        },
        {
          key: "rajapuri",
          name: "Rajapuri (Sangli) Turmeric",
          badge: "BULK EXPORT",
          note: "Large fingers · commercial lead",
          origin: "Origin – Sangli, Maharashtra, India",
          desc: "Rajapuri (Sangli) Turmeric is India's leading commercial turmeric variety, valued for its large fingers, bright yellow colour, and consistent processing quality. It is widely exported for spice manufacturing, food processing, pharmaceutical, and nutraceutical applications worldwide.",
          tile: "Large finger turmeric preferred for bulk exports worldwide.",
          image: "assets/turmeric_rajapuri.jpg",
          metric: "Curcumin 2.5 – 4%",
          forms: "Polished",
          specs: [
            ["Origin", "Sangli, Maharashtra, India"],
            ["Curcumin Content", "2.5 – 4%"],
            ["ASTA Colour Value", "70+"],
            ["Moisture", "12% max"],
            ["Finger Length", "3-5 cm"],
            ["Aroma", "Mild & Earthy"],
            ["Form", "Whole Fingers"],
            ["Export Use", "Food Processing, Spice"]
          ]
        },
        {
          key: "lakadong",
          name: "Lakadong Turmeric",
          badge: "HIGH CURCUMIN",
          note: "7-12% Curcumin · medicinal grade",
          origin: "Origin – Lakadong, Meghalaya, India",
          desc: "Lakadong Turmeric is a premium high-curcumin variety from Meghalaya, renowned for its exceptional purity, rich golden colour, and superior medicinal value. Its outstanding quality makes it a preferred choice for pharmaceutical, nutraceutical, wellness, and premium food applications worldwide.",
          tile: "High-curcumin premium turmeric with exceptional purity and potency.",
          image: "assets/turmeric_lakadong.jpg",
          metric: "Curcumin 7-12%",
          forms: "Double Polished, Premium Cleaned",
          specs: [
            ["Origin", "Lakadong, Meghalaya, India"],
            ["Curcumin Content", "7-12%"],
            ["ASTA Colour Value", "100+"],
            ["Moisture", "10% max"],
            ["Finger Length", "2-4 cm"],
            ["Aroma", "Intense & Rich"],
            ["Form", "Whole Fingers / Bulbs"],
            ["Export Use", "Pharma, Nutraceutical, Medicinal"]
          ]
        }
      ]
    },
    cardamom: {
      id: "cardamom",
      theme: "cardamom",
      reverse: false,
      cream: false,
      badgeClass: "badge-teal",
      specsClass: "green-bg",
      dot: "#0E8268",
      overview: {
        badge: "AROMATIC GRADE",
        note: "3 export varieties available",
        name: "Cardamom",
        origin: "Origin: Kerala & Tamil Nadu (Western Ghats)",
        desc: "Select an export grade below to view quality parameters, capsule size, moisture, and packing options.",
        tagline: "Aromatic • Premium • Superior",
        image: "assets/green_cardamom.png",
        specs: [
          ["Capsule Size", "6.5 mm to > 8 mm"],
          ["Grade", "Export / Premium Export"],
          ["Forms", "Whole Pods, Seeds, Powder"],
          ["Moisture", "Less than 10%"],
          ["Packaging", "PP Bags / Vacuum"],
          ["Min. Order Qty", "500 kg – 1 FCL"],
          ["Certifications", "APEDA · FSSAI · Phyto"]
        ]
      },
      varieties: [
        {
          key: "ageb",
          name: "AGEB – Alleppey Green Extra Bold",
          badge: "EXTRA BOLD",
          note: "Extra-large capsules · > 8 mm",
          origin: "Origin - Idukki, Kerala, India",
          desc: "The finest export grade of Indian green cardamom, AGEB is distinguished by its extra-large capsules, vibrant green colour, and intense natural aroma. It is the preferred choice for premium retail, gourmet food products, and international spice markets.",
          tile: "Extra-large premium capsules with vibrant green colour and exceptional aroma.",
          image: "assets/cardamom_ageb.webp",
          metric: "Capsule > 8 mm",
          forms: "Extra Bold, Premium Grade",
          specs: [
            ["Origin", "Idukki, Kerala, India"],
            ["Capsule Size", "More than 8 mm"],
            ["Grade", "Premium Export Grade"],
            ["Colour", "Bright Natural Green"],
            ["Moisture", "Less than 10%"],
            ["Aroma", "Strong, Sweet & Characteristic"],
            ["Forms Available", "Whole Pods, Seeds, Powder"]
          ]
        },
        {
          key: "agb",
          name: "AGB – Alleppey Green Bold",
          badge: "EXPORT BOLD",
          note: "7-8 mm capsules · rich aroma",
          origin: "Origin - Idukki, Kerala, India",
          desc: "AGB features bold, uniformly graded green capsules with a rich aroma and excellent flavour. Its consistent quality and attractive appearance make it ideal for bulk exports, food processing, and spice manufacturing.",
          tile: "Bold green capsules offering rich flavour, uniform size, and export-grade quality.",
          image: "assets/cardamom_agb.jpg",
          metric: "Capsule 7-8 mm",
          forms: "Bold, Export Grade",
          specs: [
            ["Origin", "Idukki, Kerala, India"],
            ["Capsule Size", "7-8 mm"],
            ["Grade", "Export Grade"],
            ["Colour", "Bright to Deep Green"],
            ["Moisture", "Less than 10%"],
            ["Aroma", "Rich & Pleasant"],
            ["Forms Available", "Whole Pods, Seeds, Powder"]
          ]
        },
        {
          key: "ags",
          name: "AGS – Alleppey Green Superior",
          badge: "SUPERIOR GRADE",
          note: "6.5-7 mm · commercial export",
          origin: "Origin - Idukki, Kerala, India",
          desc: "AGS is a well-graded commercial export quality cardamom offering balanced size, natural green colour, and pleasant aroma. It is widely used in spice blends, beverages, and food processing industries across global markets.",
          tile: "Well-graded green capsules with pleasant aroma and consistent commercial quality.",
          image: "assets/cardamom_ags.webp",
          metric: "Capsule 6.5-7 mm",
          forms: "Superior, Commercial Grade",
          specs: [
            ["Origin", "Idukki, Kerala, India"],
            ["Capsule Size", "6.5-7 mm"],
            ["Grade", "Superior Commercial Export Grade"],
            ["Colour", "Natural Green"],
            ["Moisture", "Less than 10%"],
            ["Aroma", "Pleasant & Characteristic"],
            ["Forms Available", "Whole Pods, Seeds, Powder"]
          ]
        }
      ]
    },
    pepper: {
      id: "pepper",
      theme: "pepper",
      reverse: true,
      cream: false,
      badgeClass: "badge-amber",
      specsClass: "dark-bg",
      dot: "#FFFFFF",
      overview: {
        badge: "KING OF SPICES",
        note: "4 export varieties available",
        name: "Black pepper",
        origin: "Origin: Kerala, Karnataka & Tamil Nadu",
        desc: "Select an export grade below to explore berry size, piperine content, density, moisture, and packaging specifications.",
        tagline: "Bold • Authentic • Distinctive",
        image: "assets/black_pepper.png",
        specs: [
          ["Piperine Content", "4.5 – 8.5%"],
          ["Berry Size", "3.8 – 5.0 mm"],
          ["Forms", "Whole, Cracked, Ground"],
          ["Moisture", "Less than 12%"],
          ["Packaging", "PP Bags / Jute / Vacuum"],
          ["Min. Order Qty", "1 FCL (18-20 MT)"],
          ["Certifications", "APEDA · FSSAI · Phyto"]
        ]
      },
      varieties: [
        {
          key: "mg1",
          name: "Malabar Garbled (MG1)",
          badge: "COMMERCIAL EXPORT",
          note: "Cleaned premium pepper",
          origin: "Origin – Kerala, India",
          desc: "Carefully cleaned and graded, Malabar Garbled offers rich flavour, natural aroma, and excellent purity. It is a trusted choice for bulk exports and food processing industries.",
          tile: "Cleaned premium pepper with excellent flavour and reliable consistency.",
          image: "assets/pepper_mg1.jpg",
          metric: "Berry Size 4.0–4.5 mm",
          forms: "Whole, Cracked, Ground",
          specs: [
            ["Origin", "Kerala, India"],
            ["Grade", "Commercial Export Grade"],
            ["Berry Size", "4.0–4.5 mm"],
            ["Piperine Content", "5.0–7.0%"],
            ["Moisture", "Less than 12%"],
            ["Colour", "Black"],
            ["Forms Available", "Whole, Cracked, Ground"]
          ]
        },
        {
          key: "mug",
          name: "Malabar Ungarbled (MUG)",
          badge: "COMMERCIAL GRADE",
          note: "Ideal for grinding & blends",
          origin: "Origin – Kerala, India",
          desc: "A commercial-grade black pepper with authentic flavour and characteristic pungency. Ideal for grinding, seasoning blends, and industrial food manufacturing.",
          tile: "Commercial black pepper ideal for grinding and industrial applications.",
          image: "assets/pepper_mug.jpg",
          metric: "Berry Size 3.8-4.3 mm",
          forms: "Whole, Cracked, Ground",
          specs: [
            ["Origin", "Kerala, India"],
            ["Grade", "Commercial Grade"],
            ["Berry Size", "3.8-4.3 mm"],
            ["Piperine Content", "4.5-6.5%"],
            ["Moisture", "Less than 12%"],
            ["Colour", "Natural Black"],
            ["Forms Available", "Whole, Cracked, Ground"]
          ]
        },
        {
          key: "tgeb",
          name: "Tellicherry Garbled Extra Bold (TGEB)",
          badge: "PREMIUM BOLD",
          note: "Robust flavour · strong aroma",
          origin: "Origin – Kerala, India",
          desc: "A premium export-grade black pepper featuring bold, uniform berries with a robust flavour and strong aroma. Widely preferred for spice manufacturing, food processing, and retail packaging.",
          tile: "Extra-bold berries with exceptional aroma and premium export quality.",
          image: "assets/pepper_tellicherry.webp",
          metric: "Berry Size 4.75–5.0 mm",
          forms: "Whole, Cracked, Ground",
          specs: [
            ["Origin", "Kerala, India"],
            ["Grade", "Premium Export Grade"],
            ["Berry Size", "4.75–5.0 mm"],
            ["Piperine Content", "6.0–8.0%"],
            ["Moisture", "Less than 12%"],
            ["Colour", "Black"],
            ["Forms Available", "Whole, Cracked, Ground"]
          ]
        },
        {
          key: "tgseb",
          name: "Tellicherry Garbled Special Extra Bold (TGSEB)",
          badge: "FINEST GRADE",
          note: "Largest berries · 5.0 mm",
          origin: "Origin – Idukki, Kerala, India",
          desc: "The finest grade of Indian black pepper, TGSEB is prized for its extra-large berries, rich aroma, and exceptional pungency. It is the preferred choice for premium food brands and gourmet markets worldwide.",
          tile: "Largest Tellicherry grade with rich flavour and superior appearance.",
          image: "assets/pepper_tellicherry.webp",
          metric: "Berry Size 5.0 mm",
          forms: "Whole, Cracked, Ground",
          specs: [
            ["Origin", "Idukki, Kerala, India"],
            ["Grade", "Premium Export Grade"],
            ["Berry Size", "5.0 mm"],
            ["Piperine Content", "6.5–8.5%"],
            ["Moisture", "Less than 12%"],
            ["Colour", "Deep Black"],
            ["Forms Available", "Whole, Cracked, Ground"]
          ]
        }
      ]
    }
  };

  function specsHtml(specs, dotColor) {
    return specs.map(([k, v]) => `
      <div class="spec-row">
        <span class="dot" style="background:${dotColor || '#C22E1A'}"></span>
        <span class="spec-label">${k}</span>
        <span class="spec-val">${v}</span>
      </div>
    `).join("");
  }

  function usesHtml(uses) {
    if (!uses || !uses.length) return "";
    return `
      <div style="margin-top:16px;">
        <p style="font-size:11px; font-weight:700; color:var(--color-text-muted); margin-bottom:8px;">COMMON USES</p>
        <div class="uses-pills">
          ${uses.map((u) => `<span class="uses-tag">${u}</span>`).join("")}
        </div>
      </div>
    `;
  }

  function renderDetail(spice, detail, isVariety, isPanelOpen = false) {
    const formsBadge = detail.forms
      ? `<p style="font-size:13px; font-weight:700; color:var(--color-brand-red); margin-top:14px;">Forms Available: <span style="color:var(--color-text-main); font-weight:500;">${detail.forms}</span></p>`
      : "";

    const toggleText = isPanelOpen
      ? `Hide Varieties <span class="chevron">▴</span>`
      : `View Varieties <span class="chevron">▾</span>`;

    const backBtn = isVariety
      ? `<button class="back-overview-btn" type="button" data-action="back">
        ← Back to ${spice.overview.name} overview
      </button>`
      : "";

    return `
      ${backBtn}
      <div class="badge-row">
        <span class="spec-badge red-pill">${detail.badge}</span>
        <span class="meta-note" style="font-size:12px; color:var(--color-accent-brown); font-weight:600;">${detail.note || ""}</span>
      </div>
      <h3 class="spec-title">${detail.name}</h3>
      <p class="spec-origin">${detail.origin}</p>
      <p class="spec-desc">${detail.desc}</p>
      ${formsBadge}
      <button class="view-varieties-btn" type="button" data-action="toggle-varieties" aria-expanded="${isPanelOpen ? 'true' : 'false'}">
        ${toggleText}
      </button>
    `;
  }

  function bindSpiceBlock(block, spice) {
    const copyEl = block.querySelector('[data-role="copy"]');
    const specRows = block.querySelector('[data-role="spec-rows"]');
    const panel = block.querySelector('[data-role="variety-panel"]');

    function isPanelOpen() {
      return !!(panel && !panel.hidden && panel.classList.contains("open"));
    }

    function setPanelPhoto(image) {
      if (!copyEl) return;
      if (image) {
        copyEl.classList.add("has-panel-photo");
        copyEl.style.setProperty("--panel-photo", `url("${image}")`);
      } else {
        copyEl.classList.remove("has-panel-photo");
        copyEl.style.removeProperty("--panel-photo");
      }

      let expandBtn = copyEl.querySelector(".panel-photo-expand");
      if (!expandBtn) {
        expandBtn = document.createElement("button");
        expandBtn.type = "button";
        expandBtn.className = "panel-photo-expand";
        expandBtn.setAttribute("aria-label", "View image full size");
        expandBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        copyEl.appendChild(expandBtn);
      }
      expandBtn.dataset.image = image || "";
      expandBtn.hidden = !image;
    }

    function showOverview() {
      block.dataset.mode = "overview";
      block.classList.remove("is-variety");
      if (copyEl) copyEl.innerHTML = renderDetail(spice, spice.overview, false, isPanelOpen());
      if (specRows) specRows.innerHTML = specsHtml(spice.overview.specs, spice.dot);
      setPanelPhoto(spice.overview.image || null);

      block.querySelectorAll(".variety-tile").forEach((t) => {
        t.classList.remove("active");
      });
    }

    function showVariety(key) {
      const varObj = spice.varieties.find((v) => v.key === key);
      if (!varObj) return;
      block.dataset.mode = "variety";
      block.classList.add("is-variety");
      if (copyEl) copyEl.innerHTML = renderDetail(spice, varObj, true, isPanelOpen());
      if (specRows) specRows.innerHTML = specsHtml(varObj.specs, spice.dot);
      setPanelPhoto(varObj.image || spice.overview.image || null);

      block.querySelectorAll(".variety-tile").forEach((t) => {
        t.classList.toggle("active", t.dataset.variety === key);
      });
    }

    setPanelPhoto(spice.overview.image || null);

    // Expose instance methods for global navigation router
    block._showVariety = showVariety;
    block._showOverview = showOverview;

    // Helper for smooth scrolling and card focus animation
    function focusCard() {
      const specCard = block.querySelector('.spec-product-card') || block;
      const yOffset = -130;
      const y = specCard.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      specCard.classList.remove('section-focus-glow');
      void specCard.offsetWidth;
      specCard.classList.add('section-focus-glow');

      setTimeout(() => {
        specCard.classList.remove('section-focus-glow');
      }, 1800);
    }

    // Event Delegation on block wrapper
    block.addEventListener("click", (e) => {
      const expandBtn = e.target.closest(".panel-photo-expand");
      if (expandBtn) {
        e.preventDefault();
        e.stopPropagation();
        openPanelPhotoViewer(expandBtn.dataset.image);
        return;
      }

      const toggleBtn = e.target.closest('[data-action="toggle-varieties"]');
      if (toggleBtn) {
        e.preventDefault();
        const currentlyOpen = isPanelOpen();
        if (currentlyOpen) {
          if (panel) {
            panel.hidden = true;
            panel.classList.remove("open");
          }
          toggleBtn.setAttribute("aria-expanded", "false");
          toggleBtn.innerHTML = `View Varieties <span class="chevron">▾</span>`;
        } else {
          if (panel) {
            panel.hidden = false;
            panel.removeAttribute("hidden");
            panel.classList.add("open");
          }
          toggleBtn.setAttribute("aria-expanded", "true");
          toggleBtn.innerHTML = `Hide Varieties <span class="chevron">▴</span>`;
          
          setTimeout(() => {
            if (panel) {
              const yOffset = -130;
              const y = panel.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }, 100);
        }
        return;
      }

      const backBtn = e.target.closest('[data-action="back"]');
      if (backBtn) {
        e.preventDefault();
        showOverview();
        focusCard();
        return;
      }

      const tile = e.target.closest(".variety-tile");
      if (tile) {
        e.preventDefault();
        showVariety(tile.dataset.variety);
        focusCard();
        return;
      }
    });

    return block;
  }

  function createSpiceBlock(spice) {
    const block = document.createElement("div");
    block.className = "spice-block";
    block.id = spice.id;
    block.dataset.theme = spice.theme;
    block.dataset.spice = spice.id;
    block.dataset.mode = "overview";

    block.innerHTML = `
      <div class="spec-product-card ${spice.reverse ? "reverse" : ""}">
        <div class="spec-info-side" data-role="copy">
          ${renderDetail(spice, spice.overview, false)}
          <button class="view-varieties-btn" type="button" data-action="toggle-varieties" aria-expanded="false">
            View Varieties <span class="chevron">▾</span>
          </button>
        </div>
        <div class="spec-table-side ${spice.specsClass}" data-role="specs">
          <h4>EXPORT SPECIFICATIONS</h4>
          <div data-role="spec-rows">${specsHtml(spice.overview.specs, spice.dot)}</div>
        </div>
      </div>

      <div class="variety-panel" data-role="variety-panel" hidden>
        <div class="variety-panel-head">
          <h3>${spice.overview.name} Varieties</h3>
          <span>${spice.varieties.length} export grades</span>
        </div>
        <div class="variety-grid" data-role="variety-grid">
          ${spice.varieties.map((v) => `
            <button class="variety-tile${v.image ? " has-photo" : ""}" type="button" data-variety="${v.key}"${v.image ? ` style="--tile-photo: url('${v.image}')"` : ""}>
              <div class="variety-tile-top">
                <h4>${v.name}</h4>
                <p>${v.tile}</p>
              </div>
              <div class="variety-tile-footer">
                <div class="metric">${v.metric}</div>
                <span class="btn-variety-details">View Details <i class="fa-solid fa-arrow-right"></i></span>
              </div>
            </button>
          `).join("")}
        </div>
      </div>
    `;

    bindSpiceBlock(block, spice);
    return block;
  }

  const photoViewer = document.getElementById("panelPhotoViewer");
  const photoViewerImg = document.getElementById("panelPhotoViewerImg");
  const photoViewerClose = document.getElementById("panelPhotoViewerClose");

  function openPanelPhotoViewer(src) {
    if (!photoViewer || !photoViewerImg || !src) return;
    photoViewerImg.src = src;
    photoViewer.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closePanelPhotoViewer() {
    if (!photoViewer) return;
    photoViewer.hidden = true;
    if (photoViewerImg) photoViewerImg.removeAttribute("src");
    document.body.style.overflow = "";
  }

  if (photoViewerClose) photoViewerClose.addEventListener("click", closePanelPhotoViewer);
  if (photoViewer) {
    photoViewer.addEventListener("click", (e) => {
      if (e.target === photoViewer) closePanelPhotoViewer();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanelPhotoViewer();
  });

  window.openPanelPhotoViewer = openPanelPhotoViewer;

  Object.values(catalog).forEach((spice) => {
    let existingBlock = document.getElementById(spice.id);
    if (existingBlock) {
      bindSpiceBlock(existingBlock, spice);
    } else {
      catalogRoot.appendChild(createSpiceBlock(spice));
    }
  });
}

// Toast Notification
function showToast(message) {
  let toastBox = document.getElementById('toastNotification');
  if (!toastBox) {
    toastBox = document.createElement('div');
    toastBox.id = 'toastNotification';
    toastBox.className = 'toast-box';
    document.body.appendChild(toastBox);
  }

  toastBox.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#38A76E;"></i> <span>${escapeHTML(message)}</span>`;
  toastBox.classList.add('show');

  setTimeout(() => {
    toastBox.classList.remove('show');
  }, 4000);
}

// Global Keyboard Accessibility (Escape Key Handler)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const photoViewer = document.getElementById('panelPhotoViewer');
    if (photoViewer && !photoViewer.hidden) {
      photoViewer.hidden = true;
      const photoViewerImg = document.getElementById('panelPhotoViewerImg');
      if (photoViewerImg) photoViewerImg.removeAttribute('src');
      document.body.style.overflow = '';
    }

    const modalOverlay = document.getElementById('quoteModal');
    if (modalOverlay && modalOverlay.classList.contains('active')) {
      modalOverlay.classList.remove('active');
    }

    const drawer = document.getElementById('mobileNavDrawer');
    const overlay = document.getElementById('mobileDrawerOverlay');
    const menuBtn = document.getElementById('mobileMenuBtn');
    if (drawer && drawer.classList.contains('active')) {
      drawer.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      if (menuBtn) menuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }

    const widget = document.getElementById('floatingContactWidget');
    const fabBtn = document.getElementById('floatingFabBtn');
    if (widget && widget.classList.contains('active')) {
      widget.classList.remove('active');
      if (fabBtn) fabBtn.classList.remove('active');
    }
  }
});

// Floating Contact Widget Controller
function initFloatingContactWidget() {
  const widget = document.getElementById('floatingContactWidget');
  const fabBtn = document.getElementById('floatingFabBtn');

  if (!widget || !fabBtn) return;

  fabBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    widget.classList.toggle('active');
    fabBtn.classList.toggle('active');
  });

  // Close floating menu when clicking outside
  document.addEventListener('click', (e) => {
    if (widget.classList.contains('active') && !widget.contains(e.target)) {
      widget.classList.remove('active');
      fabBtn.classList.remove('active');
    }
  });
}

// Back to Top Button Controller (Triggered only when scroll >= 50%)
function initBackToTopButton() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const scrollPercentage = (window.scrollY / scrollHeight) * 100;
      if (scrollPercentage >= 50) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Scroll Reveal & Intersection Observer for Ultra-Premium Smooth Transitions
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.product-card, .cert-gold-card, .spec-product-card, .process-card, .incoterm-card, .cert-card-item, .why-choose-us, .about-story-section');
  revealElements.forEach(el => el.classList.add('reveal-element'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => observer.observe(el));

  // Also trigger reveal check on active view switch
  window.triggerScrollRevealCheck = () => {
    setTimeout(() => {
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          el.classList.add('revealed');
        }
      });
    }, 100);
  };
}

// B2B FAQ Accordion Controller (Accessible & Auto-Collapse)
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Collapse all other FAQ items for clean UX
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked FAQ item
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// Mobile Navigation Drawer Controller
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileDrawerCloseBtn');
  const overlay = document.getElementById('mobileDrawerOverlay');
  const drawer = document.getElementById('mobileNavDrawer');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  if (!menuBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    menuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', () => {
    if (drawer.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  mobileNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetView = item.getAttribute('data-view');
      if (targetView) {
        window.location.hash = targetView;
      }
      closeDrawer();
    });
  });
}
