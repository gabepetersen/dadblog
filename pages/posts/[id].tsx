import Head from 'next/head';
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next';
import Layout from '../../components/layout';
import { getPostData, getSortedPostsData } from '../../lib/posts.service';
import CustomDate from '../../components/custom-date';

// add types
export default function Post({ postData }:
  { postData: { title: string, date: number, author: string, content: string } }
) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading the post...</div>
  }

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <section className="posts">
        <h1 className="headingXl">{postData.title}</h1>
        <div className="lightText">
          <CustomDate ms={postData.date} />
          <p>By {postData.author}</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.content }}></div>
      </section>
    </Layout>
  );
}

/**
 * BIG NOTE: getStaticPaths and getStaticProps ONLYYY runs when the pages are BUILDING
 * so don't put like client fetches in these functions - only write server side code
 */
export const getStaticProps: GetStaticProps = async (context) => {
  let postData;
  try {
    postData = await getPostData(context.params.id as string);
  } catch (err) {
    console.error('Error with fetching Post Data: ', err);
  }
  
  // return postData for template to use 
  return {
    props: {
      postData
    },
    // will revalidate changes every 10 seconds
    revalidate: 10
  };
}

export async function getStaticPaths() {
  // get all the Post Datas
  const allPostsData = await getSortedPostsData();
  const allPaths = allPostsData.map((postData) => {
    return '/posts/' + postData.pageKey;
  })

  return {
    paths: allPaths,
    fallback: true
  }
}
