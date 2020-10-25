import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import { getThemeController } from './theme-provider';
import { logout, checkLogin } from '../lib/auth.service';
import Button from './button';

import styles from './navbar.module.scss';
import utilStyles from '../styles/utils.module.scss';

export default function Navbar({ home }: { home: boolean }) {

  // get the theme state and function to change it
  const [theme, setTheme] = getThemeController();
  
  return (
    <nav>
      <motion.ul
        className={styles.menu}
        initial="initial"
        animate="animate"
        variants={nav_list}
      >
        <motion.li className={`${utilStyles.heading2Xl} ${styles.menu_title}`}
          variants={nav_item}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link href="/">
          <a>
              Thats a Blog!
          </a>
          </Link>
        </motion.li>
        <motion.li variants={nav_item}>
          <Button style="primary" callback={() => setTheme(theme == 'dark' ? 'light' : 'dark')}>
            {theme == 'dark' ? 'Day Mode' : 'Night Mode'}
          </Button>
        </motion.li>
        <motion.li variants={nav_item}><Link href="/articles">Articles</Link></motion.li>
        <motion.li variants={nav_item}>
          <LoginControl></LoginControl>
        </motion.li>
      </motion.ul>
    </nav>
  );
}

/**
 * LoginControl returns sign in or sign out based on if the user is logged in
 * @param user tells if the user is logged in or not
 */
function LoginControl() {

  // declare router
  const router = useRouter();

  function toggleLogout(event) {
    event.preventDefault();
    logout();
    router.push('/');
  }
  return (checkLogin() ? <a onClick={toggleLogout}>Logout</a> : <Link href="/login"><a>Login</a></Link> ) 
}

/**
 * Here are the animation variants
 */
const nav_list = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

// animation variants for the list items
const nav_item = {
  initial: {
    opacity: 0, y: -100
  },
  animate: {
    opacity: 1, y: 0
  }
}