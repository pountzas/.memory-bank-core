#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ClaudeSkillsIntegrator {
  constructor() {
    this.config = require('./config.json');
    this.skillsDir = path.resolve(this.config.configuration.skills_directory);
    this.templatesDir = path.resolve('memory-bank/templates');
    this.discoveredSkills = new Map();
  }

  async discoverSkills() {
    console.log('🔍 Discovering Claude skills...');

    if (!fs.existsSync(this.skillsDir)) {
      console.log('⚠️  Claude skills directory not found:', this.skillsDir);
      console.log('💡 Make sure ai-labs-claude-skills is installed and .claude/skills exists');
      return;
    }

    const skillDirs = fs.readdirSync(this.skillsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`📂 Found ${skillDirs.length} skill directories`);

    for (const skillName of skillDirs) {
      const skillPath = path.join(this.skillsDir, skillName);
      const skillInfo = await this.parseSkill(skillPath, skillName);

      if (skillInfo) {
        this.discoveredSkills.set(skillName, skillInfo);
        console.log(`✅ Discovered skill: ${skillName}`);
      }
    }

    console.log(`🎯 Total skills discovered: ${this.discoveredSkills.size}`);
    return this.discoveredSkills;
  }

  async parseSkill(skillPath, skillName) {
    try {
      const skillMdPath = path.join(skillPath, 'SKILL.md');

      if (!fs.existsSync(skillMdPath)) {
        console.log(`⚠️  SKILL.md not found for ${skillName}, skipping`);
        return null;
      }

      const skillContent = fs.readFileSync(skillMdPath, 'utf8');
      const skillInfo = this.extractSkillMetadata(skillContent, skillName);

      // Check for package.json
      const packagePath = path.join(skillPath, 'package.json');
      if (fs.existsSync(packagePath)) {
        const packageInfo = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        skillInfo.packageInfo = packageInfo;
      }

      // Check for additional resources
      skillInfo.resources = this.scanSkillResources(skillPath);

      return skillInfo;
    } catch (error) {
      console.error(`❌ Error parsing skill ${skillName}:`, error.message);
      return null;
    }
  }

  extractSkillMetadata(content, skillName) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';

    const metadata = {
      name: skillName,
      title: skillName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: '',
      capabilities: [],
      useCases: [],
      resources: {}
    };

    // Extract name and description from frontmatter
    const nameMatch = frontmatter.match(/name:\s*(.+)/);
    const descMatch = frontmatter.match(/description:\s*(.+)/);

    if (nameMatch) metadata.name = nameMatch[1].trim();
    if (descMatch) metadata.description = descMatch[1].trim();

    // Extract capabilities and use cases from content
    const capabilitiesMatch = content.match(/## Core Capabilities\s*\n([\s\S]*?)(?=\n##|\n---|\n$)/);
    if (capabilitiesMatch) {
      const capabilitiesText = capabilitiesMatch[1];
      const capMatches = capabilitiesText.match(/\*\*([^*]+)\*\*/g);
      if (capMatches) {
        metadata.capabilities = capMatches.map(match => match.replace(/\*\*/g, '').trim());
      }
    }

    const useCasesMatch = content.match(/## When to Use This Skill\s*\n([\s\S]*?)(?=\n##|\n---|\n$)/);
    if (useCasesMatch) {
      const useCasesText = useCasesMatch[1];
      const caseMatches = useCasesText.match(/-\s*(.+)/g);
      if (caseMatches) {
        metadata.useCases = caseMatches.map(match => match.replace(/^-\s*/, '').trim());
      }
    }

    return metadata;
  }

  scanSkillResources(skillPath) {
    const resources = {
      assets: [],
      scripts: [],
      references: []
    };

    const scanDir = (dirPath, type) => {
      if (fs.existsSync(dirPath)) {
        const items = fs.readdirSync(dirPath);
        resources[type] = items.map(item => ({
          name: item,
          path: path.join(dirPath, item),
          type: fs.statSync(path.join(dirPath, item)).isDirectory() ? 'directory' : 'file'
        }));
      }
    };

    scanDir(path.join(skillPath, 'assets'), 'assets');
    scanDir(path.join(skillPath, 'scripts'), 'scripts');
    scanDir(path.join(skillPath, 'references'), 'references');

    return resources;
  }

  async generateTaskTemplates() {
    console.log('📝 Generating task templates from Claude skills...');

    const templatesGenerated = [];

    for (const [skillName, skillInfo] of this.discoveredSkills) {
      const templateId = this.config.configuration.skill_templates.template_mapping[skillName] || `claude-skill-${skillName}`;

      const templateContent = this.createTaskTemplate(skillInfo, templateId);

      const templatePath = path.join(this.templatesDir, `${templateId}.md`);
      fs.writeFileSync(templatePath, templateContent);

      templatesGenerated.push(templateId);
      console.log(`✅ Generated template: ${templateId}`);
    }

    console.log(`📋 Generated ${templatesGenerated.length} task templates`);
    return templatesGenerated;
  }

  createTaskTemplate(skillInfo, templateId) {
    const capabilities = skillInfo.capabilities.map(cap => `  - ${cap}`).join('\n');
    const useCases = skillInfo.useCases.map(useCase => `  - ${useCase}`).join('\n');

    return `---
template_id: ${templateId}
title: ${skillInfo.title} - Claude Skill Integration
intent: Leverage Claude AI skill for ${skillInfo.name} to enhance development workflow and deliver specialized expertise
input_format: task_description, context_details, skill_parameters
output_format: Claude skill execution results, generated assets, implementation guidance
steps: |
  0. Verify current branch location and create feature branch if necessary: git branch --show-current, create feature/claude-${skillInfo.name.replace(/\s+/g, '-').toLowerCase()} if on dev (MANDATORY - before any work)
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
notes: This template leverages the specialized Claude AI skill "${skillInfo.name}" for enhanced development capabilities. Ensure skill prerequisites are met before execution. CRITICAL - Create feature branch BEFORE any work begins. Never commit directly to dev. Always verify workspace directory location. ALWAYS use PowerShell for terminal commands. RIGHT BEFORE git add: Test skill outputs thoroughly.
learning_tags: [claude-skill, ${skillInfo.name.replace(/\s+/g, '-').toLowerCase()}, automation, ai-enhancement]
changelog:
  - "2025-12-19: Initial Claude skill integration template for ${skillInfo.name}."
---

## Claude Skill: ${skillInfo.title}

**Description:** ${skillInfo.description}

## Available Capabilities

${capabilities}

## Recommended Use Cases

${useCases}

## Skill Resources

${this.formatSkillResources(skillInfo.resources)}

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

When you instantiate this template, also create a per-task metadata file at \`memory-bank/tasks/{task_id}.md\` including:

\`\`\`yaml
task_id: <id>
template_id: ${templateId}
status: todo
lane: ai-enhancement
locks: ["${skillInfo.name.replace(/\s+/g, '-').toLowerCase()}-related-files"]
depends_on: []
branch: feature/claude-${skillInfo.name.replace(/\s+/g, '-').toLowerCase()}
timebox_minutes: 60
\`\`\`
`;
  }

  formatSkillResources(resources) {
    let output = '';

    if (resources.assets && resources.assets.length > 0) {
      output += '### Assets\n';
      resources.assets.forEach(asset => {
        output += `- \`${asset.name}\` (${asset.type})\n`;
      });
      output += '\n';
    }

    if (resources.scripts && resources.scripts.length > 0) {
      output += '### Scripts\n';
      resources.scripts.forEach(script => {
        output += `- \`${script.name}\` (${script.type})\n`;
      });
      output += '\n';
    }

    if (resources.references && resources.references.length > 0) {
      output += '### References\n';
      resources.references.forEach(ref => {
        output += `- \`${ref.name}\` (${ref.type})\n`;
      });
      output += '\n';
    }

    return output || 'No additional resources available.';
  }

  async invokeSkill(skillName, parameters = {}) {
    console.log(`🚀 Invoking Claude skill: ${skillName}`);

    if (!this.discoveredSkills.has(skillName)) {
      throw new Error(`Skill "${skillName}" not found. Run discovery first.`);
    }

    const skillInfo = this.discoveredSkills.get(skillName);

    // Check if skill has an index.js file
    const skillPath = path.join(this.skillsDir, skillName);
    const indexPath = path.join(skillPath, 'index.js');

    if (fs.existsSync(indexPath)) {
      console.log('📄 Executing skill index.js...');
      try {
        const skillModule = require(indexPath);
        if (typeof skillModule.execute === 'function') {
          const result = await skillModule.execute(parameters);
          console.log('✅ Skill executed successfully');
          return result;
        } else {
          console.log('ℹ️  Skill index.js does not export execute function');
        }
      } catch (error) {
        console.error('❌ Error executing skill:', error.message);
        throw error;
      }
    } else {
      console.log('ℹ️  Skill does not have executable index.js, providing manual guidance');
      return this.provideSkillGuidance(skillInfo);
    }
  }

  provideSkillGuidance(skillInfo) {
    return {
      skill: skillInfo.name,
      guidance: {
        description: skillInfo.description,
        capabilities: skillInfo.capabilities,
        useCases: skillInfo.useCases,
        resources: skillInfo.resources,
        manualSteps: [
          'Review SKILL.md for detailed instructions',
          'Check package.json for dependencies',
          'Execute scripts in scripts/ directory as needed',
          'Use assets and references for implementation'
        ]
      }
    };
  }

  async generateSkillReport() {
    console.log('📊 Generating Claude skills report...');

    const report = {
      timestamp: new Date().toISOString(),
      totalSkills: this.discoveredSkills.size,
      skillsByCategory: this.categorizeSkills(),
      skillCapabilities: this.analyzeCapabilities(),
      integrationStatus: 'active'
    };

    const reportPath = path.join(process.cwd(), 'reports', 'claude-skills-report.json');
    const reportsDir = path.dirname(reportPath);

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✅ Report generated: ${reportPath}`);

    return report;
  }

  categorizeSkills() {
    const categories = {};

    for (const [skillName, skillInfo] of this.discoveredSkills) {
      for (const [category, skills] of Object.entries(this.config.configuration.skill_categories)) {
        if (skills.includes(skillName)) {
          if (!categories[category]) categories[category] = [];
          categories[category].push(skillName);
          break;
        }
      }
    }

    return categories;
  }

  analyzeCapabilities() {
    const capabilities = {};

    for (const [skillName, skillInfo] of this.discoveredSkills) {
      capabilities[skillName] = skillInfo.capabilities;
    }

    return capabilities;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    const integrator = new ClaudeSkillsIntegrator();

    if (command === 'discover') {
      integrator.discoverSkills().then(() => {
        console.log('🎯 Discovery complete');
      });
    } else if (command === 'generate-templates') {
      integrator.discoverSkills().then(() => {
        return integrator.generateTaskTemplates();
      }).then(() => {
        console.log('📝 Template generation complete');
      });
    } else if (command === 'invoke') {
      const skillName = args[1];
      if (!skillName) {
        console.log('Usage: node index.js invoke <skill-name>');
        process.exit(1);
      }
      integrator.invokeSkill(skillName).then(result => {
        console.log('🎯 Skill invocation result:', result);
      });
    } else if (command === 'report') {
      integrator.discoverSkills().then(() => {
        return integrator.generateSkillReport();
      }).then(report => {
        console.log('📊 Report generated successfully');
      });
    } else if (command === 'setup') {
      // Run full setup: discover, generate templates, create report
      integrator.discoverSkills().then(() => {
        return integrator.generateTaskTemplates();
      }).then(() => {
        return integrator.generateSkillReport();
      }).then(() => {
        console.log('🎉 Claude Skills Integration setup complete!');
        console.log('');
        console.log('Available commands:');
        console.log('  discover         - Discover available skills');
        console.log('  generate-templates - Create task templates from skills');
        console.log('  invoke <skill>   - Execute a specific skill');
        console.log('  report          - Generate skills usage report');
      });
    } else {
      console.log('Claude Skills Integration CLI');
      console.log('');
      console.log('Commands:');
      console.log('  setup            - Full setup (discover + templates + report)');
      console.log('  discover         - Discover available skills');
      console.log('  generate-templates - Create task templates from skills');
      console.log('  invoke <skill>   - Execute a specific skill');
      console.log('  report          - Generate skills usage report');
      console.log('');
      console.log('Examples:');
      console.log('  node index.js setup');
      console.log('  node index.js invoke frontend-enhancer');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = ClaudeSkillsIntegrator;
