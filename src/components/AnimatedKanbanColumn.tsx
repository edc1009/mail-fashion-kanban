import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Check, X, Trash2 } from 'lucide-react';
import EmailCard from './EmailCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

interface Column {
  id: string;
  title: string;
  color: string;
  cards: EmailCardData[];
}

interface ColorOption {
  name: string;
  value: string;
}

interface AnimatedKanbanColumnProps {
  column: Column;
  index: number;
  onDragStart: (e: React.DragEvent, cardId: string, sourceColumnId: string) => void;
  onDrop: (e: React.DragEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  editingTitle: string;
  editingColor: string;
  onTitleChange: (title: string) => void;
  onColorChange: (color: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  colorOptions: { name: string; value: string }[];
  onCardClick?: (card: EmailCardData) => void;
  onEmailToCard?: (e: React.DragEvent, targetCardId: string) => void;
}

const AnimatedKanbanColumn: React.FC<AnimatedKanbanColumnProps> = ({ 
  column, 
  index,
  onDragStart, 
  onDrop, 
  onEdit, 
  onDelete, 
  isEditing, 
  editingTitle, 
  editingColor, 
  onTitleChange, 
  onColorChange, 
  onSaveEdit, 
  onCancelEdit, 
  colorOptions,
  onCardClick,
  onEmailToCard
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Check if we have card or email data being dragged
    const hasCardData = e.dataTransfer.types.includes('cardid') || e.dataTransfer.types.includes('emaildata');
    if (hasCardData) {
      // Visual feedback for drop zone
      e.currentTarget.classList.add('bg-blue-50', 'border-blue-300');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Remove visual feedback
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove visual feedback
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
    onDrop(e);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: 0
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        layout: { duration: 0.3 }
      }}
      className="w-full h-full bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg transition-all duration-200 hover:shadow-xl flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header - Fixed */}
      <div className="p-4 border-b border-gray-100 flex-shrink-0 sticky top-0 bg-white/80 backdrop-blur-sm z-10 rounded-t-2xl">
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${editingColor}`} />
              <Input
                value={editingTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                className="flex-1 h-8 text-sm"
                autoFocus
              />
            </div>
            
            {/* Color Picker */}
            <div className="grid grid-cols-4 gap-1">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onColorChange(color.value)}
                  className={`w-6 h-6 rounded-full bg-gradient-to-r ${color.value} border-2 ${
                    editingColor === color.value ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
            
            <div className="flex gap-1">
              <Button onClick={onSaveEdit} size="sm" className="flex-1 h-7 text-xs">
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button onClick={onCancelEdit} variant="outline" size="sm" className="flex-1 h-7 text-xs">
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button 
                onClick={onDelete} 
                variant="destructive" 
                size="sm" 
                className="h-7 text-xs px-2"
                title="Delete column"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 truncate">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color} flex-shrink-0`} />
              <span className="truncate">{column.title}</span>
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                {column.cards.length}
              </span>
              <button
                onClick={onEdit}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Edit column"
              >
                <Edit2 className="h-3 w-3 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cards - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {column.cards.map((card, cardIndex) => (
          <motion.div
            key={card.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              delay: cardIndex * 0.1,
              layout: { duration: 0.2 }
            }}
          >
            <EmailCard
              card={card}
              onDragStart={(e) => {
                e.stopPropagation();
                onDragStart(e, card.id, column.id);
              }}
              onCardClick={() => onCardClick?.(card)}
              onDrop={onEmailToCard ? (e) => onEmailToCard(e, card.id) : undefined}
            />
          </motion.div>
        ))}
        
        {column.cards.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-lg"
          >
            <div className="text-4xl mb-2">📧</div>
            <p className="text-sm">Drop emails here</p>
            <p className="text-xs mt-1">Drag emails from inbox to create cards</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AnimatedKanbanColumn;