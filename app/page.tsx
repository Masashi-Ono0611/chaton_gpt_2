// app/page.tsx
import ChatBox from './components/ChatBox';

export default function Home() {
  const userId = '1234';  // ユーザーIDを動的に取得できるように後で修正

  return (
    <div>
      <h1>Chat Application</h1>
      <ChatBox userId={userId} />
    </div>
  );
}
