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
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg"/>
        <link rel="icon" type="image/png" href="/favicon/favicon.png"/>
        <meta name="description" content="Mutual Threads is a work-in-progress community where people can share what they learn and relate to each other in writing."/>
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
