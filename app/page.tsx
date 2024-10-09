// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ChatBox from './components/ChatBox';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('loading');
  const [statusMessage, setStatusMessage] = useState('Initializing...');
  const [logs, setLogs] = useState<string[]>([]); // ログの配列を追加

  // ログを更新して表示する関数
  const addLog = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  useEffect(() => {
    const checkTelegramWebApp = () => {
      try {
        if (typeof window !== 'undefined') {
          addLog('Window object detected.');
          setStatusMessage('Window object detected.');

          if (window.Telegram?.WebApp) {
            addLog('Telegram WebApp exists. Initializing...');
            setStatusMessage('Telegram WebApp exists. Initializing...');

            const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
            const tgUserId = initDataUnsafe?.user?.id;

            if (tgUserId) {
              setUserId(tgUserId.toString());
              setStatus('ready');
              setStatusMessage('User ID found, application is ready.');
              addLog('User ID found, application is ready.');
            } else {
              setStatus('noUser');
              setStatusMessage('No user data found in Telegram WebApp.');
              addLog('No user data found in Telegram WebApp.');
            }
          } else {
            setStatus('error');
            setStatusMessage('Telegram WebApp is not available.');
            addLog('Telegram WebApp is not available.');
          }
        }
      } catch (error) {
        setStatus('error');
        setStatusMessage('Error occurred during Telegram SDK initialization.');
        addLog(`Error occurred during Telegram SDK initialization: ${error}`);
      }
    };

    // ドキュメントがロード完了したタイミングで処理を実行
    if (document.readyState === 'complete') {
      addLog('Document is fully loaded.');
      setStatusMessage('Document is fully loaded.');
      checkTelegramWebApp();
    } else {
      addLog('Waiting for document to load...');
      setStatusMessage('Waiting for document to load...');
      window.addEventListener('load', checkTelegramWebApp);
    }

    return () => {
      window.removeEventListener('load', checkTelegramWebApp);
    };
  }, []);

  return (
    <div>
      <h1>Chat Application</h1>
      <p>Status: {status}</p>
      <p>{statusMessage}</p> {/* 詳細なステータスを表示 */}
      
      {/* ログメッセージの表示 */}
      <div>
        <h2>Logs:</h2>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>

      {/* ロード中、ユーザー情報なし、エラー、準備完了の状態に応じた表示 */}
      {status === 'loading' && <p>Loading...</p>}
      {status === 'noUser' && <p>No User Data</p>}
      {status === 'error' && <p>An error occurred.</p>}
      {status === 'ready' && <ChatBox userId={userId} />}
    </div>
  );
}
