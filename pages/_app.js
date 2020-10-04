import '../styles/global.scss';

// This default export is required in a new `pages/_app.js` file.
// this is so global sass can be a thing
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
