import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './ParkMap.css';
import VideoBackground from './VideoBackground';
// import AirPollution from './components/Airpolution';
// import LightPollution from './components/LightPolution';
// import Weather from './components/Weather';
// import UVData from './components/UVIndex';   


mapboxgl.accessToken = 'pk.eyJ1IjoiYWthY2hyb28iLCJhIjoiY20zMGd3ZmYzMG44azJsb2o0cHVtYmFzZyJ9.Cgs--oaX89DPQE_Xj7l9NA';

function ParkMap() {

  const [userLocation, setUserLocation] = useState(null);
  const [parks, setParks] = useState([]);
  const [mapSize, setMapSize] = useState('500px');
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');   
  const [loading, setLoading] = useState(false);
  const mapContainer = useRef(null);
  const markersRef = useRef(new Map());
  const userMarkerRef = useRef(null);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([longitude, latitude]);
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!userLocation || mapContainer.current === null) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10', // Dark theme map style
      center: userLocation,
      zoom: 12,
    });

    // Create user marker only once
    userMarkerRef.current = new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat(userLocation)
      .addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [userLocation]);

  // Update user marker position
  useEffect(() => {
    if (userMarkerRef.current && userLocation) {
      userMarkerRef.current.setLngLat(userLocation);
    }
  }, [userLocation]);

  const searchLocation = async () => {
    if (!searchQuery || !map) return;
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch location');
      
      const data = await response.json();
      if (data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        setUserLocation([longitude, latitude]);
        
        map.flyTo({
          center: [longitude, latitude],
          zoom: 12
        });
        
        // Clear existing markers before fetching new parks
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current.clear();
        
        fetchNearbyParks([longitude, latitude]);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyParks = async (location) => {
    if (!location || !map) return;
    
    try {
      const radius = 0.8;
      const [longitude, latitude] = location;
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/park.json?` +
        `bbox=${longitude - radius},${latitude - radius},${longitude + radius},${latitude + radius}&` +
        `types=poi&limit=25&access_token=${mapboxgl.accessToken}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch parks');
      
      const data = await response.json();

      const nearbyParks = data.features
        .map(park => ({
        id: park.id,
        name: park.text,
        coordinates: park.center,
        address: park.place_name
      }));
      
      setParks(nearbyParks);
      
    //   markersRef.current.forEach(marker => marker.remove());
    //   markersRef.current.clear();

      // Create markers for new parks
      nearbyParks.forEach(park => {
        if (!markersRef.current.has(park.id)) {
          const marker = new mapboxgl.Marker({ color: '#4CAF50' })
            .setLngLat(park.coordinates)
            .setPopup(
              new mapboxgl.Popup().setHTML(`
                <h3 style="font-weight: bold; margin-bottom: 4px;">${park.name}</h3>
                <p style="font-size: 0.875rem; color: #bbb;">${park.address}</p>
              `)
            )
            .addTo(map);
          
          markersRef.current.set(park.id, marker);
        }
      });

      // Fit bounds to include all markers
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(location);
      nearbyParks.forEach(park => bounds.extend(park.coordinates));
      
      map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15
      });
    } catch (error) {
      console.error('Error fetching parks:', error);
    }
  };

  /*const toggleMapSize = () => {
    setMapSize(prevSize => prevSize === '500px' ? '100vh' : '500px');
    setTimeout(() => {
      if (map) map.resize();
    }, 300);
  };*/
  return (
        <div className='background'>
            <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            // backgroundColor: '#121212',
            flexDirection: 'column',
            width:'100%',
            padding: '0 16px' 
            }}>
            <div style={{
                // backgroundColor: '#121212',
                color: '#e0e0e0',
                padding: '16px',
                maxWidth: '800px',
                width: '200%',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <h1 style={{ fontFamily: 'Exo 2, sans-serif', fontSize: '25px', fontWeight: 'bold', textAlign: 'center' }}>Places to Stargaze in a 50 Miles Radius</h1>
                
                <div style={{ display: 'flex', gap: '8px'}}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                    placeholder="Search for a location..."
                    style={{
                    flex: '1',
                    padding: '8px',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    backgroundColor: '#1e1e1e',
                    color: '#e0e0e0',
                    fontFamily: 'Exo 2, sans-serif'
                    }}
                />
                <button
                    onClick={searchLocation}
                    disabled={loading}
                    style={{
                    padding: '12px 24px',
                    backgroundColor: loading ? '#444' : '#3b82f6',
                    color: '#fff',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
                </div>
        
                {/* Removed the toggle button for map size */}
                
                <div
                ref={mapContainer}
                style={{
                    width: '100%',
                    height: '500px', // Set a fixed height for the map
                    margin: '16px auto',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}
                />
        
                <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Nearby Locations</h2>
                <div style={{ display: 'center', flexDirection: 'row', gap: '8px' }}>
                    {parks.map((park) => (
                    <div
                        key={park.id}
                        style={{
                        padding: '12px',
                        backgroundColor: '#1e1e1e',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#e0e0e0',
                        border: '1px solid #333'
                        }}
                        onClick={() => {
                        if (map) {
                            map.flyTo({
                            center: park.coordinates,
                            zoom: 15
                            });
                        }
                        window.scrollTo({top: 0, behavior: 'smooth'});
                        }}
                    >
                        <h3 style={{ fontWeight: '600' }}>{park.name}</h3>
                        <span style={{ fontSize: '14px', color: '#bbb' }}>{park.address}</span>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </div>
            <VideoBackground />
        </div>
  );
}  

export default ParkMap;