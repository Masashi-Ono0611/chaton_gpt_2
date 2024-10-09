// app/components/ChatBox.js
'use client';

import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase"; 

// ChatBox component with userId passed as prop
const ChatBox = ({ userId }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatCount, setChatCount] = useState(0);

  const sendMessage = async () => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
      });
      const data = await res.json();

      // Save message and response to Firebase
      await fetch("/api/saveMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message, response: data.message }),
      });

      setMessage(''); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Fetch chat history from Firebase
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
          if (e.key === 'Enter') sendMessage();
        }}
      />
      <Button onClick={sendMessage}>Send</Button>
    </Box>
  );
};

export default ChatBox;
