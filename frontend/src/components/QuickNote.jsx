import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

function QuickNote({ onNoteAdded }) {
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('orange');
  const [tag, setTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = [
    { name: 'orange', bg: 'bg-orange-400', hover: 'hover:bg-orange-500', ring: 'ring-orange-400' },
    { name: 'yellow', bg: 'bg-yellow-400', hover: 'hover:bg-yellow-500', ring: 'ring-yellow-400' },
    { name: 'green', bg: 'bg-green-400', hover: 'hover:bg-green-500', ring: 'ring-green-400' },
    { name: 'red', bg: 'bg-red-400', hover: 'hover:bg-red-500', ring: 'ring-red-400' },
    { name: 'purple', bg: 'bg-purple-400', hover: 'hover:bg-purple-500', ring: 'ring-purple-400' },
    { name: 'teal', bg: 'bg-teal-400', hover: 'hover:bg-teal-500', ring: 'ring-teal-400' },
  ];

  const handleAddNote = async () => {
    if (!isAuthenticated) {
      alert("Please login first");
      return;
    }

    if (!title.trim() && !content.trim()) {
      alert("Please add a title or content to create a note.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
      };
      
      const response = await axiosClient.post('/notes', noteData);
      
      // Reset form
      setTitle('');
      setContent('');
      setTag('');
      setSelectedColor('orange');
      
      // Notify parent if callback provided
      if (onNoteAdded) {
        onNoteAdded(response.data);
      }
      
      alert('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedColorObj = colors.find(c => c.name === selectedColor);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Note</h3>
      
      <div className="space-y-4">
        {/* Title Input */}
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
        />
        
        {/* Content Textarea */}
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          disabled={isSubmitting}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none text-sm placeholder-gray-400"
        />
        
        {/* Color Picker and Tag Input */}
        <div className="flex items-center justify-between">
          {/* Color Picker */}
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                disabled={isSubmitting}
                className={`w-6 h-6 rounded-full ${color.bg} ${color.hover} transition-all duration-200 focus:outline-none ${
                  selectedColor === color.name 
                    ? `ring-2 ${selectedColorObj?.ring} ring-offset-2` 
                    : 'hover:scale-110'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
          
          {/* Tag Input */}
          <input
            type="text"
            placeholder="Add tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            disabled={isSubmitting}
            className="text-xs px-2 py-1.5 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all duration-200 w-20 placeholder-gray-400"
          />
        </div>
        
        {/* Add Note Button */}
        <button
          onClick={handleAddNote}
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : 'Add Note'}
        </button>
      </div>
    </div>
  );
}

export default QuickNote;