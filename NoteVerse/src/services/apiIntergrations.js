// src/services/apiIntegrations.js
import DatabaseService from './database.js';

class ApiIntegrations {
  constructor() {
    this.spotifyAccessToken = null;
    this.spotifyRefreshToken = null;
    this.pinterestAccessToken = null;
    
    // API endpoints and credentials
    this.spotifyClientId = process.env.VITE_SPOTIFY_CLIENT_ID || 'your-spotify-client-id';
    this.spotifyClientSecret = process.env.VITE_SPOTIFY_CLIENT_SECRET || 'your-spotify-client-secret';
    this.pinterestClientId = process.env.VITE_PINTEREST_CLIENT_ID || 'your-pinterest-client-id';
    
    // Load saved tokens
    this.loadTokens();
  }

  loadTokens() {
    this.spotifyAccessToken = DatabaseService.getSetting('spotify_access_token');
    this.spotifyRefreshToken = DatabaseService.getSetting('spotify_refresh_token');
    this.pinterestAccessToken = DatabaseService.getSetting('pinterest_access_token');
  }

  // SPOTIFY INTEGRATION
  async authenticateSpotify() {
    const clientId = this.spotifyClientId;
    const redirectUri = window.location.origin + '/callback/spotify';
    const scopes = [
      'user-read-recently-played',
      'user-top-read',
      'user-read-playback-state',
      'user-library-read',
      'playlist-read-private',
      'user-read-currently-playing',
      'user-read-playback-position'
    ].join(' ');

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `show_dialog=true`;

    // Open auth window
    const authWindow = window.open(authUrl, 'spotify-auth', 'width=600,height=800');
    
    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkClosed);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);

      window.addEventListener('message', (event) => {
        if (event.data.type === 'spotify-auth-success') {
          clearInterval(checkClosed);
          authWindow.close();
          this.handleSpotifyCallback(event.data.code)
            .then(resolve)
            .catch(reject);
        } else if (event.data.type === 'spotify-auth-error') {
          clearInterval(checkClosed);
          authWindow.close();
          reject(new Error(event.data.error));
        }
      });
    });
  }

  async handleSpotifyCallback(code) {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.spotifyClientId}:${this.spotifyClientSecret}`)}`
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(window.location.origin + '/callback/spotify')}`
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokens = await response.json();
      
      this.spotifyAccessToken = tokens.access_token;
      this.spotifyRefreshToken = tokens.refresh_token;
      
      // Save tokens
      DatabaseService.setSetting('spotify_access_token', this.spotifyAccessToken);
      DatabaseService.setSetting('spotify_refresh_token', this.spotifyRefreshToken);
      DatabaseService.setSetting('spotify_token_expires', Date.now() + (tokens.expires_in * 1000));
      
      return { success: true, accessToken: this.spotifyAccessToken };
    } catch (error) {
      console.error('Spotify authentication failed:', error);
      throw error;
    }
  }

  async refreshSpotifyToken() {
    if (!this.spotifyRefreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.spotifyClientId}:${this.spotifyClientSecret}`)}`
        },
        body: `grant_type=refresh_token&refresh_token=${this.spotifyRefreshToken}`
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const tokens = await response.json();
      this.spotifyAccessToken = tokens.access_token;
      
      DatabaseService.setSetting('spotify_access_token', this.spotifyAccessToken);
      DatabaseService.setSetting('spotify_token_expires', Date.now() + (tokens.expires_in * 1000));
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear invalid tokens
      this.clearSpotifyTokens();
      throw error;
    }
  }

  clearSpotifyTokens() {
    this.spotifyAccessToken = null;
    this.spotifyRefreshToken = null;
    DatabaseService.setSetting('spotify_access_token', null);
    DatabaseService.setSetting('spotify_refresh_token', null);
    DatabaseService.setSetting('spotify_token_expires', null);
  }

  async searchSpotifyTracks(query, limit = 20) {
    if (!this.spotifyAccessToken) {
      throw new Error('Spotify not authenticated');
    }

    try {
      const response = await this.makeSpotifyRequest(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`
      );

      return response.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        artists: track.artists.map(a => a.name),
        album: track.album.name,
        image: track.album.images[0]?.url,
        preview_url: track.preview_url,
        external_url: track.external_urls.spotify,
        duration_ms: track.duration_ms,
        popularity: track.popularity,
        release_date: track.album.release_date
      }));
    } catch (error) {
      console.error('Spotify search failed:', error);
      throw error;
    }
  }

  async getSpotifyUserStats() {
    if (!this.spotifyAccessToken) {
      throw new Error('Spotify not authenticated');
    }

    try {
      // Get user profile
      const profileResponse = await this.makeSpotifyRequest('https://api.spotify.com/v1/me');
      
      // Get top tracks (multiple time ranges)
      const [shortTermTracks, mediumTermTracks, longTermTracks] = await Promise.all([
        this.makeSpotifyRequest('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term'),
        this.makeSpotifyRequest('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term'),
        this.makeSpotifyRequest('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term')
      ]);

      // Get top artists
      const [shortTermArtists, mediumTermArtists, longTermArtists] = await Promise.all([
        this.makeSpotifyRequest('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term'),
        this.makeSpotifyRequest('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term'),
        this.makeSpotifyRequest('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term')
      ]);

      // Get recently played
      const recentResponse = await this.makeSpotifyRequest('https://api.spotify.com/v1/me/player/recently-played?limit=50');

      // Get current playback
      let currentlyPlaying = null;
      try {
        currentlyPlaying = await this.makeSpotifyRequest('https://api.spotify.com/v1/me/player/currently-playing');
      } catch (error) {
        console.log('No current playback or private session');
      }

      return {
        profile: profileResponse,
        topTracks: {
          short_term: shortTermTracks.items,
          medium_term: mediumTermTracks.items,
          long_term: longTermTracks.items
        },
        topArtists: {
          short_term: shortTermArtists.items,
          medium_term: mediumTermArtists.items,
          long_term: longTermArtists.items
        },
        recentTracks: recentResponse.items,
        currentlyPlaying: currentlyPlaying,
        stats: this.calculateListeningStats({
          shortTerm: shortTermTracks.items,
          mediumTerm: mediumTermTracks.items,
          longTerm: longTermTracks.items
        }, recentResponse.items)
      };
    } catch (error) {
      console.error('Failed to get Spotify stats:', error);
      throw error;
    }
  }

  calculateListeningStats(topTracks, recentTracks) {
    const genres = new Map();
    const artists = new Map();
    const decades = new Map();
    let totalListeningTime = 0;

    // Process all tracks
    const allTracks = [
      ...topTracks.shortTerm,
      ...topTracks.mediumTerm,
      ...topTracks.longTerm
    ];

    allTracks.forEach(track => {
      // Count genres (from artists)
      track.artists.forEach(artist => {
        if (artist.genres) {
          artist.genres.forEach(genre => {
            genres.set(genre, (genres.get(genre) || 0) + 1);
          });
        }
        artists.set(artist.name, (artists.get(artist.name) || 0) + 1);
      });

      // Calculate decades
      if (track.album.release_date) {
        const year = parseInt(track.album.release_date.substring(0, 4));
        const decade = `${Math.floor(year / 10) * 10}s`;
        decades.set(decade, (decades.get(decade) || 0) + 1);
      }

      totalListeningTime += track.duration_ms;
    });

    // Process recent tracks for listening patterns
    const listeningPatterns = this.analyzeListeningPatterns(recentTracks);

    return {
      topGenres: Array.from(genres.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      topArtists: Array.from(artists.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20),
      decadeDistribution: Array.from(decades.entries())
        .sort((a, b) => b[1] - a[1]),
      totalListeningTime: Math.round(totalListeningTime / 1000 / 60), // minutes
      listeningPatterns,
      averagePopularity: allTracks.reduce((sum, track) => sum + track.popularity, 0) / allTracks.length,
      uniqueTracks: allTracks.length,
      diversityScore: this.calculateDiversityScore(genres, artists)
    };
  }

  analyzeListeningPatterns(recentTracks) {
    const hourlyPattern = new Array(24).fill(0);
    const dailyPattern = new Array(7).fill(0);
    const monthlyPattern = new Array(12).fill(0);

    recentTracks.forEach(item => {
      const playedAt = new Date(item.played_at);
      hourlyPattern[playedAt.getHours()]++;
      dailyPattern[playedAt.getDay()]++;
      monthlyPattern[playedAt.getMonth()]++;
    });

    return {
      hourly: hourlyPattern,
      daily: dailyPattern,
      monthly: monthlyPattern,
      peakHour: hourlyPattern.indexOf(Math.max(...hourlyPattern)),
      peakDay: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
        dailyPattern.indexOf(Math.max(...dailyPattern))
      ]
    };
  }

  calculateDiversityScore(genres, artists) {
    // Simple diversity calculation based on distribution
    const genreCount = genres.size;
    const artistCount = artists.size;
    const genreEntropy = this.calculateEntropy(Array.from(genres.values()));
    const artistEntropy = this.calculateEntropy(Array.from(artists.values()));
    
    return Math.round((genreEntropy + artistEntropy) * 10) / 10;
  }

  calculateEntropy(values) {
    const total = values.reduce((sum, val) => sum + val, 0);
    return -values.reduce((entropy, val) => {
      const p = val / total;
      return entropy + (p > 0 ? p * Math.log2(p) : 0);
    }, 0);
  }

  async makeSpotifyRequest(url) {
    if (!this.spotifyAccessToken) {
      throw new Error('No access token available');
    }

    // Check if token is expired
    const tokenExpires = DatabaseService.getSetting('spotify_token_expires');
    if (tokenExpires && Date.now() >= tokenExpires) {
      await this.refreshSpotifyToken();
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.spotifyAccessToken}`
      }
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      await this.refreshSpotifyToken();
      return this.makeSpotifyRequest(url);
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // PINTEREST INTEGRATION
  async authenticatePinterest() {
    const clientId = this.pinterestClientId;
    const redirectUri = window.location.origin + '/callback/pinterest';
    const scopes = ['boards:read', 'pins:read', 'user_accounts:read'].join(',');

    const authUrl = `https://www.pinterest.com/oauth/?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${scopes}`;

    const authWindow = window.open(authUrl, 'pinterest-auth', 'width=600,height=800');
    
    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkClosed);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);

      window.addEventListener('message', (event) => {
        if (event.data.type === 'pinterest-auth-success') {
          clearInterval(checkClosed);
          authWindow.close();
          this.handlePinterestCallback(event.data.code)
            .then(resolve)
            .catch(reject);
        }
      });
    });
  }

  async handlePinterestCallback(code) {
    try {
      // Note: Pinterest token exchange needs to be done server-side for security
      // This is a simplified version - in production, send code to your backend
      const response = await fetch('/api/pinterest/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const tokens = await response.json();
      this.pinterestAccessToken = tokens.access_token;
      
      DatabaseService.setSetting('pinterest_access_token', this.pinterestAccessToken);
      
      return { success: true, accessToken: this.pinterestAccessToken };
    } catch (error) {
      console.error('Pinterest authentication failed:', error);
      throw error;
    }
  }

  async searchPinterestImages(query, limit = 25) {
    if (!this.pinterestAccessToken) {
      throw new Error('Pinterest not authenticated');
    }

    try {
      // Note: Pinterest API v5 has limited search capabilities
      // This is a simplified implementation
      const response = await fetch(
        `https://api.pinterest.com/v5/search/pins?query=${encodeURIComponent(query)}&page_size=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.pinterestAccessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Pinterest API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.items.map(pin => ({
        id: pin.id,
        title: pin.title,
        description: pin.description,
        image_url: pin.media?.images?.['736x']?.url || pin.media?.images?.original?.url,
        thumbnail_url: pin.media?.images?.['236x']?.url,
        link: pin.link,
        board_name: pin.board?.name,
        creator: pin.creator?.username,
        created_at: pin.created_at,
        note: pin.note
      }));
    } catch (error) {
      console.error('Pinterest search failed:', error);
      throw error;
    }
  }

  async getUserPinterestBoards() {
    if (!this.pinterestAccessToken) {
      throw new Error('Pinterest not authenticated');
    }

    try {
      const response = await fetch(
        'https://api.pinterest.com/v5/boards?page_size=100',
        {
          headers: {
            'Authorization': `Bearer ${this.pinterestAccessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Pinterest API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.items.map(board => ({
        id: board.id,
        name: board.name,
        description: board.description,
        pin_count: board.pin_count,
        follower_count: board.follower_count,
        created_at: board.created_at,
        privacy: board.privacy
      }));
    } catch (error) {
      console.error('Failed to get Pinterest boards:', error);
      throw error;
    }
  }

  // NOTE INTEGRATION METHODS
  async addSpotifyTrackToNote(noteId, trackData) {
    try {
      await DatabaseService.addSpotifyTrack(noteId, {
        spotify_id: trackData.id,
        track_name: trackData.name,
        artist_name: trackData.artist,
        album_name: trackData.album,
        preview_url: trackData.preview_url,
        external_url: trackData.external_url
      });

      // Update note to mark as modified
      const note = DatabaseService.getNoteById(noteId);
      if (note) {
        DatabaseService.updateNote(noteId, {
          updated_at: new Date().toISOString(),
          sync_status: 'pending'
        });
      }

      return true;
    } catch (error) {
      console.error('Error adding Spotify track to note:', error);
      throw error;
    }
  }

  async addPinterestImageToNote(noteId, imageData) {
    try {
      await DatabaseService.addPinterestImage(noteId, {
        pinterest_id: imageData.id,
        image_url: imageData.image_url,
        thumbnail_url: imageData.thumbnail_url,
        description: imageData.description || imageData.title,
        board_name: imageData.board_name
      });

      // Update note to mark as modified
      const note = DatabaseService.getNoteById(noteId);
      if (note) {
        DatabaseService.updateNote(noteId, {
          updated_at: new Date().toISOString(),
          sync_status: 'pending'
        });
      }

      return true;
    } catch (error) {
      console.error('Error adding Pinterest image to note:', error);
      throw error;
    }
  }

  // AUTHENTICATION STATUS
  isSpotifyAuthenticated() {
    return !!this.spotifyAccessToken;
  }

  isPinterestAuthenticated() {
    return !!this.pinterestAccessToken;
  }

  getAuthenticationStatus() {
    return {
      spotify: this.isSpotifyAuthenticated(),
      pinterest: this.isPinterestAuthenticated(),
      tokens_loaded: true
    };
  }

  // CLEANUP
  disconnectSpotify() {
    this.clearSpotifyTokens();
    return true;
  }

  disconnectPinterest() {
    this.pinterestAccessToken = null;
    DatabaseService.setSetting('pinterest_access_token', null);
    return true;
  }

  disconnectAll() {
    this.disconnectSpotify();
    this.disconnectPinterest();
    return true;
  }
}

export default new ApiIntegrations();