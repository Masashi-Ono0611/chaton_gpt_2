// app/components/ChatBox.js
'use client';

import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase"; 

// `props` で userId を受け取るように修正
const ChatBox = ({ userId }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatCount, setChatCount] = useState(0);

  // Telegram SDK から `userId` を取得し、ログに出力
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
      console.log(initDataUnsafe); // ここでユーザー情報を確認
      const tgUserId = initDataUnsafe?.user?.id;  // TelegramからユーザーIDを取得
      if (tgUserId) {
        console.log("Telegram User ID: ", tgUserId);
      }
    }
  }, []);

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
        setChatHistory(messages);
        setChatCount(snapshot.size);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  return (
    <Box p={4}>
      <Text fontSize="lg" fontWeight="bold">Your Points: {chatCount}</Text>

      <VStack spacing={4} align="start">
        {chatHistory.map((chat, index) => (
          <Box key={index}>
            <Text>User: {chat.message}</Text>
            <Text>ChatGPT: {chat.response}</Text>
          </Box>
        ))}
      </VStack>
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
