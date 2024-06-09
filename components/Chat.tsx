// @ts-nocheck
"use client"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.SOCKET_SERVER_URL); // Use your server's URL in production

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('chat_message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('chat_message');
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit('chat_message', message);
            setMessage('');
        }
    };

    return (
        <div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;