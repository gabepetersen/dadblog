import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Layout, { siteTitle } from '../components/layout';
import { ToastContainer } from '../components/toast';
import { getRecentPosts } from '../lib/posts.service';
import CustomDate from '../components/custom-date';
import { MongoBlogPost, User } from '../lib/types';
import { getAuthors } from '../lib/user.services';

export default function Home({ recentPostsData, sortedAuthors } : { recentPostsData: MongoBlogPost[], sortedAuthors: User[] }) {
  return (    
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <section className="headingMd padding1px">
        <h2 className="headingLg">Recent Posts</h2>
        <ul className="list">
          {recentPostsData.map(({ blogID, pageKey, date, title, author, hidden }) => !hidden ? (
            <li className="listItem" key={parseInt(blogID)}>
              <Link href={`/posts/${pageKey}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small>
                <CustomDate ms={date} />
              </small>
            </li>
          ) : null )}
        </ul>
      </section>

      <section className="headingMd padding1px">
        <h2 className="headingLg">Authors</h2>
        <ul className="list">
          {sortedAuthors.map(({ name, pageKey, writtenBlogs }) => (
            <li className="listItem" key={parseInt(name)}>
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
  const recentPostsData = await getRecentPosts();
  const allAuthors = await getAuthors();
  const sortedAuthors = allAuthors.sort((a: User, b: User) => b.writtenBlogs.length - a.writtenBlogs.length);

  return {
    props: {
      recentPostsData,
      sortedAuthors
    },
    // will revalidate changes every 10 seconds
    revalidate: 10
  }
}
