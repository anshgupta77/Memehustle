import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    const fetchMemes = async () => {
      const { data, error } = await supabase.from('memes').select('*');
      if (error) console.error('Error fetching memes:', error);
      else setMemes(data);
    };

    fetchMemes();
  }, []);

  return (
    <div className="p-4 text-white bg-black">
      <h1 className="text-xl mb-4">🚀 Meme Gallery</h1>
      {memes.map((meme) => (
        <div key={meme.id} className="mb-4 border-b border-gray-700 pb-2">
          <h2 className="text-lg font-bold">{meme.title}</h2>
          <img src={meme.image_url} alt={meme.title} className="w-64 h-auto mt-2 rounded" />
          <p className="text-sm text-gray-400">Upvotes: {meme.upvotes}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
