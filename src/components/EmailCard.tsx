
import React from 'react';
import { Mail, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Email {
  id: string;
  from: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
}

interface EmailCardData {
  id: string;
  subject: string;
  emails: Email[];
  priority: 'low' | 'medium' | 'high';
  labels: string[];
}

interface EmailCardProps {
  card: EmailCardData;
  onDragStart: (e: React.DragEvent) => void;
  onCardClick?: () => void;
  onDrop?: (e: React.DragEvent) => void;
}

const EmailCard: React.FC<EmailCardProps> = ({ card, onDragStart, onCardClick, onDrop }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const unreadCount = card.emails.filter(email => !email.isRead).length;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only show visual feedback for email drops, not card drops
    const dragType = e.dataTransfer.getData('dragType');
    if (dragType === 'email') {
      // Visual feedback for email drop zone
      e.currentTarget.classList.add('ring-2', 'ring-blue-400', 'bg-blue-50');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove visual feedback
    e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove visual feedback
    e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'bg-blue-50');
    
    // Only handle email drops, not card drops
    const dragType = e.dataTransfer.getData('dragType');
    const emailData = e.dataTransfer.getData('emailData');
    
    if (dragType === 'email' && emailData && onDrop) {
      onDrop(e);
    }
    // If it's a card being dropped, do nothing - let the column handle it
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onCardClick}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-[1.02] group w-full max-w-full overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        {/* Priority Badge - Top Right */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-2 min-w-0">
            <h4 className="font-bold text-gray-900 text-base leading-tight mb-2 break-words">
              {card.subject}
            </h4>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {card.priority === 'high' && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant="outline" className={`text-xs font-semibold ${getPriorityColor(card.priority)}`}>
              {card.priority.toUpperCase()}
            </Badge>
          </div>
        </div>
        
        {/* Labels - More Prominent */}
        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {card.labels.slice(0, 3).map(label => (
              <Badge
                key={label}
                variant="secondary"
                className="text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200"
              >
                {label}
              </Badge>
            ))}
            {card.labels.length > 3 && (
              <Badge variant="outline" className="text-xs text-gray-500">
                +{card.labels.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Email Count and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {card.emails.length} email{card.emails.length !== 1 ? 's' : ''}
            </span>
            {unreadCount > 0 && (
              <Badge className="text-xs bg-blue-600 text-white font-semibold">
                {unreadCount} NEW
              </Badge>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {card.emails[0]?.timestamp}
          </span>
        </div>
      </div>

      {/* Email Preview */}
      <div className="p-4">
        {/* Email Previews - Show up to 3 emails */}
        <div className="space-y-3">
          {card.emails.slice(0, 3).map((email, index) => (
            <div key={email.id} className={`${index > 0 ? 'pt-3 border-t border-gray-100' : ''}`}>
              <div className="flex items-center justify-between mb-1 min-w-0">
                <span className={`text-sm font-semibold truncate flex-1 mr-2 ${email.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                  From: {email.from}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {email.timestamp}
                  </span>
                  {!email.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </div>
              <p className={`text-sm leading-relaxed line-clamp-2 break-words ${email.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                {email.preview}
              </p>
            </div>
          ))}
        </div>
        
        {/* Additional Emails Indicator */}
        {card.emails.length > 3 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                +{card.emails.length - 3} more emails
              </span>
              <span 
                className="text-xs text-purple-600 hover:text-purple-700 cursor-pointer font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick?.();
                }}
              >
                View all →
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 rounded-xl transition-all duration-200 pointer-events-none" />
    </div>
  );
};

export default EmailCard;
