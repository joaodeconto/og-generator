export interface RandomStyle {
  theme: 'light' | 'dark';
  layout: 'left' | 'center';
  accentColor: string;
}

// A preset is simply a named random style configuration. Keeping an alias
// makes the intent clearer when used elsewhere in the app.
export type Preset = RandomStyle;

const themes: RandomStyle['theme'][] = ['light', 'dark'];
const layouts: RandomStyle['layout'][] = ['left', 'center'];
// A handful of pleasant accent colors
const colors: string[] = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#22c55e', // green
  '#f59e0b', // amber
  '#a855f7', // purple
  '#ec4899' // pink
];

export function generateRandomStyle(): RandomStyle {
  const theme = themes[Math.floor(Math.random() * themes.length)];
  const layout = layouts[Math.floor(Math.random() * layouts.length)];
  const accentColor = colors[Math.floor(Math.random() * colors.length)];
  return { theme, layout, accentColor };
}

// Convenience wrapper with a more semantic name when generating presets.
export function generateRandomPreset(): Preset {
  return generateRandomStyle();
}
