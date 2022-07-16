import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from './button';
import moon from '../public/images/moon.png'
import sun from '../public/images/sun.png';

const themeStorageKey = 'theme';

export default function ThemeButton() {
  const [theme, setTheme] = useState(document.body.dataset.theme);

  // update coloring when theme changes
  useEffect(() => {
    document.body.dataset.theme = theme;
    if (theme === 'light' || theme === 'dark') {
      window.localStorage.setItem(themeStorageKey, theme);
    }
  }, [theme]);

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
