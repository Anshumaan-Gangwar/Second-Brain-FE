// components/SearchBar.tsx
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { api } from '../services/api';

interface SearchBarProps {
  onSearchResults: (results: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearchMessage('');
    
    try {
      const response = await api.search(query);
      setSearchMessage(response.answer || 'Search completed successfully');
      onSearchResults(response);
    } catch (error: any) {
      setSearchMessage(error.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchMessage('');
    onSearchResults(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your content..."
            className="w-full px-4 py-3 pl-12 pr-12 text-[#4b2e2e] bg-white border-2 border-[#dbcbb5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4c0a8] focus:border-transparent shadow-sm"
          />
          
          <Search 
            size={20} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7c5c5c]" 
          />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7c5c5c] hover:text-[#4b2e2e] transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-[#dbcbb5] hover:bg-[#d4c0a8] text-[#4b2e2e] rounded-lg transition duration-150 disabled:opacity-50 text-sm"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {searchMessage && (
        <div className="mt-3 p-3 bg-white border border-[#dbcbb5] rounded-lg shadow-sm">
          <p className="text-[#4b2e2e] text-sm">{searchMessage}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
