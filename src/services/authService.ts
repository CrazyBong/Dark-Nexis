// Authentication service for Dark-Nexis frontend

// Get API base URL - default to proxy path
const API_BASE_URL = '/api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    // Load tokens from localStorage on init
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      // Create form data for OAuth2 login
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      // Add timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/v1/auth/login/access-token`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', response.status, response.statusText, errorText);
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }

      const authResponse: AuthResponse = await response.json();
      
      // Store tokens
      this.accessToken = authResponse.access_token;
      this.refreshToken = authResponse.refresh_token;
      
      localStorage.setItem('access_token', this.accessToken);
      localStorage.setItem('refresh_token', this.refreshToken);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  // Demo login for testing (using the demo credentials from backend)
  async demoLogin(): Promise<boolean> {
    try {
      const success = await this.login({
        username: 'demo@example.com',
        password: 'password'
      });
      
      if (!success) {
        console.error('Demo login returned false');
      }
      
      return success;
    } catch (error) {
      console.error('Demo login error:', error);
      return false;
    }
  }

  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  // Get authorization headers for API requests
  getAuthHeaders(): Record<string, string> {
    if (!this.accessToken) {
      return {};
    }
    
    return {
      'Authorization': `Bearer ${this.accessToken}`,
    };
  }

  // Make authenticated API request with proper URL construction
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Ensure URL uses the API base path for proper proxying
    let apiUrl = url;
    if (url.startsWith('/api/v1/')) {
      // For API v1 endpoints, use the base URL directly
      apiUrl = `${API_BASE_URL}${url.substring(4)}`; // Remove /api from the beginning
    } else if (url.startsWith('/')) {
      // For other endpoints, replace /api with nothing
      apiUrl = `${API_BASE_URL}${url.replace('/api', '')}`;
    }
    
    const headers = {
      ...options.headers,
      ...this.getAuthHeaders(),
    };

    console.log(`Making API request to: ${apiUrl} (original: ${url})`);
    return fetch(apiUrl, {
      ...options,
      headers,
    });
  }
}

export default AuthService;