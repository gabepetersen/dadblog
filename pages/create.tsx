import Link from 'next/link';
import { useRouter } from 'next/router';

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
        if (data.code > 300) {
          console.log(`Error Posting Blog ${data.text}`);
          ToastController.show(`Error Posting Blog ${data.text}`);
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
      <ToastContainer />
    </Layout>
  );
}

