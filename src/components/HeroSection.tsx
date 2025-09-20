import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, FileImage, FileVideo, AudioLines, Shield, Zap, Users } from 'lucide-react';
import { UploadCard } from './UploadCard';

interface HeroSectionProps {
  onFileUpload: (file: File) => void;
  isAuthenticated: boolean;
}

export function HeroSection({ onFileUpload, isAuthenticated }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { icon: Shield, label: '99.7% Accuracy', value: '99.7%' },
    { icon: Zap, label: 'Average Detection Time', value: '2.3s' },
    { icon: Users, label: 'Files Analyzed', value: '2.4M+' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Black hole effect */}
        <div 
          className="absolute inset-0 black-hole animate-rotate-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
          }}
        />
        
        {/* Floating particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
                  Detect Deepfakes
                </span>
                <br />
                <span className="text-white/90">
                  Protect Truth
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Advanced AI-powered deepfake detection for images, videos, and audio. 
                Protect yourself and your organization from synthetic media manipulation 
                with industry-leading accuracy.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 mb-4 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <UploadCard onFileUpload={onFileUpload} isAuthenticated={isAuthenticated} />
          </motion.div>

          {/* Supported Formats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-muted-foreground mb-6">Supported file formats:</p>
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileImage className="h-4 w-4 text-primary" />
                <span>Images: JPG, PNG, GIF, WebP</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileVideo className="h-4 w-4 text-primary" />
                <span>Videos: MP4, AVI, MOV, WebM</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <AudioLines className="h-4 w-4 text-primary" />
                <span>Audio: MP3, WAV, M4A, OGG</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground/70">
              Maximum file size: 100MB • Files are processed securely and never stored
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-3 bg-primary/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}