import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  BookOpen, 
  Settings, 
  Home,
  Music,
  Image as ImageIcon,
  Palette,
  Save,
  Trash2,
  Edit3
} from 'lucide-react';

const NotesApp = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "My Favorite Music 2025",
      content: "Artists I'm loving this year:\n• Tyler, The Creator\n• FKA twigs\n• Bad Bunny",
      category: "music",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      background: null,
      spotifyConnected: false
    },
    {
      id: 2,
      title: "Travel Bucket List",
      content: "Places I want to visit:\n• Japan in cherry blossom season\n• Northern Lights in Iceland\n• Bali temples",
      category: "travel",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      background: null,
      spotifyConnected: false
    }
  ]);

  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const categories = ['all', 'music', 'travel', 'memories', 'ideas', 'work'];

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
      background: null,
      spotifyConnected: false
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
              onClick={createNewNote}
              className="bg-[#f87060] hover:bg-[#e55a45] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Note</span>
            </button>
            <Link to="/settings" className="text-gray-600 hover:text-[#f87060] transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
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
                      {note.background && <ImageIcon className="w-4 h-4 text-[#f87060]" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
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
                    value={selectedNote.title}
                    onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                    className="text-2xl font-bold text-[#102542] bg-transparent border-none outline-none"
                  />
                  <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">
                    {selectedNote.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingNote(selectedNote)}
                    className="p-2 text-gray-600 hover:text-[#f87060] hover:bg-gray-100 rounded transition-colors"
                    title="Edit Note"
                  >
                    <Edit3 className="w-4 h-4" />
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
                <textarea
                  value={selectedNote.content}
                  onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                  placeholder="Start writing your thoughts..."
                  className="w-full h-full resize-none border-none outline-none text-gray-700 text-base leading-relaxed"
                />
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
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-[#f87060] hover:bg-gray-100 rounded transition-colors">
                    <Palette className="w-4 h-4" />
                    <span>Theme</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    Last saved: {new Date(selectedNote.updatedAt).toLocaleTimeString()}
                  </span>
                  <button className="flex items-center space-x-1 px-3 py-2 text-sm bg-[#f87060] text-white rounded hover:bg-[#e55a45] transition-colors">
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
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
                  onClick={createNewNote}
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
    </div>
  );
};

export default NotesApp;