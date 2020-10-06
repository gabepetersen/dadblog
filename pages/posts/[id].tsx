import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next'

import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Date from '../../components/date';

import utilStyles from '../../styles/utils.module.scss';

// add types
export default function Post({ postData }:
  { postData: { title: string, date: string, contentHTML: string } }
) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHTML }}></div>
      </article>
    </Layout>
  );
}


/**
 * BIG NOTE: getStaticPaths and getStaticProps ONLYYY runs on the server
 * so don't put like fetches in these functions - only write server side code
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id as string);
  // return postData for template to use 
  return {
    props: {
      postData
    }
  };
}