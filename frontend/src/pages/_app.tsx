import './global.scss';
import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Handsfree Box</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
