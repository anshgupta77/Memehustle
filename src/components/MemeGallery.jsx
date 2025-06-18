import React from 'react';
import MemeCard from './MemeCard';

const MemeGallery = ({ memes, onVote, onBid, onGenerateCaption, currentUser }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          NEON MEME MATRIX
        </h2>
        <p className="text-gray-400 text-lg">
          {memes.length} memes loaded into the matrix
        </p>
      </div>

      {memes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-2xl font-bold text-gray-400 mb-2">No memes found</h3>
          <p className="text-gray-500">The matrix is empty. Create the first meme!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {memes.map((meme, index) => (
            <MemeCard
              key={meme.id}
              meme={meme}
              onVote={onVote}
              onBid={onBid}
              onGenerateCaption={onGenerateCaption}
              index={index}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MemeGallery;
