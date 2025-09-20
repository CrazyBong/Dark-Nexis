# CI Dependency Installation Failure - Fix Report

## Issue Summary

The CI workflow is failing at the "Install backend dependencies" step. This is preventing all subsequent steps from running.

## Root Causes Identified

1. **Missing System Dependencies**: The workers Dockerfile installs system packages like `ffmpeg`, `libsm6`, and `libxext6` that are required by OpenCV, but the CI workflow doesn't install these.

2. **Python Version Mismatch**: The CI uses Python 3.10, but the backend Dockerfile uses Python 3.9. Some packages might have compatibility issues.

3. **GPU vs CPU Dependencies**: The workers Dockerfile uses a PyTorch GPU base image, but the CI environment likely doesn't have GPU support.

4. **Package Conflicts**: Some packages like `opencv-python` and `torch` can be problematic in CI environments without proper system dependencies.

## Solution Implemented

### 1. Updated CI Workflow (`.github/workflows/ci.yml`)

- Changed Python version from 3.10 to 3.9 for consistency with Docker environments
- Added system dependency installation step:
  ```bash
  sudo apt-get update
  sudo apt-get install -y ffmpeg libsm6 libxext6
  ```
- Modified dependency installation to use CPU versions of ML packages:
  ```bash
  pip install torch==2.0.0+cpu torchvision==0.15.0+cpu -f https://download.pytorch.org/whl/torch_stable.html
  pip install opencv-python-headless>=4.7.0  # Server-friendly version
  ```

### 2. Updated Workers Requirements (`workers/requirements.txt`)

- Replaced `onnxruntime-gpu` with `onnxruntime` for better CI compatibility
- Replaced `opencv-python` with `opencv-python-headless` for server environments

## Additional Recommendations

1. **Pin Specific Versions**: Consider pinning exact versions of critical dependencies to ensure reproducible builds.

2. **Separate CI Requirements**: Create a separate `requirements-ci.txt` file with CI-optimized dependencies to avoid modifying production requirements.

3. **Cache Dependencies**: Add dependency caching to speed up CI builds:
   ```yaml
   - name: Cache pip dependencies
     uses: actions/cache@v3
     with:
       path: ~/.cache/pip
       key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
   ```

4. **Matrix Testing**: Consider testing with multiple Python versions to ensure compatibility.

## Testing the Fix

To verify the fix:
1. Commit the changes to a branch
2. Create a pull request to trigger the CI workflow
3. Monitor the "Install backend dependencies" step to ensure it completes successfully

## Long-term Maintenance

- Regularly update dependencies and test in CI
- Monitor for new versions of PyTorch and other ML libraries that might improve CI compatibility
- Consider using dependency management tools like Poetry or Pipenv for better dependency resolution