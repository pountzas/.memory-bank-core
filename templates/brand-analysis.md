---
template_id: brand-analysis
title: Brand Analyzer - Claude Skill Integration
intent: Leverage Claude AI skill for brand-analyzer to enhance development workflow and deliver specialized expertise
input_format: task_description, context_details, skill_parameters
output_format: Claude skill execution results, generated assets, implementation guidance
steps: |
  0. Verify current branch location and create feature branch if necessary: git branch --show-current, create feature/claude-brand-analyzer if on dev (MANDATORY - before any work)
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
notes: This template leverages the specialized Claude AI skill "brand-analyzer" for enhanced development capabilities. Ensure skill prerequisites are met before execution. CRITICAL - Create feature branch BEFORE any work begins. Never commit directly to dev. Always verify workspace directory location. ALWAYS use PowerShell for terminal commands. RIGHT BEFORE git add: Test skill outputs thoroughly.
learning_tags: [claude-skill, brand-analyzer, automation, ai-enhancement]
changelog:
  - "2025-12-19: Initial Claude skill integration template for brand-analyzer."
---

## Claude Skill: Brand Analyzer

**Description:** This skill should be used when the user requests brand analysis, brand guidelines creation, brand audits, or establishing brand identity and consistency standards. It provides comprehensive frameworks for analyzing brand elements and creating actionable brand guidelines based on requirements.

## Available Capabilities



## Recommended Use Cases

  - Brand analysis or brand audit
  - Creation of brand guidelines or brand standards
  - Brand identity development or refinement
  - Brand consistency evaluation
  - Brand positioning and differentiation analysis
  - Brand archetype identification
  - Recommendations for brand improvements
  - Documentation of existing brand elements

## Skill Resources

### Assets
- `brand_analysis_report_template.md` (file)
- `brand_guidelines_template.md` (file)
- `quick_brand_audit_template.md` (file)

### References
- `brand_analysis_framework.md` (file)
- `brand_archetypes.md` (file)



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
template_id: brand-analysis
status: todo
lane: ai-enhancement
locks: ["brand-analyzer-related-files"]
depends_on: []
branch: feature/claude-brand-analyzer
timebox_minutes: 60
```
