// app/_document.tsx

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* 非同期でTelegram Mini App SDKを読み込む */}
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
