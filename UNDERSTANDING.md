# Online Tools - Repository Understanding Document

> **Last Updated**: 2026-08-07
> **Repository**: online-tools (lowcode-apps fork of lowcode-apps/online-tools)

## Table of Contents
1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Technology Stack](#technology-stack)
4. [Features & Functionality](#features--functionality)
5. [Architecture & Design Patterns](#architecture--design-patterns)
6. [Deployment & Build](#deployment--build)
7. [Development Workflow](#development-workflow)
8. [Security Considerations](#security-considerations)
9. [Key Files Reference](#key-files-reference)

---

## Project Overview

### What is this?
A **static web application** providing 105+ free browser-based tools for cryptography, encoding, compression, and data formatting. All processing happens client-side in the browser with zero backend dependencies.

### Original Source
- **Upstream**: https://github.com/lowcode-apps/online-tools
- **Fork**: https://github.com/lowcode-apps/online-tools.git
- **Live Site**: https://lowcode-apps.github.io/online-tools/

### Key Characteristics
- ✅ 100% client-side processing (no data sent to servers)
- ✅ 105+ individual tool pages
- ✅ Pre-built static site (no build system needed)
- ✅ Dark/Light theme support
- ✅ Mobile responsive design
- ✅ SEO optimized with sitemap
- ✅ Monetized with Google AdSense

---

## Repository Structure

```
online-tools/
├── index.html                    # Main landing page with tool directory
├── 105+ tool .html files         # Individual tool pages (md5.html, base64_encode.html, etc.)
├── 404.html                      # Error page
├── sitemap.xml                   # SEO sitemap
├── robots.txt                    # Crawler rules
├── SECURITY.md                   # Security policy
│
├── css/                          # Stylesheets (5 files)
│   ├── style.css                 # Main styling
│   ├── json-formatter.css        # JSON tool specific
│   ├── qrcode.css                # QR code styling
│   ├── compression.css           # Compression tools
│   └── scanner.css               # Scanner functionality
│
├── js/                           # JavaScript files (154+ files)
│   ├── main.js                   # Core application logic
│   ├── lib/                      # Minified third-party libraries
│   │   ├── jquery-1.10.1.min.js
│   │   ├── bootstrap.min.js
│   │   └── [crypto libraries]
│   └── [tool-specific files]     # Individual tool implementations
│
├── images/                       # Assets (17 SVG files)
│   ├── logo.svg
│   └── [various icons]
│
└── [tool subdirectories]/        # Organized tool variants
    ├── aes/                      # AES encrypt/decrypt variants
    ├── des/                      # DES encryption
    ├── rsa/                      # RSA operations
    ├── json/                     # JSON tools
    │   ├── formatter/
    │   ├── validator/
    │   ├── minify/
    │   └── compare/
    └── [others]/
```

### Repository Statistics
- **Total Files**: 577
- **Repository Size**: 41MB
- **Root HTML Pages**: 105+
- **JavaScript Files**: 154+
- **CSS Files**: 5
- **Image Assets**: 17 SVGs

---

## Technology Stack

### Frontend Framework
| Technology | Version | Purpose |
|-----------|---------|---------|
| HTML5 | - | Structure |
| CSS3 | - | Styling (Grid/Flexbox) |
| JavaScript | ES5+ | Core logic |
| jQuery | 1.10.1 | DOM manipulation |
| Bootstrap | 3.x | UI components (minified) |

### Cryptographic Libraries
All libraries are compiled to **minified UMD modules**:

**Hash Algorithms**:
- MD5, SHA1, SHA2 (224/256/384/512), SHA3
- BLAKE2b, BLAKE2s, BLAKE3
- Keccak, RIPEMD-160, Whirlpool
- XXHash, SM3

**Key Derivation Functions**:
- PBKDF2, HKDF, EvpKDF
- Bcrypt, Scrypt, Argon2

**Symmetric Encryption**:
- AES (ECB/CBC/CFB/OFB/CTR/GCM modes)
- DES, Triple DES
- RC4, ChaCha20, ChaCha20-Poly1305
- SPECK, XXTEA

**Asymmetric Cryptography**:
- RSA (key generation, sign, verify, encrypt, decrypt)
- ECDSA (sign, verify)

**Encoding & Compression**:
- Base16/32/58/64, Hex, HTML, URL, CBOR
- GZIP, Deflate, Brotli, Zstandard
- XZ, LZIP, LZMA, ZIP, TAR

**Data Format Tools**:
- JSON (validate, format, minify, compare, view)
- XML (validate, format, minify)

**Utilities**:
- JWT decoder
- QR code generator/scanner
- UUID generators (v1-v7)
- Password generator
- Text comparison
- Syntax highlighting

### Third-Party Services
- **None** - Privacy-focused, no tracking or ads

---

## Features & Functionality

### Tool Categories

#### 1. Hash Functions (50+ variants)
- Text-based: MD5, SHA families, BLAKE variants
- File-based: Upload and hash files
- HMAC variants: HMAC-MD5, HMAC-SHA, etc.

#### 2. Cryptography
- **Encryption/Decryption**: AES, DES, RSA, ChaCha20
- **Key Generation**: RSA key pairs, ECDSA keys
- **Digital Signatures**: RSA signing/verification
- **Key Derivation**: PBKDF2, Scrypt, Argon2

#### 3. Compression
- **Compress**: GZIP, Brotli, Zstandard, XZ
- **Decompress**: Reverse operations
- **Archive**: ZIP, TAR creation and extraction

#### 4. Encoding
- **Base Encoding**: Base16/32/58/64
- **Character Encoding**: UTF-8, UTF-16, ASCII, Hex
- **URL Encoding**: Encode/decode URLs
- **HTML Entities**: Encode/decode

#### 5. Format Tools
- **JSON**: Validate, format, minify, compare, tree view
- **XML**: Validate, format, minify

#### 6. Converters
- **Case Conversion**: 7 variants (uppercase, lowercase, camel, snake, kebab, pascal, title)
- **Time Conversion**: Epoch to human-readable

#### 7. Generators
- **UUID**: v1, v3, v4, v5, v6, v7
- **Password**: Customizable password generation
- **QR Code**: Generate QR codes from text

#### 8. Other Tools
- **Text Comparison**: Side-by-side diff
- **Syntax Highlighting**: Code beautification
- **QR Scanner**: Scan QR codes from images

### UX Features

#### Input/Output
- **Multiple Input Methods**:
  - Text input areas
  - File upload (batch processing supported)
  - Encoding selection (UTF-8, UTF-16, Hex, Base64, Latin1, etc.)

- **Output Options**:
  - Display in output area
  - Download as file
  - Copy to clipboard
  - URL sharing via query parameters

#### User Experience
- **Auto-update**: Real-time processing as you type
- **Remember Input**: localStorage persistence
- **Dark Mode**: Theme toggle with localStorage
- **Fullscreen Mode**: Distraction-free tool usage
- **Responsive Design**: Mobile-friendly sidebar navigation
- **Collapsible Sections**: Organized tool categories
- **Version Management**: Cache busting with version query params

---

## Architecture & Design Patterns

### Single-Page Tool Pattern
Each tool follows a consistent structure:

```
[tool-name].html
├── HTML Structure
│   ├── Sidebar navigation (shared)
│   ├── Tool-specific input area
│   ├── Tool-specific output area
│   └── Footer (shared)
│
├── CSS (shared + tool-specific)
│   ├── style.css?v=49 (global)
│   └── [tool-specific].css (if needed)
│
└── JavaScript (shared + tool-specific)
    ├── jquery-1.10.1.min.js (shared)
    ├── main.js?v=50 (shared core)
    ├── [crypto-lib].min.js (as needed)
    └── inline script (tool implementation)
```

### Core Application Object: `ot` (Online Tools)

The `main.js` file defines a global `ot` object that provides:

```javascript
ot = {
  // State management
  autoUpdate: true,
  rememberInput: false,
  darkMode: false,

  // Core functions (inferred)
  process(),      // Process input
  updateOutput(), // Update output area
  copyToClipboard(),
  downloadFile(),
  loadFromFile(),
  shareURL(),

  // Theme management
  toggleTheme(),
  setDarkMode(),

  // Analytics
  trackEvent()
}
```

### Data Flow Pattern

```
User Input
    ↓
Input Area (textarea/file)
    ↓
Encoding Selection (UTF-8/Hex/Base64/etc.)
    ↓
Tool-Specific Processing (crypto/encoding/compression)
    ↓
Output Formatting
    ↓
Output Area (display/download/copy)
```

### State Management
- **localStorage**: Theme preference, remember input, auto-update setting
- **URL Query Parameters**: Tool state sharing
- **Session State**: In-memory processing state

### Event Handling
- **Auto-update**: Input events trigger processing
- **Manual Update**: Button click for heavy operations
- **File Upload**: FileReader API for client-side processing
- **Copy/Download**: Blob API and Clipboard API

---

## Deployment & Build

### Build System: **None**
This is a **pre-built static website** repository:
- All JavaScript is already minified/bundled
- No webpack, rollup, or similar build tools
- No `package.json` or npm scripts
- No source files (only distribution files)

### Version Management
Cache busting via query parameters:
- `style.css?v=49` - CSS version 49
- `main.js?v=50` - JavaScript version 50

### Deployment
- **Platform**: GitHub Pages
- **URL**: https://lowcode-apps.github.io/online-tools/
- **Process**: Direct git push (no build step)
- **Frequency**: Daily updates ("Site updated" commits)

### Git Configuration
```
[remote "origin"]
    url = https://github.com/lowcode-apps/online-tools.git
    fetch = +refs/heads/*:refs/remotes/origin/*

[remote "upstream"]
    url = https://github.com/lowcode-apps/online-tools.git
    fetch = +refs/heads/*:refs/remotes/upstream/*
```

### Recent Commits Pattern
```
c936cfda Site updated: 2026-08-07 09:03:23
ad03cfe1 Site updated: 2026-08-06 10:32:02
5c984023 Site updated: 2026-08-06 09:16:53
9e3e2216 Site updated: 2026-08-05 15:06:05
945d654b Site updated: 2026-08-04 18:24:38
```
Daily automated updates suggest a CI/CD process or scheduled maintenance.

---

## Development Workflow

### Making Changes

Since this is a **distribution repository** (not a source repository):

1. **For Content Changes**:
   - Edit HTML files directly
   - Update version numbers in query strings
   - Commit and push

2. **For Style Changes**:
   - Edit CSS files in `/css/`
   - Increment `?v=XX` version number
   - Test locally by opening HTML files in browser

3. **For Functionality Changes**:
   - Edit JavaScript files in `/js/`
   - Increment `?v=XX` version number
   - Test thoroughly (no build step to catch errors)

4. **Adding New Tools**:
   - Copy existing tool HTML as template
   - Update tool-specific sections
   - Add to navigation in all files
   - Update `sitemap.xml`
   - Update `index.html` tool directory

### Testing
- **Local Testing**: Open HTML files directly in browser
- **No Unit Tests**: All testing is manual/browser-based
- **Browser Compatibility**: Test across browsers
- **Mobile Testing**: Test responsive design

### Syncing with Upstream
```bash
git fetch upstream
git merge upstream/master
# Resolve conflicts
git push origin master
```

---

## Security Considerations

### Security Policy (SECURITY.md)

**In Scope**:
- XSS vulnerabilities
- Unsafe file handling
- Dependency vulnerabilities
- Client-side injection attacks

**Out of Scope**:
- Official forks/mirrors
- Compromised devices/browsers
- DOS without significant impact

### Security Strengths
✅ **Client-side only**: No data sent to servers
✅ **No backend**: No database or API vulnerabilities
✅ **Sandboxed**: Browser security model applies
✅ **HTTPS**: Served over secure connection (GitHub Pages)

### Security Concerns
⚠️ **Old jQuery**: Version 1.10.1 (2013) has known vulnerabilities
⚠️ **No CSP**: No Content Security Policy headers
⚠️ **No Subresource Integrity**: Third-party scripts not integrity-checked
⚠️ **Minified Code**: Harder to audit third-party libraries
⚠️ **Google Services**: AdSense and Analytics introduce tracking

### Vulnerability Reporting
Report via GitHub's private vulnerability reporting feature.

---

## Key Files Reference

### Critical Files

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `index.html` | Landing page with tool directory | As tools added |
| `css/style.css` | Global styles | Version 49 |
| `js/main.js` | Core application logic | Version 50 |
| `sitemap.xml` | SEO sitemap | As tools added |
| `robots.txt` | Crawler rules | Rarely |
| `404.html` | Error page | Rarely |

### Tool HTML Files (105+)
Examples:
- `md5.html`, `sha1.html`, `sha256.html` - Hash tools
- `base64_encode.html`, `base64_decode.html` - Encoding
- `aes_encrypt.html`, `aes_decrypt.html` - Encryption
- `json_formatter.html`, `json_validator.html` - JSON tools
- `uuid_v4.html`, `uuid_v7.html` - UUID generators

### JavaScript Libraries (154+ files)
Located in `/js/`:
- `jquery-1.10.1.min.js` - Core DOM library
- `bootstrap.min.js` - UI framework
- `[algorithm].min.js` - Individual crypto libraries
- Tool-specific implementation files

### Configuration
- `.git/config` - Git remotes (origin + upstream)
- Version query params in HTML files

---

## Common Tasks

### Finding a Tool's Implementation
1. Open the tool's HTML file (e.g., `md5.html`)
2. Look for `<script>` tags in the `<head>` section
3. Check loaded libraries and inline implementation
4. Core logic usually in inline `<script>` at bottom

### Adding a New Tool
1. Copy similar tool HTML as template
2. Update title, heading, and tool-specific sections
3. Load required crypto/encoding libraries
4. Implement tool logic in inline script
5. Update navigation in all HTML files
6. Add to `index.html` directory
7. Update `sitemap.xml`
8. Test thoroughly
9. Commit with descriptive message

### Updating Styles
1. Edit `/css/style.css` or tool-specific CSS
2. Increment version: `style.css?v=49` → `style.css?v=50`
3. Update version in all HTML files that reference it
4. Test in multiple browsers
5. Commit and push

### Debugging Issues
1. Open browser DevTools (F12)
2. Check Console for JavaScript errors
3. Check Network tab for failed resource loads
4. Verify file paths are correct (case-sensitive)
5. Test without browser extensions (in incognito)
6. Check localStorage for persisted state issues

---

## Licensing & Attribution

**Author**: Chen, Yi-Cyuan (lowcode-apps@github.com)

**License**: Proprietary with exceptions
- Generated/static files: Not licensed for reuse
- Third-party libraries: Retain original licenses (MIT/Apache/etc.)
- Refer to individual library documentation for terms

---

## Additional Resources

### External Links
- **Upstream Repository**: https://github.com/lowcode-apps/online-tools
- **Live Site**: https://lowcode-apps.github.io/online-tools/
- **Fork**: https://github.com/lowcode-apps/online-tools

### Internal Documentation
- `SECURITY.md` - Security policy and vulnerability reporting
- `sitemap.xml` - Complete tool listing for SEO
- `index.html` - User-facing tool directory

---

## Maintenance Notes

### Regular Maintenance Tasks
- [ ] Update version numbers on changes (`?v=XX`)
- [ ] Test new tools across browsers
- [ ] Keep `sitemap.xml` up to date
- [ ] Sync with upstream periodically
- [ ] Monitor Google Analytics for usage patterns
- [ ] Review and update dependencies (consider jQuery upgrade)

### Known Technical Debt
- jQuery 1.10.1 is outdated (2013) - consider upgrade to jQuery 3.x
- Bootstrap version unclear - likely outdated
- No automated testing
- No CI/CD pipeline (manual deployments)
- No dependency management (npm/yarn)
- Consider implementing CSP headers
- Consider adding Subresource Integrity for third-party scripts

---

**Document Maintained By**: Development Team
**Last Review**: 2026-08-07
**Next Review**: As needed when major changes occur
