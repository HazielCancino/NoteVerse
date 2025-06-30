import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, ArrowRight } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/notes');
  };

  const handleGithub = () => {
    // Replace with your actual GitHub repo URL
    window.open('https://github.com/yourusername/noteverse', '_blank');
  };

  return (
    <section className="bg-gradient-to-br from-[#102542] via-[#1a3a5c] to-[#102542] py-20">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Build Your Digital Memory Palace?
        </h2>
        <p className="text-xl text-gray-300 mb-10">
          Join the revolution of personal knowledge management. Start creating your customizable note universe today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={handleGetStarted}
            className="bg-[#f87060] hover:bg-[#e55a45] text-white px-10 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-2"
          >
            Start Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={handleGithub}
            className="border-2 border-white text-white hover:bg-white hover:text-[#102542] px-10 py-4 rounded-xl text-lg font-medium transition-all duration-300 flex items-center gap-2"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;