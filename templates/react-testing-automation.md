---
template_id: react-testing-automation
title: Automate React Component Testing
intent: Set up comprehensive automated testing for React components including unit tests, integration tests, and E2E tests
input_format: testing_scope, test_framework, coverage_target, component_path
output_format: Test files, test configuration, CI integration, coverage reports
steps: |
  0. Verify current branch location and create feature branch if necessary: git branch --show-current, create feature/testing-{testing_scope} if on dev (MANDATORY - before any work)
  1. Verify workspace location (MANDATORY): Set-Location -Path "."; (Get-Location).Path
  2. Set up testing framework configuration (Jest/Vitest + RTL)
  3. Create unit tests for components with edge cases
  4. Implement integration tests for component interactions
  5. Set up E2E tests with Playwright for critical user journeys
  6. Configure test coverage thresholds and reporting
  7. Add visual regression testing with Chromatic/Storybook
  8. Integrate tests with CI/CD pipeline
  9. RIGHT BEFORE git add: Run full test suite and verify coverage
  10. Set up automated test execution on pre-commit hooks
acceptance_criteria: |
  - All components have unit tests with >80% coverage
  - Integration tests cover critical user flows
  - E2E tests automated for key user journeys
  - Test coverage meets target threshold
  - Tests run successfully in CI pipeline
  - Visual regression tests integrated
  - Performance testing included
timebox_minutes: 180
dependencies: []
version: 1.0.0
notes: Use industry-standard testing practices with Jest/Vitest and React Testing Library. Include accessibility testing, performance testing, and visual regression. CRITICAL - Create feature branch BEFORE any work begins. Never commit directly to dev. Always verify workspace directory location. ALWAYS use PowerShell for terminal commands. RIGHT BEFORE git add: Run full test suite and verify all tests pass.
learning_tags: [react, testing, automation, jest, playwright, coverage]
changelog:
  - "2025-12-19: Initial React testing automation template with comprehensive test coverage."
---

## Testing Scopes

- `unit`: Component unit tests with mocks
- `integration`: Component interaction and data flow tests
- `e2e`: End-to-end user journey tests
- `visual`: Visual regression testing
- `performance`: Performance and load testing
- `accessibility`: A11y compliance testing
- `api`: API integration testing

## Test Frameworks

- `jest-rtl`: Jest with React Testing Library
- `vitest-rtl`: Vitest with React Testing Library
- `playwright`: Playwright for E2E testing
- `cypress`: Cypress for E2E testing
- `testing-library`: React Testing Library ecosystem
- `storybook-test`: Storybook test runner

## Coverage Targets

- `statements`: Statement coverage percentage
- `branches`: Branch coverage percentage
- `functions`: Function coverage percentage
- `lines`: Line coverage percentage

## Test Automation Features

- Pre-commit test hooks
- CI/CD integration
- Parallel test execution
- Test result reporting
- Coverage badges
- Test failure notifications
- Performance regression detection

## Concurrency guidance

When you instantiate this template, also create a per-task metadata file at `memory-bank/tasks/{task_id}.md` including:

```yaml
task_id: <id>
template_id: react-testing-automation
status: todo
lane: testing
locks: ["__tests__/", "src/"] # test directories and source code
depends_on: []
branch: feature/testing-<testing_scope>
timebox_minutes: 180
```
