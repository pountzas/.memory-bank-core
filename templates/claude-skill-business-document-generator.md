---
template_id: claude-skill-business-document-generator
title: Business Document Generator - Claude Skill Integration
intent: Leverage Claude AI skill for business-document-generator to enhance development workflow and deliver specialized expertise
input_format: task_description, context_details, skill_parameters
output_format: Claude skill execution results, generated assets, implementation guidance
steps: |
  0. Verify current branch location and create feature branch if necessary: git branch --show-current, create feature/claude-business-document-generator if on dev (MANDATORY - before any work)
  1. Verify workspace location (MANDATORY): Set-Location -Path "."; (Get-Location).Path
  2. Review available Claude skill capabilities and resources
  3. Prepare task context and parameters for skill invocation
  4. Execute Claude skill with appropriate inputs
  5. Review and validate skill-generated outputs
  6. Integrate skill results into project workflow
  7. RIGHT BEFORE git add: Test skill outputs and verify implementation
  8. Document skill usage and results for future reference
acceptance_criteria: |
  - Claude skill successfully executed with provided inputs
  - Skill outputs meet quality and relevance standards
  - Generated assets properly integrated into project
  - Documentation updated with skill usage details
  - No conflicts with existing codebase patterns
timebox_minutes: 60
dependencies: []
version: 1.0.0
notes: This template leverages the specialized Claude AI skill "business-document-generator" for enhanced development capabilities. Ensure skill prerequisites are met before execution. CRITICAL - Create feature branch BEFORE any work begins. Never commit directly to dev. Always verify workspace directory location. ALWAYS use PowerShell for terminal commands. RIGHT BEFORE git add: Test skill outputs thoroughly.
learning_tags: [claude-skill, business-document-generator, automation, ai-enhancement]
changelog:
  - "2025-12-19: Initial Claude skill integration template for business-document-generator."
---

## Claude Skill: Business Document Generator

**Description:** This skill should be used when the user requests to create professional business documents (proposals, business plans, or budgets) from templates. It provides PDF templates and a Python script for generating filled documents from user data.

## Available Capabilities



## Recommended Use Cases

  - Create a business proposal or project proposal
  - Generate a business plan document
  - Develop an annual budget plan
  - Create any professional business document based on the available templates
  - Fill in business templates with specific data

## Skill Resources

### Assets
- `examples` (directory)
- `templates` (directory)

### Scripts
- `generate_document.py` (file)

### References
- `document_schemas.md` (file)



## Execution Workflow

1. **Context Preparation**
   - Review skill documentation and capabilities
   - Prepare relevant project context and requirements
   - Identify specific skill parameters needed

2. **Skill Invocation**
   - Execute skill with prepared inputs
   - Monitor skill processing and outputs
   - Address any skill-specific requirements

3. **Output Integration**
   - Review generated assets and recommendations
   - Integrate results into project workflow
   - Validate implementation quality

4. **Quality Assurance**
   - Test skill-generated implementations
   - Verify compatibility with existing code
   - Document usage and results

## Prerequisites

- Claude AI access with skill capabilities
- Required dependencies installed (check skill package.json)
- Appropriate project context prepared
- Understanding of skill-specific requirements

## Quality Metrics

- Skill execution completes successfully
- Generated outputs meet project standards
- Implementation integrates seamlessly
- Documentation is comprehensive and accurate

## Concurrency guidance

When you instantiate this template, also create a per-task metadata file at `memory-bank/tasks/{task_id}.md` including:

```yaml
task_id: <id>
template_id: claude-skill-business-document-generator
status: todo
lane: ai-enhancement
locks: ["business-document-generator-related-files"]
depends_on: []
branch: feature/claude-business-document-generator
timebox_minutes: 60
```
