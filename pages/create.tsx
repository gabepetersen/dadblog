import Link from 'next/link';

import Layout from '../components/layout';
import styles from './create.module.scss';

var blogText: string = '';
var blogTitle: string = '';

export default function Create() {
  return (
    <Layout>
      <h1>Create a New Post</h1>
      <p>**text** for <b>bold</b></p>
      <p>*text* for <i>italic</i></p>
      <form className={styles.blogForm} onSubmit={handleSubmit}>
        <label htmlFor="btitle">Title</label><br />
        <input type="text" id="btitle" name="btitle" onChange={handleTitle} /><br />
        <label htmlFor="btext">Blog Text</label><br />
        <textarea id="btext" name="btext" onChange={handleText}></textarea><br />
        <input type="submit" value="Submit" />
      </form>
      <br />
      <Link href="/"><a>Back To Home</a></Link>
    </Layout>
  );
}

async function handleSubmit(event) {
  try {
    event.preventDefault();
    // const res = await uploadNewPost(blogTitle, blogText);
    // console.log(res);
    const data = await fetch("/api/post-blog", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ title: blogTitle, text: blogText, username: 'gabepetersen' })
    }).then(x => x.json());
    console.log(data);
  } catch (err) {
    console.error(err); 
  }
}

function handleTitle(event) {
  blogTitle = event.target.value;
}

function handleText(event) {
  blogText = event.target.value;
}