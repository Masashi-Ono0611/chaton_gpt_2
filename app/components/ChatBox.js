// app/components/ChatBox.js
'use client';

import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase"; 

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const [userId, setUserId] = useState(''); // 初期状態は空

  useEffect(() => {
    // Telegramからユーザー情報を取得
    if (typeof window !== 'undefined' && window.Telegram) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user && user.id) {
        setUserId(user.id.toString()); // ユーザーIDを設定
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
      body: JSON.stringify({ userId, message, response: data.message }),
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
      />
      <Button onClick={sendMessage}>Send</Button>
    </Box>
  );
};

export default ChatBox;
