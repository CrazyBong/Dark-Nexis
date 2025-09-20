// Connection test script to verify frontend-backend integration

async function testConnection() {
  console.log('Testing Dark-Nexis frontend-backend connection...');
  
  try {
    // Test 1: Check if we can access the backend API root
    console.log('\n1. Testing backend API root access...');
    const apiRootResponse = await fetch('http://localhost:8000/');
    if (apiRootResponse.ok) {
      const apiData = await apiRootResponse.json();
      console.log('✅ Backend API root accessible:', apiData);
    } else {
      console.log('❌ Backend API root not accessible:', apiRootResponse.status);
    }
  } catch (error) {
    console.log('❌ Backend API root test failed:', error.message);
  }
  
  try {
    // Test 2: Check if we can access the backend API v1 root
    console.log('\n2. Testing backend API v1 root access...');
    const apiV1Response = await fetch('http://localhost:8000/api/v1/');
    if (apiV1Response.ok) {
      const apiV1Data = await apiV1Response.json();
      console.log('✅ Backend API v1 root accessible:', apiV1Data);
    } else {
      console.log('❌ Backend API v1 root not accessible:', apiV1Response.status);
    }
  } catch (error) {
    console.log('❌ Backend API v1 root test failed:', error.message);
  }
  
  try {
    // Test 3: Check if we can access the backend through the frontend proxy
    console.log('\n3. Testing frontend proxy to backend...');
    const proxyResponse = await fetch('/api/v1/');
    if (proxyResponse.ok) {
      const proxyData = await proxyResponse.json();
      console.log('✅ Frontend proxy to backend working:', proxyData);
    } else {
      console.log('❌ Frontend proxy to backend not working:', proxyResponse.status);
    }
  } catch (error) {
    console.log('❌ Frontend proxy test failed:', error.message);
  }
  
  try {
    // Test 4: Test authentication endpoint
    console.log('\n4. Testing authentication endpoint...');
    
    // Create form data for login
    const formData = new FormData();
    formData.append('username', 'demo@example.com');
    formData.append('password', 'password');
    
    const authResponse = await fetch('http://localhost:8000/api/v1/auth/login/access-token', {
      method: 'POST',
      body: formData,
    });
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Authentication endpoint working:', {
        token_type: authData.token_type,
        access_token_length: authData.access_token.length
      });
      
      // Test 5: Test authenticated request
      console.log('\n5. Testing authenticated request...');
      try {
        const mediaResponse = await fetch(`http://localhost:8000/api/v1/media/upload?filename=test.mp4&file_size=1024&mime_type=video/mp4`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authData.access_token}`
          }
        });
        
        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          console.log('✅ Authenticated media upload request working:', {
            media_id: mediaData.media_id,
            upload_url: mediaData.upload_url ? '***' : null, // Hide URL for security
            expires_in: mediaData.expires_in
          });
        } else {
          console.log('❌ Authenticated media upload request failed:', mediaResponse.status);
        }
      } catch (mediaError) {
        console.log('❌ Authenticated media upload test failed:', mediaError.message);
      }
    } else {
      console.log('❌ Authentication endpoint not working:', authResponse.status);
    }
  } catch (authError) {
    console.log('❌ Authentication test failed:', authError.message);
  }
  
  console.log('\nConnection test completed.');
}

// Run the test
testConnection();