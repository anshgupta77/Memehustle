import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Zap, User, DollarSign } from 'lucide-react';

const MemeCard = ({ meme, onVote, onBid, onGenerateCaption, index, currentUser }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [showBidInput, setShowBidInput] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (type) => {
    setIsVoting(true);
    await onVote(meme.id, type);
    setTimeout(() => setIsVoting(false), 300);
  };

  const handleBid = (e) => {
    e.preventDefault();
    if (bidAmount && parseInt(bidAmount) > 0) {
      onBid(meme.id, bidAmount);
      setBidAmount('');
      setShowBidInput(false);
    }
  };

  return (
    <div 
      className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm 
                 border border-cyan-500/30 rounded-xl overflow-hidden transform transition-all duration-300
                 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className="flex justify-between items-start p-4 pb-2">
        <h3 className="text-lg font-bold text-white truncate flex-1 mr-2">
          {meme.title}
        </h3>
        {meme.vibe && (
          <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-bold rounded-full">
            {meme.vibe}
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative overflow-hidden mx-4 rounded-lg">
        <img 
          src={meme.image_url} 
          alt={meme.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Tags Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-2">
              {meme.tags?.map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-cyan-500/80 text-white text-xs rounded-md backdrop-blur-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      {meme.caption && (
        <div className="mx-4 mt-3 p-3 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg">
          <p className="text-purple-300 italic text-sm">
            "{meme.caption}"
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 space-y-4">
        {/* Voting Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVote('up')}
              disabled={isVoting}
              className={`
                flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200
                ${isVoting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500/20 hover:scale-110 active:scale-95'}
                border border-green-500/50 text-green-400
              `}
            >
              <ChevronUp size={18} />
              <span className="font-bold">{meme.upvotes}</span>
            </button>
            
            <button
              onClick={() => handleVote('down')}
              disabled={isVoting}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${isVoting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500/20 hover:scale-110 active:scale-95'}
                border border-red-500/50 text-red-400
              `}
            >
              <ChevronDown size={18} />
            </button>
          </div>

          <button
            onClick={() => onGenerateCaption(meme.id)}
            className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 
                       border border-purple-500/50 text-purple-300 rounded-lg transition-all duration-200
                       hover:from-purple-500/30 hover:to-cyan-500/30 hover:scale-105 active:scale-95"
          >
            <Zap size={16} />
            <span className="text-xs font-medium">AI</span>
          </button>
        </div>

        {/* Bidding Section */}
        <div className="space-y-2">
          {meme.highest_bid > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-yellow-400 font-medium flex items-center gap-1">
                <DollarSign size={14} />
                {meme.highest_bid} credits
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                <User size={12} />
                @{currentUser}
              </span>
            </div>
          )}

          {!showBidInput ? (
            <button
              onClick={() => setShowBidInput(true)}
              className="w-full py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 
                         border border-yellow-500/50 text-yellow-300 rounded-lg font-medium
                         transition-all duration-200 hover:from-yellow-500/30 hover:to-orange-500/30
                         hover:scale-105 active:scale-95"
            >
              PLACE BID
            </button>
          ) : (
            <form onSubmit={handleBid} className="flex space-x-2">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Credits"
                min="1"
                className="flex-1 px-3 py-2 bg-gray-800/50 border border-cyan-500/50 text-cyan-400 
                           rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
                           border border-cyan-500/50 text-cyan-300 rounded-lg font-medium
                           transition-all duration-200 hover:from-cyan-500/30 hover:to-blue-500/30
                           hover:scale-105 active:scale-95"
              >
                BID
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
          <span className="text-gray-500 text-sm">Owner</span>
          <span className="text-gray-400 text-sm flex items-center gap-1">
            <User size={12} />
            @{meme.owner_id}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MemeCard;
