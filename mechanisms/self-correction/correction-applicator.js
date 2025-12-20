// Self-Correction Applicator
// Automatically applies corrections based on learned patterns

const fs = require('fs');
const path = require('path');

class CorrectionApplicator {
  constructor(learningSystem) {
    this.learningSystem = learningSystem;
    this.backupDir = path.join(process.cwd(), 'memory-bank', 'backups');
    this.ensureBackupDir();
  }

  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async applyCorrection(correctionType, correctionData) {
    console.log(`🔧 Applying correction: ${correctionType}`);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupId = `correction_${correctionType}_${timestamp}`;

    try {
      // Create backup before applying correction
      await this.createBackup(backupId, correctionData);

      // Apply the specific correction
      switch (correctionType) {
        case 'command_syntax_fix':
          await this.fixCommandSyntax(correctionData);
          break;
        case 'path_validation_add':
          await this.addPathValidation(correctionData);
          break;
        case 'template_import_fix':
          await this.fixTemplateImports(correctionData);
          break;
        case 'mechanism_config_fix':
          await this.fixMechanismConfig(correctionData);
          break;
        case 'typescript_validation_add':
          await this.addTypeScriptValidation(correctionData);
          break;
        default:
          console.log(`⚠️  Unknown correction type: ${correctionType}`);
          return false;
      }

      console.log(`✅ Correction applied successfully: ${correctionType}`);
      this.learningSystem.logCorrection('applied_fix', `Successfully applied ${correctionType} correction`, 0.9);

      return true;
    } catch (error) {
      console.error(`❌ Correction failed: ${error.message}`);

      // Attempt rollback
      await this.rollbackCorrection(backupId);

      this.learningSystem.logCorrection('correction_failed', `Failed to apply ${correctionType}: ${error.message}`, 0.1);

      return false;
    }
  }

  async createBackup(backupId, correctionData) {
    const backupPath = path.join(this.backupDir, backupId);

    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    // Backup files that will be modified
    if (correctionData.filesToModify) {
      for (const filePath of correctionData.filesToModify) {
        if (fs.existsSync(filePath)) {
          const fileName = path.basename(filePath);
          const backupFilePath = path.join(backupPath, fileName);

          // Create backup with timestamp
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const backupFileName = `${fileName}.backup.${timestamp}`;
          const timestampedBackupPath = path.join(backupPath, backupFileName);

          fs.copyFileSync(filePath, timestampedBackupPath);
        }
      }
    }

    // Store correction metadata
    const metadata = {
      backupId,
      timestamp: new Date().toISOString(),
      correctionData,
      status: 'created'
    };

    fs.writeFileSync(
      path.join(backupPath, 'correction-metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
  }

  async rollbackCorrection(backupId) {
    console.log(`🔄 Rolling back correction: ${backupId}`);

    const backupPath = path.join(this.backupDir, backupId);
    const metadataPath = path.join(backupPath, 'correction-metadata.json');

    if (!fs.existsSync(metadataPath)) {
      console.error(`❌ Cannot rollback: backup metadata not found for ${backupId}`);
      return false;
    }

    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

      // Restore files from backup
      if (metadata.correctionData.filesToModify) {
        for (const filePath of metadata.correctionData.filesToModify) {
          const fileName = path.basename(filePath);

          // Find the most recent backup
          const backupFiles = fs.readdirSync(backupPath)
            .filter(file => file.startsWith(`${fileName}.backup.`))
            .sort()
            .reverse();

          if (backupFiles.length > 0) {
            const latestBackup = path.join(backupPath, backupFiles[0]);
            fs.copyFileSync(latestBackup, filePath);
            console.log(`✅ Restored: ${fileName}`);
          }
        }
      }

      // Mark backup as rolled back
      metadata.status = 'rolled_back';
      metadata.rollbackTime = new Date().toISOString();
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`✅ Rollback completed for ${backupId}`);
      return true;
    } catch (error) {
      console.error(`❌ Rollback failed: ${error.message}`);
      return false;
    }
  }

  async fixCommandSyntax(correctionData) {
    const { filePath, lineNumber, originalCommand, correctedCommand } = correctionData;

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    if (lineNumber >= lines.length) {
      throw new Error(`Line number ${lineNumber} is beyond file length`);
    }

    // Replace the problematic command
    lines[lineNumber] = lines[lineNumber].replace(originalCommand, correctedCommand);
    content = lines.join('\n');

    fs.writeFileSync(filePath, content);

    console.log(`✅ Fixed command syntax in ${filePath}:${lineNumber + 1}`);
  }

  async addPathValidation(correctionData) {
    const { filePath, functionName, validationCode } = correctionData;

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Find the function and add path validation
    const functionRegex = new RegExp(`(function ${functionName}|const ${functionName}|${functionName}\\s*=)`, 'g');
    const functionMatch = content.match(functionRegex);

    if (functionMatch) {
      // Add validation at the beginning of the function
      const validationInsertion = `\n  // Path validation added by self-correction system\n  ${validationCode}\n`;

      // Insert after function declaration
      const insertIndex = content.indexOf(functionMatch[0]) + functionMatch[0].length;
      content = content.slice(0, insertIndex) + validationInsertion + content.slice(insertIndex);

      fs.writeFileSync(filePath, content);
      console.log(`✅ Added path validation to ${functionName} in ${filePath}`);
    } else {
      throw new Error(`Function ${functionName} not found in ${filePath}`);
    }
  }

  async fixTemplateImports(correctionData) {
    const { templatePath, incorrectImport, correctImport } = correctionData;

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    let content = fs.readFileSync(templatePath, 'utf8');

    // Replace incorrect import with correct one
    content = content.replace(incorrectImport, correctImport);

    fs.writeFileSync(templatePath, content);
    console.log(`✅ Fixed template import in ${templatePath}`);
  }

  async fixMechanismConfig(correctionData) {
    const { configPath, configKey, incorrectValue, correctValue } = correctionData;

    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }

    let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Navigate to the config key and update value
    const keys = configKey.split('.');
    let current = config;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = correctValue;

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✅ Fixed mechanism config ${configKey} in ${configPath}`);
  }

  async addTypeScriptValidation(correctionData) {
    const { filePath, validationCode, insertLocation } = correctionData;

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Add TypeScript validation at the specified location
    if (insertLocation === 'top') {
      content = validationCode + '\n' + content;
    } else if (insertLocation === 'before_export') {
      // Insert before the first export
      const exportIndex = content.indexOf('export');
      if (exportIndex !== -1) {
        content = content.slice(0, exportIndex) + validationCode + '\n' + content.slice(exportIndex);
      }
    }

    fs.writeFileSync(filePath, content);
    console.log(`✅ Added TypeScript validation to ${filePath}`);
  }

  // Utility method to validate corrections before applying
  async validateCorrection(correctionType, correctionData) {
    console.log(`🔍 Validating correction: ${correctionType}`);

    try {
      // Check if all required files exist
      if (correctionData.filesToModify) {
        for (const filePath of correctionData.filesToModify) {
          if (!fs.existsSync(filePath)) {
            throw new Error(`Required file does not exist: ${filePath}`);
          }
        }
      }

      // Type-specific validation
      switch (correctionType) {
        case 'command_syntax_fix':
          if (!correctionData.filePath || !correctionData.originalCommand) {
            throw new Error('Missing required fields for command syntax fix');
          }
          break;
        case 'template_import_fix':
          if (!correctionData.templatePath || !correctionData.incorrectImport) {
            throw new Error('Missing required fields for template import fix');
          }
          break;
      }

      console.log(`✅ Correction validation passed: ${correctionType}`);
      return true;
    } catch (error) {
      console.error(`❌ Correction validation failed: ${error.message}`);
      return false;
    }
  }

  // Get list of available backups
  getAvailableBackups() {
    if (!fs.existsSync(this.backupDir)) {
      return [];
    }

    return fs.readdirSync(this.backupDir)
      .filter(item => {
        const itemPath = path.join(this.backupDir, item);
        return fs.statSync(itemPath).isDirectory();
      })
      .sort()
      .reverse(); // Most recent first
  }

  // Clean up old backups (keep last 50)
  cleanupOldBackups() {
    const backups = this.getAvailableBackups();

    if (backups.length > 50) {
      const toDelete = backups.slice(50);

      for (const backupId of toDelete) {
        const backupPath = path.join(this.backupDir, backupId);
        fs.rmSync(backupPath, { recursive: true, force: true });
      }

      console.log(`🧹 Cleaned up ${toDelete.length} old backups`);
    }
  }
}

module.exports = CorrectionApplicator;
