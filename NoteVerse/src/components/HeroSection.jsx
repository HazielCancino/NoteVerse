// src/components/HeroSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartNoting = () => {
    navigate('/notes');
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#102542] via-[#1a3a5c] to-[#102542]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#f87060] opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-[#f87060] opacity-15 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-40 w-16 h-16 bg-[#f87060] opacity-20 rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-20 w-20 h-20 bg-[#f87060] opacity-10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Universe of
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f87060] to-[#fa9285]">
              Ideas & Memories
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create, customize, and sync your personal notes across all devices. 
            Never lose your favorite lists, memories, or creative thoughts again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleStartNoting}
              className="bg-[#f87060] hover:bg-[#e55a45] text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:shadow-2xl hover:scale-105 min-w-[200px] flex items-center justify-center gap-2 group"
            >
              Start Creating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-[#102542] px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 min-w-[200px] flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;