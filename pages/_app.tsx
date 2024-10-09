// pages/_app.tsx
import { useEffect } from 'react';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize Telegram WebApp SDK safely
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      console.log('Telegram SDK Initialized');
    } else {
      console.warn('Telegram SDK not available');
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
