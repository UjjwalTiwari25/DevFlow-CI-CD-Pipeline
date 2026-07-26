import React from 'react';
import Head from 'next/head';
import styles from './styles';

export default function FooterBackground() {
  return (
    <>
      <picture>
        <Head>
          <link rel="preload" href="/static/images/gradient-1024w.webp" />
        </Head>
        <source
          media="(max-width:769px)"
          srcSet="/static/images/gradient.png"
        />
        <img
          className="bottom-background-clean"
          src="/static/images/gradient-1024w.webp"
          alt="aura-background-gradient"
        />
      </picture>
      <style jsx>{styles}</style>
    </>
  );
}
