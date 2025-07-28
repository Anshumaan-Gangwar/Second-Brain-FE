// components/ContentGrid.tsx
import React from 'react';
import Card from './Card';

interface Content {
  id: string;
  title: string;
  type: string;
  content?: string;
  url?: string;
  imageUrl?: string;
  createdAt: string;
}

interface ContentGridProps {
  contents: Content[];
  onDeleteContent: (id: string) => void;
  onViewNote: (content: Content) => void;
}

const ContentGrid: React.FC<ContentGridProps> = ({ 
  contents, 
  onDeleteContent, 
  onViewNote 
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (contents.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-[#7c5c5c] text-lg mb-2">No content found</p>
          <p className="text-[#7c5c5c] text-sm">Start by adding some content using the button below</p>
        </div>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {contents.map((content) => (
        <Card
          key={content.id}
          title={content.title}
          type={content.type}
          content={content.content}
          url={content.url}
          imageUrl={content.imageUrl}
          time={formatTime(content.createdAt)}
          setdelete={() => onDeleteContent(content.id)}
          setNotes={() => onViewNote(content)}
        />
      ))}
    </div>
  );
};

export default ContentGrid;
