
import React from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  priority: 'low' | 'medium' | 'high';
  threadCount?: number;
}

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: () => void;
  onToggleCheck: () => void;
  onDragStart?: (e: React.DragEvent, email: Email) => void;
}

const EmailListItem: React.FC<EmailListItemProps> = ({
  email,
  isSelected,
  isChecked,
  onSelect,
  onToggleCheck,
  onDragStart
}) => {
  const getReadStatusColor = (isRead: boolean) => {
    return isRead ? 'border-l-green-500' : 'border-l-red-500';
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(e, email);
    }
  };

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={handleDragStart}
      onClick={onSelect}
      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
        getReadStatusColor(email.isRead)
      } ${
        isSelected ? 'bg-purple-50 border-r-4 border-r-purple-500' : ''
      } ${
        !email.isRead ? 'bg-red-50/30' : 'bg-green-50/20'
      } ${
        onDragStart ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggleCheck}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className={`text-sm truncate ${
                !email.isRead ? 'text-red-900 font-bold' : 'text-green-700 font-normal'
              }`}>
                {email.from}
              </span>
              {email.threadCount && email.threadCount > 1 && (
                 <span className="text-xs text-gray-500 font-medium">
                   {email.threadCount}
                 </span>
               )}
              {email.isStarred && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {email.timestamp}
            </span>
          </div>
          
          <h3 className={`text-sm mb-1 truncate ${
            !email.isRead ? 'font-bold text-red-900' : 'font-normal text-green-800'
          }`}>
            {email.subject}
          </h3>
          
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {email.preview}
          </p>
          
          {email.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {email.labels.map((label, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                  {label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailListItem;
