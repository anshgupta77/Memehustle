

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [memes, setMemes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentView, setCurrentView] = useState('gallery');
  const [loading, setLoading] = useState(false);
  const [terminalText, setTerminalText] = useState('');

  // Meme creation form
  const [newMeme, setNewMeme] = useState({
    title: '',
    image_url: '',
    tags: ''
  });

  useEffect(() => {
    fetchMemes();
    fetchLeaderboard();
    startTerminalEffect();

    // Socket event listeners
    socket.on('meme_created', (meme) => {
      setMemes(prev => [meme, ...prev]);
    });

    socket.on('vote_update', (update) => {
      setMemes(prev => prev.map(meme => 
        meme.id === update.meme_id 
          ? { ...meme, upvotes: update.upvotes }
          : meme
      ));
    });

    socket.on('bid_update', (update) => {
      setMemes(prev => prev.map(meme => 
        meme.id === update.meme_id 
          ? { 
              ...meme, 
              highest_bid: Math.max(meme.highest_bid || 0, update.credits),
              highest_bidder: update.credits > (meme.highest_bid || 0) ? update.user_id : meme.highest_bidder
            }
          : meme
      ));
    });

    return () => {
      socket.off('meme_created');
      socket.off('vote_update');
      socket.off('bid_update');
    };
  }, []);

  const startTerminalEffect = () => {
    const text = 'INITIALIZING CYBERPUNK MEME MATRIX... LOADING NEON CHAOS...';
    let i = 0;
    const timer = setInterval(() => {
      setTerminalText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(timer);
        setTimeout(() => setTerminalText(''), 2000);
      }
    }, 50);
  };

  const fetchMemes = async () => {
    try {
      const response = await fetch(`${'http://localhost:5000'}/api/memes`);
      
      const data = await response.json();
      console.log('Fetched memes:', data);
      setMemes(data);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${'http://localhost:5000'}/api/leaderboard?top=10`);
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const createMeme = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tags = newMeme.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const response = await fetch(`${'http://localhost:5000'}/api/memes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMeme,
          tags
        })
      });
      
      if (response.ok) {
        setNewMeme({ title: '', image_url: '', tags: '' });
        fetchLeaderboard(); // Refresh leaderboard
      }
    } catch (error) {
      console.error('Error creating meme:', error);
    } finally {
      setLoading(false);
    }
  };

  const vote = async (memeId, type) => {
    try {
      await fetch(`${ 'http://localhost:5000'}/api/memes/${memeId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const placeBid = async (memeId, credits) => {
    try {
      await fetch(`${ 'http://localhost:5000'}/api/memes/${memeId}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits: parseInt(credits) })
      });
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  const generateCaption = async (memeId) => {
    try {
      const response = await fetch(`${ 'http://localhost:5000'}/api/memes/${memeId}/caption`, {
        method: 'POST'
      });
      const data = await response.json();
      setMemes(prev => prev.map(meme => 
        meme.id === memeId ? data : meme
      ));
    } catch (error) {
      console.error('Error generating caption:', error);
    }
  };

  return (
    <div className="App">
      {/* Terminal Effect */}
      {terminalText && (
        <div className="terminal-overlay">
          <div className="terminal-text">{terminalText}_</div>
        </div>
      )}

      {/* Header */}
      <header className="cyber-header">
        <h1 className="neon-title glitch" data-text="MEMEHUSTLE">
          MEMEHUSTLE
        </h1>
        <p className="subtitle">CYBERPUNK AI MEME MARKETPLACE</p>
        
        <nav className="nav-buttons">
          <button 
            className={`cyber-btn ${currentView === 'gallery' ? 'active' : ''}`}
            onClick={() => setCurrentView('gallery')}
          >
            MEME GALLERY
          </button>
          <button 
            className={`cyber-btn ${currentView === 'create' ? 'active' : ''}`}
            onClick={() => setCurrentView('create')}
          >
            CREATE MEME
          </button>
          <button 
            className={`cyber-btn ${currentView === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('leaderboard')}
          >
            LEADERBOARD
          </button>
        </nav>
      </header>
      
      <main className="main-content">
        {/* Meme Gallery */}
        {currentView === 'gallery' && (
          <div className="meme-gallery">
            <h2 className="section-title">NEON MEME MATRIX</h2>
            <div className="meme-grid">
              {memes.map(meme => (
                <MemeCard
                  key={meme.id}
                  meme={meme}
                  onVote={vote}
                  onBid={placeBid}
                  onGenerateCaption={generateCaption}
                />
              ))}
            </div>
          </div>
        )}

        {/* Create Meme */}
        {currentView === 'create' && (
          <div className="create-section">
            <h2 className="section-title">HACK A NEW MEME</h2>
            <form onSubmit={createMeme} className="meme-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newMeme.title}
                  onChange={(e) => setNewMeme({...newMeme, title: e.target.value})}
                  placeholder="Doge HODL"
                  required
                  className="cyber-input"
                />
              </div>
              
              <div className="form-group">
                <label>Image URL (optional)</label>
                <input
                  type="url"
                  value={newMeme.image_url}
                  onChange={(e) => setNewMeme({...newMeme, image_url: e.target.value})}
                  placeholder="https://picsum.photos/400"
                  className="cyber-input"
                />
              </div>
              
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newMeme.tags}
                  onChange={(e) => setNewMeme({...newMeme, tags: e.target.value})}
                  placeholder="crypto, funny, doge"
                  required
                  className="cyber-input"
                />
              </div>
              
              <button 
                type="submit" 
                className="cyber-btn primary"
                disabled={loading}
              >
                {loading ? 'HACKING...' : 'DEPLOY MEME'}
              </button>
            </form>
          </div>
        )}

        {/* Leaderboard */}
        {currentView === 'leaderboard' && (
          <div className="leaderboard-section">
            <h2 className="section-title">TRENDING CHAOS</h2>
            <div className="leaderboard">
              {leaderboard.map((meme, index) => (
                <div key={meme.id} className="leaderboard-item">
                  <div className="rank">#{index + 1}</div>
                  <img src={meme.image_url} alt={meme.title} className="thumb" />
                  <div className="meme-info">
                    <h3>{meme.title}</h3>
                    <p className="vibe">{meme.vibe}</p>
                    <div className="stats">
                      <span className="upvotes">🔥 {meme.upvotes}</span>
                      <span className="owner">@{meme.owner_id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Meme Card Component
function MemeCard({ meme, onVote, onBid, onGenerateCaption }) {
  const [bidAmount, setBidAmount] = useState('');
  const [showBidInput, setShowBidInput] = useState(false);

  const handleBid = (e) => {
    e.preventDefault();
    if (bidAmount && parseInt(bidAmount) > 0) {
      onBid(meme.id, bidAmount);
      setBidAmount('');
      setShowBidInput(false);
    }
  };

  return (
    <div className="meme-card">
      <div className="meme-header">
        <h3 className="meme-title">{meme.title}</h3>
        <div className="meme-vibe">{meme.vibe}</div>
      </div>
      
      <div className="meme-image-container">
        <img src={meme.image_url} alt={meme.title} className="meme-image" />
        <div className="image-overlay">
          <div className="tags">
            {meme.tags?.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
      
      {meme.caption && (
        <div className="meme-caption">"{meme.caption}"</div>
      )}
      
      <div className="meme-actions">
        <div className="vote-section">
          <button 
            className="vote-btn up"
            onClick={() => onVote(meme.id, 'up')}
          >
            ⬆️ {meme.upvotes}
          </button>
          <button 
            className="vote-btn down"
            onClick={() => onVote(meme.id, 'down')}
          >
            ⬇️
          </button>
        </div>
        
        <div className="bid-section">
          {meme.highest_bid > 0 && (
            <div className="current-bid">
              🏆 {meme.highest_bid} credits
              <br />
              <small>@{meme.highest_bidder}</small>
            </div>
          )}
          
          {!showBidInput ? (
            <button 
              className="cyber-btn small"
              onClick={() => setShowBidInput(true)}
            >
              PLACE BID
            </button>
          ) : (
            <form onSubmit={handleBid} className="bid-form">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Credits"
                className="bid-input"
                min="1"
              />
              <button type="submit" className="cyber-btn small">BID</button>
            </form>
          )}
        </div>
      </div>
      
      <div className="meme-footer">
        <span className="current-bid">owner</span>
        <span className="owner">@{meme.owner_id}</span>
        <button 
          className="cyber-btn mini"
          onClick={() => onGenerateCaption(meme.id)}
        >
          🤖 AI CAPTION
        </button>
      </div>
    </div>
  );
}

export default App;