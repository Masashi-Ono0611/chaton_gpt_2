// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Telegram Mini App SDKを非同期的に読み込む */}
        <script 
          src="https://telegram.org/js/telegram-web-app.js" 
          async 
          onLoad={() => {
            if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
              window.Telegram.WebApp.ready();
              console.log('Telegram WebApp SDK loaded successfully');
            } else {
              console.error('Failed to load Telegram WebApp SDK');
            }
          }}
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
