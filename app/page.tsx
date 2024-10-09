// app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import ChatBox from './components/ChatBox';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const checkTelegramWebApp = () => {
      try {
        if (typeof window !== 'undefined') {
          console.log('window object exists');
          if (window.Telegram?.WebApp) {
            console.log('Telegram WebApp exists');
            const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
            const tgUserId = initDataUnsafe?.user?.id;
            if (tgUserId) {
              setUserId(tgUserId.toString());
              setStatus('ready');
            } else {
              setStatus('noUser');
            }
          } else {
            setStatus('error');
            console.error('Telegram WebApp is not available.');
          }
        }
      } catch (error) {
        console.error("Error occurred during Telegram SDK initialization:", error);
        setStatus('error');
      }
    };

    // スクリプトが読み込まれているか確認してから初期化
    if (document.readyState === 'complete') {
      checkTelegramWebApp();
    } else {
      window.addEventListener('load', checkTelegramWebApp);
    }

    return () => {
      window.removeEventListener('load', checkTelegramWebApp);
    };
  }, []);

  return (
    <div>
      <h1>Chat Application</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'noUser' && <p>No User Data</p>}
      {status === 'error' && <p>An error occurred.</p>}
      {status === 'ready' && <ChatBox userId={userId} />}
    </div>
  );
}
