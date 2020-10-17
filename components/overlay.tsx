import React from 'react';
import ReactDOM from 'react-dom';

// Big thank you goes out to Jeremy Gillick on this solution
// THIS DOESN'T WORK IGNORE THIS FOR LATER
// https://stackoverflow.com/questions/51662609/react-programmatically-opening-modals-and-cleaning-up-automatically

export const overlay = {
  create() {
    if (typeof window != 'undefined') {
      // first append a div to the document body
      const container = document.createElement('div');
      document.body.appendChild(container);
      // create an react reference with customized arguements and children nodes
      const overlayReference = React.createElement('div', {}, 'yeet');
      // render new overlay element inside of DOM container
      ReactDOM.render(overlayReference, container);
      console.log(overlayReference);
      return this.destroy(container);
    }
  },
  destroy(container) {
    if (typeof window != 'undefined') {
      // destroy from virtual DOM
      ReactDOM.unmountComponentAtNode(container);
      // destroy reference of container
      container.parentNode.removeChild(container);
    }
  }
}
