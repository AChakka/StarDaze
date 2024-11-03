import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sampleStarData, constellationLines, planetData } from './stardata';
import ShootingBackground from './ShootingBackground';
import ParkButton from './ParkButton';

const StarVisualization = () => {
  const svgRef = useRef();
  const startTime = useRef(Date.now());
  const [selectedObject, setSelectedObject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedObjects, setHighlightedObjects] = useState([]);
  const dimensions = { width: 800, height: 600 };
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [showConstellationLabels, setShowConstellationLabels] = useState(false);
  const highlightTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      setCurrentTime(Date.now());
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
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

    svg.selectAll('*').remove();

    const defs = svg.append('defs');
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

    svg.append('circle')
      .attr('cx', dimensions.width / 2)
      .attr('cy', dimensions.height / 2)
      .attr('r', Math.min(dimensions.width, dimensions.height) * 0.45)
      .attr('fill', '#301934')
      .attr('stroke', '#2A4A73')
      .attr('stroke-width', 1)
      .attr('opacity', 2);
    
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

      if (showConstellationLabels) {
        const stars = constellation.lines.flatMap(line => [
          starPositions.find(s => s.name === line.star1),
          starPositions.find(s => s.name === line.star2)
        ]).filter(star => star && star.visible);

        if (stars.length > 0) {
          const centerX = d3.mean(stars, d => d.x);
          const centerY = d3.mean(stars, d => d.y);
          const avgBrightness = d3.mean(stars, d => d.brightness);

          svg.append('text')
            .attr('class', 'constellation-label')
            .attr('x', centerX)
            .attr('y', centerY)
            .attr('fill', 'white')
            .attr('opacity', avgBrightness * 0.8)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text(constellation.name);
        }
      }
    });

    const sortedStars = starPositions
      .filter(star => star.visible)
      .sort((a, b) => a.z - b.z);

    sortedStars.forEach(star => {
      const starGroup = svg.append('g')
        .attr('class', 'star-group')
        .attr('transform', `translate(${star.x}, ${star.y})`);

      const isHighlighted = highlightedObjects.some(obj => 
        (obj.type === 'star' && obj.id === star.id) ||
        (obj.type === 'constellation' && obj.name === star.constellation)
      );

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

  }, [dimensions, selectedObject, highlightedObjects, currentTime, transform, showConstellationLabels]);
//Used AI to do this
  return (
    <div className="star-visualization">
      <div className="controls-container">
        <label className="setting-item">
          <input
            type="checkbox"
            checked={showConstellationLabels}
            onChange={(e) => setShowConstellationLabels(e.target.checked)}
          />
          Show Constellation Labels
        </label>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Stars or constellations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="search-button" onClick={handleSearch}>
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
          Viewing from: 40.7128°N, -74.0060°E
        </div>
      </div>
      <ParkButton />
      <ShootingBackground />
    </div>
  );
};
//end of ai 
export default StarVisualization;