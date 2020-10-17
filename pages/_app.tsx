import '../styles/global.scss';
import { AppProps } from 'next/app';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '../components/theme-provider';

// This default export is required in a new `pages/_app.js` file.
// this is so global sass can be a thing
export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <ThemeProvider theme="light">
      <AnimatePresence>
        <motion.div key={router.route} initial="pageInitial" exit="pageExit" animate="pageAnimate" variants={{
          pageInitial: {
            opacity: 0
          },
          pageAnimate: {
            opacity: 1
          },
          pageExit: {
            opacity: 0
          }
        }}>
          <Component {...pageProps} />
        </motion.div>

        {/* Need some global style tags */}
        <style jsx global>{`
          body {
            margin: 0 auto;
            height: 100%;
          }
          html {
            height: 100%;
          }
        `}</style>
      </AnimatePresence>
    </ThemeProvider>
  );
}
