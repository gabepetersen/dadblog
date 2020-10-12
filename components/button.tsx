import styles from './button.module.scss';
import { motion } from 'framer-motion';

export default function Button({ children, style, callback }:
  { children: React.ReactNode, style: string, callback: (() => any) })
{
  var styleButton;
  if (style == 'primary') {
    styleButton = styles.primary;
  } else if (style == 'secondary') {
    styleButton = styles.secondary;
  } else {
    styleButton = styles.primary;
    console.warn('Button style not specified correctly - default to \'primary\' style'); 
  }
  return (
    <>
      <motion.button
        className={styleButton}
        onClick={callback}
        // define hover and tap events for button
        whileHover={{
          scale: 1.1,
          borderRadius: '20px',
          boxShadow: '5px 5px 1px 1px #000000'
        }}
        whileTap={{
          scale: 0.8
        }}
      >
        {children}
      </motion.button>
    </>
  );
}