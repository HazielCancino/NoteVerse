// src/services/syncService.js
import DatabaseService from './database.js';

class SyncService {
  constructor() {
    this.syncEndpoint = 'https://your-api-endpoint.com/api'; // You'll replace this
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.conflictResolutionStrategy = 'latest_wins'; // 'latest_wins', 'manual', 'merge'
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncWhenOnline();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async initialize() {
    // Set up periodic sync (every 5 minutes when online)
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.performSync();
      }
    }, 5 * 60 * 1000);

    // Initial sync attempt
    if (this.isOnline) {
      await this.performSync();
    }
  }

  async performSync() {
    if (this.syncInProgress) {
      console.log('Sync already in progress');
      return;
    }

    this.syncInProgress = true;
    console.log('Starting sync...');

    try {
      // Step 1: Push local changes to server
      await this.pushLocalChanges();
      
      // Step 2: Pull remote changes from server
      await this.pullRemoteChanges();
      
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  async pushLocalChanges() {
    const pendingItems = DatabaseService.getPendingSyncItems();
    
    if (pendingItems.length === 0) {
      console.log('No local changes to push');
      return;
    }

    console.log(`Pushing ${pendingItems.length} local changes...`);

    for (const item of pendingItems) {
      try {
        const response = await this.makeApiRequest('POST', '/notes/sync', {
          note: item,
          device_id: DatabaseService.getDeviceId(),
          timestamp: new Date().toISOString()
        });

        if (response.success) {
          DatabaseService.markAsSynced(item.id);
          console.log(`Synced note ${item.id}`);
        } else {
          console.error(`Failed to sync note ${item.id}:`, response.error);
          // Handle conflicts here
          if (response.conflict) {
            await this.handleConflict(item, response.remoteNote);
          }
        }
      } catch (error) {
        console.error(`Error syncing note ${item.id}:`, error);
      }
    }
  }

  async pullRemoteChanges() {
    try {
      const lastSyncTime = DatabaseService.getSetting('lastSyncTime') || '1970-01-01T00:00:00Z';
      
      const response = await this.makeApiRequest('GET', `/notes/changes?since=${lastSyncTime}&device_id=${DatabaseService.getDeviceId()}`);
      
      if (response.success && response.changes.length > 0) {
        console.log(`Pulling ${response.changes.length} remote changes...`);
        
        for (const change of response.changes) {
          await this.applyRemoteChange(change);
        }
        
        // Update last sync time
        DatabaseService.setSetting('lastSyncTime', new Date().toISOString());
      }
    } catch (error) {
      console.error('Error pulling remote changes:', error);
    }
  }

  async applyRemoteChange(change) {
    const { action, note, timestamp } = change;
    
    try {
      switch (action) {
        case 'create':
          // Check if note already exists locally
          const existingNote = DatabaseService.getNoteById(note.id);
          if (!existingNote) {
            DatabaseService.createNote({
              ...note,
              sync_status: 'synced'
            });
            console.log(`Created note ${note.id} from remote`);
          } else {
            // Handle conflict
            await this.handleConflict(existingNote, note);
          }
          break;
          
        case 'update':
          const localNote = DatabaseService.getNoteById(note.id);
          if (localNote) {
            // Check for conflicts
            if (localNote.updated_at > timestamp && localNote.sync_status === 'pending') {
              await this.handleConflict(localNote, note);
            } else {
              DatabaseService.updateNote(note.id, {
                ...note,
                sync_status: 'synced'
              });
              console.log(`Updated note ${note.id} from remote`);
            }
          } else {
            // Note doesn't exist locally, create it
            DatabaseService.createNote({
              ...note,
              sync_status: 'synced'
            });
          }
          break;
          
        case 'delete':
          const noteToDelete = DatabaseService.getNoteById(note.id);
          if (noteToDelete) {
            DatabaseService.deleteNote(note.id);
            console.log(`Deleted note ${note.id} from remote`);
          }
          break;
      }
    } catch (error) {
      console.error(`Error applying remote change for note ${note.id}:`, error);
    }
  }

  async handleConflict(localNote, remoteNote) {
    console.log(`Conflict detected for note ${localNote.id}`);
    
    switch (this.conflictResolutionStrategy) {
      case 'latest_wins':
        if (new Date(remoteNote.updated_at) > new Date(localNote.updated_at)) {
          DatabaseService.updateNote(localNote.id, {
            ...remoteNote,
            sync_status: 'synced'
          });
          console.log(`Resolved conflict: remote version won for note ${localNote.id}`);
        } else {
          // Keep local version, it will be pushed in next sync
          console.log(`Resolved conflict: local version won for note ${localNote.id}`);
        }
        break;
        
      case 'manual':
        // Store both versions and let user decide
        await this.storeConflictForManualResolution(localNote, remoteNote);
        break;
        
      case 'merge':
        // Attempt to merge content intelligently
        const mergedNote = await this.mergeNotes(localNote, remoteNote);
        DatabaseService.updateNote(localNote.id, mergedNote);
        break;
    }
  }

  async storeConflictForManualResolution(localNote, remoteNote) {
    // Create a conflict record that the UI can display to the user
    const conflictData = {
      note_id: localNote.id,
      local_version: localNote,
      remote_version: remoteNote,
      created_at: new Date().toISOString(),
      resolved: false
    };
    
    DatabaseService.setSetting(`conflict_${localNote.id}`, conflictData);
    
    // Trigger UI notification about conflict
    this.notifyConflict(conflictData);
  }

  async mergeNotes(localNote, remoteNote) {
    // Simple merge strategy: combine content if different
    let mergedContent = localNote.content;
    
    if (localNote.content !== remoteNote.content) {
      mergedContent = `${localNote.content}\n\n--- MERGED FROM OTHER DEVICE ---\n${remoteNote.content}`;
    }
    
    return {
      ...localNote,
      content: mergedContent,
      title: remoteNote.updated_at > localNote.updated_at ? remoteNote.title : localNote.title,
      sync_status: 'synced'
    };
  }

  notifyConflict(conflictData) {
    // Emit custom event that the UI can listen to
    window.dispatchEvent(new CustomEvent('sync-conflict', {
      detail: conflictData
    }));
  }

  async makeApiRequest(method, endpoint, data = null) {
    const url = `${this.syncEndpoint}${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      // If we're offline, queue the request for later
      if (!this.isOnline) {
        await this.queueOfflineRequest(method, endpoint, data);
      }
      throw error;
    }
  }

  async queueOfflineRequest(method, endpoint, data) {
    const queuedRequests = DatabaseService.getSetting('queuedRequests') || [];
    
    queuedRequests.push({
      method,
      endpoint,
      data,
      timestamp: new Date().toISOString()
    });
    
    DatabaseService.setSetting('queuedRequests', queuedRequests);
  }

  async processQueuedRequests() {
    const queuedRequests = DatabaseService.getSetting('queuedRequests') || [];
    
    if (queuedRequests.length === 0) return;
    
    console.log(`Processing ${queuedRequests.length} queued requests...`);
    
    for (const request of queuedRequests) {
      try {
        await this.makeApiRequest(request.method, request.endpoint, request.data);
      } catch (error) {
        console.error('Error processing queued request:', error);
        // Keep failed requests in queue for retry
        continue;
      }
    }
    
    // Clear processed requests
    DatabaseService.setSetting('queuedRequests', []);
  }

  getAuthToken() {
    // In a real app, you'd implement proper authentication
    return DatabaseService.getSetting('authToken') || 'demo-token';
  }

  syncWhenOnline() {
    if (this.isOnline && !this.syncInProgress) {
      // Process any queued requests first
      this.processQueuedRequests();
      // Then perform normal sync
      this.performSync();
    }
  }

  // Manual sync trigger
  async forcSync() {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    
    return await this.performSync();
  }

  // Get sync status
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      pendingItems: DatabaseService.getPendingSyncItems().length,
      queuedRequests: (DatabaseService.getSetting('queuedRequests') || []).length,
      lastSync: DatabaseService.getSetting('lastSyncTime')
    };
  }
}

export default new SyncService();