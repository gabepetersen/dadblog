import Link from 'next/link';
import { GetStaticProps } from 'next';

import Layout from '../components/layout';
import CustomDate from '../components/custom-date';
import { getSortedPostsData } from '../lib/posts.service';

import utilStyles from '../styles/utils.module.scss';

// NOTE: this is ONLY for the getStaticProps since this is server code
// otherwise you will download all the .md files to the client
import { readFiles } from '../server/storage.service';

export default function Articles({ allPostsData }:
  { allPostsData: {id: string, date: number, title: string, author: string}[] }
)  {
  return (
    <Layout>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Blog</h2>
          <ul className={utilStyles.list}>
            {allPostsData.map(({ id, date, title, author }) => (
                <li className={utilStyles.listItem} key={id}>
                  <Link href={`/posts/${id}`}>
                    <a>{title}</a>
                  </Link>
                  <br />
                  <small>
                    {author}&nbsp;&nbsp;/&nbsp;&nbsp;<CustomDate ms={date} />
                  </small>
                </li>
              ))}
          </ul>
      </section>
    </Layout>
  );
}


// Get static props will get the blog posts on static generation pre-render
export const getStaticProps: GetStaticProps = async () => {
  // read blogs from the file server into the web server
  readFiles();
  // get all the Post Datas
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    },
    // will revalidate changes every 5 seconds
    revalidate: 5
  }
}

