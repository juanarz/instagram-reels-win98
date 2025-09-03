import React, { useState, useEffect } from 'react';
import instagramAPI from '../services/instagramGraphAPI';

const InstagramAuth = ({ onAuthSuccess, onAuthError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we're returning from Instagram OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      setError('Authentication cancelled or failed');
      onAuthError?.(errorParam);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code) {
      handleAuthCallback(code);
    }
  }, []);

  const handleAuthCallback = async (code) => {
    setIsLoading(true);
    setError(null);

    try {
      // Exchange code for access token
      const tokenData = await instagramAPI.getAccessToken(code);
      
      // Get long-lived token
      await instagramAPI.getLongLivedToken(tokenData.access_token);
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      onAuthSuccess?.();
    } catch (error) {
      console.error('Auth callback error:', error);
      setError('Failed to complete authentication');
      onAuthError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    const authUrl = instagramAPI.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    instagramAPI.logout();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="win98-window" style={{ maxWidth: '400px', margin: '20px auto' }}>
        <div className="win98-title-bar">
          <span>🔐 Instagram Authentication</span>
        </div>
        <div className="win98-content" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '12px', marginBottom: '10px' }}>
            Authenticating with Instagram...
          </div>
          <div style={{ fontSize: '10px' }}>Please wait...</div>
        </div>
      </div>
    );
  }

  if (instagramAPI.isAuthenticated()) {
    return (
      <div className="win98-window" style={{ maxWidth: '400px', margin: '20px auto' }}>
        <div className="win98-title-bar">
          <span>✅ Connected to Instagram</span>
        </div>
        <div className="win98-content" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '12px', marginBottom: '15px' }}>
            Successfully connected to your Instagram account!
          </div>
          <button 
            style={{
              background: '#c0c0c0',
              border: '2px outset #c0c0c0',
              padding: '6px 12px',
              fontSize: '11px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
            onClick={() => window.location.reload()}
          >
            Refresh Data
          </button>
          <button 
            style={{
              background: '#c0c0c0',
              border: '2px outset #c0c0c0',
              padding: '6px 12px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
            onClick={handleLogout}
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="win98-window" style={{ maxWidth: '400px', margin: '20px auto' }}>
      <div className="win98-title-bar">
        <span>🔐 Instagram Authentication Required</span>
      </div>
      <div className="win98-content" style={{ padding: '20px' }}>
        <div style={{ fontSize: '12px', marginBottom: '15px', textAlign: 'center' }}>
          Connect your Instagram account to view real statistics
        </div>
        
        {error && (
          <div style={{ 
            background: '#ffcccc', 
            border: '1px solid #ff0000', 
            padding: '8px', 
            marginBottom: '15px',
            fontSize: '10px',
            color: '#cc0000'
          }}>
            Error: {error}
          </div>
        )}
        
        <div style={{ fontSize: '10px', marginBottom: '15px', color: '#666' }}>
          <strong>Requirements:</strong><br/>
          • Instagram account<br/>
          • Facebook Developer App configured<br/>
          • Valid App ID and App Secret in .env file
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <button 
            style={{
              background: '#c0c0c0',
              border: '2px outset #c0c0c0',
              padding: '8px 16px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={handleLogin}
          >
            🔗 Connect Instagram Account
          </button>
        </div>
        
        <div style={{ fontSize: '9px', marginTop: '15px', color: '#666', textAlign: 'center' }}>
          You'll be redirected to Instagram to authorize this app
        </div>
      </div>
    </div>
  );
};

export default InstagramAuth;
