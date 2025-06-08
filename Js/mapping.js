/**
 * CLARITY MAP - VISUAL MAPPING
 * Handles the interactive system mapping functionality
 */

class MappingSystem {
    constructor() {
        this.canvas = null;
        this.elements = [];
        this.connections = [];
        this.isDragging = false;
        this.dragElement = null;
        this.dragOffset = { x: 0, y: 0 };
        
        this.setupEventListeners();
    }

    /**
     * Initialize the mapping canvas
     * @param {string} canvasId - ID of the canvas container
     */
    initializeCanvas(canvasId) {
        this.canvas = Utils.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas element with ID '${canvasId}' not found`);
            return false;
        }

        this.canvas.innerHTML = '';
        this.canvas.style.position = 'relative';
        this.setupCanvasEvents();
        
        return true;
    }

    /**
     * Setup canvas event listeners
     */
    setupCanvasEvents() {
        if (!this.canvas) return;

        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    /**
     * Generate interactive map from journal data
     * @param {Object} mappingData - Data from the mapping section
     */
    generateMap(mappingData) {
        if (!this.initializeCanvas('mappingCanvas')) {
            this.showFallbackMap(mappingData);
            return;
        }

        const { mapFocus, mapEnergyGivers, mapEnergyDrainers, mapPattern } = mappingData;
        
        this.elements = [];
        this.connections = [];

        // Create center focus element
        this.createFocusElement(mapFocus || 'Your Focus');

        // Create surrounding elements
        this.createSurroundingElements(mapEnergyGivers, mapEnergyDrainers, mapPattern);

        // Draw all elements
        this.renderElements();

        // Create connections
        this.createConnections();

        // Add instructions
        this.addInstructions();
    }

    /**
     * Create the central focus element
     * @param {string} focusText - Focus area text
     */
    createFocusElement(focusText) {
        const centerElement = {
            id: 'focus',
            text: focusText,
            type: 'focus',
            x: this.canvas.offsetWidth / 2,
            y: this.canvas.offsetHeight / 2,
            width: 150,
            height: 60,
            draggable: false
        };

        this.elements.push(centerElement);
    }

    /**
     * Create surrounding elements for influences
     * @param {string} energyGivers - Energy givers text
     * @param {string} energyDrainers - Energy drainers text
     * @param {string} pattern - Pattern text
     */
    createSurroundingElements(energyGivers, energyDrainers, pattern) {
        const centerX = this.canvas.offsetWidth / 2;
        const centerY = this.canvas.offsetHeight / 2;
        const radius = 120;

        // Parse energy givers
        const givers = this.parseInfluenceText(energyGivers);
        givers.forEach((giver, index) => {
            const angle = (index * 2 * Math.PI) / Math.max(givers.length, 1) - Math.PI / 2;
            this.elements.push({
                id: `giver-${index}`,
                text: giver,
                type: 'positive',
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                width: 100,
                height: 50,
                draggable: true
            });
        });

        // Parse energy drainers
        const drainers = this.parseInfluenceText(energyDrainers);
        drainers.forEach((drainer, index) => {
            const angle = (index * 2 * Math.PI) / Math.max(drainers.length, 1) + Math.PI / 2;
            this.elements.push({
                id: `drainer-${index}`,
                text: drainer,
                type: 'negative',
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                width: 100,
                height: 50,
                draggable: true
            });
        });

        // Add pattern element
        if (pattern && pattern.trim()) {
            this.elements.push({
                id: 'pattern',
                text: pattern,
                type: 'pattern',
                x: centerX + 140,
                y: centerY - 100,
                width: 120,
                height: 50,
                draggable: true
            });
        }
    }

    /**
     * Parse influence text into individual items
     * @param {string} text - Comma-separated text
     * @returns {Array<string>} Array of individual influences
     */
    parseInfluenceText(text) {
        if (!text || typeof text !== 'string') return [];
        
        return text
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0)
            .slice(0, 4); // Limit to 4 items for visual clarity
    }

    /**
     * Render all elements on the canvas
     */
    renderElements() {
        this.elements.forEach(element => {
            const elementDiv = this.createElement(element);
            this.canvas.appendChild(elementDiv);
        });
    }

    /**
     * Create DOM element for a map element
     * @param {Object} element - Element data
     * @returns {HTMLElement} Created DOM element
     */
    createElement(element) {
        const div = Utils.createElement('div', {
            id: `map-element-${element.id}`,
            className: `map-element ${element.type}-element`,
            style: `
                position: absolute;
                left: ${element.x - element.width / 2}px;
                top: ${element.y - element.height / 2}px;
                width: ${element.width}px;
                height: ${element.height}px;
                background: var(--color-primary);
                color: white;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                font-size: 0.8em;
                font-weight: 500;
                padding: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                cursor: ${element.draggable ? 'move' : 'default'};
                user-select: none;
                transition: transform 0.2s ease;
                z-index: 10;
            `,
            dataset: {
                elementId: element.id,
                elementType: element.type
            }
        }, this.truncateText(element.text, 50));

        // Add hover effect
        if (element.draggable) {
            div.addEventListener('mouseenter', () => {
                div.style.transform = 'scale(1.05)';
            });
            div.addEventListener('mouseleave', () => {
                if (!this.isDragging) {
                    div.style.transform = 'scale(1)';
                }
            });
        }

        return div;
    }

    /**
     * Truncate text to fit in element
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    /**
     * Create connections between elements
     */
    createConnections() {
        const focusElement = this.elements.find(el => el.type === 'focus');
        if (!focusElement) return;

        // Connect all elements to focus
        this.elements.forEach(element => {
            if (element.type !== 'focus') {
                this.createConnection(element, focusElement, element.type);
            }
        });
    }

    /**
     * Create a visual connection between two elements
     * @param {Object} from - Source element
     * @param {Object} to - Target element
     * @param {string} type - Connection type
     */
    createConnection(from, to, type) {
        const line = Utils.createElement('div', {
            className: `connection connection-${type}`,
            style: `
                position: absolute;
                background: ${this.getConnectionColor(type)};
                height: 2px;
                transform-origin: left center;
                pointer-events: none;
                z-index: 1;
            `
        });

        this.updateConnectionPosition(line, from, to);
        this.canvas.appendChild(line);

        this.connections.push({
            element: line,
            from: from,
            to: to,
            type: type
        });
    }

    /**
     * Get color for connection type
     * @param {string} type - Connection type
     * @returns {string} CSS color
     */
    getConnectionColor(type) {
        const colors = {
            positive: 'var(--color-primary)',
            negative: 'var(--color-negative)',
            pattern: 'var(--color-secondary)'
        };
        return colors[type] || 'var(--color-border)';
    }

    /**
     * Update connection line position
     * @param {HTMLElement} line - Line element
     * @param {Object} from - Source element
     * @param {Object} to - Target element
     */
    updateConnectionPosition(line, from, to) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        line.style.left = `${from.x}px`;
        line.style.top = `${from.y}px`;
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}rad)`;
    }

    /**
     * Add instructions to the canvas
     */
    addInstructions() {
        const instructions = Utils.createElement('div', {
            className: 'map-instructions',
            style: `
                position: absolute;
                bottom: 10px;
                left: 10px;
                right: 10px;
                text-align: center;
                font-size: 0.8em;
                color: var(--color-text-secondary);
                background: rgba(255,255,255,0.9);
                padding: 8px;
                border-radius: 4px;
                z-index: 100;
            `
        }, 'Drag the colored elements to explore connections. The center represents your focus area.');

        this.canvas.appendChild(instructions);
    }

    /**
     * Handle mouse down events
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseDown(event) {
        const element = event.target.closest('.map-element');
        if (!element || element.dataset.elementType === 'focus') return;

        this.startDrag(element, event.clientX, event.clientY);
        event.preventDefault();
    }

    /**
     * Handle touch start events
     * @param {TouchEvent} event - Touch event
     */
    handleTouchStart(event) {
        const element = event.target.closest('.map-element');
        if (!element || element.dataset.elementType === 'focus') return;

        const touch = event.touches[0];
        this.startDrag(element, touch.clientX, touch.clientY);
        event.preventDefault();
    }

    /**
     * Start dragging an element
     * @param {HTMLElement} element - Element to drag
     * @param {number} clientX - X coordinate
     * @param {number} clientY - Y coordinate
     */
    startDrag(element, clientX, clientY) {
        this.isDragging = true;
        this.dragElement = element;

        const rect = element.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        
        this.dragOffset = {
            x: clientX - rect.left - rect.width / 2,
            y: clientY - rect.top - rect.height / 2
        };

        element.style.transform = 'scale(1.1)';
        element.style.zIndex = '100';
    }

    /**
     * Handle mouse move events
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseMove(event) {
        if (!this.isDragging || !this.dragElement) return;
        
        this.updateDragPosition(event.clientX, event.clientY);
        event.preventDefault();
    }

    /**
     * Handle touch move events
     * @param {TouchEvent} event - Touch event
     */
    handleTouchMove(event) {
        if (!this.isDragging || !this.dragElement) return;
        
        const touch = event.touches[0];
        this.updateDragPosition(touch.clientX, touch.clientY);
        event.preventDefault();
    }

    /**
     * Update drag position
     * @param {number} clientX - X coordinate
     * @param {number} clientY - Y coordinate
     */
    updateDragPosition(clientX, clientY) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const elementWidth = parseInt(this.dragElement.style.width);
        const elementHeight = parseInt(this.dragElement.style.height);
        
        let newX = clientX - canvasRect.left - this.dragOffset.x;
        let newY = clientY - canvasRect.top - this.dragOffset.y;

        // Constrain to canvas bounds
        newX = Math.max(elementWidth / 2, Math.min(this.canvas.offsetWidth - elementWidth / 2, newX));
        newY = Math.max(elementHeight / 2, Math.min(this.canvas.offsetHeight - elementHeight / 2, newY));

        this.dragElement.style.left = `${newX - elementWidth / 2}px`;
        this.dragElement.style.top = `${newY - elementHeight / 2}px`;

        // Update element data
        const elementId = this.dragElement.dataset.elementId;
        const element = this.elements.find(el => el.id === elementId);
        if (element) {
            element.x = newX;
            element.y = newY;
        }

        // Update connections
        this.updateConnections();
    }

    /**
     * Handle mouse up and touch end events
     */
    handleMouseUp() {
        this.endDrag();
    }

    handleTouchEnd() {
        this.endDrag();
    }

    /**
     * End dragging
     */
    endDrag() {
        if (this.dragElement) {
            this.dragElement.style.transform = 'scale(1)';
            this.dragElement.style.zIndex = '10';
        }

        this.isDragging = false;
        this.dragElement = null;
        this.dragOffset = { x: 0, y: 0 };
    }

    /**
     * Update all connection positions
     */
    updateConnections() {
        this.connections.forEach(connection => {
            this.updateConnectionPosition(connection.element, connection.from, connection.to);
        });
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
            if (this.canvas && this.elements.length > 0) {
                this.repositionElements();
            }
        }, 250));
    }

    /**
     * Reposition elements on resize
     */
    repositionElements() {
        const centerX = this.canvas.offsetWidth / 2;
        const centerY = this.canvas.offsetHeight / 2;

        // Update focus element position
        const focusElement = this.elements.find(el => el.type === 'focus');
        if (focusElement) {
            focusElement.x = centerX;
            focusElement.y = centerY;
            
            const focusDiv = Utils.getElementById(`map-element-${focusElement.id}`);
            if (focusDiv) {
                focusDiv.style.left = `${centerX - focusElement.width / 2}px`;
                focusDiv.style.top = `${centerY - focusElement.height / 2}px`;
            }
        }

        this.updateConnections();
    }

    /**
     * Show fallback static map when canvas fails
     * @param {Object} mappingData - Mapping data
     */
    showFallbackMap(mappingData) {
        const canvas = Utils.getElementById('mappingCanvas');
        if (!canvas) return;

        const { mapFocus, mapEnergyGivers, mapEnergyDrainers, mapPattern } = mappingData;

        canvas.innerHTML = `
            <div style="text-align: center; padding: 20px; font-family: sans-serif; color: #333;">
                <div style="background: var(--color-primary); color: white; padding: 15px 25px; border-radius: 50px; font-weight: bold; margin-bottom: 20px; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    ${mapFocus || 'Your Focus'}
                </div>
                
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; max-width: 90%; margin: 0 auto;">
                    ${this.createFallbackElements(mapEnergyGivers, 'positive', '+ ')}
                    ${this.createFallbackElements(mapEnergyDrainers, 'negative', '- ')}
                    ${mapPattern ? `<div style="background: var(--color-secondary); color: white; padding: 8px 15px; border-radius: 20px; font-size: 0.9em;">Pattern: ${mapPattern}</div>` : ''}
                </div>
                
                <p style="margin-top: 20px; font-size: 0.8em; color: #666;">
                    This is a visual representation of your system connections.
                </p>
            </div>
        `;
    }

    /**
     * Create fallback elements for static display
     * @param {string} text - Text to parse
     * @param {string} type - Element type
     * @param {string} prefix - Prefix for display
     * @returns {string} HTML string
     */
    createFallbackElements(text, type, prefix) {
        if (!text) return '';
        
        const className = type === 'positive' ? 'positive-element' : 'negative-element';
        
        return this.parseInfluenceText(text)
            .map(item => `<div class="${className}" style="padding: 8px 15px; border-radius: 20px; font-size: 0.9em; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">${prefix}${item}</div>`)
            .join('');
    }

    /**
     * Export map as image (placeholder for future implementation)
     * @returns {Promise<Blob>} Image blob
     */
    async exportAsImage() {
        // This would require HTML2Canvas or similar library
        // For now, return a placeholder
        throw new Error('Image export not yet implemented');
    }

    /**
     * Clear the mapping canvas
     */
    clearCanvas() {
        if (this.canvas) {
            this.canvas.innerHTML = '';
        }
        this.elements = [];
        this.connections = [];
    }
}

// Make MappingSystem available globally
window.MappingSystem = MappingSystem;
