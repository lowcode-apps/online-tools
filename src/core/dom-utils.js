/**
 * Vanilla JavaScript DOM Utilities
 * Lightweight replacements for common jQuery operations
 *
 * @module dom-utils
 */

/**
 * Select a single element (replaces jQuery $())
 * @param {string|Element} selector - CSS selector or DOM element
 * @param {Element|Document} context - Context for selection (default: document)
 * @returns {Element|null} First matching element or null
 */
export const $ = (selector, context = document) => {
  if (typeof selector === 'string') {
    return context.querySelector(selector);
  }
  return selector; // Already a DOM element
};

/**
 * Select multiple elements (replaces jQuery $())
 * @param {string} selector - CSS selector
 * @param {Element|Document} context - Context for selection (default: document)
 * @returns {Array<Element>} Array of matching elements
 */
export const $$ = (selector, context = document) => {
  return Array.from(context.querySelectorAll(selector));
};

/**
 * Add event listener (replaces jQuery .on())
 * @param {Element} element - Target element
 * @param {string} event - Event name
 * @param {Function|string} selectorOrHandler - Selector for delegation or handler function
 * @param {Function} [handler] - Handler function (if using delegation)
 */
export const on = (element, event, selectorOrHandler, handler) => {
  if (typeof selectorOrHandler === 'function') {
    // Direct event binding
    element.addEventListener(event, selectorOrHandler);
  } else {
    // Event delegation
    element.addEventListener(event, (e) => {
      const target = e.target.closest(selectorOrHandler);
      if (target) {
        handler.call(target, e);
      }
    });
  }
};

/**
 * Remove event listener
 * @param {Element} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Handler function
 */
export const off = (element, event, handler) => {
  element.removeEventListener(event, handler);
};

/**
 * Add CSS class (replaces jQuery .addClass())
 * @param {Element} element - Target element
 * @param {string} className - Class name to add
 */
export const addClass = (element, className) => {
  if (element) element.classList.add(className);
};

/**
 * Remove CSS class (replaces jQuery .removeClass())
 * @param {Element} element - Target element
 * @param {string} className - Class name to remove
 */
export const removeClass = (element, className) => {
  if (element) element.classList.remove(className);
};

/**
 * Toggle CSS class (replaces jQuery .toggleClass())
 * @param {Element} element - Target element
 * @param {string} className - Class name to toggle
 * @param {boolean} [force] - Force add (true) or remove (false)
 * @returns {boolean} True if class is now present
 */
export const toggleClass = (element, className, force) => {
  if (!element) return false;
  return element.classList.toggle(className, force);
};

/**
 * Check if element has class (replaces jQuery .hasClass())
 * @param {Element} element - Target element
 * @param {string} className - Class name to check
 * @returns {boolean} True if class is present
 */
export const hasClass = (element, className) => {
  return element ? element.classList.contains(className) : false;
};

/**
 * Get or set input value (replaces jQuery .val())
 * @param {Element} element - Input element
 * @param {string} [value] - Value to set (if provided)
 * @returns {Element|string} Element for chaining or current value
 */
export const val = (element, value) => {
  if (!element) return '';
  if (value !== undefined) {
    element.value = value;
    return element;
  }
  return element.value;
};

/**
 * Get or set attribute (replaces jQuery .attr())
 * @param {Element} element - Target element
 * @param {string} name - Attribute name
 * @param {string} [value] - Value to set (if provided)
 * @returns {Element|string|null} Element for chaining or attribute value
 */
export const attr = (element, name, value) => {
  if (!element) return null;
  if (value !== undefined) {
    element.setAttribute(name, value);
    return element;
  }
  return element.getAttribute(name);
};

/**
 * Remove attribute (replaces jQuery .removeAttr())
 * @param {Element} element - Target element
 * @param {string} name - Attribute name
 */
export const removeAttr = (element, name) => {
  if (element) element.removeAttribute(name);
};

/**
 * Get or set data attribute (replaces jQuery .data())
 * @param {Element} element - Target element
 * @param {string} key - Data attribute key (without 'data-' prefix)
 * @param {*} [value] - Value to set (if provided)
 * @returns {Element|*} Element for chaining or data value
 */
export const data = (element, key, value) => {
  if (!element) return undefined;
  if (value !== undefined) {
    element.dataset[key] = value;
    return element;
  }
  return element.dataset[key];
};

/**
 * Get or set property (replaces jQuery .prop())
 * @param {Element} element - Target element
 * @param {string} name - Property name
 * @param {*} [value] - Value to set (if provided)
 * @returns {Element|*} Element for chaining or property value
 */
export const prop = (element, name, value) => {
  if (!element) return undefined;
  if (value !== undefined) {
    element[name] = value;
    return element;
  }
  return element[name];
};

/**
 * Find closest ancestor matching selector (replaces jQuery .closest())
 * @param {Element} element - Starting element
 * @param {string} selector - CSS selector
 * @returns {Element|null} Closest matching ancestor or null
 */
export const closest = (element, selector) => {
  return element ? element.closest(selector) : null;
};

/**
 * Find descendant element (replaces jQuery .find())
 * @param {Element} element - Parent element
 * @param {string} selector - CSS selector
 * @returns {Element|null} First matching descendant or null
 */
export const find = (element, selector) => {
  return element ? element.querySelector(selector) : null;
};

/**
 * Find all descendant elements (replaces jQuery .find())
 * @param {Element} element - Parent element
 * @param {string} selector - CSS selector
 * @returns {Array<Element>} Array of matching descendants
 */
export const findAll = (element, selector) => {
  return element ? Array.from(element.querySelectorAll(selector)) : [];
};

/**
 * Toggle element visibility (replaces jQuery .toggle())
 * @param {Element} element - Target element
 * @param {boolean} [force] - Force show (true) or hide (false)
 */
export const toggle = (element, force) => {
  if (!element) return;
  if (force === undefined) {
    element.style.display = element.style.display === 'none' ? '' : 'none';
  } else {
    element.style.display = force ? '' : 'none';
  }
};

/**
 * Show element (replaces jQuery .show())
 * @param {Element} element - Target element
 */
export const show = (element) => {
  if (element) element.style.display = '';
};

/**
 * Hide element (replaces jQuery .hide())
 * @param {Element} element - Target element
 */
export const hide = (element) => {
  if (element) element.style.display = 'none';
};

/**
 * Get or set text content (replaces jQuery .text())
 * @param {Element} element - Target element
 * @param {string} [value] - Text to set (if provided)
 * @returns {Element|string} Element for chaining or current text
 */
export const text = (element, value) => {
  if (!element) return '';
  if (value !== undefined) {
    element.textContent = value;
    return element;
  }
  return element.textContent;
};

/**
 * Get or set HTML content (replaces jQuery .html())
 * @param {Element} element - Target element
 * @param {string} [value] - HTML to set (if provided)
 * @returns {Element|string} Element for chaining or current HTML
 */
export const html = (element, value) => {
  if (!element) return '';
  if (value !== undefined) {
    element.innerHTML = value;
    return element;
  }
  return element.innerHTML;
};

/**
 * Trigger custom event (replaces jQuery .trigger())
 * @param {Element} element - Target element
 * @param {string} eventName - Event name
 * @param {*} [detail] - Event detail data
 */
export const trigger = (element, eventName, detail) => {
  if (!element) return;
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
};

/**
 * Execute callback when DOM is ready (replaces jQuery $(document).ready())
 * @param {Function} callback - Function to execute
 */
export const ready = (callback) => {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};

/**
 * Get parent element
 * @param {Element} element - Target element
 * @returns {Element|null} Parent element
 */
export const parent = (element) => {
  return element ? element.parentElement : null;
};

/**
 * Get children elements
 * @param {Element} element - Target element
 * @returns {Array<Element>} Array of child elements
 */
export const children = (element) => {
  return element ? Array.from(element.children) : [];
};

/**
 * Get next sibling element
 * @param {Element} element - Target element
 * @returns {Element|null} Next sibling element
 */
export const next = (element) => {
  return element ? element.nextElementSibling : null;
};

/**
 * Get previous sibling element
 * @param {Element} element - Target element
 * @returns {Element|null} Previous sibling element
 */
export const prev = (element) => {
  return element ? element.previousElementSibling : null;
};

/**
 * Append element(s) to parent
 * @param {Element} parent - Parent element
 * @param {Element|Array<Element>} children - Child element(s) to append
 */
export const append = (parent, children) => {
  if (!parent) return;
  if (Array.isArray(children)) {
    children.forEach(child => parent.appendChild(child));
  } else {
    parent.appendChild(children);
  }
};

/**
 * Prepend element(s) to parent
 * @param {Element} parent - Parent element
 * @param {Element|Array<Element>} children - Child element(s) to prepend
 */
export const prepend = (parent, children) => {
  if (!parent) return;
  const firstChild = parent.firstChild;
  if (Array.isArray(children)) {
    children.forEach(child => parent.insertBefore(child, firstChild));
  } else {
    parent.insertBefore(children, firstChild);
  }
};

/**
 * Remove element from DOM
 * @param {Element} element - Element to remove
 */
export const remove = (element) => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

/**
 * Check if element is visible
 * @param {Element} element - Target element
 * @returns {boolean} True if element is visible
 */
export const isVisible = (element) => {
  if (!element) return false;
  return element.offsetWidth > 0 || element.offsetHeight > 0;
};

/**
 * Get element dimensions
 * @param {Element} element - Target element
 * @returns {{width: number, height: number}} Element dimensions
 */
export const dimensions = (element) => {
  if (!element) return { width: 0, height: 0 };
  return {
    width: element.offsetWidth,
    height: element.offsetHeight
  };
};

/**
 * Scroll element into view
 * @param {Element} element - Target element
 * @param {Object} [options] - Scroll options
 */
export const scrollIntoView = (element, options = { behavior: 'smooth', block: 'nearest' }) => {
  if (element) element.scrollIntoView(options);
};

/**
 * Iterate over elements (replaces jQuery .each())
 * @param {Array<Element>|NodeList} elements - Elements to iterate
 * @param {Function} callback - Callback function (element, index)
 */
export const each = (elements, callback) => {
  Array.from(elements).forEach(callback);
};

// Export all utilities as default object for convenience
export default {
  $,
  $$,
  on,
  off,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  val,
  attr,
  removeAttr,
  data,
  prop,
  closest,
  find,
  findAll,
  toggle,
  show,
  hide,
  text,
  html,
  trigger,
  ready,
  parent,
  children,
  next,
  prev,
  append,
  prepend,
  remove,
  isVisible,
  dimensions,
  scrollIntoView,
  each
};
