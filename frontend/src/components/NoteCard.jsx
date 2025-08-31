import { Calendar, Tag, Edit3, Trash2 } from 'lucide-react';

function NoteCard({ note, onEdit, onDelete, onClick }) {
  const colorClasses = {
    orange: "bg-orange-100 border-orange-200 hover:bg-orange-50",
    yellow: "bg-yellow-100 border-yellow-200 hover:bg-yellow-50", 
    green: "bg-green-100 border-green-200 hover:bg-green-50",
    red: "bg-red-100 border-red-200 hover:bg-red-50",
    purple: "bg-purple-100 border-purple-200 hover:bg-purple-50",
    teal: "bg-teal-100 border-teal-200 hover:bg-teal-50"
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className={`${colorClasses[note.color] || colorClasses.yellow} rounded-lg border-2 p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group relative`}
      onClick={() => onClick && onClick(note)}
    >
      <div className="space-y-3">
        {/* Header with title and tag */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate flex-1 text-sm">
            {note.title || 'Untitled'}
          </h3>
          {note.tag && (
            <div className="ml-2 flex items-center gap-1 px-2 py-1 bg-white bg-opacity-70 rounded-full text-xs text-gray-600 flex-shrink-0">
              <Tag size={10} />
              {note.tag}
            </div>
          )}
        </div>
        
        {/* Content */}
        <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">
          {truncateContent(note.content)}
        </p>
        
        {/* Footer with date and actions */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar size={10} />
            {formatDate(note.created_at)}
          </div>
          
          {/* Action buttons - show on hover */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              title="Edit note"
            >
              <Edit3 size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 bg-red-500 hover:bg-red-600 focus:bg-red-600 text-white rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              title="Delete note"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;