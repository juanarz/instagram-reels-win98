import React, { useState, useEffect } from 'react';
import './index.css';
import InstagramAuth from './components/InstagramAuth';
import instagramAPI from './services/instagramGraphAPI';

// Sample Instagram reels data
const sampleReels = [
  {
    id: 1,
    title: "Dancing Tutorial",
    thumbnail: "🕺",
    views: 125000,
    likes: 8500,
    comments: 342,
    shares: 156,
    saves: 89,
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Cooking Recipe",
    thumbnail: "👨‍🍳",
    views: 89000,
    likes: 6200,
    comments: 278,
    shares: 234,
    saves: 145,
    date: "2024-01-12"
  },
  {
    id: 3,
    title: "Travel Vlog",
    thumbnail: "✈️",
    views: 156000,
    likes: 12300,
    comments: 567,
    shares: 289,
    saves: 234,
    date: "2024-01-10"
  },
  {
    id: 4,
    title: "Tech Review",
    thumbnail: "📱",
    views: 78000,
    likes: 4500,
    comments: 189,
    shares: 123,
    saves: 67,
    date: "2024-01-08"
  },
  {
    id: 5,
    title: "Fitness Routine",
    thumbnail: "💪",
    views: 203000,
    likes: 15600,
    comments: 678,
    shares: 345,
    saves: 289,
    date: "2024-01-05"
  },
  {
    id: 6,
    title: "Art Tutorial",
    thumbnail: "🎨",
    views: 67000,
    likes: 3800,
    comments: 156,
    shares: 89,
    saves: 123,
    date: "2024-01-03"
  }
];

const ReelWindow = ({ reel }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (isMinimized) {
    return (
      <div className="win98-window" style={{ height: '30px' }}>
        <div className="win98-title-bar">
          <span>{reel.title}</span>
          <div className="win98-title-buttons">
            <button 
              className="win98-button"
              onClick={() => setIsMinimized(false)}
              title="Restore"
            >
              □
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="win98-window">
      <div className="win98-title-bar">
        <span>📹 {reel.title}</span>
        <div className="win98-title-buttons">
          <button 
            className="win98-button"
            onClick={() => setIsMinimized(true)}
            title="Minimize"
          >
            _
          </button>
          <button className="win98-button" title="Maximize">□</button>
          <button className="win98-button" title="Close">×</button>
        </div>
      </div>
      <div className="win98-content">
        <div className="reel-thumbnail">
          <div style={{ fontSize: '48px' }}>{reel.thumbnail}</div>
        </div>
        
        <div style={{ marginBottom: '8px', fontSize: '11px', fontWeight: 'bold' }}>
          Statistics Panel
        </div>
        
        <table className="stats-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>👁️ Views</td>
              <td>{formatNumber(reel.views)}</td>
            </tr>
            <tr>
              <td>❤️ Likes</td>
              <td>{formatNumber(reel.likes)}</td>
            </tr>
            <tr>
              <td>💬 Comments</td>
              <td>{formatNumber(reel.comments)}</td>
            </tr>
            <tr>
              <td>📤 Shares</td>
              <td>{formatNumber(reel.shares)}</td>
            </tr>
            <tr>
              <td>🔖 Saves</td>
              <td>{formatNumber(reel.saves)}</td>
            </tr>
            <tr>
              <td>📅 Date</td>
              <td>{reel.date}</td>
            </tr>
          </tbody>
        </table>
        
        <div style={{ marginTop: '8px', padding: '4px', background: '#f0f0f0', border: '1px insetrgb(9, 9, 9)', fontSize: '10px' }}>
          Engagement Rate: {((reel.likes + reel.comments + reel.shares) / reel.views * 100).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

const StatsPopup = ({ isOpen, onClose, reels }) => {
  if (!isOpen) return null;

  const totalViews = reels.reduce((sum, reel) => sum + reel.views, 0);
  const totalLikes = reels.reduce((sum, reel) => sum + reel.likes, 0);
  const totalComments = reels.reduce((sum, reel) => sum + reel.comments, 0);
  const totalShares = reels.reduce((sum, reel) => sum + reel.shares, 0);
  const totalSaves = reels.reduce((sum, reel) => sum + reel.saves, 0);
  const avgEngagement = ((totalLikes + totalComments + totalShares) / totalViews * 100).toFixed(2);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="win98-window" style={{ width: '400px', maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
        <div className="win98-title-bar">
          <span>📊 General Statistics</span>
          <div className="win98-title-buttons">
            <button className="win98-button" onClick={onClose}>×</button>
          </div>
        </div>
        <div className="win98-content">
          <div style={{ marginBottom: '12px', fontSize: '11px', fontWeight: 'bold' }}>
            Overall Performance Summary
          </div>
          
          <table className="stats-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Total</th>
                <th>Average</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>👁️ Views</td>
                <td>{formatNumber(totalViews)}</td>
                <td>{formatNumber(Math.round(totalViews / reels.length))}</td>
              </tr>
              <tr>
                <td>❤️ Likes</td>
                <td>{formatNumber(totalLikes)}</td>
                <td>{formatNumber(Math.round(totalLikes / reels.length))}</td>
              </tr>
              <tr>
                <td>💬 Comments</td>
                <td>{formatNumber(totalComments)}</td>
                <td>{formatNumber(Math.round(totalComments / reels.length))}</td>
              </tr>
              <tr>
                <td>📤 Shares</td>
                <td>{formatNumber(totalShares)}</td>
                <td>{formatNumber(Math.round(totalShares / reels.length))}</td>
              </tr>
              <tr>
                <td>🔖 Saves</td>
                <td>{formatNumber(totalSaves)}</td>
                <td>{formatNumber(Math.round(totalSaves / reels.length))}</td>
              </tr>
            </tbody>
          </table>
          
          <div style={{ marginTop: '12px', padding: '8px', background: '#f0f0f0', border: '1px inset #c0c0c0' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Key Insights:</div>
            <div style={{ fontSize: '10px' }}>
              • Total Reels: {reels.length}<br/>
              • Average Engagement Rate: {avgEngagement}%<br/>
              • Most Popular: {reels.reduce((prev, current) => (prev.views > current.views) ? prev : current).title}<br/>
              • Total Reach: {formatNumber(totalViews)} views
            </div>
          </div>
          
          <div style={{ marginTop: '12px', textAlign: 'center' }}>
            <button 
              style={{
                background: '#c0c0c0',
                border: '2px outset #c0c0c0',
                padding: '4px 16px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StartBar = () => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="start-bar">
      <button className="start-button">
        <span style={{ fontSize: '14px' }}>🪟</span>
        Start
      </button>
      <div className="taskbar-app">Instagram Reels Manager</div>
      <div style={{ marginLeft: 'auto', fontSize: '11px', padding: '4px 8px' }}>
        {currentTime}
      </div>
    </div>
  );
};

function App() {
  const [showStatsPopup, setShowStatsPopup] = useState(false);
  const [reelsData, setReelsData] = useState(sampleReels);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsAuthenticated(instagramAPI.isAuthenticated());
    if (instagramAPI.isAuthenticated()) {
      loadInstagramData();
    }
  }, []);

  const loadInstagramData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const instagramReels = await instagramAPI.getUserReels(20);
      const transformedReels = instagramAPI.transformReelData(instagramReels);
      
      if (transformedReels.length > 0) {
        setReelsData(transformedReels);
      } else {
        setError('No reels found in your Instagram account');
      }
    } catch (error) {
      console.error('Error loading Instagram data:', error);
      setError('Failed to load Instagram data. Using sample data.');
      // Keep using sample data on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    loadInstagramData();
  };

  const handleAuthError = (error) => {
    setError('Authentication failed. Using sample data.');
  };

  return (
    <div className="win98-desktop">
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div className="win98-window" style={{ display: 'inline-block', padding: '8px 16px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: 'bold',
            fontFamily: 'Tahoma, sans-serif'
          }}>
            📹 Instagram Reels Statistics - Windows 98 Edition
          </h1>
        </div>
      </div>

      <div 
        className="reels-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {isLoading ? (
          <div className="win98-window" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '12px' }}>Loading Instagram data...</div>
          </div>
        ) : (
          reelsData.map(reel => (
            <ReelWindow key={reel.id} reel={reel} />
          ))
        )}
      </div>

      <button 
        className="floating-button"
        onClick={() => setShowStatsPopup(true)}
        title="More Statistics"
      >
        Más
      </button>

      <StatsPopup 
        isOpen={showStatsPopup}
        onClose={() => setShowStatsPopup(false)}
        reels={reelsData}
      />

      {!isAuthenticated && (
        <InstagramAuth 
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleAuthError}
        />
      )}

      {error && (
        <div className="win98-window" style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          maxWidth: '300px',
          zIndex: 1002
        }}>
          <div className="win98-title-bar">
            <span>⚠️ Notice</span>
            <div className="win98-title-buttons">
              <button className="win98-button" onClick={() => setError(null)}>×</button>
            </div>
          </div>
          <div className="win98-content" style={{ fontSize: '10px', padding: '8px' }}>
            {error}
          </div>
        </div>
      )}

      <StartBar />
    </div>
  );
}

export default App;
