import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { GetStaticProps } from 'next';
import { useEffect } from 'react';

import Layout, { siteTitle } from '../components/layout';
import CustomDate from '../components/custom-date';
import { ToastContainer, ToastController } from '../components/toast';
import { ThemeProvider } from '../components/theme-provider';
import { getSortedPostsData } from '../lib/posts';

import utilStyles from '../styles/utils.module.scss';
import indexStyles from './index.module.scss'

export default function Home({ allPostsData }:
  { allPostsData: {id: string, date: number, title: string}[] }
) {
  return (    
    <ThemeProvider theme="light">
      <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        
        <section className={utilStyles.headingMd}>
          <p>
            Hello! My name is Gabe and I want to die. If you would like to kill me, 
            please email me at <a href="mailto:gabeardenpetersen@gmail.com">gabeardenpetersen@gmail.com</a> 
            for more information.
          </p>
          <p>
            (This is a sample website - you’ll be building a site like this on{' '}
              <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
          </p>
          <button onClick={checkLogin}>Show Toast</button>
        </section>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Blog</h2>
          <ul className={utilStyles.list}>
            {allPostsData.map(({ id, date, title }) => (
                <li className={utilStyles.listItem} key={id}>
                  <Link href={`/posts/${id}`}>
                    <a>{title}</a>
                  </Link>
                  <br />
                  <small>
                    <CustomDate ms={date} />
                  </small>
                </li>
              ))}
          </ul>
        </section>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <Link href="/create">
            <a>Create a Post</a>
          </Link>
        </section>
        {/* Need a Toast Container for Toasts */}
        <section>
          <ToastContainer />
        </section>
      </Layout>
    </ThemeProvider>
  )
}

function checkLogin() {
  var loggedIn = true;
  var message = 'I like big booty!';
  if (loggedIn) {
    if (typeof window !== 'undefined') {
      ToastController.show(message);
    } else {
      console.log("window doesn't exist")
    }
  }
}


// Get static props will get the blog posts on static generation pre-render
export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    }
  }
}


