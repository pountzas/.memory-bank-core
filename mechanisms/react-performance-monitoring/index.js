#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ReactPerformanceMonitor {
  constructor() {
    this.config = require('./config.json');
    this.templatesDir = path.join(__dirname, 'templates');
  }

  async setupPerformanceMonitoring(options = {}) {
    const {
      webVitals = true,
      profiler = true,
      errorBoundaries = true,
      analytics = false
    } = options;

    console.log('📊 Setting up React performance monitoring...');

    try {
      // Install performance monitoring dependencies
      await this.installPerformanceDependencies(webVitals, analytics);

      // Set up Core Web Vitals tracking
      if (webVitals) {
        await this.setupWebVitals();
      }

      // Set up React Profiler
      if (profiler) {
        await this.setupReactProfiler();
      }

      // Set up error boundaries
      if (errorBoundaries) {
        await this.setupErrorBoundaries();
      }

      // Set up analytics integration
      if (analytics) {
        await this.setupAnalytics();
      }

      // Configure build-time performance checks
      await this.setupBuildPerformanceChecks();

      // Create performance utilities
      await this.createPerformanceUtilities();

      console.log('✅ Performance monitoring setup completed!');
    } catch (error) {
      console.error('❌ Performance monitoring setup failed:', error.message);
      throw error;
    }
  }

  async installPerformanceDependencies(webVitals, analytics) {
    console.log('📦 Installing performance monitoring dependencies...');

    const dependencies = {
      devDependencies: {}
    };

    if (webVitals) {
      Object.assign(dependencies.devDependencies, {
        'web-vitals': '^3.5.0'
      });
    }

    if (analytics) {
      Object.assign(dependencies.devDependencies, {
        'react-ga4': '^2.1.0'
      });
    }

    // Always include performance utilities
    Object.assign(dependencies.devDependencies, {
      'webpack-bundle-analyzer': '^4.9.0',
      'lighthouse': '^11.0.0'
    });

    // Update package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    Object.assign(packageJson.devDependencies, dependencies.devDependencies);
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    execSync('npm install', { stdio: 'inherit', cwd: process.cwd() });
  }

  async setupWebVitals() {
    console.log('📏 Setting up Core Web Vitals tracking...');

    // Create web vitals utility
    const webVitalsUtils = `import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

// Development logging
if (process.env.NODE_ENV === 'development') {
  const logVitals = (metric) => {
    console.log(\`Web Vital \${metric.name}:\`, metric.value, metric.rating);
  };

  reportWebVitals(logVitals);
}

// Production reporting (extend this based on your analytics setup)
if (process.env.NODE_ENV === 'production') {
  reportWebVitals((metric) => {
    // Send to analytics service
    console.log('Performance metric:', metric);
  });
}`;

    fs.writeFileSync(
      path.join(process.cwd(), 'src', 'utils', 'webVitals.ts'),
      webVitalsUtils
    );

    // Update main.tsx to include web vitals
    const mainTsxPath = path.join(process.cwd(), 'src', 'main.tsx');
    if (fs.existsSync(mainTsxPath)) {
      let mainContent = fs.readFileSync(mainTsxPath, 'utf8');

      if (!mainContent.includes('reportWebVitals')) {
        mainContent += `\n\nimport('./utils/webVitals').then(({ reportWebVitals }) => {
  reportWebVitals(console.log);
});`;
      }

      fs.writeFileSync(mainTsxPath, mainContent);
    }
  }

  async setupReactProfiler() {
    console.log('🔍 Setting up React Profiler...');

    // Create profiler wrapper component
    const profilerComponent = `import React from 'react';

interface ProfilerProps {
  id: string;
  onRender: (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => void;
  children: React.ReactNode;
}

export const PerformanceProfiler: React.FC<ProfilerProps> = ({
  id,
  onRender,
  children
}) => {
  const handleRender = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {
    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && actualDuration > 16) {
      console.warn(\`Slow render detected in \${id}: \${actualDuration.toFixed(2)}ms\`);
    }

    if (onRender) {
      onRender(id, phase, actualDuration, baseDuration, startTime, commitTime);
    }
  };

  return (
    <React.Profiler id={id} onRender={handleRender}>
      {children}
    </React.Profiler>
  );
};

// HOC for easy component profiling
export const withProfiler = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const ProfilerComponent = (props: P) => (
    <PerformanceProfiler
      id={componentName}
      onRender={(id, phase, actualDuration) => {
        if (actualDuration > 16) {
          console.log(\`\${componentName} - \${phase}: \${actualDuration.toFixed(2)}ms\`);
        }
      }}
    >
      <Component {...props} />
    </PerformanceProfiler>
  );

  ProfilerComponent.displayName = \`withProfiler(\${componentName})\`;
  return ProfilerComponent;
};`;

    const utilsDir = path.join(process.cwd(), 'src', 'utils');
    if (!fs.existsSync(utilsDir)) {
      fs.mkdirSync(utilsDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(utilsDir, 'profiler.tsx'),
      profilerComponent
    );
  }

  async setupErrorBoundaries() {
    console.log('🛡️ Setting up error boundaries...');

    // Create error boundary component
    const errorBoundary = `import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Report error
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Send to error reporting service
      console.error('Production error:', { error: error.message, stack: error.stack });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>
          <button onClick={this.handleRetry}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export const useErrorHandler = () => {
  return React.useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('Error caught by hook:', error, errorInfo);
    // Report to error tracking service
  }, []);
};

// Fallback UI component
export const ErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({
  error,
  retry
}) => (
  <div className="error-fallback">
    <h3>Oops! Something went wrong</h3>
    {error && <p>Error: {error.message}</p>}
    <button onClick={retry}>Try Again</button>
  </div>
);`;

    const componentsDir = path.join(process.cwd(), 'src', 'components');
    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(componentsDir, 'ErrorBoundary.tsx'),
      errorBoundary
    );
  }

  async setupAnalytics() {
    console.log('📈 Setting up analytics integration...');

    // Create analytics utility
    const analyticsUtils = `import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initAnalytics = (measurementId: string) => {
  ReactGA.initialize(measurementId);
};

// Track page views
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// Track events
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value
  });
};

// Track performance metrics
export const trackPerformance = (metric: string, value: number, unit: string = 'ms') => {
  trackEvent('Performance', metric, unit, value);
};

// Track errors
export const trackError = (error: Error, context?: string) => {
  trackEvent('Error', error.name, context || error.message);
};

export { ReactGA };`;

    fs.writeFileSync(
      path.join(process.cwd(), 'src', 'utils', 'analytics.ts'),
      analyticsUtils
    );
  }

  async setupBuildPerformanceChecks() {
    console.log('🔧 Setting up build-time performance checks...');

    // Update package.json with performance scripts
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    packageJson.scripts = {
      ...packageJson.scripts,
      'analyze-bundle': 'webpack-bundle-analyzer dist/static/js/*.js',
      'lighthouse': 'lighthouse http://localhost:3000 --output=json --output-path=./performance-reports/lighthouse.json',
      'performance-check': 'npm run lighthouse'
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  async createPerformanceUtilities() {
    console.log('🛠️ Creating performance utilities...');

    // Create performance utilities
    const performanceUtils = `// Performance utilities for React applications

export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(\`\${name} took \${(end - start).toFixed(2)}ms\`);
  return end - start;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const usePerformanceMark = (name: string) => {
  React.useEffect(() => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(\`\${name}-start\`);

      return () => {
        performance.mark(\`\${name}-end\`);
        try {
          performance.measure(name, \`\${name}-start\`, \`\${name}-end\`);
          const measure = performance.getEntriesByName(name)[0];
          console.log(\`\${name} duration: \${measure.duration.toFixed(2)}ms\`);
        } catch (error) {
          console.warn('Performance measure failed:', error);
        }
      };
    }
  }, [name]);
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if (typeof performance !== 'undefined' && (performance as any).memory) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
    };
  }
  return null;
};

export const logMemoryUsage = () => {
  const memory = getMemoryUsage();
  if (memory) {
    console.log('Memory usage:', memory);
  }
};

// Network monitoring
export const monitorNetworkRequests = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          console.log('Network request:', {
            url: entry.name,
            duration: entry.duration,
            size: (entry as any).transferSize || 0
          });
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
    return observer;
  }
  return null;
};`;

    fs.writeFileSync(
      path.join(process.cwd(), 'src', 'utils', 'performance.ts'),
      performanceUtils
    );
  }

  async runPerformanceAudit(options = {}) {
    const {
      url = 'http://localhost:3000',
      format = 'json',
      outputPath = './performance-reports'
    } = options;

    console.log('🔍 Running performance audit...');

    try {
      // Ensure output directory exists
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      // Run Lighthouse audit
      const lighthouseCommand = `npx lighthouse ${url} --output=${format} --output-path=${outputPath}/lighthouse.${format}`;
      execSync(lighthouseCommand, { stdio: 'inherit', cwd: process.cwd() });

      // Analyze bundle size
      const bundleReportPath = path.join(outputPath, 'bundle-analysis.json');

      // Generate performance report
      const report = {
        timestamp: new Date().toISOString(),
        lighthouseUrl: url,
        recommendations: [
          'Implement code splitting for better initial load times',
          'Optimize images and static assets',
          'Use lazy loading for non-critical components',
          'Implement proper caching strategies',
          'Monitor Core Web Vitals regularly'
        ]
      };

      fs.writeFileSync(
        path.join(outputPath, 'performance-report.json'),
        JSON.stringify(report, null, 2)
      );

      console.log('✅ Performance audit completed!');
      console.log(`📊 Reports saved to: ${outputPath}`);
    } catch (error) {
      console.error('❌ Performance audit failed:', error.message);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    const monitor = new ReactPerformanceMonitor();

    if (command === 'setup') {
      const options = {};
      args.slice(1).forEach(arg => {
        if (arg === '--no-web-vitals') options.webVitals = false;
        if (arg === '--no-profiler') options.profiler = false;
        if (arg === '--no-error-boundaries') options.errorBoundaries = false;
        if (arg === '--analytics') options.analytics = true;
      });

      monitor.setupPerformanceMonitoring(options);
    } else if (command === 'audit') {
      const options = {};
      args.slice(1).forEach(arg => {
        if (arg.startsWith('--url=')) options.url = arg.split('=')[1];
        if (arg.startsWith('--format=')) options.format = arg.split('=')[1];
        if (arg.startsWith('--output=')) options.outputPath = arg.split('=')[1];
      });

      monitor.runPerformanceAudit(options);
    } else {
      console.log('Usage:');
      console.log('  node index.js setup [options] - Setup performance monitoring');
      console.log('  node index.js audit [options] - Run performance audit');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = ReactPerformanceMonitor;
