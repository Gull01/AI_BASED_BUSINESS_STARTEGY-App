import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom animated marker icons
const createPulsingIcon = (color, size = 'large') => {
  const iconSize = size === 'large' ? 40 : 30;
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: ${iconSize}px; height: ${iconSize}px;">
        <div style="
          position: absolute;
          width: ${iconSize}px;
          height: ${iconSize}px;
          background: ${color};
          border-radius: 50%;
          opacity: 0.4;
          animation: pulse 2s infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${iconSize * 0.6}px;
          height: ${iconSize * 0.6}px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: ${size === 'large' ? '18px' : '14px'};
          font-weight: bold;
        ">●</div>
      </div>
    `,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
  });
};

const AutoZoomToResults = ({ data, selectedCity }) => {
    const map = useMap();
    
    useEffect(() => {
        if (data && data.length > 0) {
            // If a city is selected, zoom to it and its areas
            if (selectedCity) {
                const bounds = L.latLngBounds([]);
                bounds.extend([selectedCity.latitude, selectedCity.longitude]);
                
                // Include all areas in bounds
                if (selectedCity.areas && selectedCity.areas.length > 0) {
                    selectedCity.areas.forEach(area => {
                        bounds.extend([area.latitude, area.longitude]);
                    });
                }
                
                map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 13, duration: 1.5 });
            } else {
                // Auto-zoom to first city result
                const firstCity = data[0];
                const bounds = L.latLngBounds([]);
                bounds.extend([firstCity.latitude, firstCity.longitude]);
                
                // Include all areas of first city
                if (firstCity.areas && firstCity.areas.length > 0) {
                    firstCity.areas.forEach(area => {
                        bounds.extend([area.latitude, area.longitude]);
                    });
                    map.flyToBounds(bounds, { padding: [80, 80], maxZoom: 12, duration: 1.5 });
                } else {
                    map.flyTo([firstCity.latitude, firstCity.longitude], 11, { duration: 1.5 });
                }
            }
        }
    }, [data, selectedCity, map]);
    
    return null;
};

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapComponent = ({ data, selectedCity, onCitySelect, selectedArea, onMapClick }) => {
  const getColor = (score) => {
    if (score >= 0.9) return '#10B981'; // Green
    if (score >= 0.8) return '#FBBF24'; // Yellow
    return '#EF4444'; // Red
  };

  const getAreaColor = (score) => {
    if (score >= 0.9) return '#059669'; // Darker Green
    if (score >= 0.8) return '#F59E0B'; // Darker Yellow
    return '#DC2626'; // Darker Red
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-md border border-gray-200">
      <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={onMapClick} />
        <AutoZoomToResults data={data} selectedCity={selectedCity} />
        
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(1.5); opacity: 0.1; }
          }
        `}</style>
        
        {/* City Markers */}
        {data.map((city, idx) => (
          <Marker
            key={`city-${idx}`}
            position={[city.latitude, city.longitude]}
            icon={createPulsingIcon(getColor(city.score), 'large')}
            eventHandlers={{
              click: () => onCitySelect(city),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{city.city}, {city.country}</h3>
                <div className="text-sm mt-1">
                  <span className="font-semibold">Score: </span> {(city.score * 100).toFixed(0)}/100
                </div>
                <p className="text-xs mt-2 text-gray-600">{city.reason}</p>
                {city.areas && city.areas.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs font-semibold">Top Areas:</p>
                    <ul className="text-xs mt-1 space-y-1">
                      {city.areas.slice(0, 3).map((area, aIdx) => (
                        <li key={aIdx}>• {area.area_name} ({(area.score * 100).toFixed(0)})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Area Markers (neighborhoods) - Always show for first city if not selected */}
        {((selectedCity && selectedCity.areas) || (data.length > 0 && data[0].areas)) && 
          (selectedCity?.areas || data[0]?.areas)?.map((area, aIdx) => (
          <Marker
            key={`area-${aIdx}`}
            position={[area.latitude, area.longitude]}
            icon={createPulsingIcon(getAreaColor(area.score), 'small')}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-bold text-sm">{area.area_name}</h4>
                <div className="text-xs mt-1">
                  <span className="font-semibold">Area Score: </span> {(area.score * 100).toFixed(0)}/100
                </div>
                <p className="text-xs mt-1 text-gray-600">{area.characteristics}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
