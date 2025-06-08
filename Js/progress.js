/**
 * CLARITY MAP - PROGRESS TRACKING
 * Handles progress bar, section management, and completion tracking
 */

class ProgressTracker {
    constructor() {
        this.sections = [
            'welcome', 'focus', 'influences', 'connections', 
            'mapping', 'patterns', 'goals', 'roadmap', 'commitment'
        ];
        this.currentSectionIndex = 0;
        this.progressBar = null;
        this.completedSections = new Set();
        
        this.initialize();
    }

    /**
     * Initialize progress tracking
     */
    initialize() {
        this.progressBar = Utils.getElementById('progressBar');
        this.loadProgress();
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for progress tracking
     */
    setupEventListeners() {
        // Listen for section changes
        window.addEventListener('sectionChange', (event) => {
            this.updateProgress(event.detail.sectionId);
        });

        // Listen for form changes to track completion
        document.addEventListener('input', Utils.debounce((event) => {
            if (event.target.matches('input, textarea, select')) {
                this.trackFieldCompletion(event.target);
            }
        }, 1000));

        // Listen for data saves
        window.addEventListener('journalSave', () => {
            this.saveProgress();
        });
    }

    /**
     * Update progress based on current section
     * @param {string} sectionId - Current section ID
     */
    updateProgress(sectionId) {
        const sectionIndex = this.sections.indexOf(sectionId);
        if (sectionIndex === -1) return;

        this.currentSectionIndex = sectionIndex;
        this.markSectionVisited(sectionId);
        this.updateProgressBar();
        this.saveProgress();
    }

    /**
     * Mark a section as visited
     * @param {string} sectionId - Section ID
     */
    markSectionVisited(sectionId) {
        this.completedSections.add(sectionId);
    }

    /**
     * Update the visual progress bar
     */
    updateProgressBar() {
        if (!this.progressBar) return;

        const progressPercentage = ((this.currentSectionIndex + 1) / this.sections.length) * 100;
        this.progressBar.style.width = `${progressPercentage}%`;

        // Add completion indicator
        this.updateProgressIndicators();
    }

    /**
     * Update section completion indicators in navigation
     */
    updateProgressIndicators() {
        this.sections.forEach((sectionId, index) => {
            const navButton = document.querySelector(`[onclick*="${sectionId}"]`);
            if (!navButton) return;

            // Remove existing indicators
            navButton.classList.remove('completed', 'current', 'locked');

            if (this.completedSections.has(sectionId)) {
                navButton.classList.add('completed');
            }

            if (index === this.currentSectionIndex) {
                navButton.classList.add('current');
            }

            // Optional: Lock sections that haven't been reached yet
            if (index > this.currentSectionIndex + 1) {
                navButton.classList.add('locked');
            }
        });
    }

    /**
     * Track field completion for detailed progress
     * @param {HTMLElement} field - Form field element
     */
    trackFieldCompletion(field) {
        const section = this.getCurrentSection();
        const fieldId = field.id;
        const value = field.value.trim();

        if (!section || !fieldId) return;

        // Track required field completion
        const isRequired = field.hasAttribute('required') || 
                          field.classList.contains('required') ||
                          this.isRequiredField(section, fieldId);

        if (isRequired) {
            const isCompleted = value.length > 0;
            this.updateFieldCompletionStatus(section, fieldId, isCompleted);
        }
    }

    /**
     * Check if a field is considered required for progress
     * @param {string} section - Section name
     * @param {string} fieldId - Field ID
     * @returns {boolean} True if required
     */
    isRequiredField(section, fieldId) {
        const requiredFields = {
            focus: ['wantMore'],
            influences: ['energyGivers', 'energyDrainers'],
            connections: ['ahaReflection'],
            patterns: ['keyLearning'],
            goals: ['goalStatement'],
            commitment: ['commitmentText']
        };

        return requiredFields[section]?.includes(fieldId) || false;
    }

    /**
     * Update field completion status
     * @param {string} section - Section name
     * @param {string} fieldId - Field ID
     * @param {boolean} isCompleted - Whether field is completed
     */
    updateFieldCompletionStatus(section, fieldId, isCompleted) {
        const key = `${section}.${fieldId}`;
        
        if (isCompleted) {
            this.completedSections.add(key);
        } else {
            this.completedSections.delete(key);
        }

        this.updateSectionProgress(section);
    }

    /**
     * Update progress for a specific section
     * @param {string} section - Section name
     */
    updateSectionProgress(section) {
        const requiredFields = this.getRequiredFieldsForSection(section);
        const completedFields = requiredFields.filter(field => 
            this.completedSections.has(`${section}.${field}`)
        );

        const sectionProgress = requiredFields.length > 0 
            ? (completedFields.length / requiredFields.length) * 100 
            : 0;

        // Update section indicator
        this.updateSectionIndicator(section, sectionProgress);
    }

    /**
     * Get required fields for a section
     * @param {string} section - Section name
     * @returns {Array<string>} Array of required field IDs
     */
    getRequiredFieldsForSection(section) {
        const requiredFields = {
            focus: ['wantMore'],
            influences: ['energyGivers', 'energyDrainers'],
            connections: ['ahaReflection'],
            patterns: ['keyLearning'],
            goals: ['goalStatement'],
            roadmap: ['milestone1'],
            commitment: ['commitmentText']
        };

        return requiredFields[section] || [];
    }

    /**
     * Update visual indicator for section progress
     * @param {string} section - Section name
     * @param {number} progress - Progress percentage (0-100)
     */
    updateSectionIndicator(section, progress) {
        const navButton = document.querySelector(`[onclick*="${section}"]`);
        if (!navButton) return;

        // Remove existing progress indicators
        navButton.classList.remove('progress-0', 'progress-25', 'progress-50', 'progress-75', 'progress-100');

        // Add appropriate progress class
        if (progress >= 100) {
            navButton.classList.add('progress-100');
        } else if (progress >= 75) {
            navButton.classList.add('progress-75');
        } else if (progress >= 50) {
            navButton.classList.add('progress-50');
        } else if (progress >= 25) {
            navButton.classList.add('progress-25');
        } else {
            navButton.classList.add('progress-0');
        }
    }

    /**
     * Get current section
     * @returns {string} Current section ID
     */
    getCurrentSection() {
        return this.sections[this.currentSectionIndex];
    }

    /**
     * Get overall completion percentage
     * @returns {number} Completion percentage (0-100)
     */
    getOverallCompletion() {
        const totalRequiredFields = this.sections.reduce((total, section) => {
            return total + this.getRequiredFieldsForSection(section).length;
        }, 0);

        const completedRequiredFields = Array.from(this.completedSections)
            .filter(key => key.includes('.'))
            .length;

        return totalRequiredFields > 0 
            ? Math.round((completedRequiredFields / totalRequiredFields) * 100)
            : 0;
    }

    /**
     * Get completion summary
     * @returns {Object} Completion summary
     */
    getCompletionSummary() {
        const sectionSummary = this.sections.map(section => {
            const requiredFields = this.getRequiredFieldsForSection(section);
            const completedFields = requiredFields.filter(field => 
                this.completedSections.has(`${section}.${field}`)
            );

            return {
                section,
                total: requiredFields.length,
                completed: completedFields.length,
                percentage: requiredFields.length > 0 
                    ? Math.round((completedFields.length / requiredFields.length) * 100)
                    : 100
            };
        });

        return {
            overall: this.getOverallCompletion(),
            sections: sectionSummary,
            visitedSections: Array.from(this.completedSections).filter(key => !key.includes('.')),
            currentSection: this.getCurrentSection()
        };
    }

    /**
     * Navigate to next section
     * @returns {string|null} Next section ID or null if at end
     */
    goToNextSection() {
        if (this.currentSectionIndex < this.sections.length - 1) {
            const nextSection = this.sections[this.currentSectionIndex + 1];
            this.updateProgress(nextSection);
            return nextSection;
        }
        return null;
    }

    /**
     * Navigate to previous section
     * @returns {string|null} Previous section ID or null if at beginning
     */
    goToPreviousSection() {
        if (this.currentSectionIndex > 0) {
            const prevSection = this.sections[this.currentSectionIndex - 1];
            this.updateProgress(prevSection);
            return prevSection;
        }
        return null;
    }

    /**
     * Check if user can navigate to a section
     * @param {string} sectionId - Target section ID
     * @returns {boolean} True if navigation is allowed
     */
    canNavigateToSection(sectionId) {
        const targetIndex = this.sections.indexOf(sectionId);
        if (targetIndex === -1) return false;

        // Allow navigation to any previously visited section or next section
        return targetIndex <= this.currentSectionIndex + 1 || 
               this.completedSections.has(sectionId);
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        const progressData = {
            currentSectionIndex: this.currentSectionIndex,
            completedSections: Array.from(this.completedSections),
            timestamp: new Date().toISOString()
        };

        Utils.storage.set('clarityMap_progress', progressData);
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        const saved = Utils.storage.get('clarityMap_progress');
        if (saved) {
            this.currentSectionIndex = saved.currentSectionIndex || 0;
            this.completedSections = new Set(saved.completedSections || []);
            this.updateProgressBar();
        }
    }

    /**
     * Reset progress
     */
    resetProgress() {
        this.currentSectionIndex = 0;
        this.completedSections.clear();
        this.updateProgressBar();
        this.saveProgress();
        
        // Dispatch reset event
        window.dispatchEvent(new CustomEvent('progressReset'));
    }

    /**
     * Show progress modal with detailed information
     */
    showProgressModal() {
        const summary = this.getCompletionSummary();
        
        const modal = Utils.createElement('div', {
            className: 'progress-modal',
            style: `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            `
        });

        const content = Utils.createElement('div', {
            style: `
                background: var(--color-background);
                padding: var(--spacing-xl);
                border-radius: var(--radius-lg);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: var(--shadow-xl);
            `
        }, this.generateProgressHTML(summary));

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Generate HTML for progress display
     * @param {Object} summary - Progress summary
     * @returns {string} HTML string
     */
    generateProgressHTML(summary) {
        let html = `
            <h3>Your Progress</h3>
            <div style="margin: var(--spacing-lg) 0;">
                <div style="background: var(--color-background-alt); padding: var(--spacing-md); border-radius: var(--radius-md); margin-bottom: var(--spacing-md);">
                    <strong>Overall Completion: ${summary.overall}%</strong>
                    <div style="width: 100%; height: 8px; background: var(--color-border); border-radius: 4px; margin-top: var(--spacing-xs);">
                        <div style="width: ${summary.overall}%; height: 100%; background: var(--color-primary); border-radius: 4px; transition: width 0.3s ease;"></div>
                    </div>
                </div>
                
                <h4>Section Progress:</h4>
                <div style="max-height: 300px; overflow-y: auto;">
        `;

        summary.sections.forEach(section => {
            const sectionName = section.section.charAt(0).toUpperCase() + section.section.slice(1);
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-xs) 0; border-bottom: 1px solid var(--color-border-light);">
                    <span>${sectionName}</span>
                    <span style="color: ${section.percentage === 100 ? 'var(--color-primary)' : 'var(--color-text-secondary)'};">
                        ${section.completed}/${section.total} (${section.percentage}%)
                    </span>
                </div>
            `;
        });

        html += `
                </div>
            </div>
            <div style="text-align: center; margin-top: var(--spacing-lg);">
                <button class="btn" onclick="this.closest('.progress-modal').remove()">Close</button>
            </div>
        `;

        return html;
    }
}

// Make ProgressTracker available globally
window.ProgressTracker = ProgressTracker;
