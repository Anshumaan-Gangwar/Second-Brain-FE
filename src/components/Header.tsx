// components/Footer.tsx
import React, { useState } from 'react';
import { Plus, Share2, Trash2, X } from 'lucide-react';
import { api } from '../services/api';

interface FooterProps {
  onContentAdded: () => void;
}

const Header: React.FC<FooterProps> = ({ onContentAdded }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [shareHash, setShareHash] = useState<string>('');
  const [contentType, setContentType] = useState<'url' | 'note'>('url');
  const [title, setTitle] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateHash = async () => {
    setLoading(true);
    try {
      const response = await api.shareBrain(true);
      setShareHash(response.shareLink || response.hash || 'Hash created successfully');
    } catch (error) {
      console.error('Failed to create hash:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHash = async () => {
    setLoading(true);
    try {
      await api.shareBrain(false);
      setShareHash('');
    } catch (error) {
      console.error('Failed to delete hash:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = async () => {
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const contentData = contentType === 'url' 
        ? { title, link: urlInput }
        : { title, content: noteInput };
      
      await api.addContent(contentData);
      
      // Reset form
      setTitle('');
      setUrlInput('');
      setNoteInput('');
      setShowAddModal(false);
      onContentAdded();
    } catch (error) {
      console.error('Failed to add content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <header className="fixed top-0 left-0 right-0 bg-[#f3ece4] border-b border-[#dbcbb5] p-4 shadow-lg z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Add a logo/title section for header */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-[#4b2e2e]">My Second Brain</h1>
          </div>

          {/* Button section moved to right side */}
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#dbcbb5] hover:bg-[#d4c0a8] text-[#4b2e2e] rounded-lg transition duration-150 shadow-sm"
            >
              <Plus size={16} />
              Add Content
            </button>
            
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#f5e3d8] text-[#4b2e2e] rounded-lg transition duration-150 shadow-sm border border-[#dbcbb5]"
            >
              <Share2 size={16} />
              Share Brain
            </button>
          </div>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f3ece4] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#4b2e2e]">Share Brain</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-[#7c5c5c] hover:text-[#4b2e2e]"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {shareHash && (
                <div className="p-3 bg-white rounded-lg border border-[#dbcbb5]">
                  <p className="text-sm text-[#7c5c5c] mb-1">Share Link:</p>
                  <p className="text-[#4b2e2e] font-mono text-sm break-all">{shareHash}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={handleCreateHash}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#dbcbb5] hover:bg-[#d4c0a8] text-[#4b2e2e] rounded-lg transition duration-150 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Hash'}
                </button>
                
                <button
                  onClick={handleDeleteHash}
                  disabled={loading || !shareHash}
                  className="flex-1 px-4 py-2 bg-white hover:bg-[#f5e3d8] text-[#4b2e2e] rounded-lg transition duration-150 border border-[#dbcbb5] disabled:opacity-50"
                >
                  <Trash2 size={16} className="inline mr-1" />
                  {loading ? 'Deleting...' : 'Delete Hash'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f3ece4] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#4b2e2e]">Add Content</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#7c5c5c] hover:text-[#4b2e2e]"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Content Type Selection */}
              <div>
                <p className="text-sm font-medium text-[#4b2e2e] mb-2">Content Type:</p>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="url"
                      checked={contentType === 'url'}
                      onChange={(e) => setContentType(e.target.value as 'url')}
                      className="mr-2"
                    />
                    <span className="text-[#4b2e2e]">URL</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="note"
                      checked={contentType === 'note'}
                      onChange={(e) => setContentType(e.target.value as 'note')}
                      className="mr-2"
                    />
                    <span className="text-[#4b2e2e]">Note</span>
                  </label>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-[#4b2e2e] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dbcbb5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4c0a8] bg-white"
                  placeholder="Enter title..."
                />
              </div>

              {/* Conditional Content Input */}
              {contentType === 'url' ? (
                <div>
                  <label className="block text-sm font-medium text-[#4b2e2e] mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dbcbb5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4c0a8] bg-white"
                    placeholder="Enter URL..."
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-[#4b2e2e] mb-1">
                    Note
                  </label>
                  <textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dbcbb5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4c0a8] bg-white h-24 resize-none"
                    placeholder="Enter your note..."
                  />
                </div>
              )}

              <button
                onClick={handleAddContent}
                disabled={loading || !title.trim() || (contentType === 'url' ? !urlInput.trim() : !noteInput.trim())}
                className="w-full px-4 py-2 bg-[#dbcbb5] hover:bg-[#d4c0a8] text-[#4b2e2e] rounded-lg transition duration-150 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Content'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
