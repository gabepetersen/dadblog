import Link from 'next/link';
import { GetStaticProps } from 'next';

import Layout from '../components/layout';
import CustomDate from '../components/custom-date';
import { getSortedPostsData } from '../lib/posts.service';

import utilStyles from '../styles/utils.module.scss';

export default function Articles({ allPostsData }:
  { allPostsData: {id: string, date: number, title: string}[] }
)  {
  return (
    <Layout>
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
      
      {/* <section className={`${utilStyles.headingMd} ${utilStyles.padding1px} ${utilStyles.noMargin}`}>
        <Link href="/create">
          <a>Create a Post</a>
        </Link>
            </section> */}
    </Layout>
  );
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