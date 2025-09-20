import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PricingSection } from './components/PricingSection';
import { AnalysisStage } from './components/AnalysisStage';
import { ResultsStage } from './components/ResultsStage';
import { AccountDashboard } from './components/AccountDashboard';
import { ConnectionTest } from './components/ConnectionTest';

type AppStage = 'upload' | 'analysis' | 'results';
type AppSection = 'home' | 'how-it-works' | 'pricing' | 'account';

interface AnalysisResults {
  confidence: number;
  isDeepfake: boolean;
  detectedTools: string[];
  metadata: {
    analysisTime: string;
    modelVersion: string;
    fileSize: number;
    resolution?: string;
    duration?: string;
  };
  heatmapData: Array<{ x: number; y: number; intensity: number }>;
}

function App() {
  const [currentStage, setCurrentStage] = useState<AppStage>('upload');
  const [currentSection, setCurrentSection] = useState<AppSection>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

  // Add smooth scrolling and page transitions
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Scroll to section when navigation changes
  useEffect(() => {
    if (currentSection !== 'home' && currentSection !== 'account') {
      const element = document.getElementById(currentSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSection]);

  const handleNavigate = (section: string) => {
    setCurrentSection(section as AppSection);
    if (section === 'home') {
      setCurrentStage('upload');
      setUploadedFile(null);
      setAnalysisResults(null);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCurrentStage('analysis');
    setCurrentSection('home');
  };

  const handleAnalysisComplete = (results: AnalysisResults) => {
    setAnalysisResults(results);
    setCurrentStage('results');
  };

  const handleBackToUpload = () => {
    setCurrentStage('upload');
    setUploadedFile(null);
    setAnalysisResults(null);
  };

  const handleAuth = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
  };

  // Render main content based on current section and stage
  const renderMainContent = () => {
    if (currentSection === 'account') {
      return <AccountDashboard onNavigate={handleNavigate} />;
    }

    if (currentSection === 'home') {
      switch (currentStage) {
        case 'upload':
          return (
            <HeroSection 
              onFileUpload={handleFileUpload} 
              isAuthenticated={isAuthenticated}
            />
          );
        case 'analysis':
          return uploadedFile ? (
            <AnalysisStage 
              file={uploadedFile}
              onAnalysisComplete={handleAnalysisComplete}
              onBack={handleBackToUpload}
            />
          ) : null;
        case 'results':
          return uploadedFile && analysisResults ? (
            <ResultsStage 
              file={uploadedFile}
              results={analysisResults}
              onNewAnalysis={handleBackToUpload}
            />
          ) : null;
        default:
          return null;
      }
    }

    // Default layout with hero and sections
    return (
      <>
        <HeroSection 
          onFileUpload={handleFileUpload} 
          isAuthenticated={isAuthenticated}
        />
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Toaster for notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
        }}
      />
      
      {/* Header */}
      <Header 
        onNavigate={handleNavigate}
        currentSection={currentSection}
        isAuthenticated={isAuthenticated}
        onAuth={handleAuth}
      />

      {/* Main Content */}
      <main className="relative">
        {renderMainContent()}
      </main>

      {/* Add connection test component for debugging */}
      <div className="container mx-auto p-4">
        <ConnectionTest />
      </div>
      
      {/* Footer */}
      {(currentSection === 'home' || currentSection === 'how-it-works' || currentSection === 'pricing') && currentStage === 'upload' && (
        <footer className="bg-card/30 backdrop-blur-sm border-t border-border py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Nexis
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4 max-w-sm">
                    Advanced AI-powered deepfake detection to protect truth and authenticity 
                    in digital media.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    © 2024 Nexis. All rights reserved. Built with privacy and security in mind.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Product</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><button onClick={() => handleNavigate('home')} className="hover:text-primary transition-colors">Detection</button></li>
                    <li><button onClick={() => handleNavigate('how-it-works')} className="hover:text-primary transition-colors">How it Works</button></li>
                    <li><button onClick={() => handleNavigate('pricing')} className="hover:text-primary transition-colors">Pricing</button></li>
                    <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
