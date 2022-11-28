import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_TAG}`}></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS_TAG}');
          `
        }}>
        </script>
      </Head>
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