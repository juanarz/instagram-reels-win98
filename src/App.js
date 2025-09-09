import React, { useState, useEffect } from 'react';
import './index.css';
import InstagramAuth from './components/InstagramAuth';
import Clippy from './components/Clippy';
import ReelInsight from './components/ReelInsight';
import instagramAPI from './services/instagramGraphAPI';

// Utility function   to calculate engagement rate
const calculateEngagementRate = (likes, comments, shares, views) => {
  const totalEngagements = likes + comments + shares;
  return ((totalEngagements / views) * 100).toFixed(2);
};

// Real Instagram reels data
const realReels = [
  {
    id: 1,
    title: "POV: Le pides un lápiz al de sistemas",
    thumbnail: "/imgs/reels covers/pov_le pides un lápiz al de sistemas.png",
    instagramUrl: "https://www.instagram.com/p/DF_g4Y9MQKp/",
    views: 874058,
    likes: 67380,
    comments: 172,
    shares: 16932,
    saves: 2092,
    date: "2024-01-15",
    accountsReached: 605291,
    interactions: 86576,
    accountsEngaged: 78454,
    profileActivity: 145,
    follows: 145
  },
  {
    id: 2,
    title: "Seguridad ante todo",
    thumbnail: "/imgs/reels covers/seguridad ante todo.png",
    instagramUrl: "https://www.instagram.com/p/DICX4_TS2VQ/",
    views: 2806994,
    likes: 131919,
    comments: 78,
    shares: 15055,
    saves: 2164,
    date: "2024-01-12",
    accountsReached: 1512344,
    interactions: 149216,
    accountsEngaged: 138970,
    profileActivity: 175,
    follows: 175
  },
  {
    id: 3,
    title: "POV: Se te cae tu botella en San Gil",
    thumbnail: "/imgs/reels covers/pov_se te cae tu botella en san gil.png",
    instagramUrl: "https://www.instagram.com/p/DL0BtdVMXup/",
    views: 1209592,
    likes: 70633,
    comments: 769,
    shares: 12757,
    saves: 1362,
    date: "2024-01-10",
    accountsReached: 853531,
    interactions: 85521,
    accountsEngaged: 78034,
    profileActivity: 732,
    follows: 732
  },
  {
    id: 4,
    title: "Qué prenda te daría pena traer a la U",
    thumbnail: "/imgs/reels covers/Que prenda te daría pena traer a la u.png",
    instagramUrl: "https://www.instagram.com/p/DDvl2vAskef/",
    views: 778939,
    likes: 41559,
    comments: 239,
    shares: 6284,
    saves: 1419,
    date: "2024-01-08",
    accountsReached: 514950,
    interactions: 49501,
    accountsEngaged: 45272,
    profileActivity: 229,
    follows: 229
  },
  {
    id: 5,
    title: "POV: Te gradúas de ingeniero",
    thumbnail: "/imgs/reels covers/pov_te graduas de ingeniero.png",
    instagramUrl: "https://www.instagram.com/p/DKU5xY3OrLQ/",
    views: 404739,
    likes: 30947,
    comments: 32,
    shares: 8830,
    saves: 905,
    date: "2024-01-05",
    accountsReached: 280806,
    interactions: 40714,
    accountsEngaged: 37283,
    profileActivity: 68,
    follows: 68
  },
  {
    id: 6,
    title: "Mi última diapositiva",
    thumbnail: "/imgs/reels covers/Mi última diapositiva.png",
    instagramUrl: "https://www.instagram.com/p/DBcIQlMyzRN/",
    views: 5500000,
    likes: 600000,
    comments: 1200,
    shares: 45000,
    saves: 8500,
    date: "2024-01-01",
    accountsReached: 3200000,
    interactions: 654700,
    accountsEngaged: 598000,
    profileActivity: 1150,
    follows: 1150
  }
];

const ReelWindow = ({ reel }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

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
        <span>🖼️ {reel.title} - {formatNumber(reel.views)} vistas</span>
        <div className="win98-title-buttons">
          <button 
            className="win98-button"
            onClick={() => setShowInsights(!showInsights)}
            title={showInsights ? 'Ocultar análisis' : 'Mostrar análisis'}
            style={{ marginRight: '4px' }}
          >
            📊
          </button>
          <button 
            className="win98-button"
            onClick={() => setIsMinimized(true)}
            title="Minimizar"
          >
            _
          </button>
          <button className="win98-button" title="Maximizar">□</button>
          <button className="win98-button" title="Cerrar">×</button>
        </div>
      </div>
      <div className="win98-content">
        {showInsights && <ReelInsight reel={reel} />}
        <div className="reel-thumbnail">
          {reel.thumbnail.startsWith('/imgs/') ? (
            <img 
              src={process.env.PUBLIC_URL + reel.thumbnail} 
              alt={reel.title}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            style={{ 
              fontSize: '48px',
              display: reel.thumbnail.startsWith('/imgs/') ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#f0f0f0',
              border: '1px dashed #ccc'
            }}
          >
            {reel.thumbnail.startsWith('/imgs/') ? '' : reel.thumbnail}
          </div>
          
          <button 
            onClick={() => window.open(reel.instagramUrl, '_blank')}
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: 'bold',
              background: 'linear-gradient(to bottom, #dfdfdf 0%, #c0c0c0 100%)',
              border: '1px outset #c0c0c0',
              cursor: 'pointer',
              borderRadius: '2px',
              color: '#000',
              fontFamily: 'Tahoma, sans-serif'
            }}
            onMouseDown={(e) => e.target.style.border = '1px inset #c0c0c0'}
            onMouseUp={(e) => e.target.style.border = '1px outset #c0c0c0'}
            onMouseLeave={(e) => e.target.style.border = '1px outset #c0c0c0'}
          >
            Go
          </button>
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
              <td><strong>👁️ Views</strong></td>
              <td><strong>{formatNumber(reel.views)}</strong></td>
            </tr>
            <tr>
              <td><strong>📊 Accounts Reached</strong></td>
              <td><strong>{formatNumber(reel.accountsReached)}</strong></td>
            </tr>
            <tr>
              <td><strong>❤️ Likes</strong></td>
              <td><strong>{formatNumber(reel.likes)}</strong></td>
            </tr>
            <tr>
              <td><strong>💬 Comments</strong></td>
              <td><strong>{formatNumber(reel.comments)}</strong></td>
            </tr>
            <tr>
              <td><strong>🔖 Saves</strong></td>
              <td><strong>{formatNumber(reel.saves)}</strong></td>
            </tr>
            <tr>
              <td><strong>📤 Shares</strong></td>
              <td><strong>{formatNumber(reel.shares)}</strong></td>
            </tr>
            <tr>
              <td><strong>🤝 Interactions</strong></td>
              <td><strong>{formatNumber(reel.interactions)}</strong></td>
            </tr>
            <tr>
              <td><strong>👥 Accounts Engaged</strong></td>
              <td><strong>{formatNumber(reel.accountsEngaged)}</strong></td>
            </tr>
            <tr>
              <td><strong>📈 Profile Activity</strong></td>
              <td><strong>{formatNumber(reel.profileActivity)}</strong></td>
            </tr>
            <tr>
              <td><strong>➕ Follows</strong></td>
              <td><strong>{formatNumber(reel.follows)}</strong></td>
            </tr>
            <tr>
              <td><strong>📊 Engagement Rate</strong></td>
              <td><strong>{calculateEngagementRate(reel.likes, reel.comments, reel.shares, reel.views)}%</strong></td>
            </tr>
          </tbody>
        </table>
        
        <div style={{ marginTop: '8px', padding: '4px', background: '#f0f0f0', border: '1px inset #c0c0c0', fontSize: '10px' }}>
          Engagement Rate: {calculateEngagementRate(reel.likes, reel.comments, reel.shares, reel.views)}%
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
  const [reelsData, setReelsData] = useState(realReels);
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
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          position: 'relative',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 10px'
        }}>
          <div className="paint-thumbnail">
            <div className="paint-title-bar">
              <div className="paint-title">
                🎨 untitled - Paint
              </div>
              <div className="paint-buttons">
                <button className="paint-btn">_</button>
                <button className="paint-btn">□</button>
                <button className="paint-btn">×</button>
              </div>
            </div>
            <div className="paint-content">
              <div className="led-text">
                <div className="scrolling-container">
                  <div className="scrolling-text">
                    Hola! Soy Juan Pablo, Creador de Contenido
                    <span className="scrolling-text-copy">Hola! Soy Juan Pablo, Creador de Contenido</span>
                  </div>
                </div>
              </div>
              <div style={{ 
                padding: '10px', 
                fontFamily: 'Poppins, sans-serif', 
                fontSize: '14px', 
                textAlign: 'center',
                color: '#000'
              }}>
                (programo por comida también🥺) <br/>
                @juan_aarias<br/>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px',
                  margin: '10px 0'
                }}>
                  <a 
                    href="https://www.instagram.com/juan_aarias/reels/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <img 
                      src={process.env.PUBLIC_URL + "/imgs/reels covers/Instagram-Logo-2010-2011-removebg-preview.png"} 
                      alt="Instagram" 
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@juan_aarias" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <img 
                      src={process.env.PUBLIC_URL + "/imgs/reels covers/Tiktok-Logo-2017-removebg-preview.png"} 
                      alt="TikTok" 
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  </a>
                </div>
                <strong>@juan_aarias</strong><br/>
                Aquí tienes las estadísticas de mis reels más populares!
              </div>
            </div>
          </div>
          
          <div style={{ 
            position: 'absolute', 
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2
          }}>
            <Clippy />
          </div>
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

