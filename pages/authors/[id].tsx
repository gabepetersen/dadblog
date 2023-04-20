import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Layout from '../../components/layout';
import { getPostsByAuthorID } from '../../lib/posts.service';
import CustomDate from '../../components/custom-date';
import { MongoBlogPost } from '../../lib/types';
import { getUserByPageKey } from '../../lib/user.services';
import { getAuthors } from '../../lib/user.services';

// add types
export default function Author({ author, authorPostsData }:
  { author: string, authorPostsData: MongoBlogPost[] }
) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading the author...</div>
  }

  return (
    <Layout>
      <Head>
        <title>{author}</title>
      </Head>

      <section className="posts">
        <h1 className="headingLg">{author}</h1>
        <ul className="list posts__grid">
          {authorPostsData.map(({ blogID, pageKey, date, title, author, hidden }) => !hidden ? (
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
    </Layout>
  );
}

// Get static props will get the blog posts on static generation pre-render
export const getStaticProps: GetStaticProps = async (context) => {
  // check if user is writer
  const userData = await getUserByPageKey(context.params.id as string);
  // we are able to check explicitly here because this is run on the server :)
  if (userData.role !== 'writer') {
    return {
      notFound: true
    }
  }
  // get all the Post Datas
  const userid = userData._id.toHexString();
  const authorPostsData = await getPostsByAuthorID(userid);

  return {
    props: {
      author: userData.name,
      authorPostsData
    },
    // will revalidate changes every 10 seconds
    revalidate: 10
  }
}

export async function getStaticPaths() {
  // get all the Post Datas
  const allAuthors = await getAuthors();
  const allPaths = allAuthors.map((authorData) => {
    return '/authors/' + authorData.pageKey;
  });

  return {
    paths: allPaths,
    fallback: true
  }
}
