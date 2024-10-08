//app/page.tsx
'use client';  // Ensuring client-side execution

import { useEffect, useState } from 'react';
import ChatBox from './components/ChatBox';

export default function Home() {
  const [userId, setUserId] = useState('');  // Store Telegram user ID
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState('');  // To handle errors if any

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
        const tgUserId = initDataUnsafe?.user?.id;  // Retrieve user ID from Telegram
        
        if (tgUserId) {
          setUserId(tgUserId.toString());  // Set user ID if available
        } else {
          setError("User ID could not be found.");
        }
      }
    } catch (err) {
      setError("Error initializing Telegram SDK.");
    } finally {
      setLoading(false);  // Set loading to false when done
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;  // While SDK is initializing
  }

  if (error) {
    return <p>{error}</p>;  // If there is an error (e.g., Telegram SDK isn't initialized properly)
  }

  return (
    <div>
      <h1>Chat Application</h1>
      {userId ? (
        <ChatBox userId={userId} />  // Pass userId to ChatBox component if available
      ) : (
        <p>No User ID found.</p>  // If userId is missing
      )}
    </div>
  );
}
