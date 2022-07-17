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
    // handle signup in auth service
    if (password1Signup.value !== password2Signup.value) {
      ToastController.show("Passwords do not match!");
      return;
    }
    // handy little email validation from: https://www.w3resource.com/javascript/form/email-validation.php
    if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailSignup.value))) {
      ToastController.show('Email format is not valid');
      return;
    }

    const res = await apiSignup(nameSignup.value, emailSignup.value, password1Signup.value);

    switch (res.dbCode) {
      case 11000:
        ToastController.show(`Already a user with the same email: ${emailSignup.value}`);
        return;
    }

    // if the account is created succesfully
    if (res.code) {
      ToastController.show(res.text);
      const emailRes = await sendConfirmation(emailSignup.value);
      // show the email result
      ToastController.show(emailRes.text);
      setTimeout(() => {
        storeToken(res.token);
        storeRole(res.role);
        // we are not going to user router.back() right now
        router.push('/');
      }, 2000);
    }
  }

  return (
    <Layout>
      <section className={styles.formContainer}>

        {/* Login Portion */}      
        <div className={styles.login}>
          <h2>Login</h2>
          <form onSubmit={handleLogin} ref={form => loginForm = form}>
            <label htmlFor="loginEmail">Email</label>
            <input
              type="text"
              id="loginEmail"
              name="loginEmail"
              {...emailLogin}
              autoComplete="on"
            />
            <label htmlFor="loginPass">Password</label>
            <input
              type="password"
              id="loginPass"
              name="loginPass"
              {...passwordLogin}
              autoComplete="on"
            />
            <input type="submit" value="Submit" />
          </form>
        </div>

        {/* Signup Portion */}   
        <div className={styles.signup}>
          <h2>Signup</h2>
          <p>The main purpose of signing up <em>for now</em> is to apply to write on the platform. The name will be used as your author title, and might be used to refer to you if I decide to add comments in the future.</p>
          <form onSubmit={handleSignup} ref={form => signupForm = form}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              {...nameSignup}
              autoComplete="on"
            />
            <label htmlFor="signupEmail">Email</label>
            <input
              type="text"
              id="signupEmail"
              name="signupEmail"
              {...emailSignup}
              autoComplete="on"
            />
            <label htmlFor="signupPass1">Password</label>
            <input
              type="password"
              id="signupPass1"
              name="signupPass1"
              {...password1Signup}
              autoComplete="on"
            />
            <label htmlFor="signupPass2">Password Again</label>
            <input
              type="password"
              id="signupPass2"
              name="signupPass2"
              {...password2Signup}
              autoComplete="on"
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
      </section>
      <ToastContainer />
    </Layout>
  );
}
