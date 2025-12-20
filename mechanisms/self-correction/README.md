# Self-Correction Learning System

The Self-Correction Learning System is an AI-powered mechanism that continuously learns from mistakes and automatically improves the memory-bank system's behavior, preventing errors from recurring.

## Overview

This system transforms the memory-bank from a static tool into a continuously improving AI assistant that learns from every interaction, identifies patterns of failure, and proactively prevents future issues.

## How It Works

### 1. Continuous Monitoring
The system monitors all memory-bank activities:
- **Command Execution**: Tracks terminal commands and their success/failure
- **Template Instantiation**: Monitors template usage and errors
- **Mechanism Calls**: Watches all mechanism executions
- **User Interactions**: Learns from user feedback and preferences

### 2. Intelligent Analysis
When issues occur, the system performs:
- **Root Cause Analysis**: Identifies why errors happen
- **Pattern Recognition**: Detects recurring problem patterns
- **Impact Assessment**: Evaluates severity and user impact
- **Solution Generation**: Creates automated fixes and prevention rules

### 3. Automated Corrections
Based on analysis confidence, the system:
- **Immediate Fixes**: Applies high-confidence corrections automatically
- **Scheduled Corrections**: Plans fixes for medium-confidence issues
- **Prevention Rules**: Creates rules to prevent future occurrences
- **Learning Updates**: Refines its understanding for better future decisions

## Key Features

### Error Prevention
- **Command Syntax Validation**: Prevents PowerShell/bash syntax errors
- **Path Validation**: Ensures file paths exist before operations
- **Import Validation**: Checks module imports before template generation
- **Type Safety**: Adds TypeScript validation where needed

### Pattern Learning
- **Error Clustering**: Groups similar errors for batch fixes
- **Frequency Analysis**: Identifies most common failure patterns
- **Correlation Detection**: Finds relationships between different error types
- **Trend Analysis**: Tracks error rates over time

### Automated Fixes
- **Code Corrections**: Automatically fixes syntax and import errors
- **Configuration Updates**: Updates settings to prevent issues
- **Template Improvements**: Enhances templates based on usage patterns
- **Mechanism Optimization**: Improves mechanism performance and reliability

## Usage

### Basic Commands

```bash
# Run learning analysis
node memory-bank/mechanisms/self-correction/index.js analyze

# Start continuous monitoring
node memory-bank/mechanisms/self-correction/index.js monitor

# Manually trigger learning from activity
node memory-bank/mechanisms/self-correction/index.js learn command_execution '{"command":"ls","exitCode":0,"success":true}'
```

### Integration Hooks

The system automatically integrates with all memory-bank activities:

```javascript
const hooks = require('./memory-bank/mechanisms/self-correction/hooks');

// Monitor command execution
const result = await hooks.onCommandExecute('npm install', { context: 'dependency_update' });
await hooks.onCommandComplete('npm install', 0, output, null, startTime, context);

// Monitor template usage
const templateResult = await hooks.onTemplateInstantiate('react-component-generator', params);
await hooks.onTemplateComplete('react-component-generator', true, [], output, startTime, params);

// Monitor mechanism calls
const mechanismResult = await hooks.onMechanismExecute('react-build-automation', 'optimize');
await hooks.onMechanismComplete('react-build-automation', 'optimize', true, [], output, startTime);
```

## Learning Data Structure

The system maintains several data stores:

### Error Patterns Database (`patterns.json`)
```json
{
  "command_errors": {
    "powershell_chaining": {
      "count": 5,
      "firstSeen": "2025-12-19T10:00:00.000Z",
      "lastSeen": "2025-12-19T15:30:00.000Z",
      "patterns": ["PowerShell chaining syntax error"],
      "fixes": ["Use semicolon (;) for PowerShell command chaining"]
    }
  }
}
```

### Error History (`errors.json`)
```json
{
  "history": [
    {
      "type": "command_execution",
      "timestamp": "2025-12-19T15:30:00.000Z",
      "data": {
        "command": "npm install && npm run build",
        "exitCode": 1,
        "error": "Invalid command syntax",
        "success": false
      }
    }
  ],
  "corrections": {
    "applied": [],
    "scheduled": [],
    "issues": []
  }
}
```

## Correction Types

### 1. Command Syntax Fixes
**Problem**: PowerShell/bash syntax errors in terminal commands
**Solution**: Automatically converts bash-style commands to PowerShell syntax
**Example**: `npm install && npm run build` → `npm install; npm run build`

### 2. Path Validation
**Problem**: Operations on non-existent files/directories
**Solution**: Adds path existence checks before file operations
**Example**: Validates paths before `fs.readFileSync()` calls

### 3. Import Corrections
**Problem**: Incorrect module import paths in templates
**Solution**: Updates import statements to correct paths
**Example**: Fixes `@/lib/utils` imports based on project structure

### 4. Configuration Fixes
**Problem**: Invalid or missing configuration settings
**Solution**: Automatically corrects configuration files
**Example**: Adds missing mechanism settings to `config.json`

### 5. TypeScript Validation
**Problem**: TypeScript compilation errors
**Solution**: Adds type validation and fixes type issues
**Example**: Adds proper type annotations and imports

## Prevention Rules

The system generates prevention rules to avoid future issues:

```json
{
  "rule_1734600000000_abc123": {
    "trigger": "command_execution",
    "condition": "PowerShell chaining syntax error",
    "action": "prevent",
    "confidence": 0.95,
    "created": "2025-12-19T10:00:00.000Z",
    "effectiveness": 0.85
  }
}
```

## Backup & Rollback System

All corrections include automatic backup creation:

```
memory-bank/backups/
├── correction_command_syntax_fix_2025-12-19T10-00-00/
│   ├── modified-file.js.backup.2025-12-19T10-00-00
│   └── correction-metadata.json
└── correction_template_import_fix_2025-12-19T10-15-00/
    ├── template-file.tsx.backup.2025-12-19T10-15-00
    └── correction-metadata.json
```

## Configuration Options

```json
{
  "self-correction": {
    "enabled": true,
    "continuous_learning": true,
    "automated_corrections": true,
    "pattern_recognition": true,
    "error_prevention": true,
    "rollback_capability": true
  }
}
```

## Safety Measures

### Validation Checks
- **Pre-correction Validation**: Ensures corrections won't break existing functionality
- **Confidence Thresholds**: Only applies corrections above confidence thresholds
- **User Approval**: High-impact changes require user confirmation
- **Rollback Capability**: All corrections can be automatically reverted

### Ethical Considerations
- **Privacy Protection**: Learning data is anonymized and local-only
- **Bias Detection**: Monitors for patterns that might create biased corrections
- **Transparency**: All corrections are logged with reasoning
- **User Control**: Users can disable automated corrections anytime

## Performance Metrics

The system tracks its own performance:

- **Correction Success Rate**: Percentage of applied corrections that resolve issues
- **False Positive Rate**: Corrections that create new problems
- **Learning Effectiveness**: How well the system prevents future errors
- **User Satisfaction**: Feedback on correction quality and usefulness

## Future Enhancements

### Advanced Features
- **Predictive Corrections**: Anticipate issues before they occur
- **Cross-System Learning**: Share learnings across different projects
- **Collaborative Intelligence**: Learn from multiple users' experiences
- **Context-Aware Corrections**: Adapt corrections based on project context

### Integration Points
- **IDE Integration**: Real-time error prevention in code editors
- **CI/CD Integration**: Apply corrections during automated builds
- **Team Learning**: Aggregate learnings across development teams
- **External Tool Integration**: Connect with linters, formatters, and other tools

## Troubleshooting

### Common Issues

**Corrections not applying:**
- Check confidence thresholds in configuration
- Verify file permissions for modifications
- Ensure backup directory is writable

**False corrections:**
- Lower confidence thresholds
- Disable automated corrections temporarily
- Review correction logs for patterns

**Performance impact:**
- Reduce monitoring frequency
- Disable non-essential learning features
- Clean up old learning data

### Recovery Procedures

**Disable automated corrections:**
```bash
# Temporarily disable
const hooks = require('./memory-bank/mechanisms/self-correction/hooks');
hooks.disable();
```

**Manual rollback:**
```bash
# Rollback specific correction
node memory-bank/mechanisms/self-correction/correction-applicator.js rollback correction_id
```

**Reset learning data:**
```bash
# Clear all learned patterns
rm memory-bank/learning-data/patterns.json
rm memory-bank/learning-data/errors.json
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Activities    │───▶│  Self-Correction │───▶│   Corrections   │
│   (Commands,    │    │     Engine       │    │   (Automated    │
│    Templates,   │    │                  │    │    Fixes)       │
│   Mechanisms)   │    │  ┌─────────────┐ │    │                 │
└─────────────────┘    │  │  Pattern     │ │    └─────────────────┘
                       │  │ Recognition  │ │
┌─────────────────┐    │  │             │ │    ┌─────────────────┐
│   User Feedback │───▶│  │ Root Cause   │ │───▶│ Prevention     │
│   & Monitoring  │    │  │ Analysis     │ │    │ Rules          │
└─────────────────┘    │  └─────────────┘ │    └─────────────────┘
                       │                  │
                       │  ┌─────────────┐ │
                       │  │ Learning     │ │
                       │  │ Database     │ │
                       │  └─────────────┘ │
                       └──────────────────┘
```

This architecture ensures the system continuously improves while maintaining safety and reliability.

## Contributing

To enhance the self-correction system:

1. **Add New Correction Types**: Extend `CorrectionApplicator` with new fix methods
2. **Improve Pattern Recognition**: Enhance analysis algorithms in the learning system
3. **Add Safety Checks**: Implement additional validation for high-risk corrections
4. **Expand Monitoring**: Add new activity types and monitoring hooks

## Conclusion

The Self-Correction Learning System transforms the memory-bank from a static tool into a continuously evolving AI assistant that gets smarter with every use, preventing mistakes before they happen and automatically improving system reliability and user experience.
