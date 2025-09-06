import React, { useState, useEffect, useRef } from 'react';
import './Clippy.css';

const Clippy = () => {
  const [showBalloon, setShowBalloon] = useState(true);
  const balloonRef = useRef(null);

  // Handle click on Clippy
  const handleClick = () => {
    setShowBalloon(!showBalloon);
  };

  // Hide on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (balloonRef.current && !balloonRef.current.contains(event.target)) {
        setShowBalloon(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="clippy-container">
      {showBalloon && (
        <div className="clippy-balloon" ref={balloonRef}>
          <div className="balloon-content">
            <div className="balloon-text">
              ¿Quieres tener más visibilidad en tus Reels?
            </div>
          </div>
        </div>
      )}
      <div className="clippy-content">
        <img 
          src={process.env.PUBLIC_URL + "/imgs/reels covers/Clippy.png"} 
          alt="Clippy" 
          className="clippy-image"
          style={{ 
            width: '80px', 
            height: '80px', 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: 1
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1) rotate(-2deg)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default Clippy;
