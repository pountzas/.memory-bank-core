#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ReactBuildAutomator {
  constructor() {
    this.config = require('./config.json');
    this.templatesDir = path.join(__dirname, 'templates');
  }

  async optimizeBuild(options = {}) {
    const {
      level = 'advanced',
      analyze = true,
      deploy = false,
      target = 'production'
    } = options;

    console.log(`🚀 Starting React build optimization (level: ${level})`);

    try {
      // Pre-build checks
      await this.runPreBuildChecks();

      // Apply optimizations based on level
      await this.applyOptimizations(level);

      // Build the application
      await this.buildApplication(target);

      // Analyze results
      if (analyze) {
        await this.analyzeBundle();
        await this.runPerformanceChecks();
      }

      // Generate reports
      await this.generateReports();

      // Deploy if requested
      if (deploy) {
        await this.deployApplication();
      }

      console.log('✅ Build optimization completed successfully!');
    } catch (error) {
      console.error('❌ Build optimization failed:', error.message);
      throw error;
    }
  }

  async runPreBuildChecks() {
    console.log('🔍 Running pre-build checks...');

    const checks = this.config.automation.pre_build_hooks;

    for (const check of checks) {
      try {
        console.log(`Running: ${check}`);
        execSync(check, { stdio: 'inherit', cwd: process.cwd() });
      } catch (error) {
        throw new Error(`Pre-build check failed: ${check}`);
      }
    }
  }

  async applyOptimizations(level) {
    console.log(`⚙️ Applying ${level} optimizations...`);

    const optimizations = this.config.configuration.optimization_levels[level];

    if (optimizations.code_splitting) {
      await this.implementCodeSplitting();
    }

    if (optimizations.lazy_loading) {
      await this.implementLazyLoading();
    }

    if (optimizations.tree_shaking) {
      await this.optimizeTreeShaking();
    }

    if (optimizations.compression) {
      await this.enableCompression();
    }
  }

  async implementCodeSplitting() {
    console.log('📦 Implementing code splitting...');

    // Create dynamic imports for route components
    const routesFile = path.join(process.cwd(), 'src', 'routes.tsx');
    if (fs.existsSync(routesFile)) {
      let routesContent = fs.readFileSync(routesFile, 'utf8');

      // Convert static imports to dynamic imports
      routesContent = routesContent.replace(
        /import\s+(\w+)\s+from\s+['"](.+)['"]/g,
        "const $1 = lazy(() => import('$2'))"
      );

      // Add React.lazy import
      if (!routesContent.includes("import { lazy }")) {
        routesContent = "import { lazy, Suspense } from 'react';\n" + routesContent;
      }

      // Wrap routes with Suspense
      routesContent = routesContent.replace(
        /<Route\s+path="([^"]+)"\s+element=\{([^}]+)\}/g,
        `<Route path="$1" element={<Suspense fallback={<div>Loading...</div>}>$2</Suspense>}`
      );

      fs.writeFileSync(routesFile, routesContent);
    }
  }

  async implementLazyLoading() {
    console.log('🦥 Implementing lazy loading...');

    // Find components that can be lazy loaded
    const componentsDir = path.join(process.cwd(), 'src', 'components');
    if (fs.existsSync(componentsDir)) {
      const componentFiles = fs.readdirSync(componentsDir)
        .filter(file => file.endsWith('.tsx') && !file.includes('index'));

      for (const file of componentFiles) {
        const filePath = path.join(componentsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Add React.memo for performance
        if (!content.includes('React.memo')) {
          content = content.replace(
            /export const (\w+) = /,
            'export const $1 = React.memo('
          );
          content += ');';
        }

        fs.writeFileSync(filePath, content);
      }
    }
  }

  async optimizeTreeShaking() {
    console.log('🌳 Optimizing tree shaking...');

    // Update build configuration for better tree shaking
    const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
    if (fs.existsSync(viteConfigPath)) {
      let config = fs.readFileSync(viteConfigPath, 'utf8');

      // Add tree shaking optimizations
      if (!config.includes('esbuild')) {
        config = config.replace(
          'export default defineConfig({',
          `export default defineConfig({
  esbuild: {
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },`
        );
      }

      fs.writeFileSync(viteConfigPath, config);
    }
  }

  async enableCompression() {
    console.log('🗜️ Enabling compression...');

    // Install and configure compression plugins
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      if (!packageJson.devDependencies['vite-plugin-compression']) {
        console.log('Installing vite-plugin-compression...');
        execSync('npm install --save-dev vite-plugin-compression', { stdio: 'inherit' });
      }
    }

    // Update Vite config
    const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
    if (fs.existsSync(viteConfigPath)) {
      let config = fs.readFileSync(viteConfigPath, 'utf8');

      if (!config.includes('vite-plugin-compression')) {
        config = config.replace(
          "import react from '@vitejs/plugin-react';",
          `import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression';`
        );

        config = config.replace(
          'plugins: [react()]',
          `plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ]`
        );
      }

      fs.writeFileSync(viteConfigPath, config);
    }
  }

  async buildApplication(target) {
    console.log(`🔨 Building application for ${target}...`);

    const buildCommand = target === 'production' ? 'npm run build' : 'npm run build:staging';
    execSync(buildCommand, { stdio: 'inherit', cwd: process.cwd() });
  }

  async analyzeBundle() {
    console.log('📊 Analyzing bundle...');

    // Install bundle analyzer if not present
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      if (!packageJson.devDependencies['rollup-plugin-visualizer']) {
        console.log('Installing rollup-plugin-visualizer...');
        execSync('npm install --save-dev rollup-plugin-visualizer', { stdio: 'inherit' });
      }
    }

    // Run bundle analysis
    execSync('npm run build -- --mode analyze', { stdio: 'inherit', cwd: process.cwd() });
  }

  async runPerformanceChecks() {
    console.log('⚡ Running performance checks...');

    // Run Lighthouse CI if configured
    if (this.config.configuration.monitoring.lighthouse_ci.enabled) {
      try {
        execSync('npm run lighthouse-ci', { stdio: 'inherit', cwd: process.cwd() });
      } catch (error) {
        console.warn('Lighthouse CI check failed, continuing...');
      }
    }
  }

  async generateReports() {
    console.log('📋 Generating reports...');

    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    // Generate bundle size report
    const bundleReport = {
      timestamp: new Date().toISOString(),
      optimizations: this.config.configuration.optimization_levels,
      performance_targets: this.config.configuration.performance_targets,
    };

    fs.writeFileSync(
      path.join(reportsDir, 'build-report.json'),
      JSON.stringify(bundleReport, null, 2)
    );
  }

  async deployApplication() {
    console.log('🚀 Deploying application...');

    // This would integrate with deployment platforms
    // For now, just log the intent
    console.log('Deployment integration would go here...');
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node optimize-build.js [level] [options]');
    console.log('Levels: basic, advanced, enterprise');
    console.log('Options: --analyze, --deploy, --target=production');
    process.exit(1);
  }

  const [level = 'advanced'] = args;
  const options = {};

  // Parse options
  args.slice(1).forEach(arg => {
    if (arg === '--analyze') options.analyze = true;
    if (arg === '--deploy') options.deploy = true;
    if (arg.startsWith('--target=')) options.target = arg.split('=')[1];
  });

  try {
    const automator = new ReactBuildAutomator();
    automator.optimizeBuild({ level, ...options });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = ReactBuildAutomator;
