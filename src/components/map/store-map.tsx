'use client';

import 'leaflet/dist/leaflet.css';
import L, { Icon, type Map } from 'leaflet';
import { useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Expand } from 'lucide-react';

interface StoreMapProps {
    lat: number;
    lng: number;
    onExpand?: () => void;
    isInteractive?: boolean;
}

const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function StoreMap({ lat, lng, onExpand, isInteractive = false }: StoreMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<Map | null>(null);

    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                scrollWheelZoom: isInteractive,
                dragging: isInteractive,
                zoomControl: isInteractive,
            }).setView([lat, lng], 15);
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([lat, lng], { icon: customIcon }).addTo(map);
            
            // Invalidate size after a short delay to ensure container is sized
            setTimeout(() => map.invalidateSize(), 100);
        }
        
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [lat, lng, isInteractive]);


    return (
        <div className="relative">
            <div 
                ref={mapContainerRef}
                className="h-80 w-full rounded-[15px] z-0"
            />
            {onExpand && (
                 <Button 
                    variant="secondary"
                    size="icon"
                    onClick={onExpand}
                    className="absolute top-2 right-2 z-10 rounded-full h-8 w-8"
                    aria-label="Expand map"
                >
                    <Expand className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}
