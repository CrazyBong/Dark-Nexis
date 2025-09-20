#!/usr/bin/env python3
"""
Test script to verify the analysis workflow is working
"""

import sys
import os

# Add project root to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

def test_simple_worker_import():
    """Test if we can import the simple worker"""
    try:
        from workers.simple_worker import mock_analysis_task
        print("✅ Successfully imported mock_analysis_task from workers.simple_worker")
        
        # Test the mock analysis function
        result = mock_analysis_task("test_file.jpg", 123)
        print(f"✅ Mock analysis completed: {result['isDeepfake']} (confidence: {result['confidence']})")
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Execution error: {e}")
        return False

def test_backend_worker_integration():
    """Test if the backend can access the worker"""
    try:
        # Simulate the backend import path
        backend_dir = os.path.join(current_dir, 'dark-nexis-backend', 'backend')
        sys.path.insert(0, os.path.dirname(backend_dir))
        
        from workers.simple_worker import mock_analysis_task
        print("✅ Backend can import simple_worker")
        
        result = mock_analysis_task("test_video.mp4", 456)
        print(f"✅ Backend integration test passed: deepfake={result['isDeepfake']}")
        return True
    except Exception as e:
        print(f"❌ Backend integration failed: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Testing Analysis Workflow...")
    print()
    
    # Test 1: Direct import
    print("Test 1: Direct Simple Worker Import")
    test1_passed = test_simple_worker_import()
    print()
    
    # Test 2: Backend integration
    print("Test 2: Backend Integration")
    test2_passed = test_backend_worker_integration()
    print()
    
    # Summary
    if test1_passed and test2_passed:
        print("✅ All tests passed! Analysis workflow should be working.")
    else:
        print("❌ Some tests failed. Analysis may be stuck due to import issues.")