import { useRouter } from 'next/router';

import Layout from '../components/layout';
import { ToastContainer, ToastController } from '../components/toast';
import { useFormField } from '../lib/input.service';
import { apiLogin, apiSignup, sendConfirmation, storeToken, storeRole } from '../lib/auth.service';

import styles from './login.module.scss';

export default function Login() {
  var loginForm = null;
  var signupForm = null;

  const router = useRouter();

  // Ok this is really messy but IT WILL HAVE TO WORK FOR NOW
  const emailLogin = useFormField();
  const passwordLogin = useFormField();
  const nameSignup = useFormField();
  const emailSignup = useFormField();
  const password1Signup = useFormField();
  const password2Signup = useFormField();


  const handleLogin = async (event: React.FormEvent) => {
    // prevent page from reloading
    event.preventDefault();
    loginForm.reset();
    ToastController.show("Logging In...");
    // Handle login in auth service
    const res = await apiLogin(emailLogin.value, passwordLogin.value);
    console.log(res.text);
    if (res.code === 1) {
      ToastController.show(res.text);
      setTimeout(() => {    
        storeToken(res.token);
        storeRole(res.role);
        // we are not going to user router.back() right now
        router.push('/');
      }, 1000);
    } else if (res.code === 2) {
      ToastController.show("You are Not Confirmed Yet - Sending Another Email");
      const emailRes = await sendConfirmation(emailLogin.value);
      console.log(emailRes);
    } else {
      ToastController.show("Login Unsuccessful");
    }
  }
  
  const handleSignup = async (event: React.FormEvent) => {
    // prevent page from reloading
    event.preventDefault();
    signupForm.reset();
    ToastController.show("signing you up!");
    // handle signup in auth service
    if (password1Signup.value == password2Signup.value) {
      // handy little email validation from: https://www.w3resource.com/javascript/form/email-validation.php
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailSignup.value)) {
        const res = await apiSignup(nameSignup.value, emailSignup.value, password1Signup.value);
        // show the signup result
        console.log(res.text);
        ToastController.show(res.text);
        setTimeout(async () => {
          // if the account is created succesfully
          if (res.code) {
            // send an email confirmation
            const emailRes = await sendConfirmation(emailSignup.value);
            console.log(emailRes);
            // show the email result
            ToastController.show(emailRes.text);
            setTimeout(() => {         
              storeToken(res.token);
              storeRole(res.role);
              // we are not going to user router.back() right now
              router.push('/');
            }, 2000);
          }
        }, 2000);
        
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
        <div className={styles.login}>
          <h2>Login</h2>
          <form onSubmit={handleLogin} ref={form => loginForm = form}>
            <label htmlFor="loginEmail">Email</label><br />
            <input
              type="text"
              id="loginEmail"
              name="loginEmail"
              {...emailLogin}
              autoComplete="on"
            />
            <br />
            <label htmlFor="loginPass">Password</label><br />
            <input
              type="password"
              id="loginPass"
              name="loginPass"
              {...passwordLogin}
              autoComplete="on"
            />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>

        {/* Signup Portion */}   
        <div className={styles.signup}>
          <h2>Signup</h2>
          <form onSubmit={handleSignup} ref={form => signupForm = form}>
            <label htmlFor="name">Name</label><br />
            <input
              type="text"
              id="name"
              name="name"
              {...nameSignup}
              autoComplete="on"
            />
            <br />
            <label htmlFor="signupEmail">Email</label><br />
            <input
              type="text"
              id="signupEmail"
              name="signupEmail"
              {...emailSignup}
              autoComplete="on"
            />
            <br />
            <label htmlFor="signupPass1">Password</label><br />
            <input
              type="password"
              id="signupPass1"
              name="signupPass1"
              {...password1Signup}
              autoComplete="on"
            />
            <br />
            <label htmlFor="signupPass2">Password Again</label><br />
            <input
              type="password"
              id="signupPass2"
              name="signupPass2"
              {...password2Signup}
              autoComplete="on"
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
