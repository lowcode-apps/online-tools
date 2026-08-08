import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  // Base path for GitHub Pages deployment
  base: process.env.NODE_ENV === 'production' ? '/online-tools/' : '/',

  // Test configuration (Vitest)
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/unit/**/*.test.js'],
    exclude: ['tests/e2e/**/*', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/e2e/',
        '*.config.js',
        '.legacy/'
      ]
    }
  },

  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    sourcemap: true,

    // Rollup options for code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vendor-crypto': ['crypto-js'],
          'vendor-clipboard': ['clipboard']
        },
        // Clean chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },

    // Terser options for minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },

    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets < 4kb
    cssCodeSplit: true,
    cssMinify: true
  },

  // Development server configuration
  server: {
    port: 5173,
    strictPort: false,
    open: false,
    cors: true
  },

  // Preview server (for testing production build locally)
  preview: {
    port: 4173,
    strictPort: false,
    open: false
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
      '@core': '/src/core',
      '@components': '/src/components'
    }
  },

  // Plugin configuration
  plugins: [
    viteStaticCopy({
      targets: [
        // Copy all legacy HTML files
        {
          src: '*.html',
          dest: '.'
        },
        {
          src: '**/index.html',
          dest: '.'
        },
        // Copy legacy JavaScript files
        {
          src: 'js/**/*',
          dest: 'js'
        },
        // Copy CSS files
        {
          src: 'css/**/*',
          dest: 'css'
        },
        // Copy images
        {
          src: 'images/**/*',
          dest: 'images'
        },
        // Copy fonts if they exist
        {
          src: 'fonts/**/*',
          dest: 'fonts'
        }
      ]
    })
  ],

  // Optimization
  optimizeDeps: {
    include: ['crypto-js', 'clipboard'],
    exclude: []
  }
});
