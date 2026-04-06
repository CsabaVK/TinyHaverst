/**
 * TinyHarvest — Custom Shopify Theme
 * theme.js — Vanilla JavaScript, no jQuery
 *
 * Modules:
 *  1. Sticky Header
 *  2. Mobile Menu Toggle
 *  3. Cart (AJAX Add to Cart + Count Update)
 *  4. Quantity Selector
 *  5. Variant Selection
 *  6. Newsletter Form
 *  7. Scroll Reveal (IntersectionObserver)
 *  8. Product Tabs
 *  9. Toast Notifications
 * 10. Announcement Bar Close
 */

'use strict';

/* ==========================================================================
   Utilities
   ========================================================================== */

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

function debounce(fn, wait = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function formatMoney(cents) {
  const amount = (cents / 100).toFixed(2);
  return `€${amount}`;
}

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */

(function initStickyHeader() {
  const header = $('.site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 50;

  function updateHeader() {
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    header.classList.toggle('is-scrolled', scrolled);
  }

  // Run on load
  updateHeader();

  // Listen to scroll with passive flag for performance
  window.addEventListener('scroll', updateHeader, { passive: true });
})();

/* ==========================================================================
   2. Mobile Menu Toggle
   ========================================================================== */

(function initMobileMenu() {
  const hamburger = $('.site-header__hamburger');
  const mobileNav = $('.mobile-nav');
  const body = document.body;

  if (!hamburger || !mobileNav) return;

  function openMenu() {
    hamburger.classList.add('is-open');
    mobileNav.classList.add('is-open');
    body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    const isOpen = mobileNav.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close on nav link click
  $$('a', mobileNav).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (
      mobileNav.classList.contains('is-open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });
})();

/* ==========================================================================
   3. Cart — AJAX Add to Cart & Count Update
   ========================================================================== */

const Cart = (function () {
  /**
   * Fetch current cart and update the header count badge
   */
  async function updateCount() {
    try {
      const res = await fetch('/cart.js', {
        headers: { 'Content-Type': 'application/json' }
      });
      const cart = await res.json();
      const count = cart.item_count || 0;
      updateCountDisplay(count);
    } catch (err) {
      console.error('Cart count error:', err);
    }
  }

  function updateCountDisplay(count) {
    $$('.cart-count').forEach(el => {
      el.textContent = count;
      el.classList.toggle('is-empty', count === 0);

      // Bump animation
      if (count > 0) {
        el.classList.add('bump');
        setTimeout(() => el.classList.remove('bump'), 300);
      }
    });
  }

  /**
   * Add an item to cart via AJAX
   * @param {string|number} variantId
   * @param {number} quantity
   * @param {HTMLElement} btn - the triggering button (for loading state)
   */
  async function addItem(variantId, quantity = 1, btn = null) {
    if (btn) {
      btn.classList.add('btn--loading');
      btn.disabled = true;
    }

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.description || 'Could not add to cart');
      }

      const item = await res.json();
      await updateCount();
      Toast.show(`${item.title} added to cart!`, 'success');
      return item;
    } catch (err) {
      Toast.show(err.message || 'Something went wrong. Please try again.', 'error');
      throw err;
    } finally {
      if (btn) {
        btn.classList.remove('btn--loading');
        btn.disabled = false;
      }
    }
  }

  /**
   * Update quantity of a cart line item
   * @param {string} key - line item key
   * @param {number} quantity
   */
  async function updateItem(key, quantity) {
    try {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity })
      });
      const cart = await res.json();
      updateCountDisplay(cart.item_count);
      return cart;
    } catch (err) {
      console.error('Cart update error:', err);
    }
  }

  /**
   * Remove a cart line item
   * @param {string} key - line item key
   */
  async function removeItem(key) {
    return updateItem(key, 0);
  }

  // Initialize: update count on page load
  updateCount();

  // Handle all Add-to-Cart forms
  document.addEventListener('submit', async function (e) {
    const form = e.target.closest('[data-add-to-cart-form]');
    if (!form) return;

    e.preventDefault();

    const variantInput = form.querySelector('[name="id"]');
    const quantityInput = form.querySelector('[name="quantity"]');
    const btn = form.querySelector('[data-add-to-cart]');

    if (!variantInput) return;

    const variantId = variantInput.value;
    const quantity = quantityInput ? parseInt(quantityInput.value, 10) || 1 : 1;

    await addItem(variantId, quantity, btn);
  });

  return { addItem, updateItem, removeItem, updateCount };
})();

/* ==========================================================================
   4. Quantity Selector
   ========================================================================== */

(function initQuantitySelectors() {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.quantity-btn');
    if (!btn) return;

    const selector = btn.closest('.quantity-selector');
    const input = selector && selector.querySelector('.quantity-input');
    if (!input) return;

    const current = parseInt(input.value, 10) || 1;
    const min = parseInt(input.min, 10) || 1;
    const max = parseInt(input.max, 10) || 99;

    if (btn.dataset.action === 'decrease') {
      input.value = Math.max(min, current - 1);
    } else if (btn.dataset.action === 'increase') {
      input.value = Math.min(max, current + 1);
    }

    // Dispatch change event for any listeners
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
})();

/* ==========================================================================
   5. Variant Selection (featured-product & product page)
   ========================================================================== */

(function initVariantSelector() {
  $$('[data-variant-selector]').forEach(container => {
    const buttons = $$('.variant-btn', container);
    const hiddenInput = container.querySelector('[data-variant-id]');
    const priceEl = container.closest('[data-product-form]')?.querySelector('[data-product-price]');

    buttons.forEach(btn => {
      btn.addEventListener('click', function () {
        // Deselect siblings within same option group
        const group = this.closest('[data-option-group]');
        if (group) {
          $$('.variant-btn', group).forEach(b => b.classList.remove('is-selected'));
        }
        this.classList.add('is-selected');

        // Update hidden variant ID
        if (hiddenInput && this.dataset.variantId) {
          hiddenInput.value = this.dataset.variantId;
        }

        // Update price display
        if (priceEl && this.dataset.price) {
          priceEl.textContent = formatMoney(parseInt(this.dataset.price, 10));
        }
      });
    });
  });
})();

/* ==========================================================================
   6. Newsletter Form
   ========================================================================== */

(function initNewsletterForms() {
  $$('[data-newsletter-form]').forEach(form => {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const emailInput = form.querySelector('[type="email"]');
      const btn = form.querySelector('[data-newsletter-btn]');
      const successMsg = form.closest('[data-newsletter]')?.querySelector('[data-newsletter-success]');

      if (!emailInput) return;

      const email = emailInput.value.trim();
      if (!email) return;

      if (btn) {
        btn.classList.add('btn--loading');
        btn.disabled = true;
      }

      // Submit to Shopify customer form (newsletter contact)
      const formData = new FormData();
      formData.append('form_type', 'customer');
      formData.append('utf8', '✓');
      formData.append('contact[email]', email);
      formData.append('contact[tags]', 'newsletter');

      try {
        await fetch('/', {
          method: 'POST',
          body: formData,
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        // Show success state
        form.style.display = 'none';
        if (successMsg) {
          successMsg.classList.add('is-visible');
        }
        Toast.show('You\'re subscribed! Welcome to the growing community.', 'success');
      } catch (err) {
        Toast.show('Subscription failed. Please try again.', 'error');
      } finally {
        if (btn) {
          btn.classList.remove('btn--loading');
          btn.disabled = false;
        }
      }
    });
  });
})();

/* ==========================================================================
   7. Scroll Reveal (IntersectionObserver)
   ========================================================================== */

(function initScrollReveal() {
  // Skip if reduced motion is preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealEls = $$('.reveal, .reveal--left, .reveal--right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after revealing (one-time animation)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealEls.forEach(el => observer.observe(el));
})();

/* ==========================================================================
   8. Product Tabs
   ========================================================================== */

(function initTabs() {
  $$('[data-tabs]').forEach(tabContainer => {
    const buttons = $$('.tab-btn', tabContainer);
    const panels = $$('.tab-panel', tabContainer);

    function activateTab(index) {
      buttons.forEach((btn, i) => {
        btn.classList.toggle('is-active', i === index);
        btn.setAttribute('aria-selected', i === index);
      });
      panels.forEach((panel, i) => {
        panel.classList.toggle('is-active', i === index);
      });
    }

    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => activateTab(index));

      // Keyboard navigation
      btn.addEventListener('keydown', e => {
        let nextIndex;
        if (e.key === 'ArrowRight') {
          nextIndex = (index + 1) % buttons.length;
        } else if (e.key === 'ArrowLeft') {
          nextIndex = (index - 1 + buttons.length) % buttons.length;
        } else {
          return;
        }
        e.preventDefault();
        activateTab(nextIndex);
        buttons[nextIndex].focus();
      });
    });
  });
})();

/* ==========================================================================
   9. Toast Notifications
   ========================================================================== */

const Toast = (function () {
  let container;

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type = 'default', duration = 4000) {
    const c = getContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');

    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `<span class="toast__icon">${icon}</span><span>${message}</span>`;

    c.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('is-visible'));
    });

    // Auto-remove
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  return { show };
})();

/* ==========================================================================
   10. Cart Page — Live Line Item Updates
   ========================================================================== */

(function initCartPage() {
  const cartForm = $('[data-cart-form]');
  if (!cartForm) return;

  // Remove item
  cartForm.addEventListener('click', async function (e) {
    const removeBtn = e.target.closest('[data-remove-item]');
    if (!removeBtn) return;

    e.preventDefault();
    const key = removeBtn.dataset.removeItem;
    const lineItem = removeBtn.closest('.cart-item');

    if (lineItem) {
      lineItem.style.opacity = '0.5';
      lineItem.style.pointerEvents = 'none';
    }

    try {
      const cart = await Cart.removeItem(key);
      // Reload page to reflect updated cart
      window.location.reload();
    } catch (err) {
      if (lineItem) {
        lineItem.style.opacity = '';
        lineItem.style.pointerEvents = '';
      }
    }
  });

  // Quantity change
  cartForm.addEventListener('change', debounce(async function (e) {
    const input = e.target.closest('.quantity-input[data-line-key]');
    if (!input) return;

    const key = input.dataset.lineKey;
    const quantity = parseInt(input.value, 10);

    if (isNaN(quantity) || quantity < 0) return;

    try {
      await Cart.updateItem(key, quantity);
      window.location.reload();
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  }, 600));
})();

/* ==========================================================================
   11. Announcement Bar — Close button
   ========================================================================== */

(function initAnnouncementBar() {
  const closeBtn = $('[data-announcement-close]');
  const bar = $('[data-announcement-bar]');
  if (!closeBtn || !bar) return;

  closeBtn.addEventListener('click', () => {
    bar.style.height = bar.offsetHeight + 'px';
    requestAnimationFrame(() => {
      bar.style.transition = 'height 0.3s ease, opacity 0.3s ease';
      bar.style.height = '0';
      bar.style.opacity = '0';
      bar.style.overflow = 'hidden';
    });

    // Remove from DOM and update header offset
    setTimeout(() => {
      bar.remove();
      document.body.classList.remove('has-announcement');
    }, 350);

    // Remember in session storage
    sessionStorage.setItem('announcement-closed', 'true');
  });
})();

/* ==========================================================================
   12. Smooth scroll for anchor links
   ========================================================================== */

(function initSmoothScroll() {
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    const headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '80',
      10
    );

    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* ==========================================================================
   13. Active navigation highlighting
   ========================================================================== */

(function initActiveNav() {
  const currentPath = window.location.pathname;

  $$('.site-header__nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (href !== '/' && currentPath.startsWith(href)))) {
      link.classList.add('is-active');
    }
  });
})();

/* ==========================================================================
   14. Image lazy loading fallback (for older browsers)
   ========================================================================== */

(function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return; // Native support

  $$('img[loading="lazy"]').forEach(img => {
    img.src = img.dataset.src || img.src;
  });
})();
