import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ContentGrid from "../components/ContentGrid";
import { api } from "../services/api";

interface Content {
  id: string;
  title: string;
  type: string;
  content?: string;
  url?: string;
  imageUrl?: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all content on mount or when new content is added
  const fetchContents = async () => {
    setLoading(true);
    try {
      const response = await api.getContent();
      // API may return { content: [...] }
      setContents(response.content || []);
    } catch (error) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  // Handle search results
  const handleSearchResults = (results: any) => {
    if (!results || !results.relevantContent) {
      setFilteredContents(null);
      return;
    }
    setFilteredContents(results.relevantContent);
  };

  // Handle delete
  const handleDeleteContent = async (id: string) => {
    await api.deleteContent(id);
    fetchContents();
  };

  // Handle view note (expand)
  const handleViewNote = (content: Content) => {
    // You can implement a modal or navigation here
    alert(`Note: ${content.content}`);
  };

  return (
    <div className="min-h-screen bg-[#f3ece4] pb-8">
      <Header onContentAdded={fetchContents} />
      <div className="pt-24 max-w-6xl mx-auto px-2">
        <Search onSearchResults={handleSearchResults} />
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-[#4b2e2e] text-lg">Loading...</span>
          </div>
        ) : (
          <ContentGrid
            contents={filteredContents !== null ? filteredContents : contents}
            onDeleteContent={handleDeleteContent}
            onViewNote={handleViewNote}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;