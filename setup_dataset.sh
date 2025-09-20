#!/bin/bash
# FaceForensics++ Dataset Download and Setup Script

echo "Setting up FaceForensics++ Dataset for Dark-Nexis Training"
echo "========================================================="

# Create directories
mkdir -p data/FaceForensics++
cd data/FaceForensics++

# Clone the repository
echo "Cloning FaceForensics++ repository..."
git clone https://github.com/ondyari/FaceForensics.git
cd FaceForensics

# Download dataset (requires agreement to terms)
echo ""
echo "IMPORTANT: You need to:"
echo "1. Register at http://kaldir.vc.in.tum.de/faceforensics_benchmark/"
echo "2. Get your download script with credentials"
echo "3. Download the dataset using their provided script"
echo ""
echo "For now, setting up the training environment..."

# Go back to models directory
cd ../../../

# Install training dependencies
echo "Installing training dependencies..."
pip install -r models/requirements.txt

echo ""
echo "Setup completed! Next steps:"
echo "1. Download FaceForensics++ dataset from official source"
echo "2. Extract to data/FaceForensics++/ directory"
echo "3. Run training with: python models/training/train.py --data_dir data/FaceForensics++ --model resnet50"