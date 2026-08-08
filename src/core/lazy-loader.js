/**
 * Lazy Loading System
 * Preserves the original methodLoad architecture while modernizing implementation
 *
 * @module lazy-loader
 */

/**
 * Script loader with status tracking
 * Compatible with original createOnDemandScript API
 */
class ScriptLoader {
  constructor(src, options = {}) {
    this.src = src;
    this.options = options;
    this.status = 0; // 0: not loaded, 1: loading, 2: loaded, 3: error
    this.callbacks = [];
    this.promise = null;
  }

  /**
   * Load script and execute callback
   * @param {Function} [callback] - Callback to execute when loaded
   */
  load(callback) {
    if (callback) {
      this.callbacks.push(callback);
    }

    // Already loaded - execute callback immediately
    if (this.status === 2) {
      this._executeCallbacks();
      return;
    }

    // Already loading - callback will be executed when done
    if (this.status === 1) {
      return;
    }

    // Start loading
    this.status = 1;
    this._loadScript()
      .then(() => {
        this.status = 2;
        this._executeCallbacks();
      })
      .catch((err) => {
        this.status = 3;
        console.error(`Failed to load script: ${this.src}`, err);
      });
  }

  /**
   * Internal method to load script
   * @private
   */
  _loadScript() {
    if (this.promise) return this.promise;

    this.promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = this.src;

      if (this.options.crossOrigin) {
        script.crossOrigin = this.options.crossOrigin;
      }

      if (this.options.integrity) {
        script.integrity = this.options.integrity;
      }

      script.onload = () => {
        if (this.options.onload) {
          this.options.onload();
        }
        resolve();
      };

      script.onerror = (err) => {
        if (this.options.onerror) {
          this.options.onerror(err);
        }
        reject(err);
      };

      document.body.appendChild(script);
    });

    return this.promise;
  }

  /**
   * Execute all queued callbacks
   * @private
   */
  _executeCallbacks() {
    while (this.callbacks.length > 0) {
      const callback = this.callbacks.shift();
      try {
        callback();
      } catch (err) {
        console.error('Error executing callback:', err);
      }
    }
  }
}

/**
 * Lazy Loader Class
 * Main orchestrator for script loading and dependency management
 */
class LazyLoader {
  constructor() {
    this.loaders = new Map(); // src -> ScriptLoader
    this.loadedScripts = new Set();
    this.delayedScripts = [];
    this.waitLoadCount = 0;
  }

  /**
   * Create on-demand script loader (compatible with legacy API)
   * @param {string} src - Script URL
   * @param {Object} [options] - Load options
   * @returns {ScriptLoader} Script loader instance
   */
  createOnDemandScript(src, options = {}) {
    if (this.loaders.has(src)) {
      return this.loaders.get(src);
    }

    const loader = new ScriptLoader(src, options);
    this.loaders.set(src, loader);
    return loader;
  }

  /**
   * Load script with Promise support
   * @param {string} src - Script URL
   * @param {Object} [options] - Load options
   * @returns {Promise<void>} Promise that resolves when script is loaded
   */
  async loadScript(src, options = {}) {
    if (this.loadedScripts.has(src)) {
      return Promise.resolve();
    }

    const loader = this.createOnDemandScript(src, options);

    return new Promise((resolve, reject) => {
      loader.load(() => {
        this.loadedScripts.add(src);
        resolve();
      });
    });
  }

  /**
   * Load multiple scripts in sequence
   * @param {Array<string|Object>} scripts - Array of script URLs or config objects
   * @returns {Promise<void>} Promise that resolves when all scripts are loaded
   */
  async loadScripts(scripts) {
    for (const script of scripts) {
      const src = typeof script === 'string' ? script : script.src;
      const options = typeof script === 'object' ? script : {};
      await this.loadScript(src, options);
    }
  }

  /**
   * Load multiple scripts in parallel
   * @param {Array<string|Object>} scripts - Array of script URLs or config objects
   * @returns {Promise<Array>} Promise that resolves when all scripts are loaded
   */
  async loadScriptsParallel(scripts) {
    const promises = scripts.map(script => {
      const src = typeof script === 'string' ? script : script.src;
      const options = typeof script === 'object' ? script : {};
      return this.loadScript(src, options);
    });

    return Promise.all(promises);
  }

  /**
   * Queue script for delayed loading
   * @param {Object} config - Script configuration
   */
  queueScript(config) {
    this.delayedScripts.push(config);
  }

  /**
   * Execute all queued delayed scripts
   */
  executeDelayedScripts() {
    for (const config of this.delayedScripts) {
      const delay = config.delay || 0;

      setTimeout(() => {
        if (config.src) {
          this.loadScript(config.src, config);
        } else if (config.onload) {
          config.onload();
        }
      }, delay);
    }

    this.delayedScripts = [];
  }

  /**
   * Method load callback (preserves legacy methodLoad architecture)
   * Increments wait counter and dispatches event
   */
  methodLoad() {
    this.waitLoadCount++;
    window.dispatchEvent(new CustomEvent('methodLoad', {
      detail: {
        count: this.waitLoadCount
      }
    }));
  }

  /**
   * Check if script is loaded
   * @param {string} src - Script URL
   * @returns {boolean} True if script is loaded
   */
  isLoaded(src) {
    return this.loadedScripts.has(src);
  }

  /**
   * Get loading status for script
   * @param {string} src - Script URL
   * @returns {number} Status code (0: not loaded, 1: loading, 2: loaded, 3: error)
   */
  getStatus(src) {
    const loader = this.loaders.get(src);
    return loader ? loader.status : 0;
  }

  /**
   * Reset loader state (useful for testing)
   */
  reset() {
    this.loaders.clear();
    this.loadedScripts.clear();
    this.delayedScripts = [];
    this.waitLoadCount = 0;
  }

  /**
   * Preload scripts (fetch without executing)
   * @param {Array<string>} urls - Script URLs to preload
   */
  preload(urls) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  /**
   * Load module (ES6 module support)
   * @param {string} src - Module URL
   * @returns {Promise<*>} Promise that resolves with module exports
   */
  async loadModule(src) {
    if (this.loadedScripts.has(src)) {
      // Can't easily re-import, assume it's available
      return Promise.resolve();
    }

    try {
      const module = await import(src);
      this.loadedScripts.add(src);
      return module;
    } catch (err) {
      console.error(`Failed to load module: ${src}`, err);
      throw err;
    }
  }
}

// Create singleton instance
export const lazyLoader = new LazyLoader();

// Export class for testing/custom instances
export { LazyLoader };

// Export default for convenience
export default lazyLoader;

// Expose to window for legacy compatibility
if (typeof window !== 'undefined') {
  window.lazyLoader = lazyLoader;

  // Legacy compatibility: expose createOnDemandScript on window.ot
  if (!window.ot) {
    window.ot = {};
  }
  window.ot.createOnDemandScript = (src, options) => {
    return lazyLoader.createOnDemandScript(src, options);
  };
}
