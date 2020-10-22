import Layout from '../components/layout';
import { ToastContainer, ToastController } from '../components/toast';
import { newFormField } from '../lib/input.service';
import { apiLogin, apiSignup } from '../lib/auth.service';

import styles from './login.module.scss';

export default function Login() {
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
    ToastController.show("logging in...");
    // Handle login in auth service
    const res = await apiLogin(emailLogin.value, passwordLogin.value);
    console.log('Login Result: ', res);
  
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
        console.log("Signup Result: ", res);
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
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label><br />
            <input
              type="text"
              id="email"
              name="email"
              {...emailLogin}
            />
            <br />
            <label htmlFor="pass">Password</label><br />
            <input
              type="text"
              id="pass"
              name="pass"
              {...passwordLogin}
            />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>

        {/* Signup Portion */}
        <h2>Signup</h2>
        <div className={styles.signup}>
          <form onSubmit={handleSignup}>
            <label htmlFor="name">Name</label><br />
            <input
              type="text"
              id="name"
              name="name"
              {...nameSignup}
            />
            <br />
            <label htmlFor="email">Email</label><br />
            <input
              type="text"
              id="email"
              name="email"
              {...emailSignup}
            />
            <br />
            <label htmlFor="pass">Password</label><br />
            <input
              type="text"
              id="pass"
              name="pass"
              {...password1Signup}
            />
            <br />
            <label htmlFor="pass2">Password Again</label><br />
            <input
              type="text"
              id="pass2"
              name="pass2"
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
