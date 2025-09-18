#!/usr/bin/env python3
"""
Test script to verify Dark-Nexis backend connectivity
"""

import requests
import json

def test_backend_connection():
    print("Testing Dark-Nexis backend connection...")
    
    # Test 1: API root
    print("\n1. Testing API root...")
    try:
        response = requests.get('http://localhost:8000/')
        if response.status_code == 200:
            print(f"✅ API root accessible: {response.json()}")
        else:
            print(f"❌ API root error: {response.status_code}")
    except Exception as e:
        print(f"❌ API root connection failed: {e}")
    
    # Test 2: API v1 root
    print("\n2. Testing API v1 root...")
    try:
        response = requests.get('http://localhost:8000/api/v1/')
        if response.status_code == 200:
            print(f"✅ API v1 root accessible: {response.json()}")
        else:
            print(f"❌ API v1 root error: {response.status_code}")
    except Exception as e:
        print(f"❌ API v1 root connection failed: {e}")
    
    # Test 3: Authentication
    print("\n3. Testing authentication...")
    try:
        auth_data = {
            'username': 'demo@example.com',
            'password': 'password'
        }
        response = requests.post(
            'http://localhost:8000/api/v1/auth/login/access-token',
            data=auth_data
        )
        if response.status_code == 200:
            auth_result = response.json()
            print(f"✅ Authentication successful: {auth_result['token_type']}")
            token = auth_result['access_token']
            
            # Test 4: Authenticated request
            print("\n4. Testing authenticated request...")
            try:
                params = {
                    'filename': 'test.mp4',
                    'file_size': 1024,
                    'mime_type': 'video/mp4'
                }
                headers = {
                    'Authorization': f"Bearer {token}"
                }
                response = requests.post(
                    'http://localhost:8000/api/v1/media/upload',
                    params=params,
                    headers=headers
                )
                if response.status_code == 200:
                    media_result = response.json()
                    print(f"✅ Authenticated media request successful: media_id={media_result['media_id']}")
                else:
                    print(f"❌ Authenticated media request failed: {response.status_code}")
            except Exception as e:
                print(f"❌ Authenticated media request failed: {e}")
                
        else:
            print(f"❌ Authentication failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Authentication test failed: {e}")

if __name__ == "__main__":
    test_backend_connection()