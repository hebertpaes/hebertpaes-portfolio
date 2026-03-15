"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

const lat = -15.66648775;
const lng = -56.13251649;

export default function MapaInstituto() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const element = mapRef.current;
    if (!apiKey || !element) return;

    const initMap = () => {
      if (!window.google?.maps) return;
      const map = new window.google.maps.Map(element, {
        center: { lat, lng },
        zoom: 18,
        mapTypeId: "satellite",
        tilt: 0,
      });

      new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: "Instituto Hélio Marinho",
      });
    };

    if (window.google?.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-900/20 p-4 text-sm text-amber-100">
        Defina <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> para habilitar o mapa interativo da Google Maps API.
      </div>
    );
  }

  return <div ref={mapRef} className="h-[360px] w-full rounded-2xl border border-white/10" />;
}
