// src/components/NotesApp.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Settings, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  Folder,
  FileText,
  Clock,
  Star,
  MoreVertical,
  Filter,
  SortAsc,
  Grid,
  List,
  Tag,
  Music,
  Image as ImageIcon,
  BookOpen,
  Home,
  Palette,
  Sync,
  Shield,
  User,
  Globe,
  Download,
  Upload
} from 'lucide-react';
import ThemeService from '../services/themeService.js';

const NotesApp = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Welcome to NoteVerse',
      content: 'This is your first note. Start writing your thoughts, ideas, and memories here.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: true,
      tags: ['welcome', 'getting-started'],
      category: 'general'
    },
    {
      id: 2,
      title: 'Project Ideas',
      content: '1. Build a task manager\n2. Create a recipe app\n3. Design a portfolio website\n4. Learn a new programming language',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      isFavorite: false,
      tags: ['ideas', 'projects'],
      category: 'work'
    },
    {
      id: 3,
      title: 'Travel Plans',
      content: 'Places to visit:\n- Paris, France\n- Tokyo, Japan\n- New York, USA\n- Barcelona, Spain',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      isFavorite: true,
      tags: ['travel', 'vacation'],
      category: 'travel'
    },
    {
      id: 4,
      title: 'Favorite Songs',
      content: 'Current playlist:\n- Bohemian Rhapsody by Queen\n- Hotel California by Eagles\n- Stairway to Heaven by Led Zeppelin',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 10800000).toISOString(),
      isFavorite: false,
      tags: ['music', 'playlist'],
      category: 'music'
    }
  ]);

  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [activeSettingsTab, setActiveSettingsTab] = useState('themes');
  const [settings, setSettings] = useState({
    theme: 'app-default',
    fontSize: 'medium',
    fontFamily: 'Proxima Nova',
    autoSync: true,
    syncInterval: 5,
    spotifyConnected: false,
    pinterestConnected: false,
    encryptNotes: false,
    shareAnalytics: true,
    loadImages: true,
    animations: true
  });

  const categories = ['all', 'music', 'travel', 'memories', 'ideas', 'work', 'general'];

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: "Untitled Note",
      content: "",
      category: "ideas",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      tags: []
    };
    setNotes([newNote, ...notes]);
    setEditingNote(newNote);
    setShowCreateModal(false);
  };

  const updateNote = (noteId, updates) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
    if (editingNote?.id === noteId) {
      setEditingNote(null);
    }
  };

  const toggleFavorite = (id) => {
    updateNote(id, { isFavorite: !notes.find(n => n.id === id).isFavorite });
  };

  const startEditing = () => {
    if (selectedNote) {
      setEditingNote({ ...selectedNote });
      setIsEditing(true);
    }
  };

  const saveNote = () => {
    if (editingNote) {
      updateNote(editingNote.id, editingNote);
      setSelectedNote(editingNote);
      setIsEditing(false);
      setEditingNote(null);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingNote(null);
  };

  const addTag = () => {
    if (newTag.trim() && editingNote) {
      const updatedNote = {
        ...editingNote,
        tags: [...editingNote.tags, newTag.trim().toLowerCase()]
      };
      setEditingNote(updatedNote);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const removeTag = (tagToRemove) => {
    if (editingNote) {
      const updatedNote = {
        ...editingNote,
        tags: editingNote.tags.filter(tag => tag !== tagToRemove)
      };
      setEditingNote(updatedNote);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-[#102542] hover:text-[#f87060] transition-colors">
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-[#f87060]" />
              <h1 className="text-xl font-bold text-[#102542]">Noteverse</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#f87060] hover:bg-[#e55a45] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Note</span>
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="text-gray-600 hover:text-[#f87060] transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060] focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f87060]">
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#f87060] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#f87060] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className={viewMode === 'grid' ? 'space-y-3' : 'space-y-2'}>
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedNote?.id === note.id 
                      ? 'bg-[#f87060]/10 border-2 border-[#f87060]' 
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-[#102542] truncate flex-1">{note.title}</h3>
                    <div className="flex items-center space-x-1 ml-2">
                      {note.category === 'music' && <Music className="w-4 h-4 text-[#f87060]" />}
                      {note.isFavorite && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(note.updatedAt)}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          +{note.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {selectedNote ? (
            <div className="flex-1 flex flex-col">
              {/* Note Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={isEditing ? (editingNote?.title || '') : selectedNote.title}
                    onChange={(e) => isEditing && setEditingNote(prev => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-bold text-[#102542] bg-transparent border-none outline-none"
                    readOnly={!isEditing}
                  />
                  <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">
                    {selectedNote.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={startEditing}
                      className="p-2 text-gray-600 hover:text-[#f87060] hover:bg-gray-100 rounded transition-colors"
                      title="Edit Note"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={saveNote}
                        className="p-2 text-[#f87060] hover:text-[#e55a45] hover:bg-[#f87060]/10 rounded transition-colors"
                        title="Save Note"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => toggleFavorite(selectedNote.id)}
                    className={`p-2 rounded transition-colors ${
                      selectedNote.isFavorite 
                        ? 'text-yellow-500 hover:bg-yellow-50' 
                        : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                    }`}
                    title="Toggle Favorite"
                  >
                    <Star className={`w-4 h-4 ${selectedNote.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="p-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Content */}
              <div className="flex-1 p-6">
                {isEditing ? (
                  <div className="space-y-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={editingNote?.category || 'general'}
                        onChange={(e) => setEditingNote(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060]"
                      >
                        <option value="general">General</option>
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="travel">Travel</option>
                        <option value="music">Music</option>
                        <option value="ideas">Ideas</option>
                        <option value="tasks">Tasks</option>
                      </select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {editingNote?.tags?.map(tag => (
                          <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      {showTagInput ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060]"
                            placeholder="Enter tag..."
                            autoFocus
                          />
                          <button
                            onClick={addTag}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowTagInput(false);
                              setNewTag('');
                            }}
                            className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowTagInput(true)}
                          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <Tag className="w-4 h-4" />
                          Add Tag
                        </button>
                      )}
                    </div>

                    {/* Content Textarea */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        value={editingNote?.content || ''}
                        onChange={(e) => setEditingNote(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060] resize-none"
                        placeholder="Start writing your note..."
                      />
                    </div>

                    {/* Integration Buttons */}
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <Music className="w-4 h-4" />
                        Add Spotify Track
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        <ImageIcon className="w-4 h-4" />
                        Add Pinterest Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div className="flex items-center gap-4 mb-4">
                      <h1 className="text-2xl font-bold text-[#102542]">{selectedNote.title}</h1>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {selectedNote.category}
                      </span>
                    </div>
                    {selectedNote.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedNote.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedNote.content || 'No content yet. Click Edit to start writing.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Note Tools */}
              <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-[#f87060] hover:bg-gray-100 rounded transition-colors">
                    <Music className="w-4 h-4" />
                    <span>Connect Spotify</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-[#f87060] hover:bg-gray-100 rounded transition-colors">
                    <ImageIcon className="w-4 h-4" />
                    <span>Add Image</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    Last saved: {formatDate(selectedNote.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Empty State
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No note selected</h3>
                <p className="text-gray-500 mb-6">Select a note from the sidebar or create a new one</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#f87060] hover:bg-[#e55a45] text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#102542]">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex h-[calc(90vh-80px)]">
              {/* Settings Sidebar */}
              <div className="w-64 bg-gray-50 p-4 border-r border-gray-200">
                <nav className="space-y-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg bg-[#f87060] text-white">
                    <Palette className="w-4 h-4" />
                    <span>Themes & Fonts</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-100">
                    <Sync className="w-4 h-4" />
                    <span>Syncing</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-100">
                    <Globe className="w-4 h-4" />
                    <span>Connected Apps</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-100">
                    <Shield className="w-4 h-4" />
                    <span>Permissions</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4" />
                    <span>Account</span>
                  </button>
                </nav>
              </div>

              {/* Settings Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-8">
                  {/* Themes Section */}
                  <div>
                    <h3 className="text-lg font-medium text-[#102542] mb-4">Choose Your Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'app-default', name: 'App Default', preview: 'bg-gradient-to-r from-[#102542] to-[#1a3a5c]' },
                        { id: 'dark-professional', name: 'Dark Professional', preview: 'bg-gradient-to-r from-[#0f172a] to-[#1e293b]' },
                        { id: 'cyberpunk', name: 'Cyberpunk', preview: 'bg-gradient-to-r from-[#0a0a0a] to-[#1a1a2e]' }
                      ].map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            try {
                              ThemeService.setTheme(theme.id);
                            } catch (error) {
                              console.error('Error setting theme:', error);
                            }
                          }}
                          className="p-4 border-2 rounded-lg transition-all hover:border-[#f87060]"
                        >
                          <div className={`w-full h-16 rounded mb-2 ${theme.preview}`}></div>
                          <p className="text-sm font-medium">{theme.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-[#102542] mb-4">Typography</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060]">
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                          <option value="xlarge">Extra Large</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060]">
                          <option value="Proxima Nova">Proxima Nova</option>
                          <option value="Inter">Inter</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Monaco">Monaco (Monospace)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Export/Import */}
                  <div>
                    <h3 className="text-lg font-medium text-[#102542] mb-4">Data Management</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => {
                          try {
                            const notes = JSON.parse(localStorage.getItem('noteverse_notes') || '[]');
                            const dataStr = JSON.stringify(notes, null, 2);
                            const dataBlob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(dataBlob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'noteverse-notes.json';
                            link.click();
                            URL.revokeObjectURL(url);
                          } catch (error) {
                            console.error('Error exporting notes:', error);
                            alert('Error exporting notes');
                          }
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f87060] text-white rounded-lg hover:bg-[#e55a45] transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Export Notes
                      </button>
                      <button 
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.json';
                          input.onchange = (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                try {
                                  const notes = JSON.parse(e.target.result);
                                  localStorage.setItem('noteverse_notes', JSON.stringify(notes));
                                  alert('Notes imported successfully!');
                                  window.location.reload();
                                } catch (error) {
                                  console.error('Error importing notes:', error);
                                  alert('Error importing notes');
                                }
                              };
                              reader.readAsText(file);
                            }
                          };
                          input.click();
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Import Notes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#102542] mb-4">Create New Note</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Enter note title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060]">
                  <option value="general">General</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="travel">Travel</option>
                  <option value="music">Music</option>
                  <option value="ideas">Ideas</option>
                  <option value="tasks">Tasks</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewNote}
                className="px-4 py-2 bg-[#f87060] text-white rounded-lg hover:bg-[#e55a45] transition-colors"
              >
                Create Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesApp;