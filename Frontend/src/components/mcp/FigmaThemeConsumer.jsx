import React from 'react';
import { useFigmaTheme } from './FigmaThemeProvider';

/**
 * Figma Theme Consumer Component
 * Demonstrates how to consume the Figma theme
 */
const FigmaThemeConsumer = () => {
  const theme = useFigmaTheme();
  
  if (!theme.isLoaded) {
    return <div>Loading theme...</div>;
  }
  
  if (theme.error) {
    return <div>Error loading theme: {theme.error}</div>;
  }
  
  return (
    <div className="figma-theme-consumer">
      <h2>Figma Theme</h2>
      
      <section>
        <h3>Colors</h3>
        <div className="color-palette">
          {Object.entries(theme.colors).map(([name, value]) => (
            <div key={name} className="color-item">
              <div 
                className="color-swatch" 
                style={{ backgroundColor: value }}
              />
              <div className="color-info">
                <div className="color-name">{name}</div>
                <div className="color-value">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h3>Typography</h3>
        <div className="typography-samples">
          {Object.entries(theme.typography).map(([name, value]) => (
            <div key={name} className="typography-item">
              <div className="typography-name">{name}</div>
              <div className="typography-sample" style={{ fontFamily: value }}>
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h3>Spacing</h3>
        <div className="spacing-samples">
          {Object.entries(theme.spacing).map(([name, value]) => (
            <div key={name} className="spacing-item">
              <div className="spacing-name">{name}</div>
              <div 
                className="spacing-sample" 
                style={{ width: value, height: '20px', backgroundColor: '#ddd' }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FigmaThemeConsumer;
