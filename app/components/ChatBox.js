// app/components/ChatBox.js
'use client';

import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";  // ここにonSnapshotを追加
import { db } from "../../lib/firebase";  // Firebaseの初期化ファイル

const ChatBox = ({ userId }) => {  // propsとしてuserIdを受け取る
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    });
    const data = await res.json();
    setResponse(data.message);

    // Firebaseにメッセージと応答を保存
    await fetch("/api/saveMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message, response: data.message }),
    });
  };

  // Firebaseから会話履歴を取得して表示
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", userId, "chats"),  // コレクション参照
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => doc.data());
        setChatHistory(messages);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return (
    <Box p={4}>
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
      <Text mt={4}>{response}</Text>
    </Box>
  );
};

export default ChatBox;
