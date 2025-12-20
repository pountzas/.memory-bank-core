---
template_id: containerization-setup
title: Docker Containerization - Claude Skill Integration
intent: Leverage Claude AI skill for docker-containerization to enhance development workflow and deliver specialized expertise
input_format: task_description, context_details, skill_parameters
output_format: Claude skill execution results, generated assets, implementation guidance
steps: |
  0. Verify current branch location and create feature branch if necessary: git branch --show-current, create feature/claude-docker-containerization if on dev (MANDATORY - before any work)
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
notes: This template leverages the specialized Claude AI skill "docker-containerization" for enhanced development capabilities. Ensure skill prerequisites are met before execution. CRITICAL - Create feature branch BEFORE any work begins. Never commit directly to dev. Always verify workspace directory location. ALWAYS use PowerShell for terminal commands. RIGHT BEFORE git add: Test skill outputs thoroughly.
learning_tags: [claude-skill, docker-containerization, automation, ai-enhancement]
changelog:
  - "2025-12-19: Initial Claude skill integration template for docker-containerization."
---

## Claude Skill: Docker Containerization

**Description:** This skill should be used when containerizing applications with Docker, creating Dockerfiles, docker-compose configurations, or deploying containers to various platforms. Ideal for Next.js, React, Node.js applications requiring containerization for development, production, or CI/CD pipelines. Use this skill when users need Docker configurations, multi-stage builds, container orchestration, or deployment to Kubernetes, ECS, Cloud Run, etc.

## Available Capabilities

  - Production
  - Development
  - Nginx Static

## Recommended Use Cases



## Skill Resources

### Assets
- `.dockerignore` (file)
- `docker-compose.yml` (file)
- `Dockerfile.development` (file)
- `Dockerfile.nginx` (file)
- `Dockerfile.production` (file)
- `nginx.conf` (file)

### Scripts
- `docker-build.sh` (file)
- `docker-cleanup.sh` (file)
- `docker-push.sh` (file)
- `docker-run.sh` (file)

### References
- `container-orchestration.md` (file)
- `docker-best-practices.md` (file)



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
template_id: containerization-setup
status: todo
lane: ai-enhancement
locks: ["docker-containerization-related-files"]
depends_on: []
branch: feature/claude-docker-containerization
timebox_minutes: 60
```
