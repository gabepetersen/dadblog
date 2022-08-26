import Head from 'next/head';
import Link from 'next/link';
import Layout, { siteTitle } from '../components/layout';
import { ToastContainer } from '../components/toast';
import utilStyles from '../styles/utils.module.scss';
import { getSortedPostsData } from '../lib/posts.service';
import { GetStaticProps } from 'next';
import CustomDate from '../components/custom-date';
import { MongoBlogPost, User } from '../lib/types';
import { getAuthors } from '../lib/user.services';

export default function Home({ allPostsData, sortedAuthors } : { allPostsData: MongoBlogPost[], sortedAuthors: User[] }) {
  return (    
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ blogID, pageKey, date, title, author, hidden }) => !hidden ? (
            <li className={utilStyles.listItem} key={parseInt(blogID)}>
              <Link href={`/posts/${pageKey}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small>
                {author}&nbsp;&nbsp;/&nbsp;&nbsp;<CustomDate ms={date} />
              </small>
            </li>
          ) : null )}
        </ul>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Authors</h2>
        <ul className={utilStyles.list}>
          {sortedAuthors.map(({ name, pageKey, writtenBlogs }) => (
            <li className={utilStyles.listItem} key={parseInt(name)}>
              <Link href={`/authors/${pageKey}`}>
                <a>{name}</a>
              </Link>
              <br />
              <small>
                {writtenBlogs.length} Post{( writtenBlogs.length > 1 ? 's' : '' )}
              </small>
            </li>
          ))}
        </ul>
      </section>
      {/* Need a Toast Container for Toasts */}
      <ToastContainer />
    </Layout>
  )
}

// Get static props will get the blog posts on static generation pre-render
export const getStaticProps: GetStaticProps = async () => {
  // get all the Post Datas
  const allPostsData = await getSortedPostsData();
  const allAuthors = await getAuthors();
  const sortedAuthors = allAuthors.sort((a: User, b: User) => b.writtenBlogs.length - a.writtenBlogs.length);

  return {
    props: {
      allPostsData,
      sortedAuthors
    },
    // will revalidate changes every 10 seconds
    revalidate: 10
  }
}
