import { useEffect, useState } from 'react';
import AuthService from '../services/authService';

export function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking...');
  const [apiData, setApiData] = useState<any>(null);
  const [authStatus, setAuthStatus] = useState<string>('Checking...');
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test direct backend access
        const response = await fetch('http://localhost:8000/api/v1/');
        if (response.ok) {
          const data = await response.json();
          setApiData(data);
          setConnectionStatus('✅ Connected to backend API');
        } else {
          setConnectionStatus(`❌ Backend API error: ${response.status}`);
        }
      } catch (error) {
        setConnectionStatus(`❌ Backend connection failed: ${error.message}`);
      }

      // Test authentication
      try {
        const authService = AuthService.getInstance();
        const loginSuccess = await authService.demoLogin();
        
        if (loginSuccess) {
          setAuthStatus('✅ Authentication successful');
          setAuthToken(authService.getAccessToken());
        } else {
          setAuthStatus('❌ Authentication failed');
        }
      } catch (error) {
        setAuthStatus(`❌ Authentication error: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-card rounded-lg border">
      <h2 className="text-xl font-bold mb-4">Frontend-Backend Connection Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Connection Status:</h3>
          <p className="text-sm">{connectionStatus}</p>
        </div>
        
        {apiData && (
          <div>
            <h3 className="font-semibold">API Response:</h3>
            <pre className="text-xs bg-muted p-2 rounded">
              {JSON.stringify(apiData, null, 2)}
            </pre>
          </div>
        )}
        
        <div>
          <h3 className="font-semibold">Authentication Status:</h3>
          <p className="text-sm">{authStatus}</p>
        </div>
        
        {authToken && (
          <div>
            <h3 className="font-semibold">Auth Token:</h3>
            <p className="text-xs font-mono bg-muted p-2 rounded">
              {authToken.substring(0, 30)}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}