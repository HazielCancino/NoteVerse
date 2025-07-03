// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#102542] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#f87060] rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-medium">Noteverse</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Your personal universe of ideas, memories, and creativity. Never lose another precious thought.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#f87060] transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#f87060] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#f87060] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-medium mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/notes" className="text-gray-400 hover:text-[#f87060] transition-colors">Notes App</Link></li>
              <li><Link to="/settings" className="text-gray-400 hover:text-[#f87060] transition-colors">Settings</Link></li>
              <li><a href="#features" className="text-gray-400 hover:text-[#f87060] transition-colors">Features</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#f87060] transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#f87060] transition-colors">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#f87060] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 Noteverse. Built with ❤️ for creators and dreamers.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#f87060] transition-colors text-sm">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-[#f87060] transition-colors text-sm">Terms</a>
            <a href="#" className="text-gray-400 hover:text-[#f87060] transition-colors text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;