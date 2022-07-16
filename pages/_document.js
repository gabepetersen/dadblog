import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(w, d) {
              var theme = 'light'
              const storedTheme = w.localStorage.getItem('theme');
              if (storedTheme) {
                theme = storedTheme;
              } else if (w.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme = 'dark';
              }
              d.body.dataset.theme = theme;
            })(window, document);`,
          }}
        />
        <Main />
        <NextScript />
        
      </body>
    </Html>
  )
}