import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sampleStarData, constellationLines, planetData  } from './StarData';
import ParkButton from './ParkButton';

const StarVisualization = () => {
  const svgRef = useRef();
  const startTime = useRef(Date.now());
  const [selectedObject, setSelectedObject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedObjects, setHighlightedObjects] = useState([]);
  const [userLocation, setUserLocation] = useState({ latitude: 40.7128, longitude: -74.0060 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const highlightTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    const updateDimensions = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    const animate = () => {
      setCurrentTime(Date.now());
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const calculateStarPositions = () => {
    const radius = Math.min(dimensions.width, dimensions.height) * 0.45;
    
    const rotationX = (transform.y / dimensions.height) * Math.PI;
    const rotationY = (transform.x / dimensions.width) * Math.PI;

    return sampleStarData.map(star => {
      const ra = (star.ra / 360) * 2 * Math.PI;
      const dec = (star.dec / 180) * Math.PI;
      
      let x = Math.cos(dec) * Math.cos(ra);
      let y = Math.cos(dec) * Math.sin(ra);
      let z = Math.sin(dec);

      const rotatedX = x;
      const rotatedY = y * Math.cos(rotationX) - z * Math.sin(rotationX);
      const rotatedZ = y * Math.sin(rotationX) + z * Math.cos(rotationX);

      x = rotatedX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
      y = rotatedY;
      z = rotatedX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);

      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      const visible = z > -0.1;
      const brightness = visible ? Math.max(0.1, (z + 1) / 2) : 0;

      return {
        ...star,
        x: centerX + x * radius,
        y: centerY + y * radius,
        z: z,
        visible,
        brightness,
        apparentSize: Math.max(2, (7 - star.magnitude) * Math.sqrt(brightness))
      };
    });
  };

  const calculatePlanetPositions = () => {
    const elapsedDays = (currentTime - startTime.current) / (1000 * 60 * 60 * 24);
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const baseRadius = Math.min(dimensions.width, dimensions.height) * 0.15;

    return planetData.map(planet => {
      const orbitalProgress = (elapsedDays / planet.orbitPeriod + planet.initialPhase / 360) % 1;
      const angle = orbitalProgress * 2 * Math.PI;
      const orbitRadiusScaled = baseRadius * planet.orbitRadius;
      
      return {
        ...planet,
        x: centerX + baseRadius * planet.orbitRadius * Math.cos(angle),
        y: centerY + baseRadius * planet.orbitRadius * Math.sin(angle),
        orbitRadiusScaled,
        angle,
        size: planet.size
      };
    });
  };

  const handleSearch = () => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setHighlightedObjects([]);
      return;
    }

    const foundStar = sampleStarData.find(star => 
      star.name.toLowerCase() === searchQuery.toLowerCase()
    );

    if (foundStar) {
      setHighlightedObjects([{ type: 'star', ...foundStar }]);
    } else {
      const constellationMatch = constellationLines.find(constellation =>
        constellation.name.toLowerCase() === searchQuery.toLowerCase()
      );

      if (constellationMatch) {
        setHighlightedObjects([{ type: 'constellation', name: constellationMatch.name }]);
      } else {
        const matchingStars = sampleStarData.find(star => 
          star.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (matchingStars) {
          setHighlightedObjects([{ type: 'star', ...matchingStars }]);
        } else {
          setHighlightedObjects([]);
        }
      }
    }

    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedObjects([]);
      setSearchQuery('');
    }, 3000);
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const starPositions = calculateStarPositions();
    const planetPositions = calculatePlanetPositions();

    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    //AI GENERATED
    const starGradient = defs.append('radialGradient')
      .attr('id', 'starGlow')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
      
    starGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'white')
      .attr('stop-opacity', 1);
      
    starGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'white')
      .attr('stop-opacity', 0);
    //end
    svg.append('circle')
      .attr('cx', dimensions.width / 2)
      .attr('cy', dimensions.height / 2)
      .attr('r', Math.min(dimensions.width, dimensions.height) * 0.45)
      .attr('fill', '#000')
      .attr('stroke', '#2A4A73')
      .attr('stroke-width', 1)
      .attr('opacity', 0.3);
    
    const linesGroup = svg.append('g')
      .attr('class', 'constellation-lines');

    constellationLines.forEach(constellation => {
      const isHighlighted = highlightedObjects.some(obj => 
        obj.type === 'constellation' && obj.name === constellation.name
      );

      constellation.lines.forEach(line => {
        const star1 = starPositions.find(s => s.name === line.star1);
        const star2 = starPositions.find(s => s.name === line.star2);
        if (star1 && star2 && star1.visible && star2.visible) {
          const brightness = Math.min(star1.brightness, star2.brightness);
          
          if (isHighlighted) {
            linesGroup.append('line')
              .attr('x1', star1.x)
              .attr('y1', star1.y)
              .attr('x2', star2.x)
              .attr('y2', star2.y)
              .attr('stroke', '#4A90E2')
              .attr('stroke-width', 4)
              .attr('opacity', brightness * 0.3);
          }

          linesGroup.append('line')
            .attr('x1', star1.x)
            .attr('y1', star1.y)
            .attr('x2', star2.x)
            .attr('y2', star2.y)
            .attr('stroke', isHighlighted ? '#4A90E2' : '#3A5A83')
            .attr('stroke-width', isHighlighted ? 2 : 1)
            .attr('opacity', isHighlighted ? brightness * 1.5 : brightness * 0.7);
        }
      });
    }); 

    const sortedStars = starPositions
      .filter(star => star.visible)
      .sort((a, b) => a.z - b.z);

    sortedStars.forEach(star => {
      const starGroup = svg.append('g')
        .attr('class', 'star-group')
        .attr('transform', `translate(${star.x}, ${star.y})`);

      const isStarHighlighted = highlightedObjects.some(obj => 
        obj.type === 'star' && obj.id === star.id
      );
      const isConstellationHighlighted = highlightedObjects.some(obj =>
        obj.type === 'constellation' && obj.name === star.constellation
      );
      const isHighlighted = isStarHighlighted || isConstellationHighlighted;

      if (isHighlighted) {
        starGroup.append('circle')
          .attr('class', 'star-highlight')
          .attr('r', star.apparentSize * 3)
          .attr('fill', 'url(#starGlow)')
          .attr('opacity', star.brightness * 0.8);
      }

      starGroup.append('circle')
        .attr('class', 'star-glow')
        .attr('r', star.apparentSize * 2)
        .attr('fill', 'url(#starGlow)')
        .attr('opacity', isHighlighted ? star.brightness * 0.8 : star.brightness * 0.5);

      starGroup.append('circle')
        .attr('class', 'star')
        .attr('r', isHighlighted ? star.apparentSize * 1.5 : star.apparentSize)
        .attr('fill', star.color)
        .style('opacity', isHighlighted ? Math.min(1, star.brightness * 1.5) : star.brightness)
        .style('cursor', 'pointer')
        .on('mouseenter', () => {
          setSelectedObject(star);
          d3.select(starGroup.node())
            .select('.star-glow')
            .transition()
            .duration(200)
            .attr('opacity', star.brightness * 0.8);
        })
        .on('mouseleave', () => {
          setSelectedObject(null);
          if (!isHighlighted) {
            d3.select(starGroup.node())
              .select('.star-glow')
              .transition()
              .duration(200)
              .attr('opacity', star.brightness * 0.5);
          }
        });
    });

    const drag = d3.drag()
      .on('drag', (event) => {
        setTransform(prev => ({
          ...prev,
          x: prev.x + event.dx,
          y: prev.y + event.dy
        }));
      });

    svg.call(drag);

  }, [dimensions, userLocation, selectedObject, highlightedObjects, currentTime, transform]);
//ai generated
  return (
    <div className="star-visualization">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for stars or constellations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="search-button" onClick={handleSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Search
        </button>
      </div>
      
      <div className="visualization-container">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
        />
        
        {selectedObject && (
          <div className="object-info">
            {selectedObject.name}
            {selectedObject.constellation && ` - ${selectedObject.constellation}`}
          </div>
        )}
        
        <div className="location-info">
          Viewing from: {userLocation.latitude.toFixed(2)}°N, {userLocation.longitude.toFixed(2)}°E
        </div>
      </div>
      <ParkButton />
    </div>
  );
};
//end
export default StarVisualization;