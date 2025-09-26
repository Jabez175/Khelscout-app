import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from './types';
import { ArrowLeftIcon, DownloadIcon, SortIcon } from './Icons';
import { indianDistricts } from './constants';

declare const L: any;

const dummyData = [
  { id: '1', name: 'Ethan Carter', lat: 28.63, lng: 77.21, role: 'Athlete', gender: 'Male', sport: 'Basketball', age: 22 },
  { id: '2', name: 'Sophia Chen', lat: 28.65, lng: 77.22, role: 'Athlete', gender: 'Female', sport: 'Running', age: 20 },
  { id: '3', name: 'Liam Rodriguez', lat: 28.61, lng: 77.23, role: 'Athlete', gender: 'Male', sport: 'Soccer', age: 24 },
  { id: '4', name: 'Coach Alex', lat: 28.59, lng: 77.20, role: 'Mentor', gender: 'Male', sport: 'Basketball', age: 35 },
  { id: '5', name: 'Olivia Kim', lat: 28.70, lng: 77.18, role: 'Athlete', gender: 'Female', sport: 'Basketball', age: 19 },
  { id: '6', name: 'Coach Jordan', lat: 28.68, lng: 77.25, role: 'Mentor', gender: 'Female', sport: 'Running', age: 31 },
  { id: '7', name: 'Noah Patel', lat: 28.55, lng: 77.24, role: 'Athlete', gender: 'Male', sport: 'Soccer', age: 21 },
  { id: '8', name: 'Ava Garcia', lat: 28.62, lng: 77.19, role: 'Athlete', gender: 'Female', sport: 'Soccer', age: 18 },
];

const sports = ['All', ...Array.from(new Set(dummyData.map(d => d.sport)))];
const genders = ['All', 'Male', 'Female'];
const roles = ['All', 'Athlete', 'Mentor'];
const ageRanges = ['All', 'Under 18', '18-22', '23+'];

const HeatmapPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [roleFilter, setRoleFilter] = useState('All');
    const [sportFilter, setSportFilter] = useState('All');
    const [genderFilter, setGenderFilter] = useState('All');
    const [ageFilter, setAgeFilter] = useState('All');

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerLayerRef = useRef<any>(null);
    const heatmapLayerRef = useRef<any>(null);

    const filteredData = useMemo(() => {
        return dummyData
            .filter(item => roleFilter === 'All' || item.role === roleFilter)
            .filter(item => sportFilter === 'All' || item.sport === sportFilter)
            .filter(item => genderFilter === 'All' || item.gender === genderFilter)
            .filter(item => {
                if (ageFilter === 'All') return true;
                if (ageFilter === 'Under 18') return item.age < 18;
                if (ageFilter === '18-22') return item.age >= 18 && item.age <= 22;
                if (ageFilter === '23+') return item.age >= 23;
                return true;
            });
    }, [roleFilter, sportFilter, genderFilter, ageFilter]);

    useEffect(() => {
        if (typeof L === 'undefined' || !mapContainerRef.current || mapRef.current) return;

        const centerLat = 28.6139;
        const centerLng = 77.2090;

        mapRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([centerLat, centerLng], 11);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
        }).addTo(mapRef.current);

        markerLayerRef.current = L.layerGroup().addTo(mapRef.current);

        const athleteIconUrl = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzM0RD M5OSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+`;
        const mentorIconUrl = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzM4QkRGNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+`;

        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend bg-[#1A2E29] p-2 rounded-md border border-gray-600 text-xs text-white');
            div.innerHTML = `
                <h4 class="font-bold mb-1">Legend</h4>
                <div class="flex items-center"><img src="${athleteIconUrl}" class="w-4 h-4 mr-1"/> Athlete</div>
                <div class="flex items-center"><img src="${mentorIconUrl}" class="w-4 h-4 mr-1"/> Mentor</div>
                <div class="mt-1 flex items-center"><div class="w-4 h-4 bg-gradient-to-t from-red-500 via-lime-500 to-blue-500 opacity-70 mr-1 rounded-full"></div> Density</div>
            `;
            return div;
        };
        legend.addTo(mapRef.current);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || !markerLayerRef.current || typeof L === 'undefined') return;

        markerLayerRef.current.clearLayers();
        if (heatmapLayerRef.current) {
            mapRef.current.removeLayer(heatmapLayerRef.current);
        }

        if (filteredData.length > 0) {
            const heatData = filteredData.map(d => [d.lat, d.lng, 0.8]);
            heatmapLayerRef.current = L.heatLayer(heatData, {
                radius: 35, blur: 20, maxZoom: 12, gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
            }).addTo(mapRef.current);
            
            const athleteIcon = L.icon({ iconUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzM0RD M5OSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+`, iconSize: [24, 24], });
            const mentorIcon = L.icon({ iconUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzM4QkRGNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+`, iconSize: [24, 24], });

            filteredData.forEach(item => {
                const marker = L.marker([item.lat, item.lng], {
                    icon: item.role === 'Athlete' ? athleteIcon : mentorIcon
                }).addTo(markerLayerRef.current);
                marker.bindPopup(`<b>${item.name}</b><br>${item.role} - ${item.sport}`);
            });
        }

    }, [filteredData]);

    const handleDownloadCsv = () => {
        // Mock CSV download
        console.log("Downloading CSV for:", filteredData);
        alert("CSV download initiated (see console for data).");
    };

    return (
        <div className="relative h-full w-full bg-gray-900 flex flex-col max-w-md mx-auto">
            <div className="relative flex-grow">
                <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
                <header className="absolute top-0 left-0 right-0 p-4 flex items-center bg-gradient-to-b from-black/60 to-transparent z-[1000]">
                    <button onClick={() => navigate(-1)} className="p-2 text-white bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors" aria-label="Back">
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-xl font-bold text-white mx-auto pr-10">Talent Map</h1>
                </header>
            </div>

            <div className="bg-[#1A2E29] rounded-t-2xl p-4 flex-shrink-0 z-10">
                <div className="w-10 h-1.5 bg-gray-600 rounded-full mx-auto mb-4 cursor-grab"></div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-center">Search Filters</h2>
                    {user?.role === UserRole.ORGANIZATION && (
                         <button onClick={handleDownloadCsv} className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white font-semibold rounded-lg text-sm">
                            <DownloadIcon/> Download CSV
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="w-full px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white appearance-none text-sm">
                        {roles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                     <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="w-full px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white appearance-none text-sm">
                        {genders.map(gender => <option key={gender} value={gender}>{gender}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <select value={sportFilter} onChange={e => setSportFilter(e.target.value)} className="w-full px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white appearance-none text-sm">
                        {sports.map(sport => <option key={sport} value={sport}>{sport}</option>)}
                    </select>
                    <select value={ageFilter} onChange={e => setAgeFilter(e.target.value)} className="w-full px-3 py-2 bg-[#0D1A18] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white appearance-none text-sm">
                        {ageRanges.map(age => <option key={age} value={age}>{age}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default HeatmapPage;