// src/components/FeaturesSection.jsx
import React from 'react';
import { Palette, Smartphone, Music, Image, RefreshCw, Shield } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Palette className="w-8 h-8 text-white" />,
      title: "Fully Customizable",
      description: "Linux-inspired customization. Change themes, layouts, fonts, and every visual detail without coding."
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-white" />,
      title: "Cross-Platform Sync",
      description: "Seamlessly sync between Android, PC, and web. Your notes follow you everywhere, even offline."
    },
    {
      icon: <Music className="w-8 h-8 text-white" />,
      title: "Spotify Integration",
      description: "Connect your favorite music lists to Spotify. Get song details, listening stats, and recommendations."
    },
    {
      icon: <Image className="w-8 h-8 text-white" />,
      title: "Pinterest & Media",
      description: "Easily add images, GIFs, and Pinterest content. Set them as backgrounds or embed in notes."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-white" />,
      title: "Mobile & Desktop",
      description: "Native apps for all platforms. Optimized experience whether you're on phone or computer."
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Never Lose Data",
      description: "Local SQLite backup with cloud sync. Your memories are safe even if devices break."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#102542] mb-6">
            Powerful Features for Your Ideas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to capture, organize, and never lose your precious thoughts and memories
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="note-card p-8 rounded-2xl hover-lift group">
              <div className="w-16 h-16 bg-[#f87060] rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#102542] mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;