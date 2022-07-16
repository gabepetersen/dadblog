import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from './button';
import moon from '../public/images/moon.png'
import sun from '../public/images/sun.png';

const themeStorageKey = 'theme';

export default function ThemeButton() {
  const [theme, setTheme] = useState(getThemeColor());

  // update coloring when theme changes
  useEffect(() => setThemeColor(theme), [theme]);

  return (
    <Button
      style="primary"
      ariaLabel={theme === 'dark' ? "day mode" : "dark mode"}
      callback={() => setTheme(theme == 'dark' ? 'light' : 'dark')}
    >
      <Image
        src={theme === 'dark' ? sun : moon}
        alt={theme === 'dark' ? "day mode" : "dark mode"}
        width="30px"
        height="30px"
      />
    </Button>
  );
}

function setThemeColor(theme: string) {
  document.body.dataset.theme = theme;
  if (typeof window !== 'undefined' && (theme === 'light' || theme === 'dark')) {
    window.localStorage.setItem(themeStorageKey, theme);
  }
}

function getThemeColor() {
  var theme = 'light'
  if (typeof window !== 'undefined') {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    if (storedTheme) {
      console.log("grabbed stored theme: ", storedTheme)
      theme = storedTheme;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
      console.log("grabbed preferred theme: ", theme)
    }
  }
  return theme;
}