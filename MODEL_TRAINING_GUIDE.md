# Dark-Nexis Model Training & Setup Guide

## 🚨 **Current Issue: Analysis Stuck at 0%**

Your analysis is stuck because the ML models aren't trained yet. Here's how to fix it:

## 📋 **Step-by-Step Setup:**

### 1. **Download FaceForensics++ Dataset**
```bash
# Go to: http://kaldir.vc.in.tum.de/faceforensics_benchmark/
# Register and agree to terms
# Download the dataset (faces only for training)
```

### 2. **Install Training Dependencies**
```bash
cd dark-nexis-backend/models
pip install -r requirements.txt
```

### 3. **Prepare Dataset Structure**
```
dark-nexis-backend/
├── data/
│   └── FaceForensics++/
│       ├── original_sequences/
│       │   └── youtube/
│       │       └── c23/
│       │           └── faces/
│       └── manipulated_sequences/
│           ├── Deepfakes/
│           ├── Face2Face/
│           ├── FaceSwap/
│           └── NeuralTextures/
```

### 4. **Train Your Models**
```bash
# Train ResNet50 (recommended first)
python models/training/train.py --data_dir data/FaceForensics++ --model resnet50 --epochs 10

# Train other models
python models/training/train.py --data_dir data/FaceForensics++ --model xception --epochs 10
python models/training/train.py --data_dir data/FaceForensics++ --model efficientnet --epochs 10
```

### 5. **Quick Fix for Testing (Without Training)**
If you want to test the system without training models first:

1. **Create dummy models:**
```bash
mkdir -p dark-nexis-backend/models
cd dark-nexis-backend/models

# Create empty model files
touch xception_model.pt
touch resnet50_model.pt
touch efficientnet_model.pt
touch meta_classifier.pt
touch retinaface_model.pt
```

2. **Update worker to use mock analysis:**

### 6. **Expected Training Results**
- **Training Time:** 2-6 hours per model (depending on GPU)
- **Expected Accuracy:** 85-95% on test set
- **Dataset Size:** ~5GB for faces only

### 7. **Model Accuracy Monitoring**
The training script will show:
```
Epoch 10/10:
  Train Loss: 0.1234, Train Acc: 92.34%
  Val Loss: 0.2345, Val Acc: 89.67%
  New best model saved! Val Acc: 89.67%
Test Accuracy: 87.45%
```

### 8. **Alternative: Use Pre-trained Models**
If training takes too long, you can:
1. Search for pre-trained deepfake detection models
2. Convert them to PyTorch format
3. Place them in `dark-nexis-backend/models/`

## 🔧 **Quick Fix for Development**

For immediate testing without trained models, I'll create a mock analysis that works: