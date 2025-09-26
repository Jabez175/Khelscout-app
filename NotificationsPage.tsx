
import React from 'react';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import { Notification, NotificationType } from './types';
import { BellIcon, CalendarIcon, MessageSquareIcon, UserIcon } from './Icons';

// Mock Data
const notifications: Notification[] = [
    { id: '1', type: NotificationType.EVENT, title: "Youth Basketball Tournament", message: "Your event is starting in 2 days.", timestamp: "1h ago", read: false, linkTo: '/events' },
    { id: '2', type: NotificationType.MESSAGE, title: "SAI Official", message: "Your latest test results for the Vertical Jump have been reviewed.", timestamp: "3h ago", read: false, linkTo: '/performance' },
    { id: '4', type: NotificationType.EVENT, title: "Regional Soccer Championship", message: "Registration confirmed! See you there.", timestamp: "2d ago", read: true, linkTo: '/my-registrations' },
];

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case NotificationType.EVENT: return <CalendarIcon />;
        case NotificationType.MESSAGE: return <MessageSquareIcon />;
        default: return <BellIcon />;
    }
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (notification.linkTo) {
            navigate(notification.linkTo);
        }
    };
    return (
        <button onClick={handleClick} className={`w-full flex items-start gap-4 p-4 text-left transition-colors hover:bg-gray-800 ${!notification.read ? 'bg-[#1A2E29]' : 'bg-transparent'}`}>
            <div className={`mt-1 ${!notification.read ? 'text-emerald-400' : 'text-gray-500'}`}>
                {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white">{notification.title}</h3>
                    {!notification.read && <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>}
                </div>
                <p className="text-sm text-gray-300">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
            </div>
        </button>
    );
};


const NotificationsPage: React.FC = () => {
    // In a real app, you'd group by date properly
    const todayNotifications = notifications.filter(n => n.timestamp.includes('h'));
    const earlierNotifications = notifications.filter(n => !n.timestamp.includes('h'));

    return (
        <Layout title="Notifications" showBackButton>
            {notifications.length > 0 ? (
                 <div className="divide-y divide-gray-800 -mx-4">
                    {todayNotifications.length > 0 && (
                        <div className="py-2">
                             <h2 className="text-sm font-bold text-gray-400 uppercase px-4 mb-2">Today</h2>
                             {todayNotifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                        </div>
                    )}
                    {earlierNotifications.length > 0 && (
                         <div className="py-2">
                             <h2 className="text-sm font-bold text-gray-400 uppercase px-4 my-2">Earlier</h2>
                             {earlierNotifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="font-semibold text-lg mb-2">All Caught Up!</h3>
                    <p className="text-gray-400 text-sm">You have no new notifications.</p>
                </div>
            )}
        </Layout>
    );
};

export default NotificationsPage;