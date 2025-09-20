#!/usr/bin/env python3
"""
Create a test user and trigger analysis to verify the workflow
"""

import sys
import os
import asyncio

# Add backend to path
backend_dir = os.path.join(os.path.dirname(__file__), 'dark-nexis-backend', 'backend')
sys.path.insert(0, backend_dir)

async def test_analysis_workflow():
    """Test the complete analysis workflow"""
    print("🔍 Testing Analysis Workflow End-to-End...")
    print()
    
    try:
        # Import required modules
        from app.db.database import SessionLocal
        from app.models.user import User
        from app.models.file import File, FileStatus
        from app.models.analysis import Analysis, AnalysisStatus
        from app.api.endpoints.analysis import process_file_analysis
        from datetime import datetime
        import uuid
        
        # Create database session
        db = SessionLocal()
        
        try:
            print("Step 1: Creating test user...")
            # Create or get test user
            test_email = "test@darknexis.com"
            test_user = db.query(User).filter(User.email == test_email).first()
            
            if not test_user:
                test_user = User(
                    email=test_email,
                    username="testuser",
                    first_name="Test",
                    last_name="User",
                    is_active=True,
                    created_at=datetime.utcnow()
                )
                db.add(test_user)
                db.commit()
                db.refresh(test_user)
                print(f"✅ Created test user: {test_user.email}")
            else:
                print(f"✅ Using existing test user: {test_user.email}")
            
            print()
            print("Step 2: Creating test file...")
            # Create test file
            test_file = File(
                user_id=test_user.id,
                filename="test_video.mp4",
                s3_key=f"test/{uuid.uuid4()}/test_video.mp4",
                file_size=1024000,  # 1MB
                mime_type="video/mp4",
                status=FileStatus.UPLOADED,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(test_file)
            db.commit()
            db.refresh(test_file)
            print(f"✅ Created test file: {test_file.filename} (ID: {test_file.id})")
            
            print()
            print("Step 3: Triggering analysis...")
            # Trigger analysis
            await process_file_analysis(test_file.id, test_user.id, db)
            
            print()
            print("Step 4: Checking analysis results...")
            # Check if analysis was created and completed
            analysis = db.query(Analysis).filter(Analysis.file_id == test_file.id).first()
            
            if analysis:
                print(f"✅ Analysis created: ID {analysis.id}")
                print(f"   Status: {analysis.status}")
                print(f"   Deepfake: {analysis.is_deepfake}")
                print(f"   Confidence: {analysis.confidence}")
                
                if analysis.status == AnalysisStatus.COMPLETED:
                    print("✅ Analysis completed successfully!")
                    return True
                else:
                    print(f"❌ Analysis stuck at status: {analysis.status}")
                    return False
            else:
                print("❌ No analysis record found")
                return False
                
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Error during analysis workflow test: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    try:
        result = asyncio.run(test_analysis_workflow())
        print()
        if result:
            print("🎉 Analysis workflow is working correctly!")
            print("   The issue is likely authentication in the frontend.")
            print("   Users need to log in before they can trigger analysis.")
        else:
            print("💥 Analysis workflow is broken!")
            print("   Check the error messages above for details.")
    except Exception as e:
        print(f"💥 Test failed to run: {e}")
        print("   Check database connection and backend setup.")