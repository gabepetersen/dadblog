import { useRouter } from 'next/router';
import Link from 'next/link';

import Layout from '../components/layout';
import styles from './create.module.scss';
import { ToastContainer, ToastController } from '../components/toast';

import { getToken } from '../lib/auth.service';

export default function Create() {

  var blogText: string = '';
  var blogTitle: string = '';
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    try {
      event.preventDefault();
      const token = getToken();
      if (token) {
        const data = await fetch("/api/post-blog", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ title: blogTitle, text: blogText, token: token })
        }).then(x => x.json());
        console.log(data.text, data.code);
        if (data.code === 0) {
          ToastController.show(`Error Posting Blog ${data.text}`);
        } else {
          ToastController.show('Succesfully Uploaded Blog');
          router.push('/articles');
        }
      } else {
        console.log("Not Logged In!");
        ToastController.show("Not Logged In");
        // wait for the toast to finish
        setTimeout(() => {
          router.push('/login');
        }, 1000) 
      }
    } catch (err) {
      console.error(err); 
    }

  }
  
  function handleTitle(event: any) {
    blogTitle = event.target.value;
  }
  
  function handleText(event: any) {
    blogText = event.target.value;
  }

  return (
    <Layout>
      <h2>Instructions for Creating a Post</h2>
      
      <p>#text for large heading</p>
      <p>####text for small heading</p>
      <p>**text** for <b>bold</b></p>
      <p>*text* for <i>italic</i></p>  
      <p>> text for blockquote</p>
      <p>1. text for ordered list</p>
      <p>- text for unordered list</p>
      <p>--- on newline for horizontal line</p>
      <p>[title](https://www.example.com) for a link</p>
      <p>You can find more formatting options at <Link href="https://www.markdownguide.org/cheat-sheet/">Markdown Cheatsheet</Link></p>   
      <br />
      <h2>Post Create Form</h2>
      <form className={styles.blogForm} onSubmit={handleSubmit}>
        <label htmlFor="btitle">Title</label><br />
        <input type="text" id="btitle" name="btitle" onChange={handleTitle} /><br />
        <label htmlFor="btext">Content</label><br />
        <textarea id="btext" name="btext" onChange={handleText}></textarea><br />
        <input type="submit" value="Post" />
      </form>
      <br />
      <ToastContainer />
    </Layout>
  );
}

