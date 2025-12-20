---
template_id: react-component-generator
title: Generate React Component with Automation
intent: Create a new React component with automated setup including tests, stories, and documentation
input_format: component_name, component_type, component_path, features
output_format: Component files, test files, story files, documentation
steps: |
  0. Verify current branch location and create feature branch if necessary: git branch --show-current, create feature/component-{component_name} if on dev (MANDATORY - before any work)
  1. Verify workspace location (MANDATORY): Set-Location -Path "{component_path}"; (Get-Location).Path
  2. Generate component boilerplate with TypeScript interfaces
  3. Create component test file with basic test cases
  4. Generate Storybook story file for component development
  5. Create component documentation with usage examples
  6. Update component index file for exports
  7. RIGHT BEFORE git add: Use MCP Chrome DevTools to verify component renders correctly
  8. Run tests and linting to ensure quality
acceptance_criteria: |
  - Component file created with proper TypeScript types
  - Test file created with at least 3 test cases
  - Storybook story file created for development
  - Component documentation generated
  - All tests pass locally
  - Component exports properly from index
  - No linting errors
timebox_minutes: 45
dependencies: []
version: 1.0.0
notes: Use industry-standard patterns. Include proper TypeScript interfaces, accessibility attributes, and responsive design considerations. CRITICAL - Create feature branch BEFORE any work begins. Never commit directly to dev. Always verify workspace directory location. ALWAYS use PowerShell for terminal commands. RIGHT BEFORE git add: Use MCP Chrome DevTools to verify component functionality.
learning_tags: [react, component, automation, typescript, testing]
changelog:
  - "2025-12-19: Initial React component generation template with full automation."
---

## Component Types Supported

- `ui`: Basic UI components (Button, Input, Card)
- `layout`: Layout components (Container, Grid, Flex)
- `form`: Form components (FormField, Select, Checkbox)
- `data`: Data display components (Table, List, Chart)
- `feedback`: User feedback components (Modal, Toast, Loading)
- `navigation`: Navigation components (NavBar, Breadcrumbs, Tabs)

## Features Options

- `typescript`: TypeScript interfaces and types
- `styled`: Styled-components or CSS modules
- `responsive`: Mobile-first responsive design
- `accessible`: ARIA attributes and keyboard navigation
- `themed`: Theme provider integration
- `animated`: Framer Motion animations
- `tested`: Jest and React Testing Library setup
- `storybook`: Storybook stories for development

## Concurrency guidance

When you instantiate this template, also create a per-task metadata file at `memory-bank/tasks/{task_id}.md` including:

```yaml
task_id: <id>
template_id: react-component-generator
status: todo
lane: components
locks: ["components/{component_path}"] # component directory
depends_on: []
branch: feature/component-<component_name>
timebox_minutes: 45
```
