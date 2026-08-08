/**
 * CDN Library Loader
 * Loads external libraries from CDN with local fallback support
 *
 * @module cdn-loader
 */

import { lazyLoader } from './lazy-loader.js';

/**
 * CDN library configuration
 */
const CDN_LIBRARIES = {
  'crypto-js': {
    cdn: 'https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js',
    fallback: '/lib/crypto-js.min.js',
    check: () => typeof window.CryptoJS !== 'undefined'
  },
  'clipboard': {
    cdn: 'https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js',
    fallback: '/lib/clipboard.min.js',
    check: () => typeof window.ClipboardJS !== 'undefined'
  },
  'monaco-editor': {
    cdn: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js',
    fallback: '/lib/monaco/loader.js',
    check: () => typeof window.require !== 'undefined' && window.require.monaco
  }
};

/**
 * CDN Loader class
 * Manages loading libraries from CDN with automatic fallback
 */
class CDNLoader {
  constructor() {
    this.loaded = new Set();
    this.loading = new Map();
  }

  /**
   * Load library from CDN with fallback
   * @param {string} libraryName - Library identifier (e.g., 'crypto-js')
   * @param {Object} [options] - Load options
   * @returns {Promise<void>} Promise that resolves when library is loaded
   */
  async load(libraryName, options = {}) {
    const config = CDN_LIBRARIES[libraryName];

    if (!config) {
      throw new Error(`Unknown library: ${libraryName}`);
    }

    // Already loaded
    if (this.loaded.has(libraryName)) {
      return Promise.resolve();
    }

    // Already loading
    if (this.loading.has(libraryName)) {
      return this.loading.get(libraryName);
    }

    // Start loading
    const loadPromise = this._loadWithFallback(libraryName, config, options);
    this.loading.set(libraryName, loadPromise);

    try {
      await loadPromise;
      this.loaded.add(libraryName);
      this.loading.delete(libraryName);
    } catch (err) {
      this.loading.delete(libraryName);
      throw err;
    }
  }

  /**
   * Load library with automatic fallback
   * @private
   */
  async _loadWithFallback(libraryName, config, options) {
    // Check if already loaded globally
    if (config.check && config.check()) {
      console.log(`${libraryName} already loaded globally`);
      return Promise.resolve();
    }

    try {
      // Try CDN first
      console.log(`Loading ${libraryName} from CDN...`);
      await lazyLoader.loadScript(config.cdn, {
        crossOrigin: 'anonymous',
        ...options
      });

      // Verify it loaded correctly
      if (config.check && !config.check()) {
        throw new Error('Library did not load correctly from CDN');
      }

      console.log(`✓ ${libraryName} loaded from CDN`);
    } catch (err) {
      console.warn(`CDN failed for ${libraryName}, trying fallback...`, err);

      try {
        // Try local fallback
        await lazyLoader.loadScript(config.fallback, options);

        // Verify it loaded correctly
        if (config.check && !config.check()) {
          throw new Error('Library did not load correctly from fallback');
        }

        console.log(`✓ ${libraryName} loaded from local fallback`);
      } catch (fallbackErr) {
        console.error(`Failed to load ${libraryName} from both CDN and fallback`, fallbackErr);
        throw new Error(`Failed to load ${libraryName}: ${fallbackErr.message}`);
      }
    }
  }

  /**
   * Load multiple libraries in parallel
   * @param {Array<string>} libraries - Array of library names
   * @param {Object} [options] - Load options
   * @returns {Promise<Array>} Promise that resolves when all libraries are loaded
   */
  async loadMultiple(libraries, options = {}) {
    const promises = libraries.map(lib => this.load(lib, options));
    return Promise.all(promises);
  }

  /**
   * Check if library is loaded
   * @param {string} libraryName - Library identifier
   * @returns {boolean} True if library is loaded
   */
  isLoaded(libraryName) {
    return this.loaded.has(libraryName);
  }

  /**
   * Register custom library configuration
   * @param {string} name - Library name
   * @param {Object} config - Library configuration
   * @param {string} config.cdn - CDN URL
   * @param {string} config.fallback - Fallback URL
   * @param {Function} [config.check] - Function to verify library loaded
   */
  register(name, config) {
    CDN_LIBRARIES[name] = config;
  }

  /**
   * Get list of registered libraries
   * @returns {Array<string>} Array of library names
   */
  getLibraries() {
    return Object.keys(CDN_LIBRARIES);
  }

  /**
   * Reset loader state (useful for testing)
   */
  reset() {
    this.loaded.clear();
    this.loading.clear();
  }
}

// Create singleton instance
export const cdnLoader = new CDNLoader();

// Export class for custom instances
export { CDNLoader };

// Export default
export default cdnLoader;

// Expose to window for legacy compatibility
if (typeof window !== 'undefined') {
  window.cdnLoader = cdnLoader;
}

/**
 * Convenience functions for common libraries
 */

/**
 * Load CryptoJS from CDN
 * @returns {Promise<void>}
 */
export const loadCryptoJS = () => cdnLoader.load('crypto-js');

/**
 * Load ClipboardJS from CDN
 * @returns {Promise<void>}
 */
export const loadClipboard = () => cdnLoader.load('clipboard');

/**
 * Load Monaco Editor from CDN
 * @returns {Promise<void>}
 */
export const loadMonaco = () => cdnLoader.load('monaco-editor');
