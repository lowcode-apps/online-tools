/**
 * Online Tools - Core Framework
 * Modernized ES6+ version replacing jQuery-based legacy system
 *
 * @module main
 */

import { $, $$, on, addClass, removeClass, toggleClass, val, text, attr, prop, closest, trigger, ready, scrollIntoView } from './dom-utils.js';
import { lazyLoader } from './lazy-loader.js';
import { storage } from './storage.js';

/**
 * Online Tools Core Class
 * Manages tool execution, auto-update, state, and UI interactions
 */
class OnlineTools {
  constructor() {
    // Execution state
    this.executeId = 0;
    this.method = null;
    this.getInput = null;
    this.setOutput = null;

    // Binding these methods for use as callbacks
    this.execute = this.execute.bind(this);
    this.autoUpdate = this.autoUpdate.bind(this);
  }

  /**
   * Initialize the application
   */
  init() {
    ready(() => {
      this._initTheme();
      this._initSidebar();
      this._initToolPage();
      this._initEventListeners();
      this._initRememberInput();
      this._initShareParameters();
    });
  }

  /**
   * Initialize theme (dark mode)
   * @private
   */
  _initTheme() {
    // Apply saved theme
    storage.initTheme();

    // Theme toggle button
    const themeButton = $('.theme');
    if (themeButton) {
      on(themeButton, 'click', () => {
        const isDark = storage.isDarkTheme();
        storage.setTheme(!isDark);
      });
    }
  }

  /**
   * Initialize sidebar navigation
   * @private
   */
  _initSidebar() {
    const toggler = $('#sidebar-toggler');
    const sidebar = $('#sidebar');
    const mask = $('#sidebar .mask');

    if (toggler && sidebar) {
      // Open sidebar
      on(toggler, 'click', () => {
        addClass(sidebar, 'open');
        attr(toggler, 'aria-expanded', 'true');
      });

      // Close sidebar
      if (mask) {
        on(mask, 'click', () => {
          removeClass(sidebar, 'open');
          attr(toggler, 'aria-expanded', 'false');
        });
      }

      // Scroll active item into view
      const activeItem = $('#sidebar details.active');
      if (activeItem) {
        scrollIntoView(activeItem, { block: 'nearest' });
      }
    }

    // Remember open state for details elements
    $$('[data-remember-open]').forEach(el => {
      const key = el.dataset.rememberOpen;
      const savedState = storage.getOpenState(key);

      if (savedState) {
        el.open = true;
      }

      on(el, 'toggle', () => {
        storage.setOpenState(key, el.open);
      });
    });

    // Prevent details from closing when clicking toolbar
    $$('summary').forEach(summary => {
      on(summary, 'click', '.toolbar', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
  }

  /**
   * Initialize tool page (input/output/execution)
   * @private
   */
  _initToolPage() {
    const input = $('#input');
    const output = $('#output');
    const autoUpdateCheckbox = $('#auto-update');
    const executeButton = $('.btn-execute');

    if (!input || !output) return;

    // Auto-update handler
    this.autoUpdate = () => {
      if (!autoUpdateCheckbox || prop(autoUpdateCheckbox, 'checked')) {
        // Small delay to avoid excessive updates while typing
        if (this._autoUpdateTimer) {
          clearTimeout(this._autoUpdateTimer);
        }
        this._autoUpdateTimer = setTimeout(() => {
          this.execute();
        }, 100);
      }
    };

    // Execute button
    if (executeButton) {
      on(executeButton, 'click', this.execute);
    }

    // Auto-update on input change
    if (autoUpdateCheckbox) {
      on(autoUpdateCheckbox, 'change', this.autoUpdate);
    }

    // Bind auto-update to all relevant fields
    $$('[data-auto-update], [data-option]').forEach(el => {
      on(el, 'input', this.autoUpdate);
      on(el, 'change', this.autoUpdate);
    });
  }

  /**
   * Initialize global event listeners
   * @private
   */
  _initEventListeners() {
    // Fullscreen toggle
    $$('[data-toggle="fullscreen"]').forEach(btn => {
      on(btn, 'click', () => {
        const block = closest(btn, '.block');
        if (block) {
          toggleClass(block, 'fullscreen');
        }
      });
    });

    // Copy to clipboard
    $$('[data-toggle="copy"]').forEach(btn => {
      on(btn, 'click', async () => {
        const targetSelector = btn.dataset.clipboardTarget;
        const target = $(targetSelector);

        if (!target) return;

        const textToCopy = val(target) || text(target);

        try {
          // Modern clipboard API
          await navigator.clipboard.writeText(textToCopy);
          this.showMessage(btn.dataset.message || 'Copied!');
        } catch {
          // Fallback for older browsers
          target.select();
          document.execCommand('copy');
          this.showMessage(btn.dataset.message || 'Copied!');
        }
      });
    });

    // Toggle elements based on checkbox
    $$('[data-toggle="toggle"]').forEach(checkbox => {
      const targetSelector = checkbox.dataset.target;
      const target = $(targetSelector);

      if (!target) return;

      const updateVisibility = () => {
        target.style.display = prop(checkbox, 'checked') ? '' : 'none';
      };

      on(checkbox, 'change', updateVisibility);
      updateVisibility(); // Initialize
    });
  }

  /**
   * Initialize remember input feature
   * @private
   */
  _initRememberInput() {
    const rememberCheckbox = $('#remember-input');
    if (!rememberCheckbox) return;

    // Load saved preference
    const isEnabled = storage.isRememberInputEnabled();
    prop(rememberCheckbox, 'checked', isEnabled);

    // Update preference on change
    on(rememberCheckbox, 'change', () => {
      const enabled = prop(rememberCheckbox, 'checked');
      storage.setRememberInput(enabled);

      if (!enabled) {
        storage.clearRememberedFields();
      }
    });

    // Remember input values
    if (isEnabled) {
      $$('[data-remember]').forEach(field => {
        const fieldName = field.dataset.remember;
        const savedValue = storage.getRememberedField(fieldName);

        if (savedValue !== null) {
          if (field.type === 'checkbox') {
            prop(field, 'checked', savedValue === '1' || savedValue === true);
          } else {
            val(field, savedValue);
          }
        }

        // Save on change
        on(field, 'input', () => {
          const value = field.type === 'checkbox' ? prop(field, 'checked') : val(field);
          storage.rememberField(fieldName, value);
        });

        on(field, 'change', () => {
          const value = field.type === 'checkbox' ? prop(field, 'checked') : val(field);
          storage.rememberField(fieldName, value);
        });
      });
    }
  }

  /**
   * Initialize URL parameter sharing
   * @private
   */
  _initShareParameters() {
    const params = new URLSearchParams(window.location.search);

    $$('[data-share]:not([data-share-ignore])').forEach(field => {
      const paramName = field.dataset.share;
      const paramValue = params.get(paramName);

      if (paramValue !== null) {
        if (field.type === 'checkbox') {
          prop(field, 'checked', paramValue === '1');
        } else if (field.tagName === 'SELECT') {
          // Find option with matching value
          const option = field.querySelector(`option[value="${paramValue}"]`);
          if (option) {
            val(field, paramValue);
          }
        } else {
          val(field, paramValue);
        }

        // Trigger change event
        trigger(field, 'change');
      }
    });
  }

  /**
   * Main execution method
   * Executes the tool's method with current input
   */
  execute() {
    if (!this.method) {
      console.warn('No method set for execution');
      return;
    }

    const executeId = ++this.executeId;
    const inputEl = $('#input');
    const outputEl = $('#output');

    if (!inputEl || !outputEl) {
      console.warn('Input or output element not found');
      return;
    }

    try {
      // Get input value
      let inputValue;
      if (this.getInput) {
        inputValue = this.getInput(inputEl);
        if (inputValue === false) return; // Validation failed
      } else {
        inputValue = val(inputEl);
      }

      // Execute method
      const result = this.method(inputValue);

      // Handle output
      this._handleOutput(executeId, outputEl, result);
    } catch (error) {
      console.error('Execution error:', error);
      this._handleOutput(executeId, outputEl, error);
    }
  }

  /**
   * Handle execution output (sync or async)
   * @private
   */
  _handleOutput(executeId, outputEl, result) {
    // Ignore if this is not the latest execution
    if (executeId !== this.executeId) return;

    if (result instanceof Promise) {
      // Show loading state
      this._showProcessing(outputEl);

      result
        .then(value => {
          if (executeId === this.executeId) {
            this._setOutput(outputEl, value);
          }
        })
        .catch(error => {
          if (executeId === this.executeId) {
            console.error('Async execution error:', error);
            this._setOutput(outputEl, `Error: ${error.message || error}`);
          }
        });
    } else if (result instanceof Error) {
      this._setOutput(outputEl, `Error: ${result.message}`);
    } else {
      this._setOutput(outputEl, result);
    }
  }

  /**
   * Show processing message
   * @private
   */
  _showProcessing(outputEl) {
    if (this.setOutput) {
      this.setOutput(outputEl, 'Processing...');
    } else {
      text(outputEl, 'Processing...');
    }
  }

  /**
   * Set output value
   * @private
   */
  _setOutput(outputEl, value) {
    if (this.setOutput) {
      this.setOutput(outputEl, value);
    } else {
      const stringValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
      val(outputEl, stringValue);
    }
  }

  /**
   * Set the tool's processing method
   * @param {Function} method - Method to execute
   */
  setMethod(method) {
    this.method = method;
  }

  /**
   * Set custom input getter
   * @param {Function} fn - Custom input getter function
   */
  setGetInput(fn) {
    this.getInput = fn;
  }

  /**
   * Set custom output setter
   * @param {Function} fn - Custom output setter function
   */
  setSetOutput(fn) {
    this.setOutput = fn;
  }

  /**
   * Show temporary message to user
   * @param {string} message - Message to display
   * @param {boolean} [isError=false] - Whether this is an error message
   * @param {number} [duration=2000] - Display duration in milliseconds
   */
  showMessage(message, isError = false, duration = 2000) {
    const msgEl = $('#message');
    if (!msgEl) return;

    text(msgEl, message);
    toggleClass(msgEl, 'error', isError);
    msgEl.style.display = 'block';

    setTimeout(() => {
      msgEl.style.opacity = '0';
      setTimeout(() => {
        msgEl.style.display = 'none';
        msgEl.style.opacity = '1';
      }, 300);
    }, duration);
  }

  /**
   * Get current input value
   * @returns {string} Current input value
   */
  getInputValue() {
    const inputEl = $('#input');
    return inputEl ? val(inputEl) : '';
  }

  /**
   * Set output value
   * @param {string} value - Value to set
   */
  setOutputValue(value) {
    const outputEl = $('#output');
    if (outputEl) {
      val(outputEl, value);
    }
  }

  /**
   * Get query parameters as object
   * @returns {Object} Query parameters
   */
  getQuery() {
    const params = new URLSearchParams(window.location.search);
    const query = {};
    for (const [key, value] of params) {
      query[key] = value;
    }
    return query;
  }
}

// Create singleton instance
const ot = new OnlineTools();

// Initialize on load
ot.init();

// Expose to window for compatibility
window.ot = ot;

// Export for ES6 modules
export default ot;
export { OnlineTools };
