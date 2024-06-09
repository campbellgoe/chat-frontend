// @ts-nocheck

"use client";


import * as Ably from 'ably';
import { AblyProvider, useChannel, useConnectionStateListener } from 'ably/react';
import { useState } from 'react';

export default function App() {

  // Connect to Ably using the AblyProvider component and your API key
  const client = new Ably.Realtime.Promise({ key: process.env.ABLY_API_KEY });

  return (
    <AblyProvider client={client}>
      <AblyPubSub />
    </AblyProvider>
  );
}

function AblyPubSub() {
    const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([]);

  useConnectionStateListener('connected', () => {
    console.log('Connected to Ably!');
  });

  // Create a channel called 'get-started' and subscribe to all messages with the name 'first' using the useChannel hook
  const { channel } = useChannel('get-started', 'first', (message) => {
    setMessages(previousMessages => [...previousMessages, message]);
  });

  return (
    // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
    <div>
        <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={() => { if(message) channel.publish('first', message) }}>
        Publish
      </button>
      {
        messages.map(message => {
          return <p key={message.id}>{message.data.body}</p>
        })
      }
    </div>
  );
}