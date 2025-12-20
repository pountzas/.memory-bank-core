---
template_id: react-performance-monitoring
title: Implement React Performance Monitoring
intent: Set up comprehensive performance monitoring for React applications including Core Web Vitals, bundle analysis, and runtime performance
input_format: monitoring_scope, performance_targets, tracking_tools, alert_thresholds
output_format: Performance monitoring configuration, dashboards, alerts, optimization recommendations
steps: |
  0. Verify current branch location and create feature branch if necessary: git branch --show-current, create feature/monitor-{monitoring_scope} if on dev (MANDATORY - before any work)
  1. Verify workspace location (MANDATORY): Set-Location -Path "."; (Get-Location).Path
  2. Implement Core Web Vitals tracking
  3. Set up React DevTools Profiler integration
  4. Configure bundle size monitoring
  5. Add runtime performance monitoring
  6. Implement error boundary with error reporting
  7. Set up performance budgets and alerts
  8. Create performance dashboards
  9. RIGHT BEFORE git add: Run performance tests and verify monitoring
  10. Document performance optimization guidelines
acceptance_criteria: |
  - Core Web Vitals tracking active
  - Performance monitoring dashboard created
  - Bundle size monitoring configured
  - Error tracking and reporting working
  - Performance alerts configured
  - Performance budgets defined
  - Optimization recommendations documented
timebox_minutes: 90
dependencies: []
version: 1.0.0
notes: Use industry-standard performance monitoring tools. Focus on Core Web Vitals, bundle analysis, and runtime performance. Include automated alerts and dashboards. CRITICAL - Create feature branch BEFORE any work begins. Never commit directly to dev. Always verify workspace directory location. ALWAYS use PowerShell for terminal commands. RIGHT BEFORE git add: Run performance tests and verify monitoring data.
learning_tags: [react, performance, monitoring, web-vitals, bundle-analysis, devtools]
changelog:
  - "2025-12-19: Initial React performance monitoring template with comprehensive tracking."
---

## Monitoring Scopes

- `core-web-vitals`: LCP, FID, CLS tracking
- `bundle-analysis`: Bundle size and composition monitoring
- `runtime-performance`: React component performance tracking
- `memory-usage`: Memory leak detection and monitoring
- `network-performance`: API and asset loading performance
- `user-experience`: Real user monitoring and feedback

## Performance Targets

- `lcp`: Largest Contentful Paint target (seconds)
- `fid`: First Input Delay target (milliseconds)
- `cls`: Cumulative Layout Shift target (score)
- `fcp`: First Contentful Paint target (seconds)
- `ttfb`: Time to First Byte target (milliseconds)
- `bundle-size`: Bundle size target (MB)

## Tracking Tools

- `web-vitals`: Google Web Vitals library
- `react-devtools`: React Profiler integration
- `lighthouse`: Automated Lighthouse audits
- `performance-observer`: Browser Performance Observer API
- `react-query-devtools`: Data fetching performance
- `webpack-bundle-analyzer`: Bundle composition analysis

## Alert Thresholds

- `error-rate`: Error rate percentage threshold
- `performance-regression`: Performance degradation threshold
- `bundle-size-increase`: Bundle size increase threshold
- `memory-leak`: Memory usage threshold
- `slow-api-calls`: API response time threshold

## Concurrency guidance

When you instantiate this template, also create a per-task metadata file at `memory-bank/tasks/{task_id}.md` including:

```yaml
task_id: <id>
template_id: react-performance-monitoring
status: todo
lane: monitoring
locks: ["src/components/ErrorBoundary.tsx", "public/monitoring/"] # monitoring files
depends_on: []
branch: feature/monitor-<monitoring_scope>
timebox_minutes: 90
```
