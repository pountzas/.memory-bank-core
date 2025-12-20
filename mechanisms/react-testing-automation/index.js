#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ReactTestingAutomator {
  constructor() {
    this.config = require('./config.json');
    this.templatesDir = path.join(__dirname, 'templates');
  }

  async setupTestingInfrastructure(options = {}) {
    const {
      framework = 'jest',
      e2e = 'playwright',
      visual = true,
      accessibility = true
    } = options;

    console.log('🧪 Setting up React testing infrastructure...');

    try {
      // Install testing dependencies
      await this.installTestingDependencies(framework, e2e, visual, accessibility);

      // Configure testing frameworks
      await this.configureTestingFrameworks(framework, e2e);

      // Set up test scripts in package.json
      await this.setupTestScripts();

      // Create test utilities and helpers
      await this.createTestUtilities();

      // Set up CI/CD integration
      await this.setupCIIntegration();

      console.log('✅ Testing infrastructure setup completed!');
    } catch (error) {
      console.error('❌ Testing setup failed:', error.message);
      throw error;
    }
  }

  async installTestingDependencies(framework, e2e, visual, accessibility) {
    console.log('📦 Installing testing dependencies...');

    const dependencies = {
      devDependencies: {}
    };

    // Testing framework
    if (framework === 'jest') {
      Object.assign(dependencies.devDependencies, {
        'jest': '^29.7.0',
        'jest-environment-jsdom': '^29.7.0',
        '@types/jest': '^29.5.8',
        'ts-jest': '^29.1.1'
      });
    }

    // React Testing Library
    if (this.config.configuration.testing_libraries.react_testing_library.enabled) {
      Object.assign(dependencies.devDependencies, {
        '@testing-library/react': '^14.1.2',
        '@testing-library/jest-dom': '^6.1.5',
        '@testing-library/user-event': '^14.5.1'
      });
    }

    // E2E Testing
    if (e2e === 'playwright') {
      Object.assign(dependencies.devDependencies, {
        '@playwright/test': '^1.40.1'
      });
    }

    // Visual Regression
    if (visual) {
      Object.assign(dependencies.devDependencies, {
        'chromatic': '^11.0.0',
        '@storybook/test-runner': '^0.17.0'
      });
    }

    // Accessibility
    if (accessibility) {
      Object.assign(dependencies.devDependencies, {
        'axe-core': '^4.8.3',
        'jest-axe': '^8.0.0'
      });
    }

    // Performance testing
    if (this.config.configuration.performance.mock_date.enabled) {
      Object.assign(dependencies.devDependencies, {
        'mockdate': '^3.0.5'
      });
    }

    // Install dependencies
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    Object.assign(packageJson.devDependencies, dependencies.devDependencies);
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    execSync('npm install', { stdio: 'inherit', cwd: process.cwd() });
  }

  async configureTestingFrameworks(framework, e2e) {
    console.log('⚙️ Configuring testing frameworks...');

    // Jest configuration
    if (framework === 'jest') {
      const jestConfig = {
        preset: 'ts-jest',
        testEnvironment: 'jsdom',
        setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
        collectCoverageFrom: [
          'src/**/*.{ts,tsx}',
          '!src/**/*.d.ts',
          '!src/**/*.stories.tsx'
        ],
        coverageThreshold: this.config.configuration.coverage.thresholds,
        testMatch: [
          '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
          '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
        ],
        moduleNameMapping: {
          '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
          '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
        }
      };

      fs.writeFileSync(
        path.join(process.cwd(), 'jest.config.js'),
        `module.exports = ${JSON.stringify(jestConfig, null, 2)};`
      );
    }

    // Playwright configuration
    if (e2e === 'playwright') {
      const playwrightConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['junit', { outputFile: 'test-results/junit.xml' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});`;

      fs.writeFileSync(
        path.join(process.cwd(), 'playwright.config.ts'),
        playwrightConfig
      );
    }
  }

  async setupTestScripts() {
    console.log('📝 Setting up test scripts...');

    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    packageJson.scripts = {
      ...packageJson.scripts,
      'test': 'jest',
      'test:watch': 'jest --watch',
      'test:coverage': 'jest --coverage',
      'test:e2e': 'playwright test',
      'test:e2e:ui': 'playwright test --ui',
      'test:accessibility': 'jest --testPathPattern=a11y',
      'test:performance': 'jest --testPathPattern=performance',
      'chromatic': 'chromatic --exit-zero-on-changes'
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  async createTestUtilities() {
    console.log('🛠️ Creating test utilities...');

    // Create setupTests.ts
    const setupTests = `import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});`;

    fs.writeFileSync(
      path.join(process.cwd(), 'setupTests.ts'),
      setupTests
    );

    // Create test utilities directory
    const testUtilsDir = path.join(process.cwd(), 'src', 'test-utils');
    if (!fs.existsSync(testUtilsDir)) {
      fs.mkdirSync(testUtilsDir, { recursive: true });
    }

    // Create custom render function
    const customRender = `import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };`;

    fs.writeFileSync(
      path.join(testUtilsDir, 'index.ts'),
      customRender
    );

    // Create accessibility test utilities
    const a11yUtils = `import { axe, toHaveNoViolations } from 'jest-axe';
import { expect } from '@jest/globals';

expect.extend(toHaveNoViolations);

export const testA11y = async (ui: React.ReactElement) => {
  const results = await axe(ui);
  expect(results).toHaveNoViolations();
};

export const testA11yContainer = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};`;

    fs.writeFileSync(
      path.join(testUtilsDir, 'a11y.ts'),
      a11yUtils
    );
  }

  async setupCIIntegration() {
    console.log('🔄 Setting up CI integration...');

    // Create GitHub Actions workflow
    const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir, { recursive: true });
    }

    const ciWorkflow = `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Unit tests
        run: npm run test:coverage

      - name: Accessibility tests
        run: npm run test:accessibility

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30`;

    fs.writeFileSync(
      path.join(workflowsDir, 'ci.yml'),
      ciWorkflow
    );
  }

  async runTests(options = {}) {
    const {
      type = 'all',
      coverage = true,
      watch = false,
      updateSnapshots = false
    } = options;

    console.log(`🧪 Running ${type} tests...`);

    let command = 'npm run test';

    if (type === 'unit') {
      command = 'npm run test';
    } else if (type === 'e2e') {
      command = 'npm run test:e2e';
    } else if (type === 'accessibility') {
      command = 'npm run test:accessibility';
    }

    if (coverage) {
      command += ':coverage';
    }

    if (watch) {
      command += ':watch';
    }

    if (updateSnapshots) {
      command += ' -- -u';
    }

    try {
      execSync(command, { stdio: 'inherit', cwd: process.cwd() });
      console.log('✅ Tests completed successfully!');
    } catch (error) {
      console.error('❌ Tests failed!');
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    const automator = new ReactTestingAutomator();

    if (command === 'setup') {
      const options = {};
      args.slice(1).forEach(arg => {
        if (arg.startsWith('--framework=')) options.framework = arg.split('=')[1];
        if (arg.startsWith('--e2e=')) options.e2e = arg.split('=')[1];
        if (arg === '--no-visual') options.visual = false;
        if (arg === '--no-accessibility') options.accessibility = false;
      });

      automator.setupTestingInfrastructure(options);
    } else if (command === 'run') {
      const options = {};
      args.slice(1).forEach(arg => {
        if (arg.startsWith('--type=')) options.type = arg.split('=')[1];
        if (arg === '--no-coverage') options.coverage = false;
        if (arg === '--watch') options.watch = true;
        if (arg === '--update-snapshots') options.updateSnapshots = true;
      });

      automator.runTests(options);
    } else {
      console.log('Usage:');
      console.log('  node index.js setup [options] - Setup testing infrastructure');
      console.log('  node index.js run [options] - Run tests');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = ReactTestingAutomator;
