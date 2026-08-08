# Deployment Guide

This guide explains how to deploy the Online Tools project to GitHub Pages using the automated CI/CD pipeline.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **GitHub Pages enabled**: Enable GitHub Pages in repository settings
3. **Node.js 20+**: Required for local builds and testing

## Automated Deployment (GitHub Actions)

The project uses GitHub Actions for automated testing and deployment to GitHub Pages.

### Workflow Overview

The workflow (`.github/workflows/deploy.yml`) consists of three jobs:

1. **Test**: Runs unit tests on every push and pull request
2. **Build**: Builds the project with Vite (only on push to master/main)
3. **Deploy**: Deploys to GitHub Pages (only on push to master/main)

### Setup GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Build and deployment**:
   - Source: **GitHub Actions** (not "Deploy from a branch")
4. Save the settings

### Triggering Deployment

Deployment is triggered automatically when you push to the `master` or `main` branch:

```bash
git add .
git commit -m "feat: your changes"
git push origin master
```

### Monitoring Deployment

1. Go to the **Actions** tab in your GitHub repository
2. Click on the latest workflow run
3. Monitor the progress of Test → Build → Deploy jobs
4. Once complete, your site will be available at:
   ```
   https://lowcode-apps.github.io/online-tools/
   ```

## Manual Deployment

If you need to deploy manually:

### 1. Build the Project

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build
```

This creates a `dist/` directory with optimized production files.

### 2. Test the Build Locally

```bash
# Preview the production build
npm run preview
```

Visit http://localhost:4173 to test the built version.

### 3. Deploy to GitHub Pages

You can use `gh-pages` branch deployment:

```bash
# Install gh-pages tool
npm install -g gh-pages

# Deploy dist folder to gh-pages branch
gh-pages -d dist
```

Or use the GitHub CLI:

```bash
# Push dist folder to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

## Configuration

### Base Path

The base path is configured in `vite.config.js`:

```javascript
base: process.env.NODE_ENV === 'production' ? '/online-tools/' : '/',
```

If you fork this project or change the repository name, update the base path accordingly:

```javascript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

### Environment Variables

You can use environment variables in GitHub Actions:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets or variables
3. Reference them in the workflow file:

```yaml
env:
  CUSTOM_VAR: ${{ secrets.CUSTOM_VAR }}
```

## Build Optimization

The build process includes:

- **Minification**: JavaScript and CSS minification with Terser
- **Code Splitting**: Vendor chunks for better caching
- **Asset Optimization**: Inline small assets, optimize images
- **Source Maps**: Generated for debugging production issues
- **Tree Shaking**: Remove unused code

Build configuration is in `vite.config.js`.

## Troubleshooting

### Build Fails in CI

1. Check the Actions logs for detailed error messages
2. Run `npm run build` locally to reproduce the issue
3. Ensure all dependencies are in `package.json`
4. Check for hard-coded localhost URLs or absolute paths

### Tests Fail

```bash
# Run tests locally
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Wrong Base Path

If assets don't load or 404 errors occur:

1. Check the `base` setting in `vite.config.js`
2. Ensure it matches your repository name
3. Rebuild and redeploy

### GitHub Pages Not Updating

1. Check the Actions tab for failed deployments
2. Go to **Settings** → **Pages** and verify the source is "GitHub Actions"
3. Check if the deployment completed successfully
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

## Rolling Back

If a deployment introduces issues:

### Option 1: Revert the Commit

```bash
git revert HEAD
git push origin master
```

This triggers a new deployment with the previous code.

### Option 2: Deploy Previous Build

1. Go to **Actions** tab
2. Find a successful previous workflow run
3. Click **Re-run all jobs**

### Option 3: Manual Rollback

```bash
# Checkout previous commit
git checkout <previous-commit-hash>

# Build and deploy manually
npm run build
gh-pages -d dist
```

## Performance Monitoring

After deployment, monitor performance:

1. **Lighthouse**: Run Lighthouse in Chrome DevTools
2. **GitHub Actions Artifacts**: Download build artifacts to inspect bundle size
3. **Network Tab**: Check asset loading times

Target metrics:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90
- Total Initial Load: < 100KB (gzipped)

## Security

- No API keys or secrets are needed for this static site
- All dependencies are specified in `package.json`
- GitHub Actions runs in an isolated environment
- Review `package-lock.json` changes carefully

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain:
   ```
   tools.yourdomain.com
   ```

2. Configure DNS with your domain provider:
   - Add a CNAME record pointing to `lowcode-apps.github.io`

3. In GitHub Settings → Pages:
   - Enter your custom domain
   - Enable "Enforce HTTPS"

4. Update the `base` path in `vite.config.js` if needed:
   ```javascript
   base: '/', // for custom domain, use root path
   ```

## Support

For issues or questions:
- Check existing issues: https://github.com/lowcode-apps/online-tools/issues
- Open a new issue with:
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots or logs
  - Environment details (browser, OS)
