const Leaderboard = ({leaderboard}) => {
    return ( 
         <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                TRENDING CHAOS
              </h2>
              <p className="text-gray-400 text-lg">
                {leaderboard.length} memes in the chaos feed
              </p>
            </div>
            
            <div className="space-y-4">
              {leaderboard.map((meme, index) => (
                <div key={meme.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center font-black text-white text-lg">
                        #{index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <img 
                        src={meme.image_url} 
                        alt={meme.title} 
                        className="w-16 h-16 rounded-lg object-cover border border-gray-600"
                      />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-white text-lg truncate">{meme.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{meme.vibe}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-orange-400 font-semibold">
                          🔥 {meme.upvotes}
                        </span>
                        <span className="text-gray-500">
                          @{meme.owner_id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
     );
}
 
export default Leaderboard;