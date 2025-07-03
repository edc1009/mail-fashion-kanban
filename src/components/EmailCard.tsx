
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
}

const EmailCard: React.FC<EmailCardProps> = ({ card, onDragStart, onCardClick }) => {
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

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onCardClick}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-[1.02] group"
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-gray-800 text-sm leading-tight">
            {card.subject}
          </h4>
          {card.priority === 'high' && (
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 ml-2" />
          )}
        </div>
        
        {/* Labels */}
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map(label => (
            <Badge
              key={label}
              variant="secondary"
              className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              {label}
            </Badge>
          ))}
        </div>

        {/* Email Count and Priority */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              {card.emails.length} email{card.emails.length !== 1 ? 's' : ''}
            </span>
            {unreadCount > 0 && (
              <Badge className="text-xs bg-blue-500 text-white">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Badge variant="outline" className={`text-xs ${getPriorityColor(card.priority)}`}>
            {card.priority}
          </Badge>
        </div>
      </div>

      {/* Email List */}
      <div className="p-4 space-y-3">
        {card.emails.slice(0, 2).map((email, index) => (
          <div key={email.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${email.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                {email.from}
              </span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">{email.timestamp}</span>
              </div>
            </div>
            <p className={`text-xs leading-relaxed ${email.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
              {email.preview}
            </p>
            {index < card.emails.slice(0, 2).length - 1 && (
              <hr className="border-gray-100 my-2" />
            )}
          </div>
        ))}
        
        {card.emails.length > 2 && (
          <div className="text-center pt-2 border-t border-gray-100">
            <span 
              className="text-xs text-purple-600 hover:text-purple-700 cursor-pointer font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onCardClick?.();
              }}
            >
              +{card.emails.length - 2} more emails - Click to expand
            </span>
          </div>
        )}
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 rounded-xl transition-all duration-200 pointer-events-none" />
    </div>
  );
};

export default EmailCard;
