import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Layout from '../../components/layout';
import { getSortedPostsData, getPostsByAuthor } from '../../lib/posts.service';
import CustomDate from '../../components/custom-date';
import utilStyles from '../../styles/utils.module.scss';
import { MongoBlogPost } from '../../lib/types';

// add types
export default function Author({ author, authorPostsData }:
  { author: string, authorPostsData: MongoBlogPost[] }
) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading the author...</div>
  }

  return (
    <Layout home>
      <Head>
        <title>{author}</title>
      </Head>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h1 className={utilStyles.headingLg}>{author}</h1>
        <ul className={utilStyles.list}>
          {authorPostsData.map(({ blogID, pageKey, date, title, author, hidden }) => !hidden ? (
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
    </Layout>
  );
}

// Get static props will get the blog posts on static generation pre-render
export const getStaticProps: GetStaticProps = async (context) => {
  // get all the Post Datas
  const authorPostsData = await getPostsByAuthor(context.params.id as string);

  return {
    props: {
      author: context.params.id,
      authorPostsData
    },
    // will revalidate changes every 10 seconds
    revalidate: 10
  }
}

export async function getStaticPaths() {
  // get all the Post Datas
  const authorPostsData = await getSortedPostsData();
  const allPaths = authorPostsData.map((postData) => {
    return '/authors/' + postData.author;
  });

  return {
    paths: allPaths,
    fallback: true
  }
}
