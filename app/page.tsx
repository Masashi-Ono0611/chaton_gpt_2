// app/page.tsx

'use client';  // クライアントサイドで実行することを明示

import { useEffect, useState } from 'react';
import ChatBox from './components/ChatBox';

export default function Home() {
  const [userId, setUserId] = useState('');  // 初期値を空に設定
  const [status, setStatus] = useState('loading');  // 状態を管理

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        console.log('window object exists');
        if (window.Telegram?.WebApp) {
          console.log('Telegram WebApp exists');
          const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
          const tgUserId = initDataUnsafe?.user?.id;
          if (tgUserId) {
            setUserId(tgUserId.toString());
            setStatus('ready');  // ユーザーIDが取得できた場合
          } else {
            setStatus('noUser');  // ユーザーIDが存在しない場合
          }
        } else {
          setStatus('error');  // SDKが利用できない場合
        }
      }
    } catch (error) {
      console.error("Error occurred during Telegram SDK initialization:", error);
      setStatus('error');
    }
  }, []);

  // 表示の切り替え
  return (
    <div>
      <h1>Chat Application</h1>
      {status === 'loading' && <p>Loading...</p>}  {/* ロード中 */}
      {status === 'noUser' && <p>No User Data</p>}  {/* ユーザー情報なし */}
      {status === 'error' && <p>An error occurred.</p>}  {/* エラー */}
      {status === 'ready' && (
        <ChatBox userId={userId} />  // userIdが設定された場合のみ表示
      )}
    </div>
  );
}
