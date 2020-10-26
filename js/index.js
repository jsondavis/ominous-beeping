window.onload = () => {
  'use strict';

  if ('serviceworker' in navigator) {
    navigator.serviceworker
      .register('./sw.js');
  }
};
