#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SelfCorrectionLearningSystem {
  constructor() {
    this.config = require('./config.json');
    this.memoryBankPath = path.resolve('memory-bank');
    this.learningDataPath = path.join(this.memoryBankPath, 'learning-data');
    this.correctionLogPath = path.join(this.learningDataPath, 'corrections.log');
    this.patternDatabasePath = path.join(this.learningDataPath, 'patterns.json');
    this.errorDatabasePath = path.join(this.learningDataPath, 'errors.json');

    this.initializeDataStructures();
    this.loadExistingData();
  }

  initializeDataStructures() {
    // Create learning data directory
    if (!fs.existsSync(this.learningDataPath)) {
      fs.mkdirSync(this.learningDataPath, { recursive: true });
    }

    // Initialize databases if they don't exist
    if (!fs.existsSync(this.patternDatabasePath)) {
      this.patterns = {
        command_errors: {},
        template_failures: {},
        mechanism_issues: {},
        configuration_errors: {},
        user_feedback: {},
        performance_regressions: {}
      };
      this.savePatterns();
    }

    if (!fs.existsSync(this.errorDatabasePath)) {
      this.errors = {
        history: [],
        patterns: {},
        corrections: {},
        prevention_rules: {}
      };
      this.saveErrors();
    }

    // Initialize correction log
    if (!fs.existsSync(this.correctionLogPath)) {
      fs.writeFileSync(this.correctionLogPath, '# Self-Correction Learning Log\n\n');
    }
  }

  loadExistingData() {
    try {
      if (fs.existsSync(this.patternDatabasePath)) {
        this.patterns = JSON.parse(fs.readFileSync(this.patternDatabasePath, 'utf8'));
      }

      if (fs.existsSync(this.errorDatabasePath)) {
        this.errors = JSON.parse(fs.readFileSync(this.errorDatabasePath, 'utf8'));
      }
    } catch (error) {
      console.error('❌ Error loading learning data:', error.message);
      this.initializeDataStructures();
    }
  }

  savePatterns() {
    fs.writeFileSync(this.patternDatabasePath, JSON.stringify(this.patterns, null, 2));
  }

  saveErrors() {
    fs.writeFileSync(this.errorDatabasePath, JSON.stringify(this.errors, null, 2));
  }

  logCorrection(action, details, confidence = 0.8) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} | ${action} | Confidence: ${(confidence * 100).toFixed(1)}% | ${details}\n`;

    fs.appendFileSync(this.correctionLogPath, logEntry);
    console.log(`📝 Correction logged: ${action}`);
  }

  // Core monitoring function - call this for all activities
  async monitorActivity(activityType, activityData) {
    if (!this.config.configuration.monitoring_scope.all_commands &&
        !this.config.configuration.monitoring_scope.all_mechanisms &&
        !this.config.configuration.monitoring_scope.all_templates) {
      return;
    }

    const activity = {
      type: activityType,
      timestamp: new Date().toISOString(),
      data: activityData,
      session_id: this.generateSessionId(),
      success: activityData.success !== false
    };

    // Analyze activity for issues
    const analysis = await this.analyzeActivity(activity);

    if (analysis.hasIssues) {
      console.log(`⚠️  Issue detected in ${activityType}: ${analysis.description}`);
      await this.handleIssue(activity, analysis);
    }

    // Learn from successful activities too
    if (activity.success) {
      await this.learnFromSuccess(activity);
    }

    // Store activity for pattern analysis
    this.storeActivity(activity);
  }

  async analyzeActivity(activity) {
    const analysis = {
      hasIssues: false,
      description: '',
      severity: 'low',
      rootCause: '',
      suggestedFixes: [],
      confidence: 0.5
    };

    // Command analysis
    if (activity.type === 'command_execution') {
      const commandAnalysis = await this.analyzeCommand(activity);
      if (commandAnalysis.hasIssues) {
        analysis.hasIssues = true;
        analysis.description = commandAnalysis.description;
        analysis.severity = commandAnalysis.severity;
        analysis.rootCause = commandAnalysis.rootCause;
        analysis.suggestedFixes = commandAnalysis.suggestedFixes;
        analysis.confidence = commandAnalysis.confidence;
      }
    }

    // Template analysis
    if (activity.type === 'template_instantiation') {
      const templateAnalysis = await this.analyzeTemplate(activity);
      if (templateAnalysis.hasIssues) {
        analysis.hasIssues = true;
        analysis.description = templateAnalysis.description;
        analysis.severity = templateAnalysis.severity;
        analysis.rootCause = templateAnalysis.rootCause;
        analysis.suggestedFixes = templateAnalysis.suggestedFixes;
        analysis.confidence = templateAnalysis.confidence;
      }
    }

    // Mechanism analysis
    if (activity.type === 'mechanism_execution') {
      const mechanismAnalysis = await this.analyzeMechanism(activity);
      if (mechanismAnalysis.hasIssues) {
        analysis.hasIssues = true;
        analysis.description = mechanismAnalysis.description;
        analysis.severity = mechanismAnalysis.severity;
        analysis.rootCause = mechanismAnalysis.rootCause;
        analysis.suggestedFixes = mechanismAnalysis.suggestedFixes;
        analysis.confidence = mechanismAnalysis.confidence;
      }
    }

    return analysis;
  }

  async analyzeCommand(activity) {
    const analysis = {
      hasIssues: false,
      description: '',
      severity: 'low',
      rootCause: '',
      suggestedFixes: [],
      confidence: 0.5
    };

    const command = activity.data.command;
    const exitCode = activity.data.exitCode;
    const error = activity.data.error;

    // Check for command failures
    if (exitCode !== 0 || error) {
      analysis.hasIssues = true;
      analysis.severity = 'medium';

      // Analyze error patterns
      if (error && error.message) {
        // PowerShell syntax errors
        if (error.message.includes('&&') && error.message.includes('is not a valid statement separator')) {
          analysis.description = 'PowerShell chaining syntax error detected';
          analysis.rootCause = 'Used bash-style command chaining (&&) in PowerShell';
          analysis.suggestedFixes = [
            'Use PowerShell semicolon (;) for command chaining',
            'Use separate execSync calls for complex commands',
            'Add PowerShell syntax validation before execution'
          ];
          analysis.confidence = 0.95;
        }

        // Path issues
        else if (error.message.includes('Cannot find path') || error.message.includes('does not exist')) {
          analysis.description = 'File or directory path error';
          analysis.rootCause = 'Incorrect path construction or missing files/directories';
          analysis.suggestedFixes = [
            'Verify path construction logic',
            'Add path existence checks before operations',
            'Use path.resolve() for cross-platform compatibility'
          ];
          analysis.confidence = 0.85;
        }

        // Permission issues
        else if (error.message.includes('Access denied') || error.message.includes('Permission denied')) {
          analysis.description = 'File system permission error';
          analysis.rootCause = 'Insufficient permissions for file operations';
          analysis.suggestedFixes = [
            'Check file permissions before operations',
            'Use appropriate user permissions',
            'Add permission validation checks'
          ];
          analysis.confidence = 0.9;
        }
      }

      // Check for known problematic commands
      if (command.includes('rm -rf') && !command.includes('safety_check')) {
        analysis.description = 'Potentially dangerous rm -rf command';
        analysis.rootCause = 'Recursive deletion without safety checks';
        analysis.suggestedFixes = [
          'Add confirmation prompts for destructive operations',
          'Implement file backup before deletion',
          'Add safety validation checks'
        ];
        analysis.confidence = 0.95;
      }
    }

    // Learn from this analysis
    if (analysis.hasIssues) {
      this.updateErrorPatterns('command_errors', command, analysis);
    }

    return analysis;
  }

  async analyzeTemplate(activity) {
    const analysis = {
      hasIssues: false,
      description: '',
      severity: 'low',
      rootCause: '',
      suggestedFixes: [],
      confidence: 0.5
    };

    const templateId = activity.data.templateId;
    const instantiationTime = activity.data.duration;
    const errors = activity.data.errors;

    // Check for instantiation errors
    if (errors && errors.length > 0) {
      analysis.hasIssues = true;
      analysis.severity = 'high';

      // Analyze error types
      const errorMessages = errors.join(' ');

      if (errorMessages.includes('Cannot find module') || errorMessages.includes('Module not found')) {
        analysis.description = 'Template dependency error';
        analysis.rootCause = 'Missing or incorrect module imports in template';
        analysis.suggestedFixes = [
          'Verify all imports exist and are correct',
          'Add dependency validation to template instantiation',
          'Update template import paths'
        ];
        analysis.confidence = 0.9;
      }

      else if (errorMessages.includes('TypeScript error') || errorMessages.includes('TS')) {
        analysis.description = 'TypeScript compilation error in template';
        analysis.rootCause = 'Type errors in generated template code';
        analysis.suggestedFixes = [
          'Fix TypeScript types in template',
          'Add TypeScript validation before template generation',
          'Update template type definitions'
        ];
        analysis.confidence = 0.85;
      }
    }

    // Check for performance issues
    if (instantiationTime > 30000) { // 30 seconds
      analysis.hasIssues = true;
      analysis.severity = 'medium';
      analysis.description = 'Template instantiation performance issue';
      analysis.rootCause = 'Template generation taking too long';
      analysis.suggestedFixes = [
        'Optimize template generation logic',
        'Cache frequently used template parts',
        'Add performance monitoring to templates'
      ];
      analysis.confidence = 0.8;
    }

    // Learn from this analysis
    if (analysis.hasIssues) {
      this.updateErrorPatterns('template_failures', templateId, analysis);
    }

    return analysis;
  }

  async analyzeMechanism(activity) {
    const analysis = {
      hasIssues: false,
      description: '',
      severity: 'low',
      rootCause: '',
      suggestedFixes: [],
      confidence: 0.5
    };

    const mechanismId = activity.data.mechanismId;
    const executionTime = activity.data.duration;
    const errors = activity.data.errors;
    const output = activity.data.output;

    // Check for mechanism errors
    if (errors && errors.length > 0) {
      analysis.hasIssues = true;
      analysis.severity = 'high';

      const errorText = errors.join(' ');

      if (errorText.includes('ENOENT') || errorText.includes('file not found')) {
        analysis.description = 'Mechanism file access error';
        analysis.rootCause = 'Missing or inaccessible mechanism files';
        analysis.suggestedFixes = [
          'Verify mechanism files exist',
          'Check file permissions',
          'Update mechanism file paths'
        ];
        analysis.confidence = 0.9;
      }

      else if (errorText.includes('JSON.parse') || errorText.includes('Unexpected token')) {
        analysis.description = 'Mechanism configuration error';
        analysis.rootCause = 'Invalid JSON in mechanism config files';
        analysis.suggestedFixes = [
          'Validate JSON syntax in config files',
          'Add JSON validation before loading configs',
          'Use JSON schema validation for configs'
        ];
        analysis.confidence = 0.95;
      }
    }

    // Check for performance issues
    if (executionTime > 60000) { // 1 minute
      analysis.hasIssues = true;
      analysis.severity = 'medium';
      analysis.description = 'Mechanism performance issue';
      analysis.rootCause = 'Mechanism execution taking too long';
      analysis.suggestedFixes = [
        'Optimize mechanism algorithms',
        'Add caching to expensive operations',
        'Implement progress indicators for long operations'
      ];
      analysis.confidence = 0.8;
    }

    // Check for empty or invalid output
    if (!output || (Array.isArray(output) && output.length === 0)) {
      analysis.hasIssues = true;
      analysis.severity = 'low';
      analysis.description = 'Mechanism produced no output';
      analysis.rootCause = 'Mechanism logic issue or empty result set';
      analysis.suggestedFixes = [
        'Add output validation to mechanisms',
        'Improve error handling and logging',
        'Add fallback behaviors for empty results'
      ];
      analysis.confidence = 0.7;
    }

    // Learn from this analysis
    if (analysis.hasIssues) {
      this.updateErrorPatterns('mechanism_issues', mechanismId, analysis);
    }

    return analysis;
  }

  async handleIssue(activity, analysis) {
    console.log(`🔧 Handling issue: ${analysis.description}`);

    // Log the issue
    this.logIssue(activity, analysis);

    // Apply corrections based on confidence and severity
    if (analysis.confidence >= 0.8) {
      if (analysis.severity === 'high') {
        await this.applyImmediateCorrection(activity, analysis);
      } else if (analysis.severity === 'medium') {
        await this.scheduleCorrection(activity, analysis);
      }
    }

    // Generate prevention rules
    await this.generatePreventionRules(activity, analysis);

    // Update learning patterns
    this.updateLearningPatterns(activity, analysis);
  }

  async applyImmediateCorrection(activity, analysis) {
    console.log(`🚨 Applying immediate correction for high-severity issue`);

    // Apply fixes based on the issue type
    if (activity.type === 'command_execution') {
      await this.fixCommandIssue(activity, analysis);
    } else if (activity.type === 'template_instantiation') {
      await this.fixTemplateIssue(activity, analysis);
    } else if (activity.type === 'mechanism_execution') {
      await this.fixMechanismIssue(activity, analysis);
    }

    this.logCorrection('immediate_fix', `Applied correction for ${analysis.description}`, analysis.confidence);
  }

  async scheduleCorrection(activity, analysis) {
    console.log(`📅 Scheduling correction for medium-severity issue`);

    // Create a scheduled task for later correction
    const correctionTask = {
      id: this.generateTaskId(),
      type: 'scheduled_correction',
      activity: activity,
      analysis: analysis,
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours later
      status: 'pending'
    };

    // Store scheduled correction
    this.storeScheduledCorrection(correctionTask);

    this.logCorrection('scheduled_fix', `Scheduled correction for ${analysis.description}`, analysis.confidence);
  }

  async fixCommandIssue(activity, analysis) {
    // Apply fixes based on the specific command issue

    if (analysis.rootCause.includes('PowerShell chaining syntax')) {
      // Update command execution logic to use proper PowerShell syntax
      await this.updateCommandValidation('powershell_chaining', {
        pattern: /&&/,
        replacement: ';',
        validation: 'powershell_syntax_check'
      });
    }

    else if (analysis.rootCause.includes('path construction')) {
      // Add path validation
      await this.addPathValidation(activity.data.command);
    }

    else if (analysis.rootCause.includes('permissions')) {
      // Add permission checks
      await this.addPermissionChecks(activity.data.command);
    }
  }

  async fixTemplateIssue(activity, analysis) {
    const templateId = activity.data.templateId;

    if (analysis.rootCause.includes('module imports')) {
      // Fix import paths in template
      await this.fixTemplateImports(templateId);
    }

    else if (analysis.rootCause.includes('TypeScript')) {
      // Add TypeScript validation to template
      await this.addTypeScriptValidation(templateId);
    }
  }

  async fixMechanismIssue(activity, analysis) {
    const mechanismId = activity.data.mechanismId;

    if (analysis.rootCause.includes('file access')) {
      // Fix file paths in mechanism
      await this.fixMechanismFilePaths(mechanismId);
    }

    else if (analysis.rootCause.includes('JSON')) {
      // Add JSON validation to mechanism
      await this.addJsonValidation(mechanismId);
    }
  }

  async generatePreventionRules(activity, analysis) {
    // Generate rules to prevent this issue from happening again

    const preventionRule = {
      id: this.generateRuleId(),
      trigger: activity.type,
      condition: analysis.rootCause,
      action: 'prevent',
      confidence: analysis.confidence,
      created: new Date().toISOString(),
      effectiveness: 0 // Will be updated based on success
    };

    // Store prevention rule
    this.errors.prevention_rules[preventionRule.id] = preventionRule;

    // Apply prevention rule immediately if possible
    await this.applyPreventionRule(preventionRule);

    this.saveErrors();
    this.logCorrection('prevention_rule', `Generated prevention rule for ${analysis.description}`, analysis.confidence);
  }

  updateErrorPatterns(errorType, key, analysis) {
    if (!this.patterns[errorType][key]) {
      this.patterns[errorType][key] = {
        count: 0,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        patterns: [],
        fixes: []
      };
    }

    const pattern = this.patterns[errorType][key];
    pattern.count++;
    pattern.lastSeen = new Date().toISOString();

    // Add pattern if not already present
    const patternKey = analysis.rootCause;
    if (!pattern.patterns.includes(patternKey)) {
      pattern.patterns.push(patternKey);
    }

    // Add suggested fixes
    analysis.suggestedFixes.forEach(fix => {
      if (!pattern.fixes.includes(fix)) {
        pattern.fixes.push(fix);
      }
    });

    this.savePatterns();
  }

  updateLearningPatterns(activity, analysis) {
    // Update broader learning patterns for continuous improvement

    const learningKey = `${activity.type}_${analysis.rootCause.replace(/\s+/g, '_')}`;

    if (!this.errors.patterns[learningKey]) {
      this.errors.patterns[learningKey] = {
        occurrences: 0,
        confidence: analysis.confidence,
        fixes: analysis.suggestedFixes,
        lastUpdated: new Date().toISOString()
      };
    }

    this.errors.patterns[learningKey].occurrences++;
    this.errors.patterns[learningKey].lastUpdated = new Date().toISOString();

    this.saveErrors();
  }

  async learnFromSuccess(activity) {
    // Learn from successful activities to reinforce good patterns

    const successPattern = {
      type: activity.type,
      command: activity.data.command,
      duration: activity.data.duration,
      timestamp: activity.timestamp,
      factors: this.analyzeSuccessFactors(activity)
    };

    // Store successful patterns for future reference
    if (!this.errors.patterns.success_patterns) {
      this.errors.patterns.success_patterns = [];
    }

    this.errors.patterns.success_patterns.push(successPattern);

    // Keep only recent successful patterns
    if (this.errors.patterns.success_patterns.length > 100) {
      this.errors.patterns.success_patterns = this.errors.patterns.success_patterns.slice(-50);
    }

    this.saveErrors();
  }

  analyzeSuccessFactors(activity) {
    const factors = [];

    // Analyze what made this activity successful
    if (activity.data.command) {
      if (activity.data.command.includes('cd') && activity.data.command.includes('.')) {
        factors.push('used_relative_paths');
      }
      if (activity.data.command.includes('&&')) {
        factors.push('bash_chaining_worked');
      }
    }

    return factors;
  }

  storeActivity(activity) {
    this.errors.history.push(activity);

    // Keep only recent activities (last 1000)
    if (this.errors.history.length > 1000) {
      this.errors.history = this.errors.history.slice(-500);
    }

    this.saveErrors();
  }

  storeScheduledCorrection(correction) {
    if (!this.errors.corrections.scheduled) {
      this.errors.corrections.scheduled = [];
    }

    this.errors.corrections.scheduled.push(correction);
    this.saveErrors();
  }

  logIssue(activity, analysis) {
    const issueLog = {
      timestamp: new Date().toISOString(),
      activity: activity,
      analysis: analysis,
      status: 'logged'
    };

    if (!this.errors.corrections.issues) {
      this.errors.corrections.issues = [];
    }

    this.errors.corrections.issues.push(issueLog);
    this.saveErrors();
  }

  // Utility methods
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateRuleId() {
    return `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Placeholder methods for specific fixes (to be implemented)
  async updateCommandValidation(type, config) {
    console.log(`📝 Would update command validation for ${type}`);
  }

  async addPathValidation(command) {
    console.log(`📝 Would add path validation for command: ${command}`);
  }

  async addPermissionChecks(command) {
    console.log(`📝 Would add permission checks for command: ${command}`);
  }

  async fixTemplateImports(templateId) {
    console.log(`📝 Would fix imports in template: ${templateId}`);
  }

  async addTypeScriptValidation(templateId) {
    console.log(`📝 Would add TypeScript validation to template: ${templateId}`);
  }

  async fixMechanismFilePaths(mechanismId) {
    console.log(`📝 Would fix file paths in mechanism: ${mechanismId}`);
  }

  async addJsonValidation(mechanismId) {
    console.log(`📝 Would add JSON validation to mechanism: ${mechanismId}`);
  }

  async applyPreventionRule(rule) {
    console.log(`📝 Would apply prevention rule: ${rule.id}`);
  }

  // CLI interface
  async runAnalysis() {
    console.log('🧠 Self-Correction Learning System Analysis');
    console.log('==========================================');

    console.log(`📊 Total activities tracked: ${this.errors.history.length}`);

    // Analyze patterns
    const commandErrors = Object.keys(this.patterns.command_errors).length;
    const templateFailures = Object.keys(this.patterns.template_failures).length;
    const mechanismIssues = Object.keys(this.patterns.mechanism_issues).length;

    console.log(`❌ Command errors: ${commandErrors}`);
    console.log(`❌ Template failures: ${templateFailures}`);
    console.log(`❌ Mechanism issues: ${mechanismIssues}`);

    // Show top error patterns
    console.log('\n🔍 Top Error Patterns:');
    const allPatterns = { ...this.patterns.command_errors, ...this.patterns.template_failures, ...this.patterns.mechanism_issues };
    const sortedPatterns = Object.entries(allPatterns)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5);

    sortedPatterns.forEach(([key, data], index) => {
      console.log(`${index + 1}. ${key}: ${data.count} occurrences`);
      if (data.patterns && data.patterns.length > 0) {
        console.log(`   Primary cause: ${data.patterns[0]}`);
      }
    });

    console.log('\n✅ Corrections Applied:');
    const corrections = this.errors.corrections.issues || [];
    console.log(`   Total issues handled: ${corrections.length}`);

    const preventionRules = Object.keys(this.errors.prevention_rules || {}).length;
    console.log(`   Prevention rules created: ${preventionRules}`);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const learningSystem = new SelfCorrectionLearningSystem();

  if (command === 'analyze') {
    learningSystem.runAnalysis().then(() => {
      console.log('\n🎯 Analysis complete!');
    });
  } else if (command === 'monitor') {
    // Start monitoring mode (would run continuously)
    console.log('👁️  Self-correction monitoring started...');
    console.log('Press Ctrl+C to stop');

    // In a real implementation, this would set up continuous monitoring
    // For now, just show that it's ready
    setInterval(() => {
      // Check for scheduled corrections
      const scheduled = learningSystem.errors.corrections?.scheduled || [];
      const dueCorrections = scheduled.filter(correction =>
        new Date(correction.scheduledFor) <= new Date()
      );

      if (dueCorrections.length > 0) {
        console.log(`⏰ ${dueCorrections.length} scheduled corrections due for execution`);
      }
    }, 60000); // Check every minute
  } else if (command === 'learn') {
    const activityType = args[1];
    const activityData = JSON.parse(args[2] || '{}');

    learningSystem.monitorActivity(activityType, activityData).then(() => {
      console.log('✅ Activity monitored and learned from');
    }).catch(error => {
      console.error('❌ Learning failed:', error.message);
    });
  } else {
    console.log('🤖 Self-Correction Learning System');
    console.log('');
    console.log('Commands:');
    console.log('  analyze          - Run learning analysis and show insights');
    console.log('  monitor          - Start continuous monitoring mode');
    console.log('  learn <type> <data> - Manually trigger learning from activity');
    console.log('');
    console.log('Examples:');
    console.log('  node index.js analyze');
    console.log('  node index.js learn command_execution \'{"command":"ls","exitCode":0,"success":true}\'');
    console.log('');
    process.exit(1);
  }
}

module.exports = SelfCorrectionLearningSystem;
