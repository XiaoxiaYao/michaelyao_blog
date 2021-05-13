import '../styles/global.css';
import React, { useEffect } from 'react';
import 'prismjs/themes/prism-okaidia.css';
const prism = require('prismjs');

export default function App({ Component, pageProps }) {
  useEffect(() => {
    prism.highlightAll();
  }, []);

  return <Component {...pageProps} />;
}
