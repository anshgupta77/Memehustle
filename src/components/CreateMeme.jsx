import React, { useState } from 'react';
import { Upload, Zap, Tag, Type } from 'lucide-react';

const CreateMeme = ({ onCreateMeme, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    tags: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one tag is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const memeData = {
      ...formData,
      tags,
      image_url: formData.image_url || `https://picsum.photos/400/400?random=${Date.now()}`
    };
    
    const success = await onCreateMeme(memeData);
    if (success) {
      setFormData({ title: '', image_url: '', tags: '' });
      setErrors({});
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formFields = [
    {
      id: 'title',
      label: 'Meme Title',
      placeholder: 'Doge HODL',
      icon: Type,
      required: true
    },
    {
      id: 'image_url',
      label: 'Image URL (optional)',
      placeholder: 'https://picsum.photos/400',
      icon: Upload,
      required: false
    },
    {
      id: 'tags',
      label: 'Tags (comma-separated)',
      placeholder: 'crypto, funny, doge',
      icon: Tag,
      required: true
    }
  ];

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          HACK A NEW MEME
        </h2>
        <p className="text-gray-400 text-lg">
          Deploy your creation into the digital matrix
        </p>
      </div>

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm 
                      border border-cyan-500/30 rounded-xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {formFields.map((field) => {
            const IconComponent = field.icon;
            return (
              <div key={field.id} className="space-y-2">
                <label className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase tracking-wide">
                  <IconComponent size={16} />
                  {field.label}
                  {field.required && <span className="text-red-400">*</span>}
                </label>
                
                <div className="relative">
                  <input
                    type={field.id === 'image_url' ? 'url' : 'text'}
                    value={formData[field.id]}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className={`
                      w-full px-4 py-3 bg-gray-800/50 border-2 rounded-lg
                      text-cyan-400 placeholder-gray-500 font-medium
                      transition-all duration-300 focus:outline-none
                      ${errors[field.id] 
                        ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' 
                        : 'border-cyan-500/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                      }
                    `}
                  />
                  
                  {errors[field.id] && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-4 px-6 font-bold text-lg rounded-lg transition-all duration-300
                ${loading
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transform hover:scale-105 active:scale-95'
                }
                text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  DEPLOYING TO MATRIX...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Zap size={20} />
                  DEPLOY MEME
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Preview Section */}
        {formData.title && (
          <div className="mt-8 pt-8 border-t border-gray-700/50">
            <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
              <span>👁️</span>
              PREVIEW
            </h3>
            
            <div className="bg-gray-800/30 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="text-white font-bold text-lg mb-2">{formData.title}</h4>
              
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/400/400?random=${Date.now()}`;
                  }}
                />
              )}
              
              {formData.tags && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-md"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMeme;