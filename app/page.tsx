//app/page.tsx
'use client';  // Client Sideで実行されることを明示

import { useEffect, useState } from 'react';
import ChatBox from './components/ChatBox';

export default function Home() {
  const [userId, setUserId] = useState('');  // 初期値を空に設定
  const [status, setStatus] = useState('loading'); // ステータス管理: loading, noUser, error, ready

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
        const tgUserId = initDataUnsafe?.user?.id;  // TelegramからユーザーIDを取得
        if (tgUserId) {
          setUserId(tgUserId.toString());  // userIdを設定
          setStatus('ready');  // ユーザーIDが取得できた場合
        } else {
          setStatus('noUser');  // ユーザーIDが存在しない場合
        }
      } else {
        setStatus('error');  // Telegramが初期化されていない場合
      }
    } catch (error) {
      console.error("Error occurred during Telegram SDK initialization:", error);
      setStatus('error');  // エラー時の状態
    }
  }, []);

  return (
    <div>
      <h1>Chat Application</h1>
      {status === 'loading' && <p>読み込み中...</p>}
      {status === 'noUser' && <p>ユーザー情報がありません。</p>}
      {status === 'error' && <p>エラーが発生しました。</p>}
      {status === 'ready' && <ChatBox userId={userId} />}  {/* userIdが取得できた場合のみ表示 */}
    </div>
  );
}
