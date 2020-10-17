import Layout from '../components/layout';
import { ToastContainer, ToastController } from '../components/toast';

import styles from './login.module.scss';

export default function Login() {
  return (
    <Layout>
      <section className={styles.formContainer}>
        <h2>Login</h2>
        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <label htmlFor="username">Username</label><br />
            <input type="text" id="username" name="username" /><br />
            <label htmlFor="pass">Password</label><br />
            <input type="text" id="pass" name="pass"/><br />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <h2>Signup</h2>
        <div className={styles.signup}>
          <form onSubmit={handleSignup}>
            <label htmlFor="username">Username</label><br />
            <input type="text" id="username" name="username" /><br />
            <label htmlFor="pass">Password</label><br />
            <input type="text" id="pass" name="pass" /><br />
            <label htmlFor="pass2">Password Again</label><br />
            <input type="text" id="pass2" name="pass2"/><br />
            <input type="submit" value="Submit" />
          </form>
        </div>
      </section>
      <ToastContainer />
    </Layout>
  )
}
function handleLogin(event) {
  event.preventDefault();
  console.log("logging in...");
  ToastController.show("logging in...");

}
function handleSignup(event) {
  event.preventDefault();
  console.log("signing you up!");
  ToastController.show("signing you up!");
}