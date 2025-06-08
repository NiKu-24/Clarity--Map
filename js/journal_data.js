/**
 * CLARITY MAP - JOURNAL DATA MANAGEMENT
 * Handles saving, loading, and managing journal data
 */

class JournalDataManager {
    constructor() {
        this.storageKey = 'clarityMapJournalData';
        this.data = this.loadData();
        this.autosaveEnabled = true;
        this.autosaveInterval = 30000; // 30 seconds
        this.lastSaved = null;
        
        this.setupAutosave();
        this.setupBeforeUnload();
    }

    /**
     * Get the default data structure
     * @returns {Object} Default journal data structure
     */
    getDefaultDataStructure() {
        return {
            metadata: {
                created: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                version: '1.0',
                currentSection: 'welcome'
            },
            welcome: {},
            focus: {
                lifeChallenge: '',
                lifeAreas: [],
                otherArea: '',
                wantMore: ''
            },
            influences: {
                energyGivers: '',
                energyDrainers: '',
                stuckRoutines: '',
                expectations: '',
                pressures: '',
                repeatedBehaviors: ''
            },
            connections: {
                focusAreaRepeat: '',
                energyGiver1: '',
                energyConnection1: '',
                energyGiver2: '',
                energyConnection2: '',
                energyDrainer1: '',
                drainerConnection1: '',
                energyDrainer2: '',
                drainerConnection2: '',
                strongestPattern: '',
                patternConnection: '',
                ahaReflection: ''
            },
            mapping: {
                mapFocus: '',
                mapEnergyGivers: '',
                mapEnergyDrainers: '',
                mapPattern: '',
                strongestNegative: '',
                strongestPositive: '',
                chainReaction: '',
                leveragePoint: ''
            },
            patterns: {
                mainLoop: '',
                loopType: '',
                selectedPattern: '',
                connectionToChange: '',
                howToChange: '',
                systemImpact: '',
                keyLearning: '',
                readyToChange: '',
                whyThisChange: ''
            },
            goals: {
                leveragePointGoal: '',
                goalStatement: '',
                goalImpact: '',
                successMetrics: '',
                potentialObstacles: ''
            },
            roadmap: {
                roadmapGoal: '',
                milestone1: '',
                milestone2: '',
                milestone3: '',
                milestone1Actions: '',
                milestone2Actions: '',
                milestone3Actions: '',
                flexibilityPlan: '',
                supportSystem: ''
            },
            commitment: {
                commitmentFoundation: '',
                patternToInterrupt: '',
                nowColumnImportant: '',
                whatToGain: '',
                commitmentText: '',
                whenHard: '',
                supportWho: '',
                supportEnvironment: '',
                whenStumble: '',
                reminderRitual: '',
                yourName: '',
                signatureDate: '',
                finalReflection: '',
                oneWord: ''
            }
        };
    }

    /**
     * Load data from localStorage or return default structure
     * @returns {Object} Journal data
     */
    loadData() {
        const stored = Utils.storage.get(this.storageKey);
        if (stored && this.validateDataStructure(stored)) {
            // Merge with default structure to ensure all fields exist
            return this.mergeWithDefaults(stored);
        }
        return this.getDefaultDataStructure();
    }

    /**
     * Merge stored data with default structure to handle version updates
     * @param {Object} stored - Stored data
     * @returns {Object} Merged data
     */
    mergeWithDefaults(stored) {
        const defaults = this.getDefaultDataStructure();
        const merged = Utils.deepClone(defaults);
        
        // Recursively merge stored data
        function mergeObjects(target, source) {
            Object.keys(source).forEach(key => {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    mergeObjects(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            });
        }
        
        mergeObjects(merged, stored);
        
        // Update metadata
        merged.metadata.lastModified = new Date().toISOString();
        
        return merged;
    }

    /**
     * Validate data structure integrity
     * @param {Object} data - Data to validate
     * @returns {boolean} True if valid
     */
    validateDataStructure(data) {
        if (!data || typeof data !== 'object') return false;
        
        const requiredSections = ['metadata', 'focus', 'influences', 'connections'];
        return requiredSections.every(section => data.hasOwnProperty(section));
    }

    /**
     * Save a single field value
     * @param {string} section - Section name
     * @param {string} fieldId - Field identifier
     * @param {any} value - Value to save
     * @returns {boolean} True if saved successfully
     */
    saveField(section, fieldId, value) {
        try {
            if (!this.data[section]) {
                this.data[section] = {};
            }
            
            this.data[section][fieldId] = value;
            this.data.metadata.lastModified = new Date().toISOString();
            
            // Trigger autosave
            this.debouncedSave();
            
            return true;
        } catch (error) {
            console.error('Error saving field:', error);
            return false;
        }
    }

    /**
     * Get a field value
     * @param {string} section - Section name
     * @param {string} fieldId - Field identifier
     * @param {any} defaultValue - Default value if not found
     * @returns {any} Field value
     */
    getField(section, fieldId, defaultValue = '') {
        try {
            if (this.data[section] && this.data[section].hasOwnProperty(fieldId)) {
                return this.data[section][fieldId];
            }
            return defaultValue;
        } catch (error) {
            console.error('Error getting field:', error);
            return defaultValue;
        }
    }

    /**
     * Save entire section data
     * @param {string} section - Section name
     * @param {Object} sectionData - Section data object
     * @returns {boolean} True if saved successfully
     */
    saveSection(section, sectionData) {
        try {
            this.data[section] = { ...this.data[section], ...sectionData };
            this.data.metadata.lastModified = new Date().toISOString();
            
            this.debouncedSave();
            
            return true;
        } catch (error) {
            console.error('Error saving section:', error);
            return false;
        }
    }

    /**
     * Get entire section data
     * @param {string} section - Section name
     * @returns {Object} Section data
     */
    getSection(section) {
        return this.data[section] || {};
    }

    /**
     * Save current section state
     * @param {string} currentSection - Current section ID
     */
    saveCurrentSection(currentSection) {
        this.data.metadata.currentSection = currentSection;
        this.debouncedSave();
    }

    /**
     * Get current section
     * @returns {string} Current section ID
     */
    getCurrentSection() {
        return this.data.metadata.currentSection || 'welcome';
    }

    /**
     * Persist data to localStorage
     * @returns {boolean} True if saved successfully
     */
    persistData() {
        try {
            const success = Utils.storage.set(this.storageKey, this.data);
            if (success) {
                this.lastSaved = new Date();
                this.dispatchSaveEvent('success');
            }
            return success;
        } catch (error) {
            console.error('Error persisting data:', error);
            this.dispatchSaveEvent('error', error.message);
            return false;
        }
    }

    /**
     * Setup debounced auto-save
     */
    setupAutosave() {
        this.debouncedSave = Utils.debounce(() => {
            if (this.autosaveEnabled) {
                this.persistData();
            }
        }, 2000); // Save 2 seconds after last change
    }

    /**
     * Setup before unload handler to save data
     */
    setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            if (this.autosaveEnabled) {
                this.persistData();
            }
        });
    }

    /**
     * Enable/disable autosave
     * @param {boolean} enabled - Whether to enable autosave
     */
    setAutosave(enabled) {
        this.autosaveEnabled = enabled;
    }

    /**
     * Force immediate save
     * @returns {boolean} True if saved successfully
     */
    forceSave() {
        return this.persistData();
    }

    /**
     * Export journal data
     * @param {string} format - Export format ('json', 'text')
     * @returns {string} Exported data
     */
    exportData(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.data, null, 2);
        } else if (format === 'text') {
            return this.generateTextSummary();
        }
        throw new Error('Unsupported export format');
    }

    /**
     * Generate a human-readable text summary
     * @returns {string} Text summary
     */
    generateTextSummary() {
        const sections = [
            { key: 'focus', title: 'Focus Area' },
            { key: 'influences', title: 'Influences' },
            { key: 'connections', title: 'Connections' },
            { key: 'patterns', title: 'Patterns' },
            { key: 'goals', title: 'Goals' },
            { key: 'commitment', title: 'Commitment' }
        ];

        let summary = `CLARITY MAP JOURNAL\n`;
        summary += `Created: ${new Date(this.data.metadata.created).toLocaleDateString()}\n`;
        summary += `Last Modified: ${new Date(this.data.metadata.lastModified).toLocaleDateString()}\n\n`;

        sections.forEach(section => {
            summary += `=== ${section.title.toUpperCase()} ===\n`;
            const sectionData = this.data[section.key] || {};
            
            Object.keys(sectionData).forEach(key => {
                const value = sectionData[key];
                if (value && typeof value === 'string' && value.trim()) {
                    const label = this.formatFieldLabel(key);
                    summary += `${label}: ${value.trim()}\n`;
                } else if (Array.isArray(value) && value.length > 0) {
                    const label = this.formatFieldLabel(key);
                    summary += `${label}: ${value.join(', ')}\n`;
                }
            });
            summary += '\n';
        });

        return summary;
    }

    /**
     * Format field key into readable label
     * @param {string} key - Field key
     * @returns {string} Formatted label
     */
    formatFieldLabel(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    /**
     * Import journal data
     * @param {string|Object} data - Data to import
     * @param {boolean} merge - Whether to merge with existing data
     * @returns {boolean} True if imported successfully
     */
    importData(data, merge = false) {
        try {
            let importedData;
            
            if (typeof data === 'string') {
                importedData = JSON.parse(data);
            } else {
                importedData = data;
            }

            if (!this.validateDataStructure(importedData)) {
                throw new Error('Invalid data structure');
            }

            if (merge) {
                this.data = this.mergeWithDefaults(importedData);
            } else {
                this.data = importedData;
                this.data.metadata.lastModified = new Date().toISOString();
            }

            this.persistData();
            this.dispatchImportEvent('success');
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            this.dispatchImportEvent('error', error.message);
            return false;
        }
    }

    /**
     * Clear all journal data
     * @returns {boolean} True if cleared successfully
     */
    clearAllData() {
        try {
            this.data = this.getDefaultDataStructure();
            Utils.storage.remove(this.storageKey);
            this.dispatchClearEvent();
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }

    /**
     * Get completion percentage
     * @returns {number} Completion percentage (0-100)
     */
    getCompletionPercentage() {
        const requiredFields = [
            'focus.wantMore',
            'influences.energyGivers',
            'influences.energyDrainers',
            'connections.ahaReflection',
            'patterns.keyLearning',
            'goals.goalStatement',
            'commitment.commitmentText'
        ];

        let completedFields = 0;
        
        requiredFields.forEach(fieldPath => {
            const [section, field] = fieldPath.split('.');
            const value = this.getField(section, field);
            if (value && typeof value === 'string' && value.trim().length > 0) {
                completedFields++;
            }
        });

        return Math.round((completedFields / requiredFields.length) * 100);
    }

    /**
     * Get data summary for display
     * @returns {Object} Summary data
     */
    getDataSummary() {
        return {
            created: this.data.metadata.created,
            lastModified: this.data.metadata.lastModified,
            currentSection: this.data.metadata.currentSection,
            completion: this.getCompletionPercentage(),
            lastSaved: this.lastSaved,
            hasUnsavedChanges: this.hasUnsavedChanges()
        };
    }

    /**
     * Check if there are unsaved changes
     * @returns {boolean} True if there are unsaved changes
     */
    hasUnsavedChanges() {
        if (!this.lastSaved) return true;
        
        const lastModified = new Date(this.data.metadata.lastModified);
        return lastModified > this.lastSaved;
    }

    /**
     * Dispatch save event
     * @param {string} status - Save status ('success', 'error')
     * @param {string} message - Optional message
     */
    dispatchSaveEvent(status, message = '') {
        const event = new CustomEvent('journalSave', {
            detail: { status, message, timestamp: new Date() }
        });
        window.dispatchEvent(event);
    }

    /**
     * Dispatch import event
     * @param {string} status - Import status ('success', 'error')
     * @param {string} message - Optional message
     */
    dispatchImportEvent(status, message = '') {
        const event = new CustomEvent('journalImport', {
            detail: { status, message, timestamp: new Date() }
        });
        window.dispatchEvent(event);
    }

    /**
     * Dispatch clear event
     */
    dispatchClearEvent() {
        const event = new CustomEvent('journalClear', {
            detail: { timestamp: new Date() }
        });
        window.dispatchEvent(event);
    }

    /**
     * Get all field values for auto-population
     * @param {string} targetSection - Section to populate
     * @returns {Object} Field mappings
     */
    getAutoPopulationData(targetSection) {
        const mappings = {
            connections: {
                focusAreaRepeat: this.getField('focus', 'wantMore')
            },
            mapping: {
                mapFocus: this.getField('focus', 'wantMore'),
                mapEnergyGivers: [
                    this.getField('connections', 'energyGiver1'),
                    this.getField('connections', 'energyGiver2')
                ].filter(Boolean).join(', '),
                mapEnergyDrainers: [
                    this.getField('connections', 'energyDrainer1'),
                    this.getField('connections', 'energyDrainer2')
                ].filter(Boolean).join(', '),
                mapPattern: this.getField('connections', 'strongestPattern')
            },
            goals: {
                leveragePointGoal: this.getField('mapping', 'leveragePoint')
            },
            roadmap: {
                roadmapGoal: this.getField('goals', 'goalStatement')
            }
        };

        return mappings[targetSection] || {};
    }

    /**
     * Setup auto-population for form fields
     * @param {string} section - Current section
     */
    setupAutoPopulation(section) {
        const autoData = this.getAutoPopulationData(section);
        
        Object.keys(autoData).forEach(fieldId => {
            const element = Utils.getElementById(fieldId);
            if (element && !element.value) {
                element.value = autoData[fieldId];
            }
        });
    }
}

// Make JournalDataManager available globally
window.JournalDataManager = JournalDataManager;
     
