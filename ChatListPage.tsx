import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

// Mock chat list data
const chatList = [
    { userId: '4', name: 'Coach Alex', lastMessage: "Let's work on those free throws tomorrow.", timestamp: '1h ago', unread: 2, avatar: 'https://picsum.photos/seed/alex/100' },
    { userId: 'sai_official_1', name: 'R. Sharma (SAI)', lastMessage: 'Your submission has been verified.', timestamp: '3h ago', unread: 0, avatar: 'https://picsum.photos/seed/sai/100' },
    { userId: '2', name: 'Sophia Chen', lastMessage: 'Thanks for the running tips!', timestamp: '1d ago', unread: 0, avatar: 'https://picsum.photos/seed/sophia/100' },
    { userId: '1', name: 'Ethan Carter', lastMessage: 'Can we schedule a session for next week?', timestamp: '2d ago', unread: 0, avatar: 'https://picsum.photos/seed/ethan/100' },
    { userId: '3', name: 'Liam Rodriguez', lastMessage: 'Okay, sounds good.', timestamp: '4d ago', unread: 0, avatar: 'https://picsum.photos/seed/liam/100' },
    { userId: '6', name: 'Mei Lin', lastMessage: 'See you at the tournament!', timestamp: '5d ago', unread: 0, avatar: 'https://picsum.photos/seed/mei/100' },
];

const ChatListPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout title="Messages" showBackButton>
            <div className="divide-y divide-gray-800 -mx-4">
                {chatList.map(chat => (
                    <button 
                        key={chat.userId} 
                        onClick={() => navigate(`/chat/${chat.userId}`)}
                        className="w-full flex items-center gap-4 p-4 text-left transition-colors hover:bg-gray-800"
                    >
                        <div className="relative">
                            <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-full" />
                            {chat.unread > 0 && 
                                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {chat.unread}
                                </span>
                            }
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-white">{chat.name}</h3>
                                <p className="text-xs text-gray-500">{chat.timestamp}</p>
                            </div>
                            <p className={`text-sm ${chat.unread > 0 ? 'text-white' : 'text-gray-400'} truncate`}>
                                {chat.lastMessage}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </Layout>
    );
};

export default ChatListPage;