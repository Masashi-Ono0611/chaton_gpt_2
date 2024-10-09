// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ChatBox from './components/ChatBox';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('loading');
  const [statusMessage, setStatusMessage] = useState('Initializing...');
  const [logs, setLogs] = useState<string[]>([]);

  // ログを追加する関数
  const addLog = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  useEffect(() => {
    const checkTelegramWebApp = () => {
      try {
        addLog('Step 1: Starting Telegram WebApp check...');

        if (typeof window !== 'undefined') {
          addLog('Step 2: Window object is available.');

          // Telegram WebAppの存在を確認
          if (window.Telegram?.WebApp) {
            addLog('Step 3: Telegram WebApp object is available. Proceeding with initialization...');

            const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
            addLog(`Step 4: initDataUnsafe retrieved: ${JSON.stringify(initDataUnsafe)}`);

            // ユーザー情報の確認
            if (initDataUnsafe?.user?.id) {
              const tgUserId = initDataUnsafe.user.id;
              addLog(`Step 5: User ID found: ${tgUserId}`);

              setUserId(tgUserId.toString());
              setStatus('ready');
              setStatusMessage('Application is ready.');
              addLog('Step 6: Application is ready and User ID has been set.');
            } else {
              setStatus('noUser');
              setStatusMessage('No user data found in Telegram WebApp.');
              addLog('Step 5: No user data found in Telegram WebApp.');
            }
          } else {
            setStatus('error');
            setStatusMessage('Telegram WebApp is not available.');
            addLog('Step 3: Telegram WebApp object is NOT available.');
          }
        } else {
          setStatusMessage('Window object not available.');
          addLog('Step 2: Window object is NOT available.');
        }
      } catch (error) {
        setStatus('error');
        setStatusMessage('Error occurred during Telegram SDK initialization.');
        addLog(`Step 6: Error during Telegram SDK initialization: ${error}`);
      }
    };

    const checkScriptLoad = () => {
      const script = document.querySelector('script[src="https://telegram.org/js/telegram-web-app.js"]');
      if (script) {
        addLog('Step 0: telegram-web-app.js script found.');
        script.addEventListener('load', () => {
          addLog('Step 0: telegram-web-app.js script loaded successfully.');
          checkTelegramWebApp();  // スクリプトのロードが完了した後に初期化処理を実行
        });
        script.addEventListener('error', () => {
          addLog('Step 0: Error loading telegram-web-app.js script.');
          setStatus('error');
          setStatusMessage('Failed to load telegram-web-app.js script.');
        });
      } else {
        addLog('Step 0: telegram-web-app.js script not found.');
        setStatus('error');
        setStatusMessage('telegram-web-app.js script is missing.');
      }
    };

    // ドキュメントのロード状況を確認
    if (document.readyState === 'complete') {
      addLog('Step 0: Document is fully loaded. Checking for script.');
      setStatusMessage('Document is fully loaded.');
      checkScriptLoad();
    } else {
      addLog('Step 0: Waiting for document to load...');
      setStatusMessage('Waiting for document to load...');
      window.addEventListener('load', checkScriptLoad);
    }

    return () => {
      window.removeEventListener('load', checkScriptLoad);
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

      {/* 状態に応じた表示 */}
      {status === 'loading' && <p>Loading...</p>}
      {status === 'noUser' && <p>No User Data</p>}
      {status === 'error' && <p>An error occurred.</p>}
      {status === 'ready' && <ChatBox userId={userId} />}
    </div>
  );
}
