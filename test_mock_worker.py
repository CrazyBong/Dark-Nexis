#!/usr/bin/env python3
"""
Direct test of mock worker import from backend context
"""

import sys
import os

# Simulate the backend import path
backend_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(backend_dir, 'dark-nexis-backend'))
sys.path.insert(0, parent_dir)

def test_mock_worker_from_backend():
    try:
        from workers.simple_worker import mock_analysis_task
        print("✅ Mock worker import successful")
        
        # Test the function
        result = mock_analysis_task('test.jpg', 123)
        print(f"✅ Mock analysis result: {result['isDeepfake']} (confidence: {result['confidence']})")
        
        return True
    except Exception as e:
        print(f"❌ Mock worker test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_backend_analysis_import():
    """Test if the backend can import and run analysis"""
    try:
        # Change to backend directory
        backend_path = os.path.join(os.path.dirname(__file__), 'dark-nexis-backend', 'backend')
        if os.path.exists(backend_path):
            sys.path.insert(0, backend_path)
            
        # Try to import the analysis module
        from app.api.endpoints.analysis import process_file_analysis
        print("✅ Backend analysis module imported successfully")
        return True
    except Exception as e:
        print(f"❌ Backend analysis import failed: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Testing Mock Worker Integration...")
    print()
    
    print("Test 1: Mock Worker Import")
    test1 = test_mock_worker_from_backend()
    print()
    
    print("Test 2: Backend Analysis Import")  
    test2 = test_backend_analysis_import()
    print()
    
    if test1 and test2:
        print("✅ All tests passed! Mock worker should be working.")
    else:
        print("❌ Tests failed. Need to fix import issues.")