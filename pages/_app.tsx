import '../styles/global.scss';
import { AppProps } from 'next/app';
import { motion, AnimatePresence } from 'framer-motion';


// This default export is required in a new `pages/_app.js` file.
// this is so global sass can be a thing
export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
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
          margin: 0;
        }
      `}</style>
    </AnimatePresence>
  );
}
