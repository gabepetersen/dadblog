import React from 'react';

import { overlay } from './overlay';
import Alert from './alert';


export const modal = {
  
  unmountLogin: null,

  show() {
    this.unmountLogin = overlay.create();
  },

  hide() {
    this.unmountLogin();
  }
}