/**
 * CLARITY MAP - MAIN APPLICATION
 * Core application logic and section management
 */

class ClarityMapApp {
    constructor() {
        this.currentSection = 'welcome';
        this.sections = [
            'welcome', 'focus', 'influences', 'connections', 
            'mapping', 'patterns', 'goals', 'roadmap', 'commitment'
        ];
        
        // Initialize core systems
        this.journalData = new JournalDataManager();
        this.aiIntegration = new AIIntegration();
        this.mappingSystem = new MappingSystem();
        this.progressTracker = new ProgressTracker();
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.renderNavigation();
        this.loadCurrentSection();
        this.bindGlobalEvents();
        this.setupAutoSave();
        this.setupKeyboardShortcuts();
        
        console.log('Clarity Map application initialized');
    }

    /**
     * Load the current section from saved data or default
     */
    loadCurrentSection() {
        const savedSection = this.journalData.getCurrentSection();
        if (this.sections.includes(savedSection)) {
            this.currentSection = savedSection;
        }
        this.showSection(this.currentSection);
    }

    /**
     * Render the navigation buttons
     */
    renderNavigation() {
        const navigation = Utils.getElementById('navigation');
        if (!navigation) {
            console.error('Navigation element not found');
            return;
        }

        const navItems = [
            { id: 'welcome', label: 'Welcome' },
            { id: 'focus', label: 'Define Focus' },
            { id: 'influences', label: 'Explore Influences' },
            { id: 'connections', label: 'Connect Dots' },
            { id: 'mapping', label: 'Map Connections' },
            { id: 'patterns', label: 'Find Pattern' },
            { id: 'goals', label: 'Set Goal' },
            { id: 'roadmap', label: 'Create Roadmap' },
            { id: 'commitment', label: 'Anchor Commitment' }
        ];

        navigation.innerHTML = '';
        
        navItems.forEach(item => {
            const button = Utils.createElement('button', {
                className: 'nav-btn',
                onclick: `app.showSection('${item.id}')`
            }, item.label);
            
            navigation.appendChild(button);
        });
        
        this.updateActiveNavButton();
    }

    /**
     * Show a specific section
     * @param {string} sectionId - Section to display
     */
    showSection(sectionId) {
        if (!this.sections.includes(sectionId)) {
            console.error(`Unknown section: ${sectionId}`);
            return;
        }

        // Save current section data before switching
        this.saveCurrentSectionData();
        
        // Hide all sections
        this.hideAllSections();
        
        // Show target section
        this.renderSection(sectionId);
        
        // Update state
        this.currentSection = sectionId;
        this.journalData.saveCurrentSection(sectionId);
        
        // Update UI
        this.updateActiveNavButton();
        this.progressTracker.updateProgress(sectionId);
        
        // Populate section with saved data
        this.populateSectionData(sectionId);
        
        // Dispatch section change event
        this.dispatchSectionChangeEvent(sectionId);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Hide all sections
     */
    hideAllSections() {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
    }

    /**
     * Render a specific section
     * @param {string} sectionId - Section to render
     */
    renderSection(sectionId) {
        const mainContent = Utils.getElementById('main-content');
        if (!mainContent) {
            console.error('Main content element not found');
            return;
        }

        // Check if section already exists
        let section = Utils.getElementById(sectionId);
        if (!section) {
            section = this.createSectionElement(sectionId);
            mainContent.appendChild(section);
        }
        
        section.classList.add('active');
        
        // Section-specific initialization
        this.initializeSectionFeatures(sectionId);
    }

    /**
     * Create section element with content
     * @param {string} sectionId - Section ID
     * @returns {HTMLElement} Section element
     */
    createSectionElement(sectionId) {
        const section = Utils.createElement('div', {
            id: sectionId,
            className: 'section'
        });

        const content = this.getSectionContent(sectionId);
        section.innerHTML = content;
        
        return section;
    }

    /**
     * Get HTML content for a section
     * @param {string} sectionId - Section ID
     * @returns {string} HTML content
     */
    getSectionContent(sectionId) {
        const sectionContents = {
            welcome: this.getWelcomeContent(),
            focus: this.getFocusContent(),
            influences: this.getInfluencesContent(),
            connections: this.getConnectionsContent(),
            mapping: this.getMappingContent(),
            patterns: this.getPatternsContent(),
            goals: this.getGoalsContent(),
            roadmap: this.getRoadmapContent(),
            commitment: this.getCommitmentContent()
        };

        return sectionContents[sectionId] || '<p>Section content not found.</p>';
    }

    /**
     * Get welcome section content
     * @returns {string} HTML content
     */
    getWelcomeContent() {
        return `
            <h2>Welcome to Your Clarity Map</h2>
            <p class="welcome-intro">You know something needs to shift, but you're tired of complicated systems that promise everything and deliver nothing. You've tried quick fixes—you're ready for something that works with your real life.</p>
            
            <div class="quick-start">
                <h3>What This Journal Is For</h3>
                <p>This journal is designed for people who are:</p>
                <ul>
                    <li>Feeling overwhelmed by competing priorities</li>
                    <li>Facing a decision that affects multiple areas of life</li>
                    <li>Sensing that something needs to change but unsure what</li>
                    <li>Tired of quick fixes that don't stick</li>
                    <li>Ready to understand the deeper patterns in their life</li>
                </ul>
            </div>

            <div class="warning-box">
                <strong>What This Journal Is NOT:</strong>
                <ul>
                    <li>A therapy replacement for serious mental health concerns</li>
                    <li>A magic solution that works without your honest reflection</li>
                    <li>A one-size-fits-all template (your insights will be uniquely yours)</li>
                </ul>
            </div>

            <div class="insights-box">
                <h3>What Is Systems Thinking?</h3>
                <p>Most of us try to solve problems by focusing on one piece at a time. But life doesn't work in isolation—everything connects to everything else. Systems thinking means stepping back to see the whole picture: how different parts of your life influence each other, where the real pressure points are, and what small shifts might create the biggest positive changes.</p>
                <p><strong>Think of it like this:</strong> instead of trying to fix a traffic jam by honking at one car, you look at the whole road system—where the bottlenecks are, what routes people are taking, and how timing affects the flow.</p>
            </div>

            <p class="quote-block">You already have the wisdom you need. This journal is here to help you access it.</p>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn" onclick="app.showSection('focus')">Begin Your Journey →</button>
            </div>
        `;
    }

    /**
     * Get focus section content
     * @returns {string} HTML content
     */
    getFocusContent() {
        return `
            <h2>Define Your Focus</h2>
            <p class="focus-description">Before we can make sense of what's happening, we need to gently name it. This section helps you get clear on what's asking for your attention right now—not by solving it immediately, but by identifying where the tension or uncertainty lives.</p>

            <div class="input-group">
                <label for="lifeChallenge">What part of your life feels blurred, tangled, or unsettled?</label>
                <textarea id="lifeChallenge" placeholder="Take your time... there are no wrong answers here."></textarea>
            </div>

            <div class="input-group">
                <label>What life areas might be connected to your current challenge?</label>
                <div class="checkbox-grid">
                    <div class="checkbox-item">
                        <input type="checkbox" id="area-family" name="lifeAreas" value="family">
                        <label for="area-family">Family / Parenting</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="area-relationships" name="lifeAreas" value="relationships">
                        <label for="area-relationships">Romantic Life / Relationships</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="area-career" name="lifeAreas" value="career">
                        <label for="area-career">Work / Career</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="area-energy" name="lifeAreas" value="energy">
                        <label for="area-energy">Energy / Burnout</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="area-emotional" name="lifeAreas" value="emotional">
                        <label for="area-emotional">Emotional Well-being</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="area-focus" name="lifeAreas" value="focus">
                        <label for="area-focus">Mental Focus / Productivity</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="area-health" name="lifeAreas" value="health">
                        <label for="area-health">Physical Health</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="area-time" name="lifeAreas" value="time">
                        <label for="area-time">Time Management</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="area-money" name="lifeAreas" value="money">
                        <label for="area-money">Money / Finances</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="area-growth" name="lifeAreas" value="growth">
                        <label for="area-growth">Learning / Growth</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="area-beliefs" name="lifeAreas" value="beliefs">
                        <label for="area-beliefs">Beliefs / Self-worth</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="area-environment" name="lifeAreas" value="environment">
                        <label for="area-environment">Environment / Home</label>
                    </div>
                </div>
                <input type="text" id="otherArea" placeholder="Other: ____________">
            </div>

            <div class="input-group goal-statement">
                <label for="wantMore">In one sentence, what do you want more of in your life right now?</label>
                <input type="text" id="wantMore" placeholder="I want to..." required>
                <small>This will help anchor your focus and guide the next steps.</small>
            </div>

            <div class="section-nav">
                <button class="btn btn-secondary" onclick="app.showSection('welcome')">← Back</button>
                <button class="btn" onclick="app.showSection('influences')">Explore Influences →</button>
            </div>
        `;
    }

    /**
     * Get influences section content
     * @returns {string} HTML content
     */
    getInfluencesContent() {
        return `
            <h2>Explore Influences</h2>
            <div class="influences-intro">
                <p>What you're experiencing right now didn't come from nowhere. It's shaped by visible and invisible forces—some energizing, others draining. Some you know, and others operate below the surface.</p>
            </div>

            <div class="energy-section">
                <h3>Energy Givers and Drainers</h3>
                <p>Look at your typical day or week. What consistently gives you energy? What consistently takes it away?</p>

                <div class="energy-examples">
                    <strong>Energy Givers might include:</strong> Specific people who leave you feeling lighter, activities that make time disappear in a good way, environments where you feel most like yourself, moments when you feel competent or valued, rituals that ground you (even small ones).
                </div>

                <div class="input-group">
                    <label for="energyGivers">What gives you energy?</label>
                    <textarea id="energyGivers" placeholder="Specific people who leave you feeling lighter, activities that make time disappear in a good way, environments where you feel most like yourself..."></textarea>
                </div>

                <div class="energy-examples">
                    <strong>Energy Drainers might include:</strong> People who leave you feeling heavy or depleted, tasks you avoid repeatedly, environments that make you tense, conversations or thoughts that loop in your mind, responsibilities that feel misaligned with your values.
                </div>

                <div class="input-group">
                    <label for="energyDrainers">What drains you — emotionally, mentally, physically?</label>
                    <textarea id="energyDrainers" placeholder="People who leave you feeling heavy or depleted, tasks you avoid repeatedly, environments that make you tense..."></textarea>
                </div>
            </div>

            <div class="patterns-section">
                <h3>Patterns and Pressures</h3>
                <p>Think beyond the obvious. What forces are shaping your experience?</p>

                <div class="input-group">
                    <label for="stuckRoutines">Routines you feel stuck in:</label>
                    <textarea id="stuckRoutines" placeholder="What do you do on autopilot that might not serve you? What habits formed without conscious choice?"></textarea>
                </div>

                <div class="input-group">
                    <label for="expectations">External expectations:</label>
                    <textarea id="expectations" placeholder="Whose approval are you seeking? What 'shoulds' are driving your decisions? What would happen if you disappointed someone?"></textarea>
                </div>

                <div class="input-group">
                    <label for="pressures">Pressure check:</label>
                    <textarea id="pressures" placeholder="Where do you feel rushed or behind? What deadlines (real or imaginary) are driving you? What standards are you holding yourself to?"></textarea>
                </div>

                <div class="input-group">
                    <label for="repeatedBehaviors">Repeated behaviors:</label>
                    <textarea id="repeatedBehaviors" placeholder="What do you keep doing despite wanting to change? What conflicts keep showing up in different areas?"></textarea>
                </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <button class="btn" onclick="app.uncoverHiddenPatterns()">✨ Uncover Hidden Patterns ✨</button>
                <div id="patternsInsight" class="ai-response-box" style="display: none;"></div>
            </div>

            <div class="section-nav">
                <button class="btn btn-secondary" onclick="app.showSection('focus')">← Back</button>
                <button class="btn" onclick="app.showSection('connections')">Connect the Dots →</button>
            </div>
        `;
    }

    /**
     * Get connections section content
     * @returns {string} HTML content
     */
    getConnectionsContent() {
        return `
            <h2>Connect the Dots</h2>
            <p>You've identified what gives you energy, what drains you, and the patterns shaping your life. Now we can see how these pieces connect to the area you want to change.</p>

            <div class="connection-step">
                <h3>Step 1: Energy Givers → Your Focus Area</h3>
                <p>Look back at what you want more of. Pick your top 2 energy givers and ask: "How could this help with my focus area?"</p>

                <div class="input-group">
                    <label for="focusAreaRepeat">Your focus area:</label>
                    <input type="text" id="focusAreaRepeat" readonly>
                </div>

                <div class="connection-example">
                    <strong>Example:</strong> Focus area: "Feel less overwhelmed by my daily routine"<br>
                    Energy giver: "Walking in the morning"<br>
                    Connection: "Morning walks clear my head so I can prioritize my day instead of just reacting to whatever comes up"
                </div>

                <div class="input-group">
                    <label for="energyGiver1">Energy giver 1:</label>
                    <input type="text" id="energyGiver1" placeholder="Your top energy giver">
                </div>

                <div class="input-group">
                    <label for="energyConnection1">How it connects to your focus:</label>
                    <textarea id="energyConnection1" placeholder="How could this energy giver help with your focus area?"></textarea>
                </div>

                <div class="input-group">
                    <label for="energyGiver2">Energy giver 2:</label>
                    <input type="text" id="energyGiver2" placeholder="Your second energy giver">
                </div>

                <div class="input-group">
                    <label for="energyConnection2">How it connects to your focus:</label>
                    <textarea id="energyConnection2" placeholder="How could this energy giver help with your focus area?"></textarea>
                </div>
            </div>

            <div class="connection-step">
                <h3>Step 2: Energy Drainers → Your Focus Area</h3>
                <p>Pick your top 2 energy drainers and ask: "How is this making my focus area harder?"</p>

                <div class="input-group">
                    <label for="energyDrainer1">Energy drainer 1:</label>
                    <input type="text" id="energyDrainer1" placeholder="Your top energy drainer">
                </div>

                <div class="input-group">
                    <label for="drainerConnection1">How it connects to your focus:</label>
                    <textarea id="drainerConnection1" placeholder="How is this making your focus area harder?"></textarea>
                </div>

                <div class="input-group">
                    <label for="energyDrainer2">Energy drainer 2:</label>
                    <input type="text" id="energyDrainer2" placeholder="Your second energy drainer">
                </div>

                <div class="input-group">
                    <label for="drainerConnection2">How it connects to your focus:</label>
                    <textarea id="drainerConnection2" placeholder="How is this making your focus area harder?"></textarea>
                </div>
            </div>

            <div class="connection-step">
                <h3>Step 3: Patterns/Pressures → Your Focus Area</h3>

                <div class="input-group">
                    <label for="strongestPattern">Strongest pattern:</label>
                    <input type="text" id="strongestPattern" placeholder="Your most significant pattern or pressure">
                </div>

                <div class="input-group">
                    <label for="patternConnection">How it keeps you stuck:</label>
                    <textarea id="patternConnection" placeholder="How is this pattern keeping you stuck in your focus area?"></textarea>
                </div>
            </div>

            <div class="aha-moment">
                <h3>You just did systems thinking!</h3>
                <p>You identified the relationships between different parts of your life. This is exactly what you need to see before creating your action plan.</p>
            </div>

            <div class="input-group">
                <label for="ahaReflection">What's Your Biggest "Aha" Moment?</label>
                <textarea id="ahaReflection" placeholder="Look at your connections above. Which one surprised you or felt most true? Write 1-2 sentences:" required></textarea>
            </div>

            <div class="section-nav">
                <button class="btn btn-secondary" onclick="app.showSection('influences')">← Back</button>
                <button class="btn" onclick="app.showSection('mapping')">Create Your Map →</button>
            </div>
        `;
    }

    /**
     * Get mapping section content
     * @returns {string} HTML content
     */
    getMappingContent() {
        return `
            <h2>Map Your Connections</h2>
            <p>You've identified the connections between different parts of your life. Now let's create a simple visual map so you can see the whole picture at once.</p>

            <div class="mapping-instructions">
                <strong>Don't worry—this isn't about being artistic.</strong> You're just putting the pieces on paper so you can see how they work together. Think of it like drawing a family tree, but for the forces affecting your life.
            </div>

            <div class="mapping-step">
                <h3>Your Focus in the Center</h3>
                <div class="input-group">
                    <label for="mapFocus">Your focus area (this will be the center of your map):</label>
                    <input type="text" id="mapFocus" readonly>
                </div>
            </div>

            <div class="mapping-step">
                <h3>Add Your Main Influences</h3>
                <p>These are the connections you'll map around your center:</p>
                
                <div class="map-elements-display" id="mapElements">
                    <div><strong>Energy Givers:</strong> <span id="mapEnergyGivers"></span></div>
                    <div><strong>Energy Drainers:</strong> <span id="mapEnergyDrainers"></span></div>
                    <div><strong>Strongest Pattern:</strong> <span id="mapPattern"></span></div>
                </div>

                <h3>Interactive Mapping Canvas</h3>
                <div class="mapping-canvas" id="mappingCanvas">
                    <div style="text-align: center; padding: 20px; color: #333333;">
                        <p>Click "Generate Map" to create your visual system map</p>
                        <button class="btn" onclick="app.generateMap()">Generate Interactive Map</button>
                    </div>
                </div>
            </div>

            <div class="mapping-step">
                <h3>What Do You Notice?</h3>

                <div class="input-group">
                    <label for="strongestNegative">What's the strongest negative influence? (What has the most (-) connections?)</label>
                    <textarea id="strongestNegative" placeholder="Looking at your map, what influence seems to create the most problems?"></textarea>
                </div>

                <div class="input-group">
                    <label for="strongestPositive">What's your most powerful positive resource? (What has the most (+) connections?)</label>
                    <textarea id="strongestPositive" placeholder="What positive influence supports multiple areas of your life?"></textarea>
                </div>

                <div class="input-group">
                    <label for="chainReaction">What pattern do you see? (Do certain influences create a chain reaction?)</label>
                    <textarea id="chainReaction" placeholder="How do your influences connect to each other? What loops or cycles can you see?"></textarea>
                </div>
            </div>

            <div class="leverage-point">
                <h3>Find Your Leverage Point</h3>
                <p><strong>Systems thinking secret:</strong> Small changes in the right place can create big improvements.</p>
                
                <div class="input-group">
                    <label for="leveragePoint">Your leverage point - where could a small change make the biggest difference?</label>
                    <textarea id="leveragePoint" placeholder="Looking at your map, where could a small change create the most positive impact?"></textarea>
                </div>
            </div>

            <div class="section-nav">
                <button class="btn btn-secondary" onclick="app.showSection('connections')">← Back</button>
                <button class="btn" onclick="app.showSection('patterns')">Find Your Pattern →</button>
            </div>
        `;
    }

    /**
     * Get patterns section content
     * @returns {string} HTML content
     */
    getPatternsContent() {
        return `
            <h2>Find Your Pattern</h2>
            <div class="patterns-intro">
                <p>You've created your personal life map. Now let's read what it's telling you. In systems thinking, patterns aren't categories you fit into—they're the loops and cycles you can see when you follow the connections on your map.</p>
            </div>

            <div class="loop-tracing">
                <h3>Step 1: Trace Your Loops</h3>
                <p>Look at your map. Follow the arrows and connections. Do any create circles that lead back to where you started? These are your loops.</p>

                <div class="input-group">
                    <label for="mainLoop">Describe your main loop in words:</label>
                    <textarea id="mainLoop" placeholder="Start with: ____________ which leads to: ____________ which leads to: ____________ which leads back to: ____________"></textarea>
                </div>

                <div class="input-group">
                    <label for="loopType">Is this loop helping (+) you or hurting (-) you?</label>
                    <select id="loopType">
                        <option value="">Select...</option>
                        <option value="helping">Helping me (+)</option>
                        <option value="hurting">Hurting me (-)</option>
                        <option value="mixed">Mixed - could work better</option>
                    </select>
                </div>
            </div>

            <h3>Step 2: Common Life System Patterns</h3>
            <p>Here are common patterns many people discover. Does your situation look like any of these?</p>

            <div class="pattern-examples">
                <div class="pattern-card" onclick="app.selectPattern('caretaker')">
                    <h4>Pattern A: The Caretaker System</h4>
                    <p>Always helping others → No time for self-care → Feeling depleted → Others need more help → Always helping others</p>
                </div>
                
                <div class="pattern-card" onclick="app.selectPattern('perfectionist')">
                    <h4>Pattern B: The Perfectionist System</h4>
                    <p>High standards → Fear of failure → Procrastination → Rushing to meet deadlines → Lower quality work → Higher standards to compensate</p>
                </div>
                
                <div class="pattern-card" onclick="app.selectPattern('identity')">
                    <h4>Pattern C: The Identity Loss System</h4>
                    <p>Saying yes to everything → No time for what matters to you → Feeling disconnected from yourself → Uncertainty about what you want → Saying yes to everything</p>
                </div>
                
                <div class="pattern-card" onclick="app.selectPattern('guilt')">
                    <h4>Pattern D: The Guilt-Paralysis System</h4>
                    <p>Feeling guilty about choices → Avoiding decisions → Problems pile up → More guilt about inaction → Feeling guilty about choices</p>
                </div>
                
                <div class="pattern-card" onclick="app.selectPattern('overwhelm')">
                    <h4>Pattern E: The Overwhelm System</h4>
                    <p>Too many commitments → Feeling scattered → Poor boundaries → Taking on more → Too many commitments</p>
                </div>
                
                <div class="pattern-card" onclick="app.selectPattern('unique')">
                    <h4>My Pattern is Unique</h4>
                    <p>My situation doesn't match these common patterns, but I can see my own clear loop.</p>
                </div>
            </div>

            <input type="hidden" id="selectedPattern">

            <div class="intervention-point">
                <h3>Step 3: Find Your Intervention Point</h3>
                <p><strong>The power of systems thinking:</strong> Change one key connection, and the whole pattern shifts.</p>

                <div class="input-group">
                    <label for="connectionToChange">The connection I want to change:</label>
                    <input type="text" id="connectionToChange" placeholder="FROM: ____________ TO: ____________">
                </div>

                <div class="input-group">
                    <label for="howToChange">HOW I'll change it:</label>
                    <textarea id="howToChange" placeholder="What specific action or shift would change this connection?"></textarea>
                </div>

                <div class="input-group">
                    <label for="systemImpact">If I made this change, what might happen to the rest of my system?</label>
                    <textarea id="systemImpact" placeholder="How might this one change create positive ripple effects?"></textarea>
                </div>
            </div>

            <div class="pattern-discovery">
                <h3>Your Pattern Discovery</h3>

                <div class="input-group">
                    <label for="keyLearning">The most important thing I learned from my map:</label>
                    <textarea id="keyLearning" placeholder="What insight surprised you most or felt most true?" required></textarea>
                </div>

                <div class="input-group">
                    <label for="readyToChange">The one connection I'm ready to change:</label>
                    <textarea id="readyToChange" placeholder="What feels most achievable and impactful right now?"></textarea>
                </div>

                <div class="input-group">
                    <label for="whyThisChange">Why this change could shift everything:</label>
                    <textarea id="whyThisChange" placeholder="How might this small change create bigger positive changes?"></textarea>
                </div>
            </div>

            <div class="section-nav">
                <button class="btn btn-secondary" onclick="app.showSection('mapping')">← Back</button>
                <button class="btn" onclick="app.showSection('goals')">Set Your Goal →</button>
            </div>
        `;
    }

    /**
     * Get goals section content
     * @returns {string} HTML content
     */
    getGoalsContent() {
        return `
            <h2>Set Your Goal</h2>
            <div class="goals-intro">
                <p>Now that you understand your system, it's time to set a goal that aligns with your leverage point. A good goal isn't just about what you want to achieve, but how it will shift your overall system for the better.</p>
            </div>

            <div class="insights-box">
                <h3>Focus on the Shift, Not Just the Outcome</h3>
                <p>Instead of "lose 10 pounds," think "build sustainable habits that support my well-being." The system shift is more powerful than a single outcome.</p>
            </div>

            <div class="input-group">
                <label for="leveragePointGoal">Your identified leverage point:</label>
                <input type="text" id="leveragePointGoal" readonly>
            </div>

            <div class="input-group">
                <label for="goalStatement">Your Goal Statement:</label>
                <textarea id="goalStatement" placeholder="What is the key system shift you want to create? (e.g., 'To consistently prioritize my energy so I can show up fully for my family and work.')" required></textarea>
            </div>

            <div class="goal-examples">
                <strong>Examples:</strong>
                <ul>
                    <li>"To feel less overwhelmed" → "To end my workday knowing I completed my top priority"</li>
                    <li>"To feel more present with family" → "To have one conversation each evening where I'm fully listening"</li>
                </ul>
            </div>

            <div class="input-group">
                <label for="goalImpact">How will achieving this goal impact your overall system?</label>
                <textarea id="goalImpact" placeholder="What positive ripple effects do you anticipate?"></textarea>
            </div>

            <div class="input-group">
                <label for="successMetrics">How will you know you've succeeded? (Specific, measurable indicators)</label>
                <textarea id="successMetrics" placeholder="e.g., 'I feel energized by 3 PM most days,' 'I'm completing my most important task by noon,' 'I have 2 evenings per week completely free.'"></textarea>
            </div>

            <div class="reality-check">
                <h3>Reality Check Your Goal</h3>
                <p>Let's make sure this goal fits your actual life:</p>
                <div class="goal-criteria">
                    <div class="criteria-item">
                        <strong>Realistic:</strong> Can you actually do this with your current energy and time?
                    </div>
                    <div class="criteria-item">
                        <strong>Connected:</strong> Does it address the pattern you identified in your map?
                    </div>
                    <div class="criteria-item">
                        <strong>Yours:</strong> Is this what YOU want, not what you think you should want?
                    </div>
                </div>
            </div>

            <div class="input-group">
                <label for="potentialObstacles">What potential obstacles might arise, and how will you address them?</label>
                <textarea id="potentialObstacles" placeholder="Think about your energy drainers and patterns. How can you anticipate and mitigate them?"></textarea>
            </div>

            <div class="section-nav">
                <button class="btn btn-secondary" onclick="app.showSection('patterns')">← Back</button>
                <button class="btn" onclick="app.showSection('roadmap')">Create Your Roadmap →</button>
            </div>
        `;
    }

    /**
     * Get roadmap section content
     * @returns {string} HTML content
     */
    getRoadmapContent() {
        return `
            <h2>Create Your Roadmap</h2>
            <div class="roadmap-intro">
                <p>A roadmap isn't a rigid plan, but a flexible guide. It helps you take your big goal and break it into manageable steps, focusing on actions that leverage your system for positive change.</p>
            </div>

            <div class="insights-box">
                <h3>Small, Consistent Shifts</h3>
                <p>Remember, systems change through consistent, small adjustments, not massive overhauls. Focus on the next few steps.</p>
            </div>

            <div class="input-group">
                <label for="roadmapGoal">Your Goal:</label>
                <input type="text" id="roadmapGoal" readonly>
            </div>

            <div class="roadmap-columns">
                <div class="roadmap-column now-column">
                    <h4>NOW (Start This Week)</h4>
                    <p>Tiny shifts you can make immediately. They should feel almost too easy—that's the point.</p>
                    <div class="input-group">
                        <label for="nowAction">Your tiny shift:</label>
                        <textarea id="nowAction" placeholder="What's one small thing you could change this week?"></textarea>
                    </div>
                </div>
                
                <div class="roadmap-column experiment-column">
                    <h4>EXPERIMENT (Next Month)</h4>
                    <p>Slightly bigger changes you want to test. Think of them as experiments, not commitments.</p>
                    <div class="input-group">
                        <label for="experimentAction">Experiment 1:</label>
                        <textarea id="experimentAction" placeholder="What boundary or routine would support your goal?"></textarea>
                    </div>
                </div>
                
                <div class="roadmap-column later-column">
                    <h4>LATER (When You Have Capacity)</h4>
                    <p>Bigger changes or dreams that emerged from your mapping process.</p>
                    <div class="input-group">
                        <label for="laterAction">Later goal:</label>
                        <textarea id="laterAction" placeholder="What bigger change does your system map point toward?"></textarea>
                    </div>
                </div>
            </div>

            <div class="weekly-checkin">
                <h3>Your Weekly Check-In Questions</h3>
                <p>At the end of each week, spend 5 minutes with these questions:</p>
                <ul class="checkin-questions">
                    <li>What did I actually do from my NOW column?</li>
                    <li>What did I learn about my system this week?</li>
                    <li>What's one small adjustment I want to make for next week?</li>
                    <li>What am I ready to move from EXPERIMENT to NOW, or from LATER to EXPERIMENT?</li>
                </ul>
            </div>

            <div class="input-group">
                <label for="flexibilityPlan">How will you build flexibility into your roadmap?</label>
                <textarea id="flexibilityPlan" placeholder="What's your plan for when things don't go perfectly?"></textarea>
            </div>

            <div class="input-group">
                <label for="supportSystem">Who or what is your support system for this journey?</label>
                <textarea id="supportSystem" placeholder="People, resources, practices..."></textarea>
            </div>

            <div class="section-nav">
                <button class="btn btn-secondary" onclick="app.showSection('goals')">← Back</button>
                <button class="btn" onclick="app.showSection('commitment')">Anchor Your Commitment →</button>
            </div>
        `;
    }

    /**
     * Get commitment section content
     * @returns {string} HTML content
     */
    getCommitmentContent() {
        return `
            <h2>Anchor Your Commitment</h2>
            <div class="commitment-intro">
                <p>You've done the deep work. You've mapped your system, identified your leverage point, set a clear goal, and outlined your roadmap. Now, let's anchor this commitment to yourself.</p>
            </div>

            <div class="commitment-card">
                <h3>Your Personal Clarity Pledge</h3>
                <p>"I, <span id="pledgeName">[Your Name]</span>, commit to the journey of understanding and intentionally shifting my system. I will focus on my leverage point, knowing that small, consistent actions create powerful ripple effects. I trust my inner wisdom and am ready to embrace the clarity that unfolds."</p>
                
                <div class="input-group">
                    <label for="yourName">Your Name:</label>
                    <input type="text" id="yourName" placeholder="Type your name here">
                </div>
            </div>

            <div class="commitment-foundation">
                <h3>Before you commit, let's ground it in what you've discovered:</h3>

                <div class="input-group">
                    <label for="commitmentFoundation">From your mapping work, what's the one insight that surprised you most?</label>
                    <textarea id="commitmentFoundation" placeholder="What connection or pattern did you discover?"></textarea>
                </div>

                <div class="input-group">
                    <label for="patternToInterrupt">What pattern or loop are you ready to interrupt?</label>
                    <textarea id="patternToInterrupt" placeholder="What cycle do you want to change?"></textarea>
                </div>

                <div class="input-group">
                    <label for="nowColumnImportant">From your roadmap, what's the one thing in your NOW column that feels most important?</label>
                    <textarea id="nowColumnImportant" placeholder="What small change are you most ready to make?"></textarea>
                </div>

                <div class="input-group">
                    <label for="whatToGain">What will you gain by making this change? (Not what you think you should gain, but what you actually want.)</label>
                    <textarea id="whatToGain" placeholder="How will this change improve your life?"></textarea>
                </div>
            </div>

            <div class="commitment-guidelines">
                <h4>Craft Your Commitment</h4>
                <p>Now, write your commitment in your own words:</p>
                <ul>
                    <li>Start with "I commit to..."</li>
                    <li>Be specific about what you'll do, not just what you'll stop doing</li>
                    <li>Include why it matters to you</li>
                    <li>Make it something you can imagine saying to a trusted friend</li>
                </ul>
            </div>

            <div class="input-group">
                <label for="commitmentText">My Commitment:</label>
                <textarea id="commitmentText" placeholder="I commit to..." required></textarea>
            </div>

            <div class="input-group">
                <label for="whenHard">When this gets hard (and it will), I will remember that:</label>
                <textarea id="whenHard" placeholder="What will help you stay connected to your intention when things get difficult?"></textarea>
            </div>

            <div class="support-system">
                <h3>Your Support System</h3>

                <div class="input-group">
                    <label for="supportWho">Who in your life will cheer you on without judgment?</label>
                    <textarea id="supportWho" placeholder="Think of people who support your growth..."></textarea>
                </div>

                <div class="input-group">
                    <label for="supportEnvironment">What environment or space helps you feel most like yourself?</label>
                    <textarea id="supportEnvironment" placeholder="Where do you feel grounded and authentic?"></textarea>
                </div>

                <div class="input-group">
                    <label for="whenStumble">What will you do when you inevitably stumble? (Because you're human, and humans stumble.)</label>
                    <textarea id="whenStumble" placeholder="How will you practice self-compassion and get back on track?"></textarea>
                </div>

                <div class="input-group">
                    <label for="reminderRitual">What reminder or ritual will help you stay connected to your intention?</label>
                    <textarea id="reminderRitual" placeholder="A photo on your phone, a weekly walk, a note in your planner..."></textarea>
                </div>
            </div>

            <div class="signature-area">
                <div class="input-group">
                    <label for="signatureDate">Date:</label>
                    <input type="date" id="signatureDate">
                </div>
                
                <div class="input-group">
                    <label for="oneWord">One word that captures how this feels:</label>
                    <input type="text" id="oneWord" placeholder="Hopeful? Empowered? Ready?">
                </div>
            </div>

            <div class="input-group">
                <label for="finalReflection">Final Reflection:</label>
                <textarea id="finalReflection" placeholder="What's one last insight or feeling you want to capture about this process?"></textarea>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <button class="btn" onclick="app.summarizeReflection()">✨ Summarize My Journey ✨</button>
                <div id="summaryInsight" class="ai-response-box" style="display: none;"></div>
            </div>

            <div class="final-reflection">
                <h3>Congratulations!</h3>
                <p>You've completed your Clarity Map. This isn't a one-time exercise; it's a living document. Revisit it whenever you feel stuck or need to re-align. Your clarity will deepen with each reflection.</p>
            </div>

            <div class="section-nav">
                <button class="btn btn-secondary" onclick="app.showSection('roadmap')">← Back</button>
                <button class="btn" onclick="app.showSection('welcome')">Start Over</button>
                <button class="btn btn-secondary" onclick="app.exportJournal()">Export Journal</button>
            </div>
        `;
    }

    /**
     * Initialize section-specific features
     * @param {string} sectionId - Section ID
     */
    initializeSectionFeatures(sectionId) {
        switch (sectionId) {
            case 'mapping':
                this.populateMapElements();
                break;
            case 'commitment':
                this.setupNameUpdater();
                this.setCurrentDate();
                break;
        }
    }

    /**
     * Populate section with saved data
     * @param {string} sectionId - Section ID
     */
    populateSectionData(sectionId) {
        const sectionData = this.journalData.getSection(sectionId);
        
        // Auto-populate from previous sections
        this.journalData.setupAutoPopulation(sectionId);
        
        // Populate saved data
        Object.keys(sectionData).forEach(fieldId => {
            const element = Utils.getElementById(fieldId);
            const value = sectionData[fieldId];
            
            if (element && value !== undefined) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else if (element.tagName === 'SELECT') {
                    element.value = value;
                } else if (fieldId === 'lifeAreas' && Array.isArray(value)) {
                    // Handle checkbox groups
                    value.forEach(area => {
                        const checkbox = Utils.getElementById(`area-${area}`);
                        if (checkbox) checkbox.checked = true;
                    });
                } else {
                    element.value = value;
                }
            }
        });
    }

    /**
     * Save current section data
     */
    saveCurrentSectionData() {
        const section = Utils.getElementById(this.currentSection);
        if (!section) return;

        const sectionData = {};
        const inputs = section.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.id) {
                if (input.type === 'checkbox') {
                    if (input.name === 'lifeAreas') {
                        // Handle checkbox groups
                        if (!sectionData.lifeAreas) sectionData.lifeAreas = [];
                        if (input.checked) {
                            sectionData.lifeAreas.push(input.value);
                        }
                    } else {
                        sectionData[input.id] = input.checked;
                    }
                } else {
                    sectionData[input.id] = input.value;
                }
            }
        });

        this.journalData.saveSection(this.currentSection, sectionData);
    }

    /**
     * Populate map elements in mapping section
     */
    populateMapElements() {
        const mapEnergyGivers = document.getElementById('mapEnergyGivers');
        const mapEnergyDrainers = document.getElementById('mapEnergyDrainers');
        const mapPattern = document.getElementById('mapPattern');
        
        if (mapEnergyGivers) {
            const giver1 = this.journalData.getField('connections', 'energyGiver1');
            const giver2 = this.journalData.getField('connections', 'energyGiver2');
            mapEnergyGivers.textContent = [giver1, giver2].filter(Boolean).join(', ');
        }
        
        if (mapEnergyDrainers) {
            const drainer1 = this.journalData.getField('connections', 'energyDrainer1');
            const drainer2 = this.journalData.getField('connections', 'energyDrainer2');
            mapEnergyDrainers.textContent = [drainer1, drainer2].filter(Boolean).join(', ');
        }
        
        if (mapPattern) {
            const pattern = this.journalData.getField('connections', 'strongestPattern');
            mapPattern.textContent = pattern;
        }
    }

    /**
     * Setup name updater for commitment section
     */
    setupNameUpdater() {
        const nameInput = Utils.getElementById('yourName');
        const pledgeName = Utils.getElementById('pledgeName');
        
        if (nameInput && pledgeName) {
            nameInput.addEventListener('input', () => {
                pledgeName.textContent = nameInput.value || '[Your Name]';
            });
            
            // Set initial value if exists
            const savedName = this.journalData.getField('commitment', 'yourName');
            if (savedName) {
                nameInput.value = savedName;
                pledgeName.textContent = savedName;
            }
        }
    }

    /**
     * Set current date in commitment section
     */
    setCurrentDate() {
        const dateInput = Utils.getElementById('signatureDate');
        if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    /**
     * Update active navigation button
     */
    updateActiveNavButton() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.classList.remove('active');
            if (button.onclick && button.onclick.toString().includes(this.currentSection)) {
                button.classList.add('active');
            }
        });
    }

    /**
     * Bind global event handlers
     */
    bindGlobalEvents() {
        // Auto-save on form changes
        document.addEventListener('input', Utils.debounce((event) => {
            if (event.target.matches('input, textarea, select')) {
                this.handleFieldChange(event.target);
            }
        }, 1000));

        // Handle form submissions
        document.addEventListener('submit', (event) => {
            event.preventDefault();
        });

        // Handle window beforeunload
        window.addEventListener('beforeunload', () => {
            this.saveCurrentSectionData();
        });
    }

    /**
     * Handle individual field changes
     * @param {HTMLElement} field - Changed field
     */
    handleFieldChange(field) {
        if (!field.id) return;
        
        let value = field.value;
        if (field.type === 'checkbox') {
            value = field.checked;
        }
        
        this.journalData.saveField(this.currentSection, field.id, value);
    }

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveCurrentSectionData();
        }, 30000);
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Only handle shortcuts when not in input fields
            if (event.target.matches('input, textarea, select')) return;
            
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case 's':
                        event.preventDefault();
                        this.saveCurrentSectionData();
                        Utils.showToast('Progress saved!', 'success', 2000);
                        break;
                    case 'ArrowRight':
                        event.preventDefault();
                        this.navigateNext();
                        break;
                    case 'ArrowLeft':
                        event.preventDefault();
                        this.navigatePrevious();
                        break;
                }
            }
        });
    }

    /**
     * Navigate to next section
     */
    navigateNext() {
        const nextSection = this.progressTracker.goToNextSection();
        if (nextSection) {
            this.showSection(nextSection);
        }
    }

    /**
     * Navigate to previous section
     */
    navigatePrevious() {
        const prevSection = this.progressTracker.goToPreviousSection();
        if (prevSection) {
            this.showSection(prevSection);
        }
    }

    /**
     * Dispatch section change event
     * @param {string} sectionId - New section ID
     */
    dispatchSectionChangeEvent(sectionId) {
        const event = new CustomEvent('sectionChange', {
            detail: { sectionId, timestamp: new Date() }
        });
        window.dispatchEvent(event);
    }

    /**
     * Generate interactive map
     */
    generateMap() {
        const mappingData = this.journalData.getSection('mapping');
        this.mappingSystem.generateMap(mappingData);
    }

    /**
     * Select pattern card
     * @param {string} patternId - Pattern identifier
     */
    selectPattern(patternId) {
        // Remove previous selections
        document.querySelectorAll('.pattern-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Select new pattern
        const selectedCard = document.querySelector(`[onclick*="${patternId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Save selection
        this.journalData.saveField('patterns', 'selectedPattern', patternId);
    }

    /**
     * Uncover hidden patterns using AI
     */
    async uncoverHiddenPatterns() {
        const influencesData = this.journalData.getSection('influences');
        const targetElement = Utils.getElementById('patternsInsight');
        
        this.aiIntegration.handleAIButtonClick(
            () => this.aiIntegration.generateInfluencesInsights(influencesData),
            targetElement
        );
    }

    /**
     * Summarize reflection using AI
     */
    async summarizeReflection() {
        const journalData = this.journalData.data;
        const targetElement = Utils.getElementById('summaryInsight');
        
        this.aiIntegration.handleAIButtonClick(
            () => this.aiIntegration.generateFinalReflection(journalData),
            targetElement
        );
    }

    /**
     * Export journal data
     */
    exportJournal() {
        try {
            const exportData = this.journalData.exportData('text');
            const blob = new Blob([exportData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `clarity-map-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            Utils.showToast('Journal exported successfully!', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            Utils.showToast('Export failed. Please try again.', 'error');
        }
    }

    /**
     * Show progress modal
     */
    showProgress() {
        this.progressTracker.showProgressModal();
    }

    /**
     * Reset all data (with confirmation)
     */
    resetJournal() {
        if (confirm('Are you sure you want to reset all your journal data? This cannot be undone.')) {
            this.journalData.clearAllData();
            this.progressTracker.resetProgress();
            this.showSection('welcome');
            Utils.showToast('Journal reset successfully.', 'info');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ClarityMapApp();
});

// Make app available globally for onclick handlers
window.ClarityMapApp = ClarityMapApp;
