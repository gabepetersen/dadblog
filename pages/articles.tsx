import Link from 'next/link';
import { GetStaticProps } from 'next';
import Layout from '../components/layout';
import CustomDate from '../components/custom-date';
import { getSortedPostsData } from '../lib/posts.service';
import utilStyles from '../styles/utils.module.scss';

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
  // get all the Post Datas
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    },
    // will revalidate changes every 5 seconds
    revalidate: 3
  }
}
