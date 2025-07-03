// src/services/themeService.js
import DatabaseService from './database.js';

class ThemeService {
  constructor() {
    this.currentTheme = null;
    this.customThemes = new Map();
    this.defaultThemes = this.getDefaultThemes();
    this.cssVariables = new Map();
    this.themeObservers = new Set();
    
    // Initialize database service first
    this.initialize();
  }

  async initialize() {
    try {
      // Initialize database service
      await DatabaseService.initialize();
      
      // Load themes and initialize theme
      this.loadThemes();
      this.initializeTheme();
      
      console.log('Theme service initialized successfully');
    } catch (error) {
      console.error('Theme service initialization failed:', error);
      // Fallback to default theme
      this.currentTheme = 'app-default';
      this.initializeTheme();
    }
  }

  // Default theme presets inspired by popular Linux themes and your app's aesthetic
  getDefaultThemes() {
    return {
      'app-default': {
        name: 'App Default',
        type: 'light',
        colors: {
          primary: '#102542',
          secondary: '#1a3a5c',
          accent: '#f87060',
          accent_light: '#fa9285',
          background: '#f8fafc',
          surface: 'rgba(255, 255, 255, 0.1)',
          surface_variant: 'rgba(255, 255, 255, 0.05)',
          text_primary: '#102542',
          text_secondary: '#1a3a5c',
          text_muted: '#64748b',
          text_accent: '#f87060',
          border: '#e2e8f0',
          glass: 'rgba(255, 255, 255, 0.1)',
          glass_border: 'rgba(255, 255, 255, 0.2)',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
          gradient_start: '#102542',
          gradient_end: '#1a3a5c'
        },
        fonts: {
          primary: 'Proxima Nova, -apple-system, BlinkMacSystemFont, sans-serif',
          secondary: 'JetBrains Mono, Monaco, monospace',
          heading: 'Proxima Nova, sans-serif'
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          xxl: '3rem'
        },
        borderRadius: {
          sm: '0.375rem',
          md: '0.5rem',
          lg: '0.75rem',
          xl: '1rem',
          full: '9999px'
        },
        shadows: {
          sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          glow: '0 0 20px rgba(248, 112, 96, 0.3)'
        },
        animations: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
          bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        effects: {
          blur: '10px',
          glass_opacity: '0.1',
          hover_scale: '1.05',
          hover_lift: '-0.25rem'
        }
      },
      'dark-professional': {
        name: 'Dark Professional',
        type: 'dark',
        colors: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#06d6a0',
          accent_light: '#34d399',
          background: '#0f172a',
          surface: 'rgba(30, 41, 59, 0.8)',
          surface_variant: 'rgba(51, 65, 85, 0.6)',
          text_primary: '#f8fafc',
          text_secondary: '#cbd5e1',
          text_muted: '#64748b',
          text_accent: '#06d6a0',
          border: '#374151',
          glass: 'rgba(30, 41, 59, 0.3)',
          glass_border: 'rgba(148, 163, 184, 0.2)',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
          gradient_start: '#0f172a',
          gradient_end: '#1e293b'
        },
        fonts: {
          primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          secondary: 'JetBrains Mono, Monaco, monospace',
          heading: 'Poppins, sans-serif'
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          xxl: '3rem'
        },
        borderRadius: {
          sm: '0.25rem',
          md: '0.5rem',
          lg: '0.75rem',
          xl: '1rem',
          full: '9999px'
        },
        shadows: {
          sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
          md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
          xl: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          glow: '0 0 20px rgba(99, 102, 241, 0.4)'
        },
        animations: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
          bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        effects: {
          blur: '12px',
          glass_opacity: '0.3',
          hover_scale: '1.05',
          hover_lift: '-0.25rem'
        }
      },
      'cyberpunk': {
        name: 'Cyberpunk',
        type: 'dark',
        colors: {
          primary: '#ff0080',
          secondary: '#00ffff',
          accent: '#ffff00',
          accent_light: '#ffff80',
          background: '#0a0a0a',
          surface: 'rgba(26, 26, 46, 0.9)',
          surface_variant: 'rgba(22, 33, 62, 0.8)',
          text_primary: '#00ffff',
          text_secondary: '#ff0080',
          text_muted: '#888888',
          text_accent: '#ffff00',
          border: '#333333',
          glass: 'rgba(26, 26, 46, 0.4)',
          glass_border: 'rgba(0, 255, 255, 0.3)',
          success: '#00ff00',
          warning: '#ffff00',
          error: '#ff0000',
          info: '#00ffff',
          gradient_start: '#0a0a0a',
          gradient_end: '#1a1a2e'
        },
        fonts: {
          primary: 'Orbitron, monospace',
          secondary: 'Source Code Pro, monospace',
          heading: 'Orbitron, monospace'
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          xxl: '3rem'
        },
        borderRadius: {
          sm: '0rem',
          md: '0.125rem',
          lg: '0.25rem',
          xl: '0.5rem',
          full: '0rem'
        },
        shadows: {
          sm: '0 0 5px rgba(255, 0, 128, 0.3)',
          md: '0 0 10px rgba(0, 255, 255, 0.3)',
          lg: '0 0 20px rgba(255, 255, 0, 0.3)',
          xl: '0 0 30px rgba(255, 0, 128, 0.5)',
          glow: '0 0 25px rgba(0, 255, 255, 0.6)'
        },
        animations: {
          fast: '100ms',
          normal: '200ms',
          slow: '400ms',
          bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        effects: {
          blur: '8px',
          glass_opacity: '0.4',
          hover_scale: '1.1',
          hover_lift: '-0.5rem'
        }
      },
      'forest': {
        name: 'Forest',
        type: 'dark',
        colors: {
          primary: '#4ade80',
          secondary: '#22c55e',
          accent: '#fde047',
          accent_light: '#fef08a',
          background: '#0c1510',
          surface: 'rgba(26, 46, 26, 0.8)',
          surface_variant: 'rgba(45, 62, 45, 0.6)',
          text_primary: '#dcfce7',
          text_secondary: '#bbf7d0',
          text_muted: '#86efac',
          text_accent: '#fde047',
          border: '#374151',
          glass: 'rgba(26, 46, 26, 0.3)',
          glass_border: 'rgba(74, 222, 128, 0.2)',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
          gradient_start: '#0c1510',
          gradient_end: '#1a2e1a'
        },
        fonts: {
          primary: 'Fira Sans, sans-serif',
          secondary: 'Fira Code, monospace',
          heading: 'Merriweather, serif'
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          xxl: '3rem'
        },
        borderRadius: {
          sm: '0.375rem',
          md: '0.5rem',
          lg: '0.75rem',
          xl: '1rem',
          full: '9999px'
        },
        shadows: {
          sm: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
          md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          xl: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          glow: '0 0 20px rgba(74, 222, 128, 0.3)'
        },
        animations: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
          bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        effects: {
          blur: '10px',
          glass_opacity: '0.3',
          hover_scale: '1.05',
          hover_lift: '-0.25rem'
        }
      },
      'sunset': {
        name: 'Sunset',
        type: 'light',
        colors: {
          primary: '#ea580c',
          secondary: '#dc2626',
          accent: '#f59e0b',
          accent_light: '#fbbf24',
          background: '#fffbeb',
          surface: 'rgba(254, 243, 199, 0.6)',
          surface_variant: 'rgba(253, 230, 138, 0.4)',
          text_primary: '#7c2d12',
          text_secondary: '#ea580c',
          text_muted: '#a3a3a3',
          text_accent: '#f59e0b',
          border: '#fed7aa',
          glass: 'rgba(254, 243, 199, 0.3)',
          glass_border: 'rgba(234, 88, 12, 0.2)',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
          gradient_start: '#fffbeb',
          gradient_end: '#fef3c7'
        },
        fonts: {
          primary: 'Nunito, sans-serif',
          secondary: 'Source Code Pro, monospace',
          heading: 'Playfair Display, serif'
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          xxl: '3rem'
        },
        borderRadius: {
          sm: '0.5rem',
          md: '0.75rem',
          lg: '1rem',
          xl: '1.5rem',
          full: '9999px'
        },
        shadows: {
          sm: '0 1px 2px 0 rgba(234, 88, 12, 0.1)',
          md: '0 4px 6px -1px rgba(234, 88, 12, 0.15)',
          lg: '0 10px 15px -3px rgba(234, 88, 12, 0.15)',
          xl: '0 25px 50px -12px rgba(234, 88, 12, 0.25)',
          glow: '0 0 20px rgba(245, 158, 11, 0.4)'
        },
        animations: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
          bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        effects: {
          blur: '8px',
          glass_opacity: '0.3',
          hover_scale: '1.05',
          hover_lift: '-0.25rem'
        }
      }
    };
  }

  loadThemes() {
    const savedCustomThemes = DatabaseService.getSetting('custom_themes');
    if (savedCustomThemes) {
      Object.entries(savedCustomThemes).forEach(([key, theme]) => {
        this.customThemes.set(key, theme);
      });
    }

    const currentThemeId = DatabaseService.getSetting('current_theme') || 'app-default';
    this.currentTheme = currentThemeId;
  }

  initializeTheme() {
    this.applyTheme(this.currentTheme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        const autoTheme = DatabaseService.getSetting('auto_theme');
        if (autoTheme) {
          this.setTheme(e.matches ? 'dark-professional' : 'app-default');
        }
      });
    }
  }

  // Get all available themes
  getAllThemes() {
    const themes = { ...this.defaultThemes };
    this.customThemes.forEach((theme, id) => {
      themes[id] = theme;
    });
    return themes;
  }

  // Get current theme
  getCurrentTheme() {
    const allThemes = this.getAllThemes();
    return allThemes[this.currentTheme] || allThemes['app-default'];
  }

  // Set theme by ID
  setTheme(themeId) {
    const allThemes = this.getAllThemes();
    if (!allThemes[themeId]) {
      console.warn(`Theme '${themeId}' not found. Using default theme.`);
      themeId = 'app-default';
    }

    this.currentTheme = themeId;
    DatabaseService.setSetting('current_theme', themeId);
    this.applyTheme(themeId);
    this.notifyObservers('theme-changed', { themeId, theme: allThemes[themeId] });
  }

  // Apply theme to DOM
  applyTheme(themeId) {
    const theme = this.getAllThemes()[themeId];
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key.replace(/_/g, '-')}`, value);
      this.cssVariables.set(`--color-${key.replace(/_/g, '-')}`, value);
    });

    // Apply font variables
    Object.entries(theme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
      this.cssVariables.set(`--font-${key}`, value);
    });

    // Apply spacing variables
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
      this.cssVariables.set(`--spacing-${key}`, value);
    });

    // Apply border radius variables
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
      this.cssVariables.set(`--radius-${key}`, value);
    });

    // Apply shadow variables
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
      this.cssVariables.set(`--shadow-${key}`, value);
    });

    // Apply animation variables
    Object.entries(theme.animations).forEach(([key, value]) => {
      root.style.setProperty(`--animation-${key}`, value);
      this.cssVariables.set(`--animation-${key}`, value);
    });

    // Apply effect variables
    if (theme.effects) {
      Object.entries(theme.effects).forEach(([key, value]) => {
        root.style.setProperty(`--effect-${key.replace(/_/g, '-')}`, value);
        this.cssVariables.set(`--effect-${key.replace(/_/g, '-')}`, value);
      });
    }

    // Set theme type data attribute
    root.setAttribute('data-theme', theme.type);
    root.setAttribute('data-theme-name', themeId);

    console.log(`Theme applied: ${theme.name} (${theme.type})`);
  }

  // Create custom theme
  createCustomTheme(themeData) {
    const themeId = themeData.id || `custom-${Date.now()}`;
    const theme = {
      name: themeData.name || 'Custom Theme',
      type: themeData.type || 'light',
      colors: { ...this.getDefaultThemes()['app-default'].colors, ...themeData.colors },
      fonts: { ...this.getDefaultThemes()['app-default'].fonts, ...themeData.fonts },
      spacing: { ...this.getDefaultThemes()['app-default'].spacing, ...themeData.spacing },
      borderRadius: { ...this.getDefaultThemes()['app-default'].borderRadius, ...themeData.borderRadius },
      shadows: { ...this.getDefaultThemes()['app-default'].shadows, ...themeData.shadows },
      animations: { ...this.getDefaultThemes()['app-default'].animations, ...themeData.animations },
      effects: { ...this.getDefaultThemes()['app-default'].effects, ...themeData.effects },
      custom: true,
      created_at: new Date().toISOString()
    };

    this.customThemes.set(themeId, theme);
    this.saveCustomThemes();
    this.notifyObservers('theme-created', { themeId, theme });
    
    return themeId;
  }

  // Update custom theme
  updateCustomTheme(themeId, updates) {
    if (!this.customThemes.has(themeId)) {
      throw new Error(`Custom theme '${themeId}' not found`);
    }

    const existingTheme = this.customThemes.get(themeId);
    const updatedTheme = {
      ...existingTheme,
      ...updates,
      colors: { ...existingTheme.colors, ...(updates.colors || {}) },
      fonts: { ...existingTheme.fonts, ...(updates.fonts || {}) },
      spacing: { ...existingTheme.spacing, ...(updates.spacing || {}) },
      borderRadius: { ...existingTheme.borderRadius, ...(updates.borderRadius || {}) },
      shadows: { ...existingTheme.shadows, ...(updates.shadows || {}) },
      animations: { ...existingTheme.animations, ...(updates.animations || {}) },
      effects: { ...existingTheme.effects, ...(updates.effects || {}) },
      updated_at: new Date().toISOString()
    };

    this.customThemes.set(themeId, updatedTheme);
    this.saveCustomThemes();

    // If this is the current theme, reapply it
    if (this.currentTheme === themeId) {
      this.applyTheme(themeId);
    }

    this.notifyObservers('theme-updated', { themeId, theme: updatedTheme });
    return updatedTheme;
  }

  // Delete custom theme
  deleteCustomTheme(themeId) {
    if (!this.customThemes.has(themeId)) {
      throw new Error(`Custom theme '${themeId}' not found`);
    }

    this.customThemes.delete(themeId);
    this.saveCustomThemes();

    // If this was the current theme, switch to default
    if (this.currentTheme === themeId) {
      this.setTheme('app-default');
    }

    this.notifyObservers('theme-deleted', { themeId });
    return true;
  }

  // Duplicate theme (for customization)
  duplicateTheme(sourceThemeId, newName) {
    const allThemes = this.getAllThemes();
    const sourceTheme = allThemes[sourceThemeId];
    
    if (!sourceTheme) {
      throw new Error(`Source theme '${sourceThemeId}' not found`);
    }

    const duplicatedTheme = {
      ...JSON.parse(JSON.stringify(sourceTheme)), // Deep copy
      name: newName || `${sourceTheme.name} Copy`,
      custom: true,
      created_at: new Date().toISOString()
    };

    return this.createCustomTheme(duplicatedTheme);
  }

  // Save custom themes to database
  saveCustomThemes() {
    const themesObject = {};
    this.customThemes.forEach((theme, id) => {
      themesObject[id] = theme;
    });
    DatabaseService.setSetting('custom_themes', themesObject);
  }

  // Export theme for sharing
  exportTheme(themeId) {
    const allThemes = this.getAllThemes();
    const theme = allThemes[themeId];
    
    if (!theme) {
      throw new Error(`Theme '${themeId}' not found`);
    }

    return {
      version: '1.0',
      exported_at: new Date().toISOString(),
      theme: {
        ...theme,
        id: themeId
      }
    };
  }

  // Import theme from export
  importTheme(exportData) {
    if (!exportData.theme || !exportData.version) {
      throw new Error('Invalid theme export format');
    }

    const theme = exportData.theme;
    const themeId = theme.id || `imported-${Date.now()}`;
    
    // Remove the id from theme data before storing
    const { id, ...themeWithoutId } = theme;
    
    return this.createCustomTheme({
      ...themeWithoutId,
      id: themeId,
      name: `${theme.name} (Imported)`
    });
  }

  // Get CSS variable by name
  getCSSVariable(variableName) {
    return this.cssVariables.get(variableName) || 
           getComputedStyle(document.documentElement).getPropertyValue(variableName);
  }

  // Set CSS variable
  setCSSVariable(variableName, value) {
    document.documentElement.style.setProperty(variableName, value);
    this.cssVariables.set(variableName, value);
  }

  // Generate CSS for current theme
  generateThemeCSS() {
    const theme = this.getCurrentTheme();
    let css = ':root {\n';
    
    this.cssVariables.forEach((value, variable) => {
      css += `  ${variable}: ${value};\n`;
    });
    
    css += '}\n\n';
    
    // Add utility classes
    css += `
/* Glass morphism utilities */
.glass {
  background: var(--color-glass);
  backdrop-filter: blur(var(--effect-blur));
  border: 1px solid var(--color-glass-border);
}

.glass-strong {
  background: var(--color-surface);
  backdrop-filter: blur(var(--effect-blur));
  border: 1px solid var(--color-glass-border);
}

/* Hover effects */
.hover-lift {
  transition: transform var(--animation-normal) var(--animation-smooth);
}

.hover-lift:hover {
  transform: translateY(var(--effect-hover-lift));
}

.hover-scale {
  transition: transform var(--animation-normal) var(--animation-smooth);
}

.hover-scale:hover {
  transform: scale(var(--effect-hover-scale));
}

/* Gradient utilities */
.gradient-primary {
  background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end));
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glow effects */
.glow {
  box-shadow: var(--shadow-glow);
}

.glow-hover {
  transition: box-shadow var(--animation-normal) var(--animation-smooth);
}

.glow-hover:hover {
  box-shadow: var(--shadow-glow);
}
`;
    
    return css;
  }

  // Auto theme based on time of day
  setAutoTheme(enabled = true) {
    DatabaseService.setSetting('auto_theme', enabled);
    
    if (enabled) {
      const hour = new Date().getHours();
      let themeId;
      
      if (hour >= 6 && hour < 18) {
        themeId = 'app-default'; // Day theme
      } else if (hour >= 18 && hour < 22) {
        themeId = 'sunset'; // Evening theme
      } else {
        themeId = 'dark-professional'; // Night theme
      }
      
      this.setTheme(themeId);
      
      // Set up interval to check time every hour
      if (this.autoThemeInterval) {
        clearInterval(this.autoThemeInterval);
      }
      
      this.autoThemeInterval = setInterval(() => {
        if (DatabaseService.getSetting('auto_theme')) {
          const currentHour = new Date().getHours();
          let newThemeId;
          
          if (currentHour >= 6 && currentHour < 18) {
            newThemeId = 'app-default';
          } else if (currentHour >= 18 && currentHour < 22) {
            newThemeId = 'sunset';
          } else {
            newThemeId = 'dark-professional';
          }
          
          if (newThemeId !== this.currentTheme) {
            this.setTheme(newThemeId);
          }
        }
      }, 60000 * 60); // Check every hour
    } else {
      if (this.autoThemeInterval) {
        clearInterval(this.autoThemeInterval);
        this.autoThemeInterval = null;
      }
    }
  }

  // Observer pattern for theme changes
  addObserver(callback) {
    this.themeObservers.add(callback);
  }

  removeObserver(callback) {
    this.themeObservers.delete(callback);
  }

  notifyObservers(event, data) {
    this.themeObservers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Theme observer error:', error);
      }
    });
  }

  // Utility methods for common theme operations
  isCurrentThemeDark() {
    return this.getCurrentTheme().type === 'dark';
  }

  getContrastColor(backgroundColor) {
    // Simple contrast calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }

  // Cleanup
  destroy() {
    if (this.autoThemeInterval) {
      clearInterval(this.autoThemeInterval);
    }
    this.themeObservers.clear();
    this.cssVariables.clear();
    this.customThemes.clear();
  }
}

export default new ThemeService();