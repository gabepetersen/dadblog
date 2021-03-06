import Head from 'next/head';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts.service';
import CustomDate from '../../components/custom-date';

import utilStyles from '../../styles/utils.module.scss';

// add types
export default function Post({ postData }:
  { postData: { title: string, date: number, author: string, contentHTML: string } }
) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <CustomDate ms={postData.date} />
          <p>By {postData.author}</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHTML }}></div>
      </article>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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
    }
  };
}
/**
 * BIG NOTE: getStaticPaths and getStaticProps ONLYYY runs when the pages are BUILDING
 * so don't put like client fetches in these functions - only write server side code
 */
/*
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false
  }
}

// getStaticPaths feeds params
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id as string);
  // return postData for template to use 
  return {
    props: {
      postData
    }
  };
}
*/