// external imports
import Head from 'next/head';

// component imports
import Navbar from './navbar';
import { getThemeController } from './theme-provider';

// style imports
import styles from './layout.module.scss';
import dark from '../styles/dark.module.scss';
import light from '../styles/light.module.scss';

const name = 'Blog Master';

export const siteTitle = 'Mutual Threads'

export default function Layout({ children, home }: { children: React.ReactNode, home?: boolean }) {

  // get the theme state and function to change it
  const [theme] = getThemeController();

  return (
    <div className={`${styles.container} ${theme == 'dark' ? dark.theme : light.theme}`} id="light">
      {/* Head tag for meta stuff */}
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Learn how to build a personal website using Next.js"/>
        <meta property="og:image" content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>


      {/* Inserts NavBar on Every Page */}
      <Navbar home={home}></Navbar>

      {/* Displays Header as Link Conditionally */}
      {/*
      <header className={styles.header}>
        {home ? (
          <>
            <img
              src="/images/linkedin.jpg"
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
            />
            <h1 className={utilStyles.heading2XL}>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <img
                  src="/images/linkedin.jpg"
                  className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                  alt={name}
                />  
              </a>
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
        */}

      {/* Main Content of Page */}
      <main className={styles.main}>
        {children}
      </main>

      {/* Conditional Back Link */} 
      {/*
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
      */}
    </div>   
  );
}
