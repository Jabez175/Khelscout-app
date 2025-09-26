

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, SendIcon } from './Icons';

// Centralized mock user data
const chatUsers: { [key: string]: { name: string; avatar: string } } = {
    'sai_official_1': { name: 'R. Sharma (SAI)', avatar: 'https://picsum.photos/seed/sai/100' },
    '1': { name: 'Ethan Carter', avatar: 'https://picsum.photos/seed/ethan/100' },
    '2': { name: 'Sophia Chen', avatar: 'https://picsum.photos/seed/sophia/100' },
    '3': { name: 'Liam Rodriguez', avatar: 'https://picsum.photos/seed/liam/100' },
    '4': { name: 'Coach Alex', avatar: 'https://picsum.photos/seed/alex/100' },
    '5': { name: 'Aarav Sharma', avatar: 'https://picsum.photos/seed/aarav/100' },
    '6': { name: 'Mei Lin', avatar: 'https://picsum.photos/seed/mei/100' },
    'org_1': { name: 'Global Sports Org', avatar: 'https://picsum.photos/seed/orgo/100' },
};

const mockMessages = [
    { id: 1, text: "Hello! We've reviewed your latest performance submission.", sender: 'other' },
    { id: 2, text: "That's great! Any feedback for me?", sender: 'user' },
    { id: 3, text: "Yes, your vertical jump shows significant improvement. We'd like to invite you to a regional assessment camp next month. More details will follow via notification.", sender: 'other' },
];


const ChatPage: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const [messages, setMessages] = useState(mockMessages);
    const [newMessage, setNewMessage] = useState('');

    const participant = userId ? chatUsers[userId] : { name: 'User', avatar: '' };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const userMessage = { id: Date.now(), text: newMessage, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');

        // Simulate a reply
        setTimeout(() => {
            const reply = { id: Date.now() + 1, text: "Thank you for your message. We will review and get back to you shortly.", sender: 'other' };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    useEffect(() => {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-[#0D1A18]">
            <header className="flex items-center p-4 bg-[#1A2E29] shadow-md z-10">
                <button onClick={() => navigate(-1)} className="p-2">
                   <ArrowLeftIcon />
                </button>
                <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full ml-3" />
                <div className="ml-3">
                    <h1 className="text-lg font-bold">{participant.name}</h1>
                    <p className="text-xs text-emerald-400">Online</p>
                </div>
            </header>
            
            <main id="chat-container" className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'other' && <img src={participant.avatar} alt="Participant" className="w-8 h-8 rounded-full" />}
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-[#1A2E29] text-white rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
            </main>

            <footer className="p-4 bg-[#1A2E29] sticky bottom-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full px-4 py-3 bg-[#0D1A18] border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white"
                    />
                    <button type="submit" className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-colors">
                        <SendIcon />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatPage;