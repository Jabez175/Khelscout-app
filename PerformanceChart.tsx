import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', progress: 65 },
    { name: 'Feb', progress: 59 },
    { name: 'Mar', progress: 80 },
    { name: 'Apr', progress: 41 },
    { name: 'May', progress: 95 },
    { name: 'Jun', progress: 75 },
];

const PerformanceChart: React.FC = () => {
    return (
        <div className="w-full h-48">
            <ResponsiveContainer>
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34D399" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide={true} domain={[0, 'dataMax + 20']} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '0.5rem',
                        }}
                        labelStyle={{ color: '#D1D5DB' }}
                    />
                    <Area type="monotone" dataKey="progress" stroke="#34D399" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceChart;