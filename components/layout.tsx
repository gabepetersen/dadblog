// external imports
import Head from 'next/head';

// component imports
import Navbar from './navbar';

// style imports
import styles from './layout.module.scss';

export const siteTitle = 'Mutual Threads'

export default function Layout({ children, home }: { children: React.ReactNode, home?: boolean }) {
  return (
    <div className={`${styles.container}`}>
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

      {/* Main Content of Page */}
      <main className={styles.main}>
        {children}
      </main>
    </div>   
  );
}
