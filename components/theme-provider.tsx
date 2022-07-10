/**
 * Big Thank you goes out to github user @Ifades
 * github repo: https://github.com/lfades/static-tweet
 */

import React from 'react';

const Theme = React.createContext(null);

export function useThemeController() {
  return React.useContext(Theme);
}

export function ThemeProvider({ theme, children }) {
  const [val, setTheme] = React.useState(theme);
  return <Theme.Provider value={[val, setTheme]}>{children}</Theme.Provider>;
}