import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Palette, 
  Monitor, 
  Smartphone, 
  Sync, 
  Music, 
  Image as ImageIcon,
  Shield,
  Database,
  Globe,
  Save,
  Download,
  Upload,
  Trash2,
  Settings as SettingsIcon
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState({
    // Appearance
    theme: 'system', // 'light', 'dark', 'system'
    accentColor: '#f87060',
    fontSize: 'medium',
    fontFamily: 'Proxima Nova',
    noteBackground: 'default',
    
    // Sync & Storage
    autoSync: true,
    syncInterval: 5, // minutes
    offlineMode: true,
    localBackup: true,
    
    // Integrations
    spotifyConnected: false,
    pinterestConnected: false,
    
    // Privacy
    encryptNotes: false,
    shareAnalytics: true,
    
    // Performance
    loadImages: true,
    animations: true,
    soundEffects: false
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const themes = [
    { id: 'light', name: 'Light', preview: 'bg-white border-gray-300' },
    { id: 'dark', name: 'Dark', preview: 'bg-gray-900 border-gray-700' },
    { id: 'system', name: 'System', preview: 'bg-gradient-to-r from-white to-gray-900' }
  ];

  const accentColors = [
    '#f87060', '#3b82f6', '#10b981', '#f59e0b', 
    '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'
  ];

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'sync', name: 'Sync & Storage', icon: <Sync className="w-4 h-4" /> },
    { id: 'integrations', name: 'Integrations', icon: <Globe className="w-4 h-4" /> },
    { id: 'privacy', name: 'Privacy & Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'advanced', name: 'Advanced', icon: <SettingsIcon className="w-4 h-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-8">
            {/* Theme Selection */}
            <div>
              <h3 className="text-lg font-medium text-[#102542] mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => updateSetting('theme', theme.id)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      settings.theme === theme.id 
                        ? 'border-[#f87060] bg-[#f87060]/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-16 rounded mb-2 ${theme.preview}`}></div>
                    <p className="text-sm font-medium">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <h3 className="text-lg font-medium text-[#102542] mb-4">Accent Color</h3>
              <div className="flex flex-wrap gap-3">
                {accentColors.map(color => (
                  <button
                    key={color}
                    onClick={() => updateSetting('accentColor', color)}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                      settings.accentColor === color 
                        ? 'border-gray-400 scale-110' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-lg font-medium text-[#102542] mb-4">Typography</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <select 
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060]"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xlarge">Extra Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                  <select 
                    value={settings.fontFamily}
                    onChange={(e) => updateSetting('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060]"
                  >
                    <option value="Proxima Nova">Proxima Nova</option>
                    <option value="Inter">Inter</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Monaco">Monaco (Monospace)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sync':
        return (
          <div className="space-y-8">
            {/* Auto Sync */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-lg font-medium text-[#102542]">Auto Sync</h3>
                <p className="text-sm text-gray-600">Automatically sync your notes across devices</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSync}
                  onChange={(e) => updateSetting('autoSync', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f87060]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f87060]"></div>
              </label>
            </div>

            {/* Sync Interval */}
            <div>
              <h3 className="text-lg font-medium text-[#102542] mb-4">Sync Interval</h3>
              <select 
                value={settings.syncInterval}
                onChange={(e) => updateSetting('syncInterval', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060]"
              >
                <option value={1}>Every minute</option>
                <option value={5}>Every 5 minutes</option>
                <option value={15}>Every 15 minutes</option>
                <option value={30}>Every 30 minutes</option>
                <option value={60}>Every hour</option>
              </select>
            </div>

            {/* Storage Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#102542]">Storage & Backup</h3>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Offline Mode</h4>
                  <p className="text-sm text-gray-600">Access notes without internet connection</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.offlineMode}
                    onChange={(e) => updateSetting('offlineMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f87060]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f87060]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Local Backup</h4>
                  <p className="text-sm text-gray-600">Create local backups automatically</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.localBackup}
                    onChange={(e) => updateSetting('localBackup', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f87060]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f87060]"></div>
                </label>
              </div>
            </div>

            {/* Backup Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f87060] text-white rounded-lg hover:bg-[#e55a45] transition-colors">
                <Download className="w-4 h-4" />
                Export Notes
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                Import Notes
              </button>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-8">
            {/* Spotify Integration */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Spotify</h3>
                    <p className="text-sm text-gray-600">Connect your music to your notes</p>
                  </div>
                </div>
                <button 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.spotifyConnected 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  onClick={() => updateSetting('spotifyConnected', !settings.spotifyConnected)}
                >
                  {settings.spotifyConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
              {settings.spotifyConnected && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">✅ Connected successfully! You can now add music details to your notes.</p>
                </div>
              )}
            </div>

            {/* Pinterest Integration */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Pinterest</h3>
                    <p className="text-sm text-gray-600">Add images and inspiration to your notes</p>
                  </div>
                </div>
                <button 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.pinterestConnected 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                  onClick={() => updateSetting('pinterestConnected', !settings.pinterestConnected)}
                >
                  {settings.pinterestConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
              {settings.pinterestConnected && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-700">✅ Connected successfully! You can now easily add Pinterest images to your notes.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-lg font-medium text-[#102542]">Encrypt Notes</h3>
                <p className="text-sm text-gray-600">End-to-end encryption for your private thoughts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.encryptNotes}
                  onChange={(e) => updateSetting('encryptNotes', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f87060]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f87060]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-lg font-medium text-[#102542]">Share Analytics</h3>
                <p className="text-sm text-gray-600">Help improve Noteverse with anonymous usage data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.shareAnalytics}
                  onChange={(e) => updateSetting('shareAnalytics', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f87060]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f87060]"></div>
              </label>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-8">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">⚠️ Advanced Settings</h3>
              <p className="text-sm text-yellow-700">These settings can affect app performance. Change with caution.</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-lg font-medium text-[#102542]">Load Images</h3>
                <p className="text-sm text-gray-600">Automatically load images in notes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.loadImages}
                  onChange={(e) => updateSetting('loadImages', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f87060]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f87060]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-lg font-medium text-[#102542]">Animations</h3>
                <p className="text-sm text-gray-600">Enable smooth transitions and animations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.animations}
                  onChange={(e) => updateSetting('animations', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f87060]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f87060]"></div>
              </label>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-200 bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-red-800 mb-4">🚨 Danger Zone</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Clear All Data
                </button>
                <p className="text-xs text-red-600">This action cannot be undone. All your notes will be permanently deleted.</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/notes"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#f87060] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Notes</span>
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-[#102542]">Settings</h1>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-[#f87060] text-white rounded-lg hover:bg-[#e55a45] transition-colors">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#f87060] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;