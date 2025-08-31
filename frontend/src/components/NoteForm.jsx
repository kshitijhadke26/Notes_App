import React, { useState } from 'react';
import { X } from 'lucide-react';

function NoteForm({ initialData, onSubmit, onCancel, isModal = false }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [selectedColor, setSelectedColor] = useState(initialData?.color || 'orange');
  const [tag, setTag] = useState(initialData?.tag || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = [
    { name: 'orange', bg: 'bg-orange-400', hover: 'hover:bg-orange-500', ring: 'ring-orange-400' },
    { name: 'yellow', bg: 'bg-yellow-400', hover: 'hover:bg-yellow-500', ring: 'ring-yellow-400' },
    { name: 'green', bg: 'bg-green-400', hover: 'hover:bg-green-500', ring: 'ring-green-400' },
    { name: 'red', bg: 'bg-red-400', hover: 'hover:bg-red-500', ring: 'ring-red-400' },
    { name: 'purple', bg: 'bg-purple-400', hover: 'hover:bg-purple-500', ring: 'ring-purple-400' },
    { name: 'teal', bg: 'bg-teal-400', hover: 'hover:bg-teal-500', ring: 'ring-teal-400' },
  ];

  const handleSubmit = async () => {
    if (!title.trim() && !content.trim()) {
      alert("Please add a title or content");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        color: selectedColor,
        tag: tag.trim()
      });
    } catch (error) {
      console.error('Error submitting note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <div className="space-y-4">
      {/* Modal Header (only if isModal) */}
      {isModal && (
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {initialData ? 'Edit Note' : 'Create a note'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Title Input */}
      <div>
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
          disabled={isSubmitting}
        />
      </div>
      
      {/* Content Textarea */}
      <div>
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none text-sm placeholder-gray-400"
          disabled={isSubmitting}
        />
      </div>
      
      {/* Color Picker and Tag Input */}
      <div className="flex items-center justify-between">
        {/* Color Picker */}
        <div className="flex space-x-2">
          {colors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setSelectedColor(color.name)}
              disabled={isSubmitting}
              className={`w-6 h-6 rounded-full ${color.bg} ${color.hover} transition-all duration-200 focus:outline-none ${
                selectedColor === color.name 
                  ? 'ring-2 ring-gray-400 ring-offset-2' 
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
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Note' : 'Add Note')}
        </button>
      </div>
    </div>
  );

  // If modal, wrap in modal container
  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6 w-full max-w-md">
          {formContent}
        </div>
      </div>
    );
  }

  // Otherwise return the form content directly
  return formContent;
}

export default NoteForm;