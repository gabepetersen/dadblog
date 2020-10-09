import Link from 'next/link';
import { motion } from 'framer-motion';

import styles from './navbar.module.scss';
import utilStyles from '../styles/utils.module.scss';

export default function Navbar({ home }: { home: boolean }) {

  const user = false;
  
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
        <motion.li variants={nav_item}><Link href="/">Articles</Link></motion.li>
        <LoginControl user={user}></LoginControl>
      </motion.ul>
    </nav>
  );
}

/**
 * LoginControl returns sign in or sign out based on if the user is logged in
 * @param user tells if the user is logged in or not
 */
function LoginControl({ user }: { user: boolean }) {
  if (user) {
    return (
      <motion.li variants={nav_item}><Link href="/"><a>Sign Out</a></Link></motion.li>
    );
  } else {
    return (
      <motion.li variants={nav_item}><Link href="/"><a>Login</a></Link></motion.li>
    );
  }
}

// animation variants for the unordered list
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