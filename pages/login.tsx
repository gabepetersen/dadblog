import { useRouter } from 'next/router';

import Layout from '../components/layout';
import { ToastContainer, ToastController } from '../components/toast';
import { newFormField } from '../lib/input.service';
import { apiLogin, apiSignup, storeToken } from '../lib/auth.service';

import styles from './login.module.scss';

export default function Login() {
  var loginForm = null;
  var signupForm = null;

  const router = useRouter();

  // Ok this is really messy but IT WILL HAVE TO WORK FOR NOW
  const emailLogin = newFormField();
  const passwordLogin = newFormField();
  const nameSignup = newFormField();
  const emailSignup = newFormField();
  const password1Signup = newFormField();
  const password2Signup = newFormField();


  const handleLogin = async (event: React.FormEvent) => {
    // prevent page from reloading
    event.preventDefault();
    ToastController.show("Logging In...");
    // Handle login in auth service
    const res = await apiLogin(emailLogin.value, passwordLogin.value);
    ToastController.show(res.text);
    if (res.code) {
      setTimeout(() => {
        loginForm.reset();
        storeToken(res.token);
        // we are not going to user router.back() right now
        router.push('/');
      }, 1000);
    }
  }
  
  const handleSignup = async (event: React.FormEvent) => {
    // prevent page from reloading
    event.preventDefault();
    ToastController.show("signing you up!");
    // handle signup in auth service
    if (password1Signup.value == password2Signup.value) {
      // handy little email validation from: https://www.w3resource.com/javascript/form/email-validation.php
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailSignup.value)) {
        const res = await apiSignup(nameSignup.value, emailSignup.value, password1Signup.value);
        ToastController.show(res.text);
        if (res.code) {
          setTimeout(() => {
            signupForm.reset();
            storeToken(res.token);
            // we are not going to user router.back() right now
            router.push('/');
          }, 1000);
        }
      } else {
        console.log('invalid email');
        ToastController.show('Email is Not Valid!');
      }
    } else {
      console.log('passwords do not match');
      ToastController.show("Passwords do not match!");
    }
  }

  return (
    <Layout>
      <section className={styles.formContainer}>

        {/* Login Portion */}
        <h2>Login</h2>
        <div className={styles.login}>
          <form onSubmit={handleLogin} ref={form => loginForm = form}>
            <label htmlFor="loginEmail">Email</label><br />
            <input
              type="text"
              id="loginEmail"
              name="loginEmail"
              {...emailLogin}
            />
            <br />
            <label htmlFor="loginPass">Password</label><br />
            <input
              type="password"
              id="loginPass"
              name="loginPass"
              {...passwordLogin}
            />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>

        {/* Signup Portion */}
        <h2>Signup</h2>
        <div className={styles.signup}>
          <form onSubmit={handleSignup} ref={form => signupForm = form}>
            <label htmlFor="name">Name</label><br />
            <input
              type="text"
              id="name"
              name="name"
              {...nameSignup}
            />
            <br />
            <label htmlFor="signupEmail">Email</label><br />
            <input
              type="text"
              id="signupEmail"
              name="signupEmail"
              {...emailSignup}
            />
            <br />
            <label htmlFor="signupPass1">Password</label><br />
            <input
              type="password"
              id="signupPass1"
              name="signupPass1"
              {...password1Signup}
            />
            <br />
            <label htmlFor="signupPass2">Password Again</label><br />
            <input
              type="password"
              id="signupPass2"
              name="signupPass2"
              {...password2Signup}
            />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>
      </section>
      <ToastContainer />
    </Layout>
  );
}
