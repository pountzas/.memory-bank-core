---
template_id: react-deployment-automation
title: Automate React Application Deployment
intent: Set up automated deployment pipeline for React applications with staging, production, and rollback capabilities
input_format: deployment_platform, environment_config, ci_provider, monitoring_setup
output_format: Deployment configuration, CI/CD pipeline, monitoring dashboard, rollback procedures
steps: |
  0. Verify current branch location and create feature branch if necessary: git branch --show-current, create feature/deploy-{deployment_platform} if on dev (MANDATORY - before any work)
  1. Verify workspace location (MANDATORY): Set-Location -Path "."; (Get-Location).Path
  2. Configure build optimization for production
  3. Set up CI/CD pipeline with automated testing
  4. Configure deployment platform (Vercel, Netlify, AWS, etc.)
  5. Implement staging environment with feature flags
  6. Set up production deployment with zero-downtime
  7. Configure monitoring and error tracking
  8. Implement automated rollback procedures
  9. RIGHT BEFORE git add: Test deployment pipeline with staging environment
  10. Set up deployment notifications and alerts
acceptance_criteria: |
  - CI/CD pipeline configured and working
  - Staging environment deployed successfully
  - Production deployment automated
  - Monitoring and error tracking integrated
  - Rollback procedures documented and tested
  - Performance monitoring active
  - Deployment notifications configured
timebox_minutes: 240
dependencies: []
version: 1.0.0
notes: Use industry-standard deployment practices with proper staging, monitoring, and rollback. Include feature flags and canary deployments. CRITICAL - Create feature branch BEFORE any work begins. Never commit directly to dev. Always verify workspace directory location. ALWAYS use PowerShell for terminal commands. RIGHT BEFORE git add: Test deployment pipeline and verify staging environment.
learning_tags: [react, deployment, ci-cd, monitoring, devops, automation]
changelog:
  - "2025-12-19: Initial React deployment automation template with comprehensive CI/CD setup."
---

## Deployment Platforms

- `vercel`: Vercel platform with preview deployments
- `netlify`: Netlify with form handling and functions
- `aws`: AWS Amplify or S3 + CloudFront
- `azure`: Azure Static Web Apps
- `github-pages`: GitHub Pages for documentation
- `docker`: Docker container deployment
- `kubernetes`: K8s deployment with Helm

## Environment Configurations

- `staging`: Pre-production testing environment
- `production`: Live production environment
- `canary`: Progressive rollout environment
- `feature-flags`: Feature flag management
- `multi-region`: Global deployment setup
- `blue-green`: Blue/green deployment strategy

## CI Providers

- `github-actions`: GitHub Actions workflows
- `gitlab-ci`: GitLab CI/CD pipelines
- `jenkins`: Jenkins pipeline configuration
- `circle-ci`: CircleCI orb configuration
- `travis-ci`: Travis CI configuration
- `azure-devops`: Azure DevOps pipelines

## Monitoring Setup

- `sentry`: Error tracking and performance monitoring
- `datadog`: Application performance monitoring
- `new-relic`: Real user monitoring
- `logrocket`: Session replay and error tracking
- `lighthouse-ci`: Performance monitoring
- `web-vitals`: Core Web Vitals tracking

## Concurrency guidance

When you instantiate this template, also create a per-task metadata file at `memory-bank/tasks/{task_id}.md` including:

```yaml
task_id: <id>
template_id: react-deployment-automation
status: todo
lane: deployment
locks: [".github/", "vercel.json", "netlify.toml", "Dockerfile"] # deployment configuration files
depends_on: []
branch: feature/deploy-<deployment_platform>
timebox_minutes: 240
```
