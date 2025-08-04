import React, { useState, useEffect } from 'react';
import { getAuthURL, getToken, checkToken, logout, isLoggedIn } from '../api';

const AuthTest = () => {
  const [authStatus, setAuthStatus] = useState('checking');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const loggedIn = isLoggedIn();
    if (loggedIn) {
      const token = localStorage.getItem('access_token');
      try {
        const tokenCheck = await checkToken(token);
        if (tokenCheck.error) {
          setAuthStatus('invalid_token');
          setError(tokenCheck.error_description || 'Token is invalid');
        } else {
          setAuthStatus('authenticated');
          setTokenInfo(tokenCheck);
        }
      } catch {
        setAuthStatus('error');
        setError('Failed to validate token');
      }
    } else {
      setAuthStatus('not_authenticated');
    }
  };

  const handleLogin = async () => {
    try {
      const authUrl = await getAuthURL();
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to get auth URL: ' + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthStatus('not_authenticated');
    setTokenInfo(null);
    setError('');
  };

  const handleCheckCode = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      try {
        await getToken(code);
        window.history.replaceState({}, document.title, window.location.pathname);
        checkAuthStatus();
      } catch (err) {
        setError('Failed to exchange code for token: ' + err.message);
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>OAuth Authentication Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Status: {authStatus}</h3>
        {error && (
          <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
            Error: {error}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        {authStatus === 'not_authenticated' && (
          <button onClick={handleLogin} style={{ padding: '10px 20px', backgroundColor: '#4285f4', color: 'white', border: 'none', borderRadius: '4px' }}>
            Login with Google
          </button>
        )}
        
        {authStatus === 'authenticated' && (
          <div>
            <p style={{ color: 'green' }}>✓ Successfully authenticated!</p>
            <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              Logout
            </button>
          </div>
        )}

        {authStatus === 'invalid_token' && (
          <div>
            <p style={{ color: 'orange' }}>Token is invalid or expired</p>
            <button onClick={handleLogin} style={{ padding: '10px 20px', backgroundColor: '#4285f4', color: 'white', border: 'none', borderRadius: '4px' }}>
              Re-authenticate
            </button>
          </div>
        )}
      </div>

      <button onClick={handleCheckCode} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
        Check for Auth Code
      </button>

      <button onClick={checkAuthStatus} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
        Refresh Status
      </button>

      {tokenInfo && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h4>Token Information:</h4>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(tokenInfo, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Local Storage Keys:</p>
        <ul>
          <li>access_token: {localStorage.getItem('access_token') ? '✓ Present' : '✗ Missing'}</li>
          <li>lastEvents: {localStorage.getItem('lastEvents') ? '✓ Present' : '✗ Missing'}</li>
        </ul>
      </div>
    </div>
  );
};

export default AuthTest;
