# Clarity Map - Interactive Systems Thinking Journal

A web-based interactive journal that helps users understand the patterns shaping their lives through systems thinking and visual mapping.

## 🌟 Features

- **Systems Thinking Approach**: Help users see connections between different areas of their life
- **Interactive Visual Mapping**: Drag-and-drop interface for exploring life systems
- **AI-Powered Insights**: Optional integration with Google Gemini for personalized reflections
- **Progress Tracking**: Visual progress indicators and completion tracking
- **Auto-Save**: Automatic saving to localStorage with manual export options
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Capable**: No server required - runs entirely in the browser

## 🚀 Quick Start

1. Clone or download the project files
2. Open `index.html` in a web browser
3. Start your clarity journey!

No build process or server setup required - it's a pure client-side application.

## 📁 Project Structure

```
clarity-map/
├── index.html              # Main application entry point
├── css/
│   ├── main.css            # Core styles and design system
│   ├── components.css      # UI component styles
│   └── sections.css        # Section-specific styles
├── js/
│   ├── app.js             # Main application logic
│   ├── journal-data.js    # Data management and persistence
│   ├── ai-integration.js  # AI features and API integration
│   ├── mapping.js         # Interactive visual mapping
│   ├── progress.js        # Progress tracking and navigation
│   └── utils.js           # Utility functions and helpers
└── README.md              # This file
```

## 🎯 How It Works

The Clarity Map guides users through a 9-step process:

1. **Welcome** - Introduction to systems thinking
2. **Define Focus** - Identify what needs attention
3. **Explore Influences** - Map energy givers/drainers and patterns
4. **Connect Dots** - Link influences to focus area
5. **Map Connections** - Create visual system map
6. **Find Pattern** - Identify system loops and patterns
7. **Set Goal** - Create systems-aligned goals
8. **Create Roadmap** - Build actionable steps (Now/Experiment/Later)
9. **Anchor Commitment** - Formalize commitment to change

## 🔧 Technical Features

### Data Management
- **localStorage Integration**: All data persists locally in the browser
- **Auto-save**: Changes saved automatically every 2 seconds after editing
- **Export/Import**: Export journal as text or JSON for backup
- **Data Validation**: Ensures data integrity and handles version updates

### AI Integration (Optional)
- **Google Gemini Integration**: Provides personalized insights
- **Privacy-First**: API key stored locally, no data sent to our servers
- **Graceful Fallback**: Works fully without AI features
- **Configurable**: Users can enable/disable AI features

### Interactive Mapping
- **Drag & Drop**: Manipulate system elements visually
- **Real-time Connections**: Visual lines show relationships
- **Touch Support**: Works on mobile and tablet devices
- **Fallback Display**: Static view when interactive features fail

### Progress Tracking
- **Section Completion**: Track progress through each section
- **Field Validation**: Identify required vs. optional fields
- **Visual Indicators**: Progress bar and section status indicators
- **Resume Capability**: Pick up where you left off

## 🎨 Design System

### Color Palette
- **Primary**: Sage Green (#A8C09A) - Growth and balance
- **Secondary**: Warm Terracotta (#D4A574) - Wisdom and grounding
- **Accent**: Warm Brown (#B08968) - Stability
- **Text**: Deep Forest Green (#2C3E2D) - Natural and readable
- **Background**: Warm Cream (#FAF7F0) - Comfortable and inviting

### Typography
- **Font Family**: Georgia serif for warmth and readability
- **Hierarchy**: Clear heading structure with appropriate sizing
- **Line Height**: 1.6 for comfortable reading

### Components
- **Responsive Grid**: Adapts to different screen sizes
- **Interactive Elements**: Hover states and smooth transitions
- **Form Components**: Accessible and user-friendly inputs
- **Information Boxes**: Different styles for various content types

## 🔌 AI Setup (Optional)

To enable AI-powered insights:

1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click any "✨ AI Insights ✨" button in the application
3. Enter your API key when prompted
4. Enjoy personalized reflections and pattern analysis!

**Privacy Note**: Your API key is stored only in your browser's localStorage and is never sent to our servers.

## 📱 Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features Used**: ES6+, CSS Grid, Flexbox, localStorage, Fetch API
- **Polyfills**: None required for modern browsers

## 🛠️ Development

### File Organization
- **Modular Architecture**: Each JavaScript file has a single responsibility
- **CSS Organization**: Separated by concern (main, components, sections)
- **Utility Functions**: Shared helpers in `utils.js`
- **Error Handling**: Graceful degradation and user-friendly error messages

### Code Standards
- **ES6+ JavaScript**: Modern syntax and features
- **CSS Custom Properties**: For consistent theming
- **Semantic HTML**: Accessible and meaningful markup
- **Progressive Enhancement**: Core functionality works without JavaScript

### Adding New Features

1. **New Section**: Add content method to `app.js` and styles to `sections.css`
2. **New Component**: Add styles to `components.css` and logic to appropriate JS file
3. **Data Fields**: Update data structure in `journal-data.js`
4. **AI Features**: Extend prompts and responses in `ai-integration.js`

## 📊 Data Structure

The journal data is organized into sections:

```javascript
{
  metadata: {
    created: "ISO timestamp",
    lastModified: "ISO timestamp", 
    currentSection: "section_id"
  },
  focus: {
    lifeChallenge: "string",
    lifeAreas: ["array"],
    wantMore: "string"
  },
  influences: {
    energyGivers: "string",
    energyDrainers: "string",
    // ... other fields
  },
  // ... other sections
}
```

## 🔒 Privacy & Security

- **Local-Only**: All data stored in browser localStorage
- **No Tracking**: No analytics or user tracking
- **API Keys**: Stored locally, never transmitted to our servers
- **Export Control**: Users control their data export/import
- **Open Source**: Full transparency in code and data handling

## 🤝 Contributing

This is currently a standalone project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across browsers
5. Submit a pull request

## 📄 License

This project is open source. Please see the license file for details.

## 🆘 Support

For issues or questions:

1. Check the browser console for error messages
2. Try refreshing the page to reload the application
3. Clear localStorage to reset data (this will erase saved progress)
4. Ensure you're using a modern browser with JavaScript enabled

## 🔮 Future Enhancements

- **Mobile App**: Native iOS/Android versions
- **Collaborative Features**: Share maps with trusted friends/coaches
- **Advanced Analytics**: Deeper insights into patterns over time
- **Integration**: Connect with calendar, task managers, etc.
- **Accessibility**: Enhanced screen reader and keyboard navigation support
- **Templates**: Pre-built patterns for common life situations

---

Built with ❤️ for people ready to understand their life patterns and create positive change.