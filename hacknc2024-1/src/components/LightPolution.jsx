// //we assume we get info of lat, lot and poplulation of city from City API by ninja in App.jsx
// import React, { useState, useEffect } from 'react';
// import Weather from "../components/weather";
// import AirPolution from "../components/airpolution";
// import UVData from "../components/uvIndex";
// import { useState } from "react";

// const LightPolution = ({uv, cp, aqi, onLightPollutionUpdate}) => {
//     const [lightPollution, setLightPollution] = useState(null);

//     useEffect(() => {
//         if (uv && cp && aqi) {
//             const fetchLightPolutionData = async () => {
//                 try{
//                     const lp = (aqi/5) * 0.6 + cp * 0.3 + uv * 0.1
//                     if(lp > 10){
//                         lp = 10;
//                     }
//                     else if(lp < 0){
//                         lp = 0;
//                     }
//                     setLightPollution(lp);
//                     onLightPollutionUpdate(lp);
//                 }catch (error) {
//                     console.error('Error fetching weather data:', error);
//                 }
//             };
//             fetchLightPolutionData();
//         };
//     }, [uv, cp, aqi, onLightPollutionUpdate]);
//     return;
// };

import React, { useState, useEffect } from 'react';

const LightPollution = ({ uv, cp, aqi, onLightPollutionUpdate }) => {
    const [lightPollution, setLightPollution] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (uv !== undefined && cp !== undefined && aqi !== undefined) {
            const calculateLightPollution = () => {
                try {
                    // Calculate light pollution
                    let lp = (aqi / 5) * 0.6 + (1 - cp) * 0.4;
                    
                    // Clamp the value between 0 and 10
                    lp = Math.min(Math.max(lp, 0), 1);
                    lp = lp * 10;
                    
                    setLightPollution(lp);
                    onLightPollutionUpdate(lp);
                    setError(null);
                } catch (error) {
                    console.error('Error calculating light pollution:', error);
                    setError('Failed to calculate light pollution');
                }
            };

            calculateLightPollution();
        }
    }, [uv, cp, aqi, onLightPollutionUpdate]);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return;
};

export default LightPollution;