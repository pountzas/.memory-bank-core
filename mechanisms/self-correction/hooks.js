// Self-Correction Integration Hooks
// These hooks automatically monitor and learn from all memory-bank activities

const SelfCorrectionLearningSystem = require('./index');

class SelfCorrectionHooks {
  constructor() {
    this.learningSystem = new SelfCorrectionLearningSystem();
    this.enabled = true;
  }

  // Hook for command execution
  async onCommandExecute(command, context = {}) {
    if (!this.enabled) return;

    const startTime = Date.now();

    try {
      // This would be called before command execution
      const preActivity = {
        command,
        context,
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        preActivity,
        startTime
      };
    } catch (error) {
      await this.learningSystem.monitorActivity('command_execution', {
        command,
        success: false,
        error: error.message,
        duration: Date.now() - startTime,
        context
      });
      throw error;
    }
  }

  // Hook for command completion
  async onCommandComplete(command, exitCode, output, error, startTime, context = {}) {
    if (!this.enabled) return;

    const duration = Date.now() - startTime;

    await this.learningSystem.monitorActivity('command_execution', {
      command,
      exitCode,
      output,
      error: error ? error.message : null,
      success: exitCode === 0 && !error,
      duration,
      context
    });
  }

  // Hook for template instantiation
  async onTemplateInstantiate(templateId, parameters = {}, context = {}) {
    if (!this.enabled) return;

    const startTime = Date.now();

    try {
      return {
        success: true,
        templateId,
        parameters,
        context,
        startTime
      };
    } catch (error) {
      await this.learningSystem.monitorActivity('template_instantiation', {
        templateId,
        parameters,
        success: false,
        error: error.message,
        duration: Date.now() - startTime,
        context
      });
      throw error;
    }
  }

  // Hook for template completion
  async onTemplateComplete(templateId, success, errors = [], output = {}, startTime, parameters = {}, context = {}) {
    if (!this.enabled) return;

    const duration = Date.now() - startTime;

    await this.learningSystem.monitorActivity('template_instantiation', {
      templateId,
      parameters,
      success,
      errors,
      output,
      duration,
      context
    });
  }

  // Hook for mechanism execution
  async onMechanismExecute(mechanismId, operation, parameters = {}, context = {}) {
    if (!this.enabled) return;

    const startTime = Date.now();

    try {
      return {
        success: true,
        mechanismId,
        operation,
        parameters,
        context,
        startTime
      };
    } catch (error) {
      await this.learningSystem.monitorActivity('mechanism_execution', {
        mechanismId,
        operation,
        parameters,
        success: false,
        error: error.message,
        duration: Date.now() - startTime,
        context
      });
      throw error;
    }
  }

  // Hook for mechanism completion
  async onMechanismComplete(mechanismId, operation, success, errors = [], output = {}, startTime, parameters = {}, context = {}) {
    if (!this.enabled) return;

    const duration = Date.now() - startTime;

    await this.learningSystem.monitorActivity('mechanism_execution', {
      mechanismId,
      operation,
      parameters,
      success,
      errors,
      output,
      duration,
      context
    });
  }

  // Hook for user feedback
  async onUserFeedback(feedbackType, feedback, context = {}) {
    if (!this.enabled) return;

    await this.learningSystem.monitorActivity('user_feedback', {
      feedbackType,
      feedback,
      context,
      success: true // User feedback is always considered successful input
    });
  }

  // Hook for performance metrics
  async onPerformanceMetric(metricType, metricValue, threshold, context = {}) {
    if (!this.enabled) return;

    const exceeded = metricValue > threshold;
    const success = !exceeded;

    await this.learningSystem.monitorActivity('performance_metric', {
      metricType,
      metricValue,
      threshold,
      exceeded,
      success,
      context
    });
  }

  // Emergency correction trigger
  async triggerEmergencyCorrection(activityType, activityData) {
    console.log('🚨 Emergency correction triggered!');

    await this.learningSystem.monitorActivity(activityType, {
      ...activityData,
      emergency: true,
      priority: 'high'
    });
  }

  // Disable/enable learning
  disable() {
    this.enabled = false;
    console.log('🚫 Self-correction learning disabled');
  }

  enable() {
    this.enabled = true;
    console.log('✅ Self-correction learning enabled');
  }

  // Get learning insights
  async getInsights(timeRange = '7d') {
    return await this.learningSystem.runAnalysis();
  }

  // Manual learning trigger
  async learnFromActivity(activityType, activityData) {
    return await this.learningSystem.monitorActivity(activityType, activityData);
  }
}

// Global hooks instance
const selfCorrectionHooks = new SelfCorrectionHooks();

module.exports = selfCorrectionHooks;
