// pages/_app.tsx
import { useEffect } from 'react';
import { AppProps } from 'next/app';  // 型定義を追加

function MyApp({ Component, pageProps }: AppProps) {  // AppPropsを使って型を指定
  useEffect(() => {
    // Telegram WebAppの初期化
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      console.log('Telegram SDK Initialized');
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
