import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { siteTitle } from './layout';
import { logout, checkLogin, getRole } from '../lib/auth.service';
import styles from './navbar.module.scss';

// disable ssr for ThemeButton and specify dynamic import
const ThemeButton = dynamic(() => import('./theme-button'), {
  ssr: false
})

export default function Navbar({ home }: { home: boolean }) {
  
  return (
    <nav>
      <motion.ul
        className={styles.menu}
        initial="initial"
        animate="animate"
        variants={nav_list}
      >
        
        {home ? (
          <li className={`${styles.menu_title}`}>
            <h1 className="headingXl">{siteTitle}</h1>
          </li>
        ) : (
          <motion.li className={`heading2Xl ${styles.menu_title}`}
            variants={nav_item}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link href="/">{siteTitle}</Link>
          </motion.li>
        )}
        
        <WriteControl></WriteControl>
        <motion.li variants={nav_item}>
          <LoginControl></LoginControl>
        </motion.li>
        <motion.li variants={nav_item}>
          <ThemeButton/>
        </motion.li>
      </motion.ul>
    </nav>
  );
}

/**
 * LoginControl returns sign in or sign out based on if the user is logged in
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

function WriteControl() {
  if (getRole() === 'writer') {
    return (<motion.li variants={nav_item}><Link href="/create">Write</Link></motion.li>);
  }
  return (<></>);
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