---
template_id: react-build-optimization
title: Optimize React Build Performance
intent: Improve React application build performance through code splitting, lazy loading, and bundle analysis
input_format: optimization_type, target_metrics, current_bundle_size
output_format: Optimized build configuration, performance improvements, bundle analysis report
steps: |
  0. Verify current branch location and create feature branch if necessary: git branch --show-current, create feature/optimize-build-{optimization_type} if on dev (MANDATORY - before any work)
  1. Verify workspace location (MANDATORY): Set-Location -Path "."; (Get-Location).Path
  2. Analyze current bundle size and identify optimization opportunities
  3. Implement code splitting with React.lazy() and Suspense
  4. Configure dynamic imports for route-based code splitting
  5. Optimize webpack/vite configuration for better tree shaking
  6. Implement image optimization and asset compression
  7. Add bundle analyzer and performance monitoring
  8. RIGHT BEFORE git add: Run build and verify performance improvements
  9. Create performance regression tests
acceptance_criteria: |
  - Bundle size reduced by at least 20% or meets target metrics
  - Code splitting implemented for all routes
  - Lazy loading configured for heavy components
  - Bundle analyzer report generated
  - Build time within acceptable limits
  - Performance monitoring integrated
  - No functionality broken
timebox_minutes: 120
dependencies: []
version: 1.0.0
notes: Focus on industry-standard optimization techniques. Use React.lazy, dynamic imports, and modern build tools. Measure performance impact. CRITICAL - Create feature branch BEFORE any work begins. Never commit directly to dev. Always verify workspace directory location. ALWAYS use PowerShell for terminal commands. RIGHT BEFORE git add: Run build and verify performance metrics.
learning_tags: [react, performance, build, optimization, webpack, vite]
changelog:
  - "2025-12-19: Initial React build optimization template with comprehensive performance improvements."
---

## Optimization Types

- `code-splitting`: Implement route and component-based code splitting
- `lazy-loading`: Add React.lazy() for heavy components
- `bundle-analysis`: Analyze and optimize bundle composition
- `asset-optimization`: Optimize images, fonts, and static assets
- `build-config`: Optimize webpack/vite configuration
- `tree-shaking`: Improve dead code elimination
- `compression`: Enable gzip/brotli compression

## Target Metrics

- `bundle-size`: Target bundle size in MB
- `first-contentful-paint`: FCP target in seconds
- `largest-contentful-paint`: LCP target in seconds
- `first-input-delay`: FID target in milliseconds
- `cumulative-layout-shift`: CLS target score
- `build-time`: Build time target in seconds

## Performance Monitoring

- Bundle analyzer integration
- Web Vitals tracking
- Core Web Vitals monitoring
- Performance regression detection
- Lighthouse CI integration

## Concurrency guidance

When you instantiate this template, also create a per-task metadata file at `memory-bank/tasks/{task_id}.md` including:

```yaml
task_id: <id>
template_id: react-build-optimization
status: todo
lane: performance
locks: ["package.json", "vite.config.js", "webpack.config.js"] # build configuration files
depends_on: []
branch: feature/optimize-build-<optimization_type>
timebox_minutes: 120
```
