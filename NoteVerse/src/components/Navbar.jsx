export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-desert-sand rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" />
              </svg>
            </div>
            <span className="text-xl font-medium text-white">NoteCraft</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white hover:text-desert-sand transition-colors">Features</a>
            <a href="#about" className="text-white hover:text-desert-sand transition-colors">About</a>
            <a href="#contact" className="text-white hover:text-desert-sand transition-colors">Contact</a>
            <button className="bg-desert-sand hover:bg-desert-sand-dark text-white px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
