import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from './Icons';

declare const L: any;

// Mock data for fraud hotspots
const fraudHotspots = [
  { lat: 28.63, lng: 77.21, score: 95 }, // High fraud score
  { lat: 28.65, lng: 77.22, score: 88 },
  { lat: 19.07, lng: 72.87, score: 40 }, // Medium fraud score in Mumbai
  { lat: 19.09, lng: 72.89, score: 55 },
  { lat: 12.97, lng: 77.59, score: 20 }, // Low fraud score in Bangalore
];

const AdminHeatmapPage: React.FC = () => {
    const navigate = useNavigate();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (typeof L === 'undefined' || !mapContainerRef.current || mapRef.current) return;

        mapRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([22.5, 78.9], 5); // Center of India
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
        }).addTo(mapRef.current);

        const heatData = fraudHotspots.map(d => [d.lat, d.lng, d.score / 100]); // Normalize score for intensity
        L.heatLayer(heatData, {
            radius: 40, blur: 25, maxZoom: 10, 
            gradient: {0.4: 'lime', 0.8: 'yellow', 1: 'red'}
        }).addTo(mapRef.current);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div className="relative h-full w-full bg-gray-900 flex flex-col max-w-md mx-auto">
            <div className="relative flex-grow">
                <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
                <header className="absolute top-0 left-0 right-0 p-4 flex items-center bg-gradient-to-b from-black/60 to-transparent z-[1000]">
                    <button onClick={() => navigate(-1)} className="p-2 text-white bg-black/30 rounded-full backdrop-blur-sm" aria-label="Back">
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-xl font-bold text-white mx-auto pr-10">Anomaly Heatmap</h1>
                </header>
            </div>
             <div className="bg-[#1A2E29] p-4 flex-shrink-0 z-10 text-center">
                <h2 className="text-lg font-bold">Flagged Submission Density</h2>
                <p className="text-sm text-gray-400">Regions with high concentrations of flagged videos are shown in red. This can help identify areas with potential organized cheating.</p>
            </div>
        </div>
    );
};

export default AdminHeatmapPage;