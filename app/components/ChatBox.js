// app/components/ChatBox.js
'use client';

import { Box, Input, Button, Text } from "@chakra-ui/react";
import { useState } from "react";

const ChatBox = ({ userId }) => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, prompt: message }),
    });
    const data = await res.json();
    setResponse(data.message);

    // Firebaseに会話履歴を保存するロジック
    await fetch("/api/saveMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        message,
        response: data.message,
        timestamp: new Date().toISOString(),
      }),
    });
  };

  return (
    <Box p={4}>
      <Input
        placeholder="メッセージを入力"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={sendMessage}>送信</Button>
      <Text mt={4}>{response}</Text>
    </Box>
  );
};

export default ChatBox;
