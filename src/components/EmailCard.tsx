
import React, { useState } from 'react';
import { Mail, Clock, AlertCircle, Edit2, Check, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  onDragStart?: (e: React.DragEvent) => void;
  onCardClick?: () => void;
  onDrop?: (e: React.DragEvent) => void;
  onCardUpdate?: (updatedCard: EmailCardData) => void;
  isNewCard?: boolean;
}

const EmailCard: React.FC<EmailCardProps> = ({ card, onDragStart, onCardClick, onDrop, onCardUpdate, isNewCard = false }) => {
  const [isEditing, setIsEditing] = useState(isNewCard);
  const [editedTitle, setEditedTitle] = useState(card.subject);
  const [editedPriority, setEditedPriority] = useState(card.priority);
  const [editedLabels, setEditedLabels] = useState(card.labels);
  const [newLabel, setNewLabel] = useState('');

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

  const handleSaveEdit = () => {
    if (onCardUpdate) {
      const updatedCard: EmailCardData = {
        ...card,
        subject: editedTitle.trim() || card.subject,
        priority: editedPriority,
        labels: editedLabels
      };
      onCardUpdate(updatedCard);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(card.subject);
    setEditedPriority(card.priority);
    setEditedLabels(card.labels);
    setNewLabel('');
    setIsEditing(false);
  };

  const handleAddLabel = () => {
    if (newLabel.trim() && !editedLabels.includes(newLabel.trim())) {
      setEditedLabels([...editedLabels, newLabel.trim()]);
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setEditedLabels(editedLabels.filter(label => label !== labelToRemove));
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      onCardClick?.();
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleCardClick}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${isEditing ? 'cursor-default' : 'cursor-grab active:cursor-grabbing hover:scale-[1.02]'} group w-full max-w-full overflow-hidden ${isEditing ? 'ring-2 ring-blue-400' : ''}`}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        {/* Edit Button - Top Right */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-2 min-w-0">
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="font-bold text-gray-900 text-base mb-2 border-0 p-0 focus:ring-0 focus:border-0"
                placeholder="Enter card title"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h4 className="font-bold text-gray-900 text-base leading-tight mb-2 break-words">
                {card.subject}
              </h4>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isEditing ? (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEdit();
                  }}
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEditClick}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Priority Selection */}
        <div className="flex items-center gap-2 mb-3">
          {isEditing ? (
            <Select value={editedPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setEditedPriority(value)}>
              <SelectTrigger className="w-32 h-7 text-xs" onClick={(e) => e.stopPropagation()}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-1">
              {card.priority === 'high' && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <Badge variant="outline" className={`text-xs font-semibold ${getPriorityColor(card.priority)}`}>
                {card.priority.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Labels */}
        <div className="mb-3">
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {editedLabels.map(label => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200 cursor-pointer group/label"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveLabel(label);
                    }}
                  >
                    {label}
                    <X className="h-2 w-2 ml-1 opacity-0 group-hover/label:opacity-100 transition-opacity" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-1">
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Add new tag"
                  className="h-6 text-xs flex-1"
                  onClick={(e) => e.stopPropagation()}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLabel();
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddLabel();
                  }}
                  className="h-6 w-6 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            editedLabels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {editedLabels.slice(0, 3).map(label => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200"
                  >
                    {label}
                  </Badge>
                ))}
                {editedLabels.length > 3 && (
                  <Badge variant="outline" className="text-xs text-gray-500">
                    +{editedLabels.length - 3}
                  </Badge>
                )}
              </div>
            )
          )}
        </div>

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


      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 rounded-xl transition-all duration-200 pointer-events-none" />
    </div>
  );
};

export default EmailCard;
