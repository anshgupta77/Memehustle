

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Header from './components/Header';
import MemeGallery from './components/MemeGallery';
import CreateMeme from './components/CreateMeme';
import Leaderboard from './components/Leaderboard';
import TerminalLoader from './components/TerminalLoader';

const socket = io('http://localhost:5000');

function App() {
  const [memes, setMemes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentView, setCurrentView] = useState('gallery');
  const [loading, setLoading] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);

  useEffect(() => {
    fetchMemes();
    fetchLeaderboard();

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

  const fetchMemes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/memes');
      const data = await response.json();
      setMemes(data);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leaderboard?top=10');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const createMeme = async (memeData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/memes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memeData)
      });
      
      if (response.ok) {
        fetchLeaderboard();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating meme:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const vote = async (memeId, type) => {
    try {
      await fetch(`http://localhost:5000/api/memes/${memeId}/vote`, {
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
      await fetch(`http://localhost:5000/api/memes/${memeId}/bid`, {
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
      const response = await fetch(`http://localhost:5000/api/memes/${memeId}/caption`, {
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
    <div className="w-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-cyan-400">
      {showTerminal && (
        <TerminalLoader onComplete={() => setShowTerminal(false)} />
      )}

      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {currentView === 'gallery' && (
          <MemeGallery
            memes={memes}
            onVote={vote}
            onBid={placeBid}
            onGenerateCaption={generateCaption}
          />
        )}

        {currentView === 'create' && (
          <CreateMeme
            onCreateMeme={createMeme}
            loading={loading}
          />
        )}

        {currentView === 'leaderboard' && (
          <Leaderboard leaderboard={leaderboard} />
        )}
      </main>
    </div>
  );
}

export default App;