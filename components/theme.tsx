/**
 * Big Thank you goes out to github user @Ifades
 * github repo: 
 */

import React from 'react';

const Theme = React.createContext(null);

export const getThemeController = () => React.useContext(Theme);

export function ThemeProvider({ theme, children }) {
  const [val, setTheme] = React.useState(theme);
  return <Theme.Provider value={[val, setTheme]}>{children}</Theme.Provider>;
}