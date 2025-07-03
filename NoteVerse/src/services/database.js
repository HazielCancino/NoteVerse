// src/services/database.js

class DatabaseService {
  constructor() {
    this.isElectron = typeof window !== 'undefined' && window.process?.type === 'renderer';
    this.storage = null;
  }

  async initialize() {
    try {
      if (this.isElectron) {
        // In Electron, we would use better-sqlite3
        // For now, fall back to localStorage for consistency
        console.log('Electron detected - using localStorage for now');
        return this.initializeWebStorage();
      } else {
        // For web version, use localStorage
        console.log('Web version - using localStorage');
        return this.initializeWebStorage();
      }
    } catch (error) {
      console.error('Database initialization failed:', error);
      return false;
    }
  }

  initializeWebStorage() {
    try {
      // Initialize localStorage with default data if empty
      if (!localStorage.getItem('noteverse_initialized')) {
        localStorage.setItem('noteverse_initialized', 'true');
        localStorage.setItem('noteverse_notes', JSON.stringify([]));
        localStorage.setItem('noteverse_settings', JSON.stringify({}));
        localStorage.setItem('noteverse_spotify_tracks', JSON.stringify([]));
        localStorage.setItem('noteverse_pinterest_images', JSON.stringify([]));
        localStorage.setItem('noteverse_sync_log', JSON.stringify([]));
      }
      
      this.storage = localStorage;
      console.log('Web storage initialized successfully');
      return true;
    } catch (error) {
      console.error('Web storage initialization failed:', error);
      return false;
    }
  }

  // CRUD Operations for Notes
  createNote(noteData) {
    try {
      const notes = this.getAllNotes();
      const newNote = {
        id: Date.now(),
        title: noteData.title,
        content: noteData.content || '',
        category: noteData.category || 'ideas',
        background_image: noteData.background_image || null,
        background_color: noteData.background_color || null,
        theme_settings: noteData.theme_settings || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sync_status: 'pending',
        device_id: this.getDeviceId(),
        version: 1
      };
      
      notes.unshift(newNote);
      this.storage.setItem('noteverse_notes', JSON.stringify(notes));
      
      // Log the action for sync
      this.logSyncAction(newNote.id, 'create', noteData);
      
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  getNoteById(id) {
    try {
      const notes = this.getAllNotes();
      const note = notes.find(n => n.id === id);
      
      if (note) {
        // Get associated Spotify tracks
        note.spotify_tracks = this.getSpotifyTracksByNoteId(id);
        // Get associated Pinterest images
        note.pinterest_images = this.getPinterestImagesByNoteId(id);
      }
      
      return note;
    } catch (error) {
      console.error('Error getting note:', error);
      return null;
    }
  }

  getAllNotes() {
    try {
      const notesJson = this.storage.getItem('noteverse_notes');
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('Error getting all notes:', error);
      return [];
    }
  }

  updateNote(id, updates) {
    try {
      const notes = this.getAllNotes();
      const noteIndex = notes.findIndex(n => n.id === id);
      
      if (noteIndex === -1) throw new Error('Note not found');

      const currentNote = notes[noteIndex];
      const updatedNote = {
        ...currentNote,
        ...updates,
        updated_at: new Date().toISOString(),
        sync_status: 'pending',
        version: currentNote.version + 1
      };

      notes[noteIndex] = updatedNote;
      this.storage.setItem('noteverse_notes', JSON.stringify(notes));

      // Log the action for sync
      this.logSyncAction(id, 'update', updates);
      
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  deleteNote(id) {
    try {
      const notes = this.getAllNotes();
      const filteredNotes = notes.filter(n => n.id !== id);
      this.storage.setItem('noteverse_notes', JSON.stringify(filteredNotes));

      // Log the action for sync
      this.logSyncAction(id, 'delete', { id });
      
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  // Spotify tracks operations
  addSpotifyTrack(noteId, trackData) {
    try {
      const tracks = this.getSpotifyTracks();
      const newTrack = {
        id: Date.now(),
        note_id: noteId,
        spotify_id: trackData.spotify_id,
        track_name: trackData.track_name,
        artist_name: trackData.artist_name,
        album_name: trackData.album_name,
        preview_url: trackData.preview_url,
        external_url: trackData.external_url,
        play_count: 0,
        added_at: new Date().toISOString()
      };
      
      tracks.push(newTrack);
      this.storage.setItem('noteverse_spotify_tracks', JSON.stringify(tracks));
      
      return newTrack;
    } catch (error) {
      console.error('Error adding Spotify track:', error);
      throw error;
    }
  }

  getSpotifyTracks() {
    try {
      const tracksJson = this.storage.getItem('noteverse_spotify_tracks');
      return tracksJson ? JSON.parse(tracksJson) : [];
    } catch (error) {
      console.error('Error getting Spotify tracks:', error);
      return [];
    }
  }

  getSpotifyTracksByNoteId(noteId) {
    const tracks = this.getSpotifyTracks();
    return tracks.filter(track => track.note_id === noteId);
  }

  // Pinterest images operations
  addPinterestImage(noteId, imageData) {
    try {
      const images = this.getPinterestImages();
      const newImage = {
        id: Date.now(),
        note_id: noteId,
        pinterest_id: imageData.pinterest_id,
        image_url: imageData.image_url,
        thumbnail_url: imageData.thumbnail_url,
        description: imageData.description,
        board_name: imageData.board_name,
        added_at: new Date().toISOString()
      };
      
      images.push(newImage);
      this.storage.setItem('noteverse_pinterest_images', JSON.stringify(images));
      
      return newImage;
    } catch (error) {
      console.error('Error adding Pinterest image:', error);
      throw error;
    }
  }

  getPinterestImages() {
    try {
      const imagesJson = this.storage.getItem('noteverse_pinterest_images');
      return imagesJson ? JSON.parse(imagesJson) : [];
    } catch (error) {
      console.error('Error getting Pinterest images:', error);
      return [];
    }
  }

  getPinterestImagesByNoteId(noteId) {
    const images = this.getPinterestImages();
    return images.filter(image => image.note_id === noteId);
  }

  // Sync operations
  logSyncAction(noteId, action, data) {
    try {
      const syncLog = this.getSyncLog();
      const logEntry = {
        id: Date.now(),
        note_id: noteId,
        action: action,
        device_id: this.getDeviceId(),
        timestamp: new Date().toISOString(),
        data_snapshot: JSON.stringify(data)
      };
      
      syncLog.push(logEntry);
      this.storage.setItem('noteverse_sync_log', JSON.stringify(syncLog));
    } catch (error) {
      console.error('Error logging sync action:', error);
    }
  }

  getSyncLog() {
    try {
      const logJson = this.storage.getItem('noteverse_sync_log');
      return logJson ? JSON.parse(logJson) : [];
    } catch (error) {
      console.error('Error getting sync log:', error);
      return [];
    }
  }

  getPendingSyncItems() {
    try {
      const notes = this.getAllNotes();
      return notes.filter(note => note.sync_status === 'pending');
    } catch (error) {
      console.error('Error getting pending sync items:', error);
      return [];
    }
  }

  markAsSynced(noteId) {
    try {
      const notes = this.getAllNotes();
      const noteIndex = notes.findIndex(n => n.id === noteId);
      
      if (noteIndex !== -1) {
        notes[noteIndex].sync_status = 'synced';
        this.storage.setItem('noteverse_notes', JSON.stringify(notes));
      }
    } catch (error) {
      console.error('Error marking note as synced:', error);
    }
  }

  getDeviceId() {
    let deviceId = this.storage.getItem('noteverse_device_id');
    if (!deviceId) {
      deviceId = 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      this.storage.setItem('noteverse_device_id', deviceId);
    }
    return deviceId;
  }

  // Settings operations
  getSetting(key) {
    try {
      const settingsJson = this.storage.getItem('noteverse_settings');
      const settings = settingsJson ? JSON.parse(settingsJson) : {};
      return settings[key];
    } catch (error) {
      console.error('Error getting setting:', error);
      return null;
    }
  }

  setSetting(key, value) {
    try {
      const settingsJson = this.storage.getItem('noteverse_settings');
      const settings = settingsJson ? JSON.parse(settingsJson) : {};
      settings[key] = value;
      this.storage.setItem('noteverse_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error setting setting:', error);
    }
  }

  close() {
    // No need to close localStorage
    console.log('Database service closed');
  }
}

// Create and export a singleton instance
const databaseService = new DatabaseService();
export default databaseService;