
import React from 'react';
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

// Add interface for dragged email from inbox
interface DraggedEmail {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  labels: string[];
}

interface KanbanColumnProps {
  column: Column;
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
  colorOptions: ColorOption[];
  isDragging?: boolean;
  onColumnDragStart: (e: React.DragEvent) => void;
  onColumnDragEnd: () => void;
  canDragColumn: boolean;
  onEmailDragStart?: (e: React.DragEvent, email: DraggedEmail) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
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
  isDragging = false,
  onColumnDragStart,
  onColumnDragEnd,
  canDragColumn,
  onEmailDragStart
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Visual feedback for drop zone
    e.currentTarget.classList.add('bg-blue-50', 'border-blue-300');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Remove visual feedback
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
  };

  const handleDrop = (e: React.DragEvent) => {
    // Remove visual feedback
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
    onDrop(e);
  };

  return (
    <div 
      className={`min-w-80 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg transition-all duration-200 ${
        isDragging ? 'cursor-grabbing scale-105 shadow-xl' : 'cursor-grab hover:shadow-xl'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div 
        className="p-4 border-b border-gray-100"
        draggable={canDragColumn && !isEditing}
        onDragStart={canDragColumn ? onColumnDragStart : undefined}
        onDragEnd={canDragColumn ? onColumnDragEnd : undefined}
        style={{ cursor: canDragColumn && !isEditing ? 'grab' : 'default' }}
      >
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
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color}`} />
              {column.title}
              {isDragging && (
                <span className="text-xs text-gray-500 ml-2">Moving...</span>
              )}
            </h3>
            <div className="flex items-center gap-2">
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

      {/* Cards */}
      <div className="p-4 space-y-3 min-h-96">
        {column.cards.map(card => (
          <EmailCard
            key={card.id}
            card={card}
            onDragStart={(e) => {
              e.stopPropagation();
              onDragStart(e, card.id, column.id);
            }}
          />
        ))}
        
        {column.cards.length === 0 && (
          <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-4xl mb-2">📧</div>
            <p className="text-sm">Drop emails here</p>
            <p className="text-xs mt-1">Drag emails from inbox to create cards</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
