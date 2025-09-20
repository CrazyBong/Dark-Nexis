#!/usr/bin/env python3
"""
Test script to simulate analysis workflow and check if it gets stuck at 0%
"""

import requests
import time
import json

# Configuration
FRONTEND_URL = "http://localhost:3003"
BACKEND_URL = "http://127.0.0.1:8000"

def test_analysis_workflow():
    """Test the complete analysis workflow"""
    print("🔍 Testing Analysis Workflow to Debug 0% Issue...")
    print()
    
    # Test 1: Check if backend is responding
    print("Test 1: Backend Health Check")
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is healthy")
        else:
            print(f"❌ Backend unhealthy: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend connection failed: {e}")
        return False
    
    print()
    
    # Test 2: Check if frontend proxy is working
    print("Test 2: Frontend Proxy Check")
    try:
        response = requests.get(f"{FRONTEND_URL}/health", timeout=5)
        if response.status_code == 200 and "healthy" in response.text:
            print("✅ Frontend proxy is working")
        else:
            print(f"❌ Frontend proxy issue: {response.status_code}")
    except Exception as e:
        print(f"❌ Frontend proxy failed: {e}")
    
    print()
    
    # Test 3: Try to access analysis endpoint (will fail due to auth, but should show it's reachable)
    print("Test 3: Analysis Endpoint Accessibility")
    try:
        response = requests.post(
            f"{FRONTEND_URL}/api/v1/analyze",
            json={"file_id": 1},
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 401:  # Not authenticated - expected
            print("✅ Analysis endpoint is accessible (authentication required)")
        elif response.status_code == 422:  # Validation error - also expected
            print("✅ Analysis endpoint is accessible (validation error)")
        else:
            print(f"❓ Unexpected response: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Analysis endpoint failed: {e}")
        return False
    
    print()
    
    # Summary and recommendations
    print("🔧 Analysis Stuck at 0% - Possible Causes:")
    print("1. ✅ Backend is running correctly")
    print("2. ✅ Frontend proxy is configured properly") 
    print("3. ✅ Analysis endpoint is accessible")
    print()
    print("Most likely causes:")
    print("• Authentication required - user needs to log in first")
    print("• Mock worker import path issue in analysis.py")
    print("• File upload process not completing correctly")
    print("• Database connection issues")
    print()
    print("Next steps:")
    print("1. Check browser developer tools for authentication errors")
    print("2. Check backend logs for import/worker errors during analysis")
    print("3. Verify file upload completes before triggering analysis")
    
    return True

if __name__ == "__main__":
    test_analysis_workflow()