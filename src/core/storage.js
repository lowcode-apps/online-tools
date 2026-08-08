/**
 * Local Storage Manager
 * Simplified wrapper for localStorage with remember/share functionality
 *
 * @module storage
 */

/**
 * Storage class for managing localStorage with prefixing and type safety
 */
export class Storage {
  constructor(prefix = '') {
    this.prefix = prefix;
  }

  /**
   * Get full key with prefix
   * @private
   */
  _key(key) {
    return this.prefix ? `${this.prefix}_${key}` : key;
  }

  /**
   * Get value from localStorage
   * @param {string} key - Storage key
   * @param {*} [defaultValue=null] - Default value if key doesn't exist
   * @returns {*} Stored value or default value
   */
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(this._key(key));
      if (value === null) return defaultValue;

      // Try to parse as JSON, fallback to raw string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (err) {
      console.warn(`Error reading from localStorage: ${key}`, err);
      return defaultValue;
    }
  }

  /**
   * Set value in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON stringified)
   * @returns {boolean} True if successful
   */
  set(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(this._key(key), stringValue);
      return true;
    } catch (err) {
      console.warn(`Error writing to localStorage: ${key}`, err);
      return false;
    }
  }

  /**
   * Remove value from localStorage
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      localStorage.removeItem(this._key(key));
    } catch (err) {
      console.warn(`Error removing from localStorage: ${key}`, err);
    }
  }

  /**
   * Clear all storage (with prefix filtering if prefix is set)
   */
  clear() {
    try {
      if (this.prefix) {
        // Only clear prefixed keys
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.prefix)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        // Clear all
        localStorage.clear();
      }
    } catch (err) {
      console.warn('Error clearing localStorage', err);
    }
  }

  /**
   * Check if key exists
   * @param {string} key - Storage key
   * @returns {boolean} True if key exists
   */
  has(key) {
    return localStorage.getItem(this._key(key)) !== null;
  }

  /**
   * Get all keys (with prefix filtering if prefix is set)
   * @returns {Array<string>} Array of keys
   */
  keys() {
    const allKeys = Object.keys(localStorage);
    if (this.prefix) {
      return allKeys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix + '_', ''));
    }
    return allKeys;
  }

  /**
   * Get storage size in bytes (approximate)
   * @returns {number} Size in bytes
   */
  size() {
    let total = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const value = localStorage[key];
          total += key.length + value.length;
        }
      }
    } catch (err) {
      console.warn('Error calculating storage size', err);
    }
    return total;
  }
}

/**
 * Application-specific storage helper
 * Manages remember input, theme, and other app state
 */
export class AppStorage extends Storage {
  constructor() {
    super(''); // No prefix for compatibility with existing data
  }

  /**
   * Enable or disable "remember input" feature
   * @param {boolean} enabled - Whether to remember inputs
   */
  setRememberInput(enabled) {
    this.set('REMEMBER_INPUT', enabled ? '1' : '0');
  }

  /**
   * Check if "remember input" is enabled
   * @returns {boolean} True if enabled
   */
  isRememberInputEnabled() {
    return this.get('REMEMBER_INPUT') === '1';
  }

  /**
   * Remember input value for a field
   * @param {string} fieldName - Field identifier
   * @param {*} value - Value to remember
   */
  rememberField(fieldName, value) {
    if (this.isRememberInputEnabled()) {
      this.set(`REMEMBER_INPUT_${fieldName}`, value);
    }
  }

  /**
   * Get remembered value for a field
   * @param {string} fieldName - Field identifier
   * @param {*} [defaultValue] - Default value if not found
   * @returns {*} Remembered value or default
   */
  getRememberedField(fieldName, defaultValue = null) {
    if (this.isRememberInputEnabled()) {
      return this.get(`REMEMBER_INPUT_${fieldName}`, defaultValue);
    }
    return defaultValue;
  }

  /**
   * Clear all remembered field values
   */
  clearRememberedFields() {
    const keys = this.keys();
    keys.forEach(key => {
      if (key.startsWith('REMEMBER_INPUT_')) {
        this.remove(key);
      }
    });
  }

  /**
   * Set theme (dark mode)
   * @param {boolean} dark - True for dark theme
   */
  setTheme(dark) {
    this.set('DARK', dark ? '1' : '0');

    // Update DOM
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark-theme', dark);
    }
  }

  /**
   * Get theme preference
   * @returns {boolean} True if dark theme
   */
  isDarkTheme() {
    return this.get('DARK') === '1';
  }

  /**
   * Initialize theme from storage
   */
  initTheme() {
    const isDark = this.isDarkTheme();
    if (typeof document !== 'undefined' && isDark) {
      document.documentElement.classList.add('dark-theme');
    }
  }

  /**
   * Remember open state for details/disclosure elements
   * @param {string} elementId - Element identifier
   * @param {boolean} open - Whether element is open
   */
  setOpenState(elementId, open) {
    this.set(`OPEN_${elementId}`, open ? '1' : '0');
  }

  /**
   * Get remembered open state
   * @param {string} elementId - Element identifier
   * @returns {boolean} True if element should be open
   */
  getOpenState(elementId) {
    return this.get(`OPEN_${elementId}`) === '1';
  }

  /**
   * Save swap data for tool switching
   * @param {Object} data - Data to save for swap
   */
  saveSwapData(data) {
    this.set('SWAP', data);
  }

  /**
   * Get swap data
   * @returns {Object|null} Swap data or null
   */
  getSwapData() {
    return this.get('SWAP');
  }

  /**
   * Clear swap data
   */
  clearSwapData() {
    this.remove('SWAP');
  }
}

// Create singleton instance
export const storage = new AppStorage();

// Export default
export default storage;

// Expose to window for legacy compatibility
if (typeof window !== 'undefined') {
  window.storage = storage;
}
