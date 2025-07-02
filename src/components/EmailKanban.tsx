
import React, { useState } from 'react';
import { Mail, Plus, Search, Filter, Calendar, Edit2, Check, X } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import GmailConnect from './GmailConnect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmailData } from '@/services/gmailService';

interface EmailCard {
  id: string;
  subject: string;
  emails: {
    id: string;
    from: string;
    preview: string;
    timestamp: string;
    isRead: boolean;
  }[];
  priority: 'low' | 'medium' | 'high';
  labels: string[];
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

const EmailKanban = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingColor, setEditingColor] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnColor, setNewColumnColor] = useState('from-gray-500 to-gray-600');
  const [showGmailDialog, setShowGmailDialog] = useState(false);
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);

  const [columns, setColumns] = useState([
    {
      id: 'inbox',
      title: 'Inbox',
      color: 'from-blue-500 to-cyan-500',
      cards: []
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'from-yellow-500 to-orange-500',
      cards: []
    },
    {
      id: 'waiting',
      title: 'Waiting for Reply',
      color: 'from-purple-500 to-pink-500',
      cards: []
    },
    {
      id: 'done',
      title: 'Completed',
      color: 'from-green-500 to-emerald-500',
      cards: []
    }
  ]);

  const colorOptions = [
    { name: 'Blue', value: 'from-blue-500 to-cyan-500' },
    { name: 'Yellow', value: 'from-yellow-500 to-orange-500' },
    { name: 'Purple', value: 'from-purple-500 to-pink-500' },
    { name: 'Green', value: 'from-green-500 to-emerald-500' },
    { name: 'Red', value: 'from-red-500 to-rose-500' },
    { name: 'Indigo', value: 'from-indigo-500 to-purple-500' },
    { name: 'Teal', value: 'from-teal-500 to-cyan-500' },
    { name: 'Gray', value: 'from-gray-500 to-gray-600' }
  ];

  const handleGmailEmailsLoaded = (gmailEmails: EmailData[]) => {
    // Convert Gmail emails to EmailCard format
    const emailCards: EmailCard[] = gmailEmails.map(email => ({
      id: email.id,
      subject: email.subject,
      emails: [{
        id: email.id,
        from: email.from,
        preview: email.preview,
        timestamp: email.timestamp,
        isRead: email.isRead
      }],
      priority: 'medium' as const,
      labels: email.labels.filter(label => !['INBOX', 'UNREAD', 'IMPORTANT'].includes(label))
    }));

    // Add all Gmail emails to the inbox column
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.id === 'inbox' 
          ? { ...col, cards: [...col.cards, ...emailCards] }
          : col
      )
    );

    setShowGmailDialog(false);
  };

  const handleDragStart = (e: React.DragEvent, cardId: string, sourceColumnId: string) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('sourceColumnId', sourceColumnId);
  };

  // Handle email drag from inbox
  const handleEmailDragStart = (e: React.DragEvent, email: DraggedEmail) => {
    console.log('Email drag started:', email);
    e.dataTransfer.setData('emailData', JSON.stringify(email));
    e.dataTransfer.setData('dragType', 'email');
  };

  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    e.dataTransfer.setData('columnId', columnId);
    setDraggedColumnId(columnId);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumnId(null);
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn = {
        id: `column-${Date.now()}`,
        title: newColumnTitle,
        color: newColumnColor,
        cards: []
      };
      setColumns([...columns, newColumn]);
      setNewColumnTitle('');
      setNewColumnColor('from-gray-500 to-gray-600');
      setIsAddingColumn(false);
    }
  };

  const handleEditColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (column) {
      setEditingColumnId(columnId);
      setEditingTitle(column.title);
      setEditingColor(column.color);
    }
  };

  const handleSaveEdit = () => {
    if (editingTitle.trim()) {
      setColumns(columns.map(col => 
        col.id === editingColumnId 
          ? { ...col, title: editingTitle, color: editingColor }
          : col
      ));
      setEditingColumnId(null);
      setEditingTitle('');
      setEditingColor('');
    }
  };

  const handleCancelEdit = () => {
    setEditingColumnId(null);
    setEditingTitle('');
    setEditingColor('');
  };

  const handleCancelAdd = () => {
    setIsAddingColumn(false);
    setNewColumnTitle('');
    setNewColumnColor('from-gray-500 to-gray-600');
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId));
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    const dragType = e.dataTransfer.getData('dragType');
    
    if (dragType === 'email') {
      // Handle email drop from inbox
      const emailDataString = e.dataTransfer.getData('emailData');
      if (emailDataString) {
        const email: DraggedEmail = JSON.parse(emailDataString);
        console.log('Email dropped into column:', targetColumnId, email);
        
        setColumns(prevColumns => {
          const newColumns = [...prevColumns];
          const targetColumn = newColumns.find(col => col.id === targetColumnId);
          
          if (targetColumn) {
            // Check if a card with the same subject already exists
            const existingCard = targetColumn.cards.find(card => 
              card.subject.toLowerCase().trim() === email.subject.toLowerCase().trim()
            );
            
            if (existingCard) {
              // Add email to existing card if not already present
              const emailExists = existingCard.emails.some(e => e.id === email.id);
              if (!emailExists) {
                existingCard.emails.push({
                  id: email.id,
                  from: email.from,
                  preview: email.preview,
                  timestamp: email.timestamp,
                  isRead: email.isRead
                });
                console.log('Added email to existing card:', existingCard.subject);
              }
            } else {
              // Create new card
              const newCard: EmailCard = {
                id: `card-${Date.now()}-${email.id}`,
                subject: email.subject,
                emails: [{
                  id: email.id,
                  from: email.from,
                  preview: email.preview,
                  timestamp: email.timestamp,
                  isRead: email.isRead
                }],
                priority: 'medium',
                labels: email.labels.filter(label => !['INBOX', 'UNREAD', 'IMPORTANT'].includes(label))
              };
              targetColumn.cards.push(newCard);
              console.log('Created new card:', newCard.subject);
            }
          }
          
          return newColumns;
        });
      }
    } else {
      // Handle card movement between columns
      const cardId = e.dataTransfer.getData('cardId');
      const sourceColumnId = e.dataTransfer.getData('sourceColumnId');

      if (sourceColumnId === targetColumnId) return;

      setColumns(prevColumns => {
        const newColumns = [...prevColumns];
        const sourceColumn = newColumns.find(col => col.id === sourceColumnId);
        const targetColumn = newColumns.find(col => col.id === targetColumnId);
        
        if (sourceColumn && targetColumn) {
          const cardIndex = sourceColumn.cards.findIndex(card => card.id === cardId);
          if (cardIndex !== -1) {
            const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);
            targetColumn.cards.push(movedCard);
          }
        }
        
        return newColumns;
      });
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Email Management Studio
          </h1>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 border-gray-200 focus:border-purple-300"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Dialog open={showGmailDialog} onOpenChange={setShowGmailDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-red-50 border-red-200 text-red-600 hover:bg-red-100">
                  <Mail className="h-4 w-4" />
                  Import Gmail
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Connect Gmail Account</DialogTitle>
                </DialogHeader>
                <GmailConnect onEmailsLoaded={handleGmailEmailsLoaded} />
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Today
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="h-4 w-4" />
              Compose
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            onDragStart={handleDragStart}
            onDrop={(e) => handleDrop(e, column.id)}
            onEdit={() => handleEditColumn(column.id)}
            onDelete={() => handleDeleteColumn(column.id)}
            isEditing={editingColumnId === column.id}
            editingTitle={editingTitle}
            editingColor={editingColor}
            onTitleChange={setEditingTitle}
            onColorChange={setEditingColor}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            colorOptions={colorOptions}
            isDragging={draggedColumnId === column.id}
            onColumnDragStart={(e) => handleColumnDragStart(e, column.id)}
            onColumnDragEnd={handleColumnDragEnd}
            canDragColumn={true}
            onEmailDragStart={handleEmailDragStart}
          />
        ))}
        
        {/* Add New Column */}
        {isAddingColumn ? (
          <div className="min-w-80 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="p-4">
              <div className="space-y-4">
                <Input
                  placeholder="Column title"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  className="bg-white/80"
                  autoFocus
                />
                
                {/* Color Picker */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewColumnColor(color.value)}
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${color.value} border-2 ${
                          newColumnColor === color.value ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleAddColumn} size="sm" className="flex-1">
                    <Check className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                  <Button onClick={handleCancelAdd} variant="outline" size="sm" className="flex-1">
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingColumn(true)}
            className="min-w-80 h-32 bg-white/30 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center group"
          >
            <div className="text-center">
              <Plus className="h-8 w-8 text-gray-400 group-hover:text-gray-600 mx-auto mb-2" />
              <span className="text-gray-500 group-hover:text-gray-700 font-medium">Add Column</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailKanban;
