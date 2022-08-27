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

      <section className="posts">
        <h2 className="headingLg posts__title">Recent Posts</h2>
        <ul className="list posts__grid">
          {recentPostsData.map(({ blogID, pageKey, date, title, author, hidden }) => !hidden ? (
            <li className="listItem" key={parseInt(blogID)}>
              <Link href={`/posts/${pageKey}`}>
                <a className="posts__grid-item">
                  <span className="posts__grid-item__title">{title}</span>
                  <CustomDate ms={date} />
                </a>
              </Link>
            </li>
          ) : null )}
        </ul>
      </section>

      <section className="authors">
        <h2 className="headingLg">Authors</h2>
        <ul className="list authors__list">
          {sortedAuthors.map(({ name, pageKey, writtenBlogs }) => (
            <li className="authors__list-item" key={parseInt(name)}>
              <Link href={`/authors/${pageKey}`}>
                <a>{name}</a>
              </Link>
              &nbsp;&nbsp;-&nbsp;&nbsp;
              <span>
                {writtenBlogs.length} Post{( writtenBlogs.length > 1 ? 's' : '' )}
              </span>
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
