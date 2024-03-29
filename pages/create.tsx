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

  // todo: fix this event type
  async function handleSubmit(event: any) {
    event.nativeEvent.submitter.disabled = true;
    try {
      event.preventDefault();
      console.log("event", event)
      debugger;
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
          ToastController.show('Succesfully Uploaded Blog - Redirecting back to home');
          setTimeout(() => {
            router.push('/')
          }, 3000);
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
    event.nativeEvent.submitter.disabled = false;
  }
  
  function handleTitle(event: any) {
    blogTitle = event.target.value;
  }
  
  function handleText(event: any) {
    blogText = event.target.value;
  }

  return (
    <Layout>
      <section>
        <h1 className='headingLg'>Write a Post</h1>
        <p>For the new Mutual Threads update, I have decided to use <Link href="https://github.com/showdownjs/showdown/wiki">Showdown</Link> to give y&apos;all a little more flexibility in posting content. Please read <Link href="https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax">Showdown Markdown Syntax</Link> on how to format your blog post. Along this documentation, keep in mind that most of the settings are enabled, so feel free to use auto-links, sized images, emojis, etc.</p>
        <h2>Content Rules</h2>
        <ul>
          <li>No adult or hate content.</li>
          <li>Provide warnings for stuff like excessive profanity</li>
          <li>If you add special characters in the title, they will be removed from the post&apos;s URL.</li>
          <li>I would advise against using H1 (# header) tags inside the content since the title is already formatted as an H1.</li>
          <li>If you don&apos;t like how your post looks or you want to delete it - reach out to me. My hope is to eventually implement draft functionality.</li>
        </ul>
      </section>
      <section>
        <form className={styles.blogForm} onSubmit={handleSubmit}>
          <label htmlFor="btitle">Title</label>
          <input type="text" id="btitle" name="btitle" onChange={handleTitle} /><br />
          <label htmlFor="btext">Content</label>
          <textarea id="btext" name="btext" onChange={handleText}></textarea><br />
          <input type="submit" value="Post" />
        </form>
      </section>
      <ToastContainer />
    </Layout>
  );
}

