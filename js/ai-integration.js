/**
 * CLARITY MAP - AI INTEGRATION
 * Handles AI-powered insights and pattern analysis
 */

class AIIntegration {
    constructor() {
        this.apiKey = null;
        // Keep gemini-2.0-flash as the model.
        // We will explicitly pass the user-provided key.
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isEnabled = false; // Initial state, assumes AI is not available until API key is set
        this.requestQueue = [];
        this.isProcessing = false;
        
        this.initializeAPI();
    }

    /**
     * Initialize API configuration
     * Attempts to load a stored API key.
     */
    initializeAPI() {
        this.apiKey = this.getStoredAPIKey();
        this.isEnabled = !!this.apiKey; // Enabled only if a key is found
    }

    /**
     * Get stored API key from localStorage
     * @returns {string|null} API key or null
     */
    getStoredAPIKey() {
        return Utils.storage.get('clarityMap_aiApiKey');
    }

    /**
     * Set API key
     * @param {string} apiKey - Gemini API key
     * @returns {boolean} True if successfully set
     */
    setAPIKey(apiKey) {
        if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
            Utils.showToast('API Key cannot be empty. Please enter a valid key.', 'error');
            return false;
        }

        this.apiKey = apiKey.trim();
        this.isEnabled = true;
        
        Utils.storage.set('clarityMap_aiApiKey', this.apiKey);
        Utils.showToast('AI insights enabled!', 'success');
        document.querySelector('.ai-config-modal')?.remove(); // Close modal on success
        
        return true;
    }

    /**
     * Check if AI features are available
     * AI is available only if a valid API key is currently set.
     * @returns {boolean} True if AI is available
     */
    isAvailable() {
        return !!this.apiKey && this.apiKey.length > 0;
    }

    /**
     * Generate insights from user's influences data
     * @param {Object} influencesData - User's influences data
     * @returns {Promise<string>} AI-generated insights
     */
    async generateInfluencesInsights(influencesData) {
        if (!this.isAvailable()) {
            this.showConfigModal(); // Prompt for key if not available
            return this.getFallbackMessage('insights'); // Return fallback immediately
        }

        const prompt = this.buildInfluencesPrompt(influencesData);
        
        try {
            const response = await this.makeAPIRequest(prompt);
            return this.formatInsightsResponse(response);
        } catch (error) {
            console.error('Error generating influences insights:', error);
            return this.getFallbackMessage('insights_error');
        }
    }

    /**
     * Generate final reflection summary
     * @param {Object} journalData - Complete journal data
     * @returns {Promise<string>} AI-generated summary
     */
    async generateFinalReflection(journalData) {
        if (!this.isAvailable()) {
            this.showConfigModal(); // Prompt for key if not available
            return this.getFallbackMessage('reflection'); // Return fallback immediately
        }

        const prompt = this.buildReflectionPrompt(journalData);
        
        try {
            const response = await this.makeAPIRequest(prompt);
            return this.formatReflectionResponse(response);
        } catch (error) {
            console.error('Error generating final reflection:', error);
            return this.getFallbackMessage('reflection_error');
        }
    }

    /**
     * Build prompt for influences insights
     * @param {Object} data - Influences data
     * @returns {string} Formatted prompt
     */
    buildInfluencesPrompt(data) {
        const { energyGivers, energyDrainers, stuckRoutines, expectations, pressures } = data;
        
        return `As a supportive life coach, analyze these personal patterns and provide gentle, actionable insights:

ENERGY GIVERS: ${energyGivers || 'Not specified'}
ENERGY DRAINERS: ${energyDrainers || 'Not specified'}
STUCK ROUTINES: ${stuckRoutines || 'Not specified'}
EXTERNAL EXPECTATIONS: ${expectations || 'Not specified'}
PRESSURES: ${pressures || 'Not specified'}

Please provide 2-3 compassionate insights that help this person understand hidden patterns in their life. Focus on:
1. Connections they might not have noticed
2. One specific, gentle suggestion for change
3. Validation of their experience

Keep the tone warm, non-judgmental, and encouraging. Limit response to 150 words.`;
    }

    /**
     * Build prompt for final reflection
     * @param {Object} data - Complete journal data
     * @returns {string} Formatted prompt
     */
    buildReflectionPrompt(data) {
        const focus = data.focus?.wantMore || '';
        const keyLearning = data.patterns?.keyLearning || '';
        const commitment = data.commitment?.commitmentText || '';
        
        return `As a supportive coach, create a personalized reflection summary for someone who has completed a self-discovery journey:

THEIR FOCUS: ${focus}
KEY LEARNING: ${keyLearning}
COMMITMENT: ${commitment}

Create a brief, encouraging reflection that:
1. Acknowledges their growth through this process
2. Highlights their key insight
3. Offers gentle encouragement for their next steps

Keep it personal, warm, and hopeful. Limit to 120 words.`;
    }

    /**
     * Make API request to Gemini
     * Always uses the stored API key.
     * @param {string} prompt - The prompt to send
     * @returns {Promise<string>} API response
     */
    async makeAPIRequest(prompt) {
        const requestData = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        // Explicitly use this.apiKey
        const apiKeyToUse = this.apiKey;

        const response = await fetch(`${this.baseUrl}?key=${apiKeyToUse}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            let errorDetail = '';
            try {
                const errorData = await response.json();
                errorDetail = errorData.error ? `: ${errorData.error.message}` : '';
            } catch (jsonError) {
                errorDetail = `: ${response.statusText}`;
            }
            throw new Error(`API request failed with status ${response.status}${errorDetail}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Unexpected API response format or no candidates returned.');
        }
    }

    /**
     * Format insights response for display
     * @param {string} response - Raw AI response
     * @returns {string} Formatted response
     */
    formatInsightsResponse(response) {
        // Clean up the response and add some structure
        let formatted = response.trim();
        
        // Add a gentle introduction if not present
        if (!formatted.toLowerCase().includes('notice') && !formatted.toLowerCase().includes('see')) {
            formatted = "Here's what I notice from your reflections:\n\n" + formatted;
        }
        
        return formatted;
    }

    /**
     * Format reflection response for display
     * @param {string} response - Raw AI response
     * @returns {string} Formatted response
     */
    formatReflectionResponse(response) {
        let formatted = response.trim();
        
        // Ensure it feels personal and encouraging
        if (!formatted.toLowerCase().includes('you')) {
            formatted = "Your journey through this process shows real insight. " + formatted;
        }
        
        return formatted;
    }

    /**
     * Get fallback message when AI is not available
     * @param {string} type - Type of fallback needed
     * @returns {string} Fallback message
     */
    getFallbackMessage(type) {
        const messages = {
            insights: `Take a moment to reflect on the patterns you've identified. What connections do you notice between your energy givers and drainers? Often, the things that drain us point toward what we value most. Your insights are forming—trust the process.`,
            
            reflection: `You've completed a meaningful journey of self-discovery. The patterns you've uncovered and the commitment you've made are stepping stones toward the life you want. Trust your insights and take the next small step when you're ready.`,
            
            insights_error: `AI insights aren't available right now, but your own reflections are the most valuable part of this process. Please ensure your API key is valid and try again. (Error: API call failed or response was unexpected.)`,
            
            reflection_error: `While AI summary isn't available, you've done the real work of understanding your patterns and making a commitment to change. That's what creates lasting transformation. Please ensure your API key is valid and try again. (Error: API call failed or response was unexpected.)`
        };
        
        return messages[type] || 'Your insights are the most important part of this journey.';
    }

    /**
     * Show AI configuration modal
     */
    showConfigModal() {
        const modal = Utils.createElement('div', {
            className: 'ai-config-modal',
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
            className: 'ai-config-content',
            style: `
                background: var(--color-background);
                padding: var(--spacing-xl);
                border-radius: var(--radius-lg);
                max-width: 500px;
                width: 90%;
                box-shadow: var(--shadow-xl);
            `
        }, `
            <h3>Enable AI Insights</h3>
            <p>To enable AI-powered insights, you'll need a Google Gemini API key. This will be stored locally in your browser.</p>
            <div class="input-group">
                <label for="aiApiKey">Gemini API Key:</label>
                <input type="password" id="aiApiKey" placeholder="Enter your API key">
                <small>Get your free API key at <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></small>
            </div>
            <div style="display: flex; gap: var(--spacing-md); justify-content: flex-end; margin-top: var(--spacing-lg);">
                <button class="btn btn-secondary" onclick="this.closest('.ai-config-modal').remove()">Cancel</button>
                <button class="btn" onclick="app.aiIntegration.saveAPIKey()">Save & Enable</button>
            </div>
        `);

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Focus on input
        setTimeout(() => {
            Utils.getElementById('aiApiKey')?.focus();
            // Pre-fill if a key was previously saved
            const currentKey = this.getStoredAPIKey();
            if (currentKey) {
                Utils.getElementById('aiApiKey').value = currentKey;
            }
        }, 100);
    }

    /**
     * Save API key from modal
     */
    saveAPIKey() {
        const input = Utils.getElementById('aiApiKey');
        const apiKey = input?.value?.trim();
        
        if (!apiKey) {
            Utils.showToast('Please enter an API key', 'error');
            return;
        }

        // Call setAPIKey directly with the input value
        this.setAPIKey(apiKey);
    }

    /**
     * Show insights in target element with loading state
     * @param {HTMLElement} targetElement - Element to show insights in
     * @param {Function} insightGenerator - Function that returns promise of insights
     * @param {string} loadingMessage - Loading message to show
     */
    async showInsightsWithLoading(targetElement, insightGenerator, loadingMessage = 'Generating insights...') {
        if (!targetElement) return;

        // Show loading state
        Utils.showLoading(targetElement, loadingMessage);
        targetElement.style.display = 'block';

        try {
            const insights = await insightGenerator();
            targetElement.innerHTML = `<p>${insights}</p>`;
        } catch (error) {
            console.error('Error showing insights:', error);
            // Show a more informative error message
            targetElement.innerHTML = `<p>${this.getFallbackMessage('insights_error')}</p>`;
        }
    }

    /**
     * Handle AI button click with configuration check
     * @param {Function} insightFunction - Function to call if AI is available
     * @param {HTMLElement} targetElement - Element to show results in
     */
    handleAIButtonClick(insightFunction, targetElement) {
        if (!this.isAvailable()) {
            this.showConfigModal();
            return; // Stop here if AI is not available and modal is shown
        }

        this.showInsightsWithLoading(targetElement, insightFunction);
    }
}

// Make AIIntegration available globally
window.AIIntegration = AIIntegration;
