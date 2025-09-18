# GitHub Push Guide for Dark-Nexis Project

This guide will help you push the Dark-Nexis project to your GitHub repository.

## Prerequisites

1. **Git installed** on your system
2. **GitHub account** 
3. **Repository created** on GitHub (or you can create one during the process)

## Current Repository Status

Based on the [.git/config](file:///C:/Users/Lenovo/Dark-Nexis/.git/config) file, your repository is already configured to push to:
```
https://github.com/CrazyBong/Dark-Nexis
```

## Steps to Push to GitHub

### 1. Open Terminal/Command Prompt
Navigate to your project directory:
```bash
cd c:\Users\Lenovo\Dark-Nexis
```

### 2. Check Current Status
```bash
git status
```

### 3. Add All Files (if needed)
If there are untracked files:
```bash
git add .
```

### 4. Commit Changes (if needed)
```bash
git commit -m "Add complete Dark-Nexis project with frontend-backend integration"
```

### 5. Push to GitHub
```bash
git push origin main
```

If you're on a different branch:
```bash
git push origin your-branch-name
```

## If You Need to Create a New Repository

### 1. Create Repository on GitHub
1. Go to https://github.com/new
2. Name your repository (e.g., "Dark-Nexis")
3. Choose public or private
4. Don't initialize with README

### 2. Connect Local Repository to GitHub
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

### 3. Push to GitHub
```bash
git push -u origin main
```

## If You Encounter Authentication Issues

### Option 1: Personal Access Token
1. Generate a Personal Access Token on GitHub (Settings > Developer settings > Personal access tokens)
2. Use it instead of password when prompted

### Option 2: SSH Keys
1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
2. Add SSH key to GitHub (Settings > SSH and GPG keys)
3. Change remote URL to SSH:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPOSITORY.git
   ```

## Troubleshooting

### If Remote Doesn't Exist
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git branch -M main
git push -u origin main
```

### If You Need to Force Push (CAUTION)
```bash
git push -u origin main --force
```

### If You Have Merge Conflicts
```bash
git pull origin main
# Resolve conflicts
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

## Files Included in the Project

The following key files and directories will be pushed:

### Frontend
- [src/](file:///C:/Users/Lenovo/Dark-Nexis/src) - React components and services
- [package.json](file:///C:/Users/Lenovo/Dark-Nexis/package.json) - Dependencies and scripts
- [vite.config.ts](file:///C:/Users/Lenovo/Dark-Nexis/vite.config.ts) - Vite configuration

### Backend
- [dark-nexis-backend/](file:///C:/Users/Lenovo/Dark-Nexis/dark-nexis-backend) - FastAPI backend services
- [docker-compose.yml](file:///C:/Users/Lenovo/Dark-Nexis/dark-nexis-backend/docker-compose.yml) - Docker configuration
- [requirements.txt](file:///C:/Users/Lenovo/Dark-Nexis/dark-nexis-backend/backend/requirements.txt) - Python dependencies

### Documentation
- [README.md](file:///C:/Users/Lenovo/Dark-Nexis/README.md) - Project overview
- [FRONTEND_BACKEND_INTEGRATION_GUIDE.md](file:///C:/Users/Lenovo/Dark-Nexis/FRONTEND_BACKEND_INTEGRATION_GUIDE.md) - Integration guide
- [COMPLETE_INTEGRATION_SOLUTION.md](file:///C:/Users/Lenovo/Dark-Nexis/COMPLETE_INTEGRATION_SOLUTION.md) - Complete solution documentation

### ML Components
- [best_deepfake_model.pth](file:///C:/Users/Lenovo/Dark-Nexis/best_deepfake_model.pth) - Trained model
- [workers/](file:///C:/Users/Lenovo/Dark-Nexis/dark-nexis-backend/workers) - ML worker services

## Verification

After pushing, verify on GitHub:
1. Go to your repository page
2. Check that all files are present
3. Verify commit history
4. Confirm branches are correctly pushed

## Additional Recommendations

1. **Add a proper README.md** with project description and setup instructions
2. **Update .gitignore** to exclude unnecessary files
3. **Tag releases** for better version management
4. **Add GitHub Actions** for CI/CD if needed

The project is now ready to be pushed to GitHub with all the frontend-backend integration work completed.