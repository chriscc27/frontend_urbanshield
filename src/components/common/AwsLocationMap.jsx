import React, { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const getLocationConfig = () => {
  const region = import.meta.env.VITE_AWS_LOCATION_REGION || 'us-east-1';
  const mapName = import.meta.env.VITE_AWS_LOCATION_MAP_NAME;
  const apiKey = import.meta.env.VITE_AWS_LOCATION_API_KEY;

  if (!mapName || !apiKey) return null;

  return {
    region,
    mapName,
    apiKey,
    styleUrl: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
  };
};

const AwsLocationMap = ({
  className = '',
  center = [-63.18, -17.78],
  zoom = 12,
  markers = [],
  onMapReady,
  showNavigation = true,
  showAttribution = true,
  preserveDrawingBuffer = false,
  centerOnUserLocation = true,
  userLocationZoom = 14,
  showUserLocationMarker = true,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);
  const userLocationMarkerRef = useRef(null);
  const config = useMemo(() => getLocationConfig(), []);

  const setUserLocation = (map) => {
    if (!centerOnUserLocation || typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCenter = [position.coords.longitude, position.coords.latitude];
        map.flyTo({ center: userCenter, zoom: userLocationZoom, duration: 1200 });

        if (!showUserLocationMarker) return;

        if (userLocationMarkerRef.current) {
          userLocationMarkerRef.current.remove();
        }

        const markerElement = document.createElement('div');
        markerElement.style.width = '18px';
        markerElement.style.height = '18px';
        markerElement.style.borderRadius = '999px';
        markerElement.style.border = '3px solid white';
        markerElement.style.boxShadow = '0 0 0 8px rgba(76, 159, 112, 0.18)';
        markerElement.style.background = '#4c9f70';

        userLocationMarkerRef.current = new maplibregl.Marker({ element: markerElement, anchor: 'center' })
          .setLngLat(userCenter)
          .addTo(map);
      },
      () => {
        // Keep the default center if location access is denied.
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (!mapContainerRef.current || mapRef.current || !config) return undefined;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: config.styleUrl,
      center,
      zoom,
      preserveDrawingBuffer,
      attributionControl: showAttribution,
    });

    if (showNavigation) {
      map.addControl(new maplibregl.NavigationControl(), 'top-right');
    }

    map.on('load', () => {
      map.resize();
      setUserLocation(map);
      if (typeof onMapReady === 'function') onMapReady(map);
    });

    const resize = () => {
      try {
        map.resize();
      } catch (error) {
        // ignore
      }
    };

    window.addEventListener('resize', resize);
    mapRef.current = map;

    return () => {
      window.removeEventListener('resize', resize);
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.remove();
        userLocationMarkerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, [center, centerOnUserLocation, config, onMapReady, preserveDrawingBuffer, showAttribution, showNavigation, userLocationZoom, showUserLocationMarker, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !config) return undefined;

    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = [];

    markers.forEach((point) => {
      if (point.longitude == null || point.latitude == null) return;

      const markerElement = document.createElement('div');
      markerElement.style.width = '16px';
      markerElement.style.height = '16px';
      markerElement.style.borderRadius = '999px';
      markerElement.style.border = '2px solid white';
      markerElement.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.22)';
      markerElement.style.background = point.color || '#dc2626';

      const marker = new maplibregl.Marker({ element: markerElement, anchor: 'center' })
        .setLngLat([point.longitude, point.latitude])
        .addTo(map);

      if (point.popupHtml) {
        marker.setPopup(
          new maplibregl.Popup({ offset: 18, closeButton: true, closeOnClick: true }).setHTML(point.popupHtml),
        );
      }

      markerRefs.current.push(marker);
    });

    return undefined;
  }, [config, markers]);

  if (!config) {
    return (
      <div className={`flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-border bg-white/80 ${className}`.trim()}>
        <div className="max-w-md text-center p-6">
          <p className="text-sm font-semibold text-text-primary">Falta configurar Amazon Location</p>
          <p className="mt-2 text-xs text-text-muted">
            Define VITE_AWS_LOCATION_REGION, VITE_AWS_LOCATION_MAP_NAME y VITE_AWS_LOCATION_API_KEY para mostrar el mapa.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainerRef} className={`h-full w-full ${className}`.trim()} />;
};

export default AwsLocationMap;