import dynamic from 'next/dynamic';

import styles from './toast.module.scss';
import ReactDOM from 'react-dom';

function ToastMessage({children} : {children: React.ReactNode}) {
  return (
    <>   
      <div className={styles.toast_message_container}> 
        <div className={styles.toast}>{children}</div>
      </div>
    </>
  )
}

export function ToastContainer() {
  return (
    <div id="toast_container" className={styles.toast_container}></div>
  )
}

/**
 * ToastController controls addition and deletion of toasts in Toast Controller
 * Nice help from Ashwani Arya :)
 * https://medium.com/@ashwaniparker/a-simple-nextjs-compatible-toast-cefdec4f3c11
 */
export const ToastController = {
  timeout: null,
  currentToast: false,

  delete: () => {
    let container = document.getElementById('toast_container');
    // check if theres a ToastContainer active
    if (container) {
      // check if there is a current toast
      if (ToastController.currentToast) {
        ReactDOM.unmountComponentAtNode(container);
        // clear the timeout if there is any
        if (ToastController.timeout) {
          clearTimeout(ToastController.timeout);
          ToastController.timeout = null;
        }
      } else {
        console.error("Trying to call a ToastController.delete without calling ToastController.show first");
      }
    } else {
      console.error("You have to add a ToastContainer component to your page first")
    }
  },

  show: (msg: string) => {
    // check validity of toast controller
    if (document.getElementById('toast_container')) {
      ReactDOM.render(
        <ToastMessage>{msg}</ToastMessage>, document.getElementById('toast_container')
      );
      // set deletion timeout to 5 seconds for now
      ToastController.timeout = setTimeout(ToastController.delete, 5000);
      ToastController.currentToast = true;
    } else {
      console.error("You have to add a ToastContainer component to your page first");
    }
  }
}