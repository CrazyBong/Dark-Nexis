# FaceForensics++ Dataset Setup Guide

## Current Status
✅ Repository structure downloaded  
❌ Missing actual video/image data  
❌ Missing trained models  

## Step 1: Request Dataset Access

1. **Fill out the Google Form**: https://docs.google.com/forms/d/e/1FAIpQLSdRRR3L5zAv6tQ_CKxmK4W96tAab_pfBu2EKAgQbeDVhmXagg/viewform
2. **Wait for approval** (can take several days)
3. **You'll receive a download script via email**

## Step 2: Download Data (Once Approved)

### Recommended: Start with compressed videos (saves bandwidth)
```bash
cd C:\Users\Lenovo\Dark-Nexis\dark-nexis-backend\backend\data\FaceForensics++

# Download all methods, compressed quality, videos only
python download-FaceForensics.py ./downloaded_data -d all -c c23 -t videos

# Download original videos
python download-FaceForensics.py ./downloaded_data -d original -c c23 -t videos
```

### Expected folder structure after download:
```
FaceForensics++/
├── downloaded_data/
│   ├── original_sequences/
│   │   └── youtube/
│   │       ├── c23/  # compressed videos
│   │       └── raw/  # (optional) uncompressed
│   └── manipulated_sequences/
│       ├── Deepfakes/
│       ├── Face2Face/
│       ├── FaceSwap/
│       └── NeuralTextures/
```

## Step 3: Extract Frames for Training

Once you have videos, extract frames:
```bash
python extract_compressed_videos.py ./downloaded_data -d all -c c23
```

## Step 4: Train Models

Use our training script:
```bash
cd C:\Users\Lenovo\Dark-Nexis\dark-nexis-backend
python -m models.training.train --data_dir backend/data/FaceForensics++/downloaded_data --model_type xception
```

## Alternative: Use Pre-trained Models

If you want to test the system immediately:
1. Download pre-trained models from research papers
2. Place them in `models/saved_models/`
3. Update model paths in the worker

## Storage Requirements

- **Compressed (c23)**: ~45GB total
- **Raw/Uncompressed**: ~2TB+ 
- **Start with compressed version**

## Timeline

- Dataset approval: 3-7 days
- Download (compressed): 2-4 hours (depending on internet)
- Training: 4-8 hours per model (depending on GPU)

## Quick Test Setup (While Waiting)

We've created a mock worker that simulates analysis results.
This lets you test the frontend/backend integration immediately.