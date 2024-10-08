// app/api/saveMessage/route.js
import { db } from '../../../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// Firestoreに会話履歴を保存するエンドポイント
export async function POST(request) {
  try {
    const { userId, message, response } = await request.json();

    // Firestoreにデータを保存
    const chatData = {
      userId,
      message,
      response,
      timestamp: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'chats', userId, 'messages'), chatData);

    return new Response(JSON.stringify({ success: true, id: docRef.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
