import Head from 'next/head';
import Link from 'next/link';

import Layout, { siteTitle } from '../components/layout';

import { ToastContainer, ToastController } from '../components/toast';

import Button from '../components/button';

import utilStyles from '../styles/utils.module.scss';
import styles from './index.module.scss'

export default function Home({ allPostsData }:
  { allPostsData: {id: string, date: number, title: string}[] }
) {

  return (    
      <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
    
        <section className={utilStyles.headingMd}>
          <p>
            Hello! Welcome to this Blog. You can checkout the blogs by going to the <Link href="/articles"><a>Articles Page</a></Link>.
          </p>
        </section>
        {/* Need a Toast Container for Toasts */}
        <ToastContainer />
      </Layout>
  )
}

function checkLogin() {
  var loggedIn = true;
  var message = 'Here is a toast for you!!!';
  if (loggedIn) {
    if (typeof window !== 'undefined') {
      ToastController.show(message);
    } else {
      console.log("window doesn't exist")
    }
  }

}




