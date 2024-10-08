// app/components/ChatBox.js
'use client';

import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase"; 

// propsで userId を受け取る
const ChatBox = ({ userId }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const [loading, setLoading] = useState(true);  // ローディング状態を追加
  const [noData, setNoData] = useState(false);   // データがない場合の状態

  const sendMessage = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    });
    const data = await res.json();

    // Firebaseにメッセージと応答を保存
    await fetch("/api/saveMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message, response: data.message }),  // userIdを保存時に使用
    });

    // 送信後、テキストボックスを空にする
    setMessage('');
  };

  // Firebaseから会話履歴・会話回数を取得して表示
  useEffect(() => {
    if (userId) {
      const q = query(
        collection(db, "users", userId, "chats"),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => doc.data());
        
        if (messages.length === 0) {
          setNoData(true);  // データがない場合のフラグを設定
        } else {
          setNoData(false);  // データがある場合はフラグをリセット
        }

        setChatHistory(messages);
        setChatCount(snapshot.size);
        setLoading(false);  // ローディング終了
      });

      return () => unsubscribe();
    }
  }, [userId]);

  return (
    <Box p={4}>
      {/* ユーザーIDの取得前のローディング中 */}
      {loading && <Text>Loading chat history...</Text>}

      {/* データがない場合 */}
      {!loading && noData && <Text>No chat history found.</Text>}

      {/* データがある場合 */}
      {!loading && !noData && (
        <>
          <Text fontSize="lg" fontWeight="bold">Your Points: {chatCount}</Text>

          <VStack spacing={4} align="start">
            {chatHistory.map((chat, index) => (
              <Box key={index}>
                <Text>User: {chat.message}</Text>
                <Text>ChatGPT: {chat.response}</Text>
              </Box>
            ))}
          </VStack>
        </>
      )}

      {/* メッセージ送信部分 */}
      <Input
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        }}
      />
      <Button onClick={sendMessage}>Send</Button>
    </Box>
  );
};

export default ChatBox;
