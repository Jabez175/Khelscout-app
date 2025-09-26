import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { PlusIcon, MessageSquareIcon, HeartIcon, SendIcon, TrophyIcon } from './Icons';
import { ATHLETES_DATA } from './constants';

// --- DUMMY DATA ---

const forumPosts = [
    { id: '1', author: 'Coach Alex', role: 'Mentor', avatar: 'https://picsum.photos/seed/alex/100', title: 'Tips for improving your vertical jump?', replies: 12, likes: 34, time: '2h ago' },
    { id: '2', author: 'Ethan Carter', role: 'Athlete', avatar: 'https://picsum.photos/seed/ethan/100', title: 'Sharing my progress on the 5k challenge!', replies: 8, likes: 56, time: '5h ago' },
    { id: '3', author: 'Sophia Chen', role: 'Athlete', avatar: 'https://picsum.photos/seed/sophia/100', title: 'Best pre-workout meals for endurance running?', replies: 21, likes: 45, time: '1d ago' },
];

const mockComments = [
    { id: 'c1', author: 'Noah', role: 'Athlete', avatar: 'https://picsum.photos/seed/noah/100', text: "Great question! I've found box jumps really help." },
    { id: 'c2', author: 'Ava', role: 'Athlete', avatar: 'https://picsum.photos/seed/ava/100', text: "Consistency is key. Don't forget to work on your landing form." },
];

// --- COMPONENTS ---

const CommentSection: React.FC = () => (
    <div className="border-t border-white/10 pt-3 mt-3 space-y-3">
        {mockComments.map(comment => (
            <div key={comment.id} className="flex items-start gap-2 text-sm">
                <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full" />
                <div className="bg-[#050e0c] p-2 rounded-lg flex-1">
                    <p className="font-semibold text-white">{comment.author} <span className="text-xs font-normal text-gray-500 ml-1">({comment.role})</span></p>
                    <p className="text-gray-300">{comment.text}</p>
                </div>
            </div>
        ))}
        <div className="flex items-center gap-2 pt-2">
            <input type="text" placeholder="Add a comment..." className="w-full bg-[#050e0c] px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm ring-1 ring-white/10" />
            <button className="p-2 text-emerald-400"><SendIcon/></button>
        </div>
    </div>
);


const PostCard: React.FC<{ post: (typeof forumPosts)[0] }> = ({ post }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [showComments, setShowComments] = useState(false);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    };

    return (
        <div className="bg-[#0E1B17] p-4 rounded-2xl ring-1 ring-white/10">
            <div className="flex items-center gap-3 mb-3">
                <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-semibold text-white">{post.author}</p>
                    <p className="text-xs text-gray-500">{post.role} • {post.time}</p>
                </div>
            </div>
            <h3 className="font-bold text-lg text-white leading-tight mb-4">{post.title}</h3>
            <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-4">
                     <button onClick={handleLike} className={`flex items-center gap-1.5 hover:text-white transition-colors ${isLiked ? 'text-red-500' : ''}`}>
                        <HeartIcon filled={isLiked} /> {likeCount}
                    </button>
                    <span className="flex items-center gap-1.5"><MessageSquareIcon /> {post.replies}</span>
                </div>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    className="bg-gray-700 text-white font-semibold px-3 py-1.5 rounded-md hover:bg-gray-600 transition-colors"
                >
                    {showComments ? 'Hide' : 'Join'}
                </button>
            </div>
            {showComments && <CommentSection />}
        </div>
    );
};

const DiscussionsView: React.FC = () => (
    <div className="space-y-4">
        {forumPosts.map(post => (
            <PostCard key={post.id} post={post} />
        ))}
    </div>
);

const RankingsPodium: React.FC<{ topThree: any[] }> = ({ topThree }) => {
    if (topThree.length < 3) {
        return (
            <div className="bg-[#0E1B17] p-6 rounded-2xl text-center text-gray-400 ring-1 ring-white/10">
                <p>Not enough ranked athletes to display a podium yet.</p>
            </div>
        );
    }
    return (
        <div className="flex justify-center items-end gap-4 bg-[#0E1B17] p-6 rounded-2xl ring-1 ring-white/10">
            {/* 2nd Place */}
            <div className="text-center">
                <div className="relative">
                    <img src={topThree[1].avatarUrl} alt={topThree[1].name} className="w-20 h-20 rounded-full mx-auto border-4 border-gray-400" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-400 text-black w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                </div>
                <p className="font-bold mt-3">{topThree[1].name}</p>
                <p className="text-sm text-emerald-400 font-mono">{topThree[1].points} pts</p>
            </div>
            {/* 1st Place */}
            <div className="text-center -translate-y-6">
                 <div className="relative">
                    <img src={topThree[0].avatarUrl} alt={topThree[0].name} className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400 shadow-lg shadow-yellow-400/30" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                </div>
                <p className="font-bold mt-3 text-lg">{topThree[0].name}</p>
                <p className="text-sm text-emerald-400 font-mono">{topThree[0].points} pts</p>
            </div>
            {/* 3rd Place */}
            <div className="text-center">
                <div className="relative">
                    <img src={topThree[2].avatarUrl} alt={topThree[2].name} className="w-20 h-20 rounded-full mx-auto border-4 border-yellow-700" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-700 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                </div>
                <p className="font-bold mt-3">{topThree[2].name}</p>
                <p className="text-sm text-emerald-400 font-mono">{topThree[2].points} pts</p>
            </div>
        </div>
    );
};

const RankingsView: React.FC = () => {
    const navigate = useNavigate();
    const rankedAthletes = [...ATHLETES_DATA].sort((a, b) => (a.rank || 999) - (b.rank || 999));
    const topThree = rankedAthletes.slice(0, 3);
    
    return (
        <div className="space-y-4">
            <RankingsPodium topThree={topThree} />
            <button
                onClick={() => navigate('/rankings')}
                className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
                <TrophyIcon /> View Full Leaderboard
            </button>
        </div>
    );
};

const CommunityPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'discussions' | 'rankings'>('discussions');

    return (
        <Layout title="Community Hub" showBackButton>
            {/* Tab Switcher */}
            <div className="bg-[#0E1B17] rounded-lg p-1 flex mb-6 ring-1 ring-white/10">
                <button
                    onClick={() => setActiveTab('discussions')}
                    className={`w-1/2 py-2.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'discussions' ? 'bg-emerald-500 text-white' : 'text-gray-300'}`}
                >
                    Discussions
                </button>
                <button
                    onClick={() => setActiveTab('rankings')}
                    className={`w-1/2 py-2.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'rankings' ? 'bg-emerald-500 text-white' : 'text-gray-300'}`}
                >
                    Rankings
                </button>
            </div>

            {activeTab === 'discussions' ? <DiscussionsView /> : <RankingsView />}

            {activeTab === 'discussions' && (
                <button
                    onClick={() => navigate('/create')}
                    className="fixed bottom-24 right-6 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black w-14 h-14 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center z-40"
                    aria-label="Start a new discussion"
                >
                    <PlusIcon />
                </button>
            )}
        </Layout>
    );
};

export default CommunityPage;