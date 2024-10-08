// app/api/saveMessage/route.js
import { db } from '../../../lib/firebase';
import { collection, addDoc } from "firebase/firestore";

const saveData = async (collectionName, data) => {
  const collectionRef = collection(db, collectionName);
  await addDoc(collectionRef, data);
};

export async function POST(request) {
  try {
    const { userId, message, response } = await request.json();
    await saveData(`users/${userId}/chats`, {
      message,
      response,
      timestamp: new Date(),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}