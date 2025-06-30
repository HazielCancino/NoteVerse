import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/notes');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#102542]/95 backdrop-blur-md' : 'glass-effect'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-[#f87060] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-medium text-white">Noteverse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white hover:text-[#f87060] transition-colors">Features</a>
            <a href="#about" className="text-white hover:text-[#f87060] transition-colors">About</a>
            <Link to="/settings" className="text-white hover:text-[#f87060] transition-colors">Settings</Link>
            <button 
              onClick={handleGetStarted}
              className="bg-[#f87060] hover:bg-[#e55a45] text-white px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Launch App
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#102542]/95 backdrop-blur-md border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-white hover:text-[#f87060]">Features</a>
              <a href="#about" className="block px-3 py-2 text-white hover:text-[#f87060]">About</a>
              <Link to="/settings" className="block px-3 py-2 text-white hover:text-[#f87060]">Settings</Link>
              <button 
                onClick={handleGetStarted}
                className="w-full text-left px-3 py-2 text-[#f87060] font-medium"
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;