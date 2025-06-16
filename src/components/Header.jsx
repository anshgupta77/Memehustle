import React from 'react';

const Header = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'gallery', label: 'MEME GALLERY', icon: '🎮' },
    { id: 'create', label: 'CREATE MEME', icon: '⚡' },
    { id: 'leaderboard', label: 'LEADERBOARD', icon: '🏆' }
  ];

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 animate-pulse"></div>
      <div className="relative z-10 text-center py-8 px-4 border-b-2 border-purple-500 shadow-lg shadow-purple-500/20">
        <h1 className="text-4xl md:text-6xl font-black mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
          MEMEHUSTLE
        </h1>
        <p className="text-gray-400 text-sm md:text-lg tracking-widest mb-6">
          CYBERPUNK AI MEME MARKETPLACE
        </p>
        
        <nav className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-4xl mx-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                group relative px-6 py-3 font-bold text-sm md:text-base
                transition-all duration-300 transform
                ${currentView === item.id
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white scale-105 shadow-lg shadow-purple-500/50'
                  : 'bg-gray-800/50 text-cyan-400 hover:bg-gray-700/50 hover:scale-105 hover:shadow-md hover:shadow-cyan-500/30'
                }
                border-2 border-cyan-500/50 rounded-lg backdrop-blur-sm
                active:scale-95
              `}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </span>
              {currentView === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-lg animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;