/**
 * Unit tests for DOM utilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { $, $$, addClass, removeClass, toggleClass, hasClass, val, text, html, attr, data, prop, show, hide, toggle } from '../../src/core/dom-utils.js';

describe('DOM Utils', () => {
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  describe('$ (selector)', () => {
    it('should select element by id', () => {
      document.body.innerHTML = '<div id="test">Hello</div>';
      const element = $('#test');
      expect(element).toBeTruthy();
      expect(element.textContent).toBe('Hello');
    });

    it('should return null if element not found', () => {
      const element = $('#nonexistent');
      expect(element).toBeNull();
    });

    it('should return element if already a DOM element', () => {
      const div = document.createElement('div');
      const result = $(div);
      expect(result).toBe(div);
    });
  });

  describe('$$ (selector all)', () => {
    it('should select all matching elements', () => {
      document.body.innerHTML = '<div class="item">1</div><div class="item">2</div><div class="item">3</div>';
      const elements = $$('.item');
      expect(elements).toHaveLength(3);
      expect(Array.isArray(elements)).toBe(true);
    });

    it('should return empty array if no matches', () => {
      const elements = $$('.nonexistent');
      expect(elements).toHaveLength(0);
      expect(Array.isArray(elements)).toBe(true);
    });
  });

  describe('addClass / removeClass / toggleClass', () => {
    it('should add class to element', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = $('#test');
      addClass(element, 'active');
      expect(element.classList.contains('active')).toBe(true);
    });

    it('should remove class from element', () => {
      document.body.innerHTML = '<div id="test" class="active old"></div>';
      const element = $('#test');
      removeClass(element, 'active');
      expect(element.classList.contains('active')).toBe(false);
      expect(element.classList.contains('old')).toBe(true);
    });

    it('should toggle class on element', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = $('#test');

      toggleClass(element, 'active');
      expect(element.classList.contains('active')).toBe(true);

      toggleClass(element, 'active');
      expect(element.classList.contains('active')).toBe(false);
    });

    it('should force toggle class with boolean', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = $('#test');

      toggleClass(element, 'active', true);
      expect(element.classList.contains('active')).toBe(true);

      toggleClass(element, 'active', true);
      expect(element.classList.contains('active')).toBe(true);

      toggleClass(element, 'active', false);
      expect(element.classList.contains('active')).toBe(false);
    });
  });

  describe('hasClass', () => {
    it('should check if element has class', () => {
      document.body.innerHTML = '<div id="test" class="active"></div>';
      const element = $('#test');
      expect(hasClass(element, 'active')).toBe(true);
      expect(hasClass(element, 'inactive')).toBe(false);
    });
  });

  describe('val (value)', () => {
    it('should get input value', () => {
      document.body.innerHTML = '<input id="test" value="hello">';
      const element = $('#test');
      expect(val(element)).toBe('hello');
    });

    it('should set input value', () => {
      document.body.innerHTML = '<input id="test">';
      const element = $('#test');
      val(element, 'world');
      expect(element.value).toBe('world');
    });

    it('should return empty string for null element', () => {
      expect(val(null)).toBe('');
    });
  });

  describe('text (textContent)', () => {
    it('should get text content', () => {
      document.body.innerHTML = '<div id="test">Hello World</div>';
      const element = $('#test');
      expect(text(element)).toBe('Hello World');
    });

    it('should set text content', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = $('#test');
      text(element, 'New Text');
      expect(element.textContent).toBe('New Text');
    });
  });

  describe('html (innerHTML)', () => {
    it('should get HTML content', () => {
      document.body.innerHTML = '<div id="test"><span>Hello</span></div>';
      const element = $('#test');
      expect(html(element)).toBe('<span>Hello</span>');
    });

    it('should set HTML content', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = $('#test');
      html(element, '<strong>Bold</strong>');
      expect(element.innerHTML).toBe('<strong>Bold</strong>');
    });
  });

  describe('attr (attributes)', () => {
    it('should get attribute value', () => {
      document.body.innerHTML = '<div id="test" data-foo="bar"></div>';
      const element = $('#test');
      expect(attr(element, 'data-foo')).toBe('bar');
    });

    it('should set attribute value', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = $('#test');
      attr(element, 'data-foo', 'baz');
      expect(element.getAttribute('data-foo')).toBe('baz');
    });

    it('should return null for non-existent attribute', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = $('#test');
      expect(attr(element, 'data-nonexistent')).toBeNull();
    });
  });

  describe('data (dataset)', () => {
    it('should get data attribute', () => {
      document.body.innerHTML = '<div id="test" data-user-id="123"></div>';
      const element = $('#test');
      expect(data(element, 'userId')).toBe('123');
    });

    it('should set data attribute', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = $('#test');
      data(element, 'userId', '456');
      expect(element.dataset.userId).toBe('456');
    });
  });

  describe('prop (properties)', () => {
    it('should get property value', () => {
      document.body.innerHTML = '<input id="test" type="checkbox" checked>';
      const element = $('#test');
      expect(prop(element, 'checked')).toBe(true);
    });

    it('should set property value', () => {
      document.body.innerHTML = '<input id="test" type="checkbox">';
      const element = $('#test');
      prop(element, 'checked', true);
      expect(element.checked).toBe(true);
    });
  });

  describe('show / hide / toggle', () => {
    it('should show element', () => {
      document.body.innerHTML = '<div id="test" style="display: none;"></div>';
      const element = $('#test');
      show(element);
      expect(element.style.display).toBe('');
    });

    it('should hide element', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = $('#test');
      hide(element);
      expect(element.style.display).toBe('none');
    });

    it('should toggle element visibility', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = $('#test');

      toggle(element);
      expect(element.style.display).toBe('none');

      toggle(element);
      expect(element.style.display).toBe('');
    });

    it('should toggle with force parameter', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = $('#test');

      toggle(element, false);
      expect(element.style.display).toBe('none');

      toggle(element, true);
      expect(element.style.display).toBe('');
    });
  });
});
