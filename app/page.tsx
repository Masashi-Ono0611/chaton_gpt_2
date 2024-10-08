//app/page.tsx
'use client';  // Client Sideで実行されることを明示

import { useEffect, useState } from 'react';
import ChatBox from './components/ChatBox';

export default function Home() {
  const [userId, setUserId] = useState('');  // 初期値を空に設定

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
      const tgUserId = initDataUnsafe?.user?.id;  // TelegramからユーザーIDを取得
      if (tgUserId) {
        setUserId(tgUserId.toString());  // userIdを設定
      }
    }
  }, []);

  return (
    <div>
      <h1>Chat Application</h1>
      {userId ? (
        <ChatBox userId={userId} />  // userIdが設定された場合のみ表示
      ) : (
        <p>Loading...</p>  // userIdが取得できるまでロード中の表示
      )}
    </div>
  );
}
