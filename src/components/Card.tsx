import React from "react";
import { NoteIcon } from "../icons/NoteIcon";
import { Delete } from "../icons/Delete";
import { ShareIcon } from "../icons/ShareIcon";
import { Expand } from "../icons/Expand";
import { File, Globe, ImageIcon } from "lucide-react";
import {
  InstagramEmbed,
  PinterestEmbed,
  YouTubeEmbed,
  LinkedInEmbed,
  FacebookEmbed,
  XEmbed,
} from 'react-social-media-embed';

interface CardProps {
  title: string;
  type?: string;
  content?: string;
  url?: string;
  imageUrl?: string | null;
  setdelete?: () => void;
  setNotes?: () => void;
  index?: number;
  time: string;
}

const Card: React.FC<CardProps> = ({
  title,
  type = "",
  content = "",
  url = "",
  time = "",
  setdelete,
  setNotes,
  imageUrl = "",
}) => {
  const getDomain = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace("www.", "");
    } catch {
      return null;
    }
  };

  const getFaviconUrl = (url: string) => {
    const domain = getDomain(url);
    return domain
      ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
      : undefined;
  };

  const randomColour = React.useMemo(() => {
    const colours = ["bg-yellow-100", "bg-amber-100", "bg-orange-100", "bg-orange-50"];
    return colours[Math.floor(Math.random() * colours.length)];
  }, []);

  // ✅ FIXED: Add null safety check
  const isValidSocialUrl = (url: string | null | undefined): string | null => {
    // Check if url exists and is a valid string
    if (!url || typeof url !== 'string') {
      return null;
    }

    const socialPatterns = {
      youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/,
      twitter: /^(https?:\/\/)?(twitter\.com|x\.com)/,
      instagram: /^(https?:\/\/)?(www\.)?instagram\.com/,
      facebook: /^(https?:\/\/)?(www\.)?facebook\.com/,
      linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com/,
      pinterest: /^(https?:\/\/)?(www\.)?pinterest\.com/,
    };
    
    for (const [platform, pattern] of Object.entries(socialPatterns)) {
      if (url.match(pattern)) return platform;
    }
    return null;
  };

  const renderContent = () => {
    // ✅ Now this won't throw an error even if url is null/undefined
    const socialPlatform = isValidSocialUrl(url);
    console.log({ type, url, socialPlatform });

    if (type === "Note") {
      return (
        <div className="p-2">
          <p className="text-[#4b2e2e] whitespace-pre-wrap line-clamp-6">
            {content}
          </p>
        </div>
      );
    } else if (type === "Url") {
      const embedDiv = {
        position: 'relative' as const,
        zIndex: 1,
        overflow: 'hidden',
        pointerEvents: 'none' as const,
        width: '100%',
      };

      const embedProps = {
        url,
        width: '100%',
        height: 'auto',
      };

      switch (socialPlatform) {
        case 'youtube':
          return <div style={embedDiv}><YouTubeEmbed {...embedProps} /></div>;
        case 'pinterest':
          return <div style={embedDiv}><PinterestEmbed {...embedProps} /></div>;
        case 'twitter':
          return <div style={{ ...embedDiv, marginBottom: '-90px' }}><XEmbed {...embedProps} /></div>;
        case 'instagram':
          return (
            <div style={{
              ...embedDiv,
              height: '370px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              transform: 'scale(2)',
              transformOrigin: 'center center',
            }}>
              <InstagramEmbed {...embedProps} height="100%" />
            </div>
          );
        case 'facebook':
          return <div style={embedDiv}><FacebookEmbed {...embedProps} /></div>;
        case 'linkedin':
          return <div style={embedDiv}><LinkedInEmbed {...embedProps} /></div>;
      }

      return (
        <div className={`overflow-hidden rounded-t-xl ${imageUrl ? "" : "h-8 bg-gradient-to-b from-[#eee0d0] via-[#f0e7db] to-[#f8f4f0]"}`}>
          {imageUrl ? (
            <img src={imageUrl || ""} alt="Saved Content" className="w-full object-cover max-h-56" />
          ) : null}
        </div>
      );
    }
    return null;
  };

  return (
    <article className="break-inside-avoid mb-3">
      <div className="flex-col bg-[#f3ece4] dark:bg-[#eaddcf] rounded-xl p-2 shadow-md dark:shadow-inner">
        <header className="rounded-xl overflow-hidden">
          <div className={`text-sm overflow-hidden rounded-xl ${type === "Url" ? "" : randomColour}`}>
            {renderContent()}
          </div>
        </header>

        <div className="rounded-b-xl">
          <div className="flex justify-between items-center px-2 py-1">
            <div className="flex gap-2 items-center">
              <div className="rounded-xl p-1 bg-[#dbcbb5] text-[#4b2e2e]">
                {type === "Doc" ? (
                  <File className="w-4 h-auto" />
                ) : type === "Image" ? (
                  <ImageIcon className="w-4 h-auto" />
                ) : type === "Note" ? (
                  <NoteIcon />
                ) : getFaviconUrl(url) ? (
                  <img src={getFaviconUrl(url)} alt="Website Logo" className="w-4 h-4" onError={(e) => (e.currentTarget.style.display = "none")} />
                ) : (
                  <Globe size={14} />
                )}
              </div>
              <h2 className="text-sm font-medium text-[#4b2e2e] whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                {title}
              </h2>
            </div>
          </div>

          <nav className="flex items-end justify-between gap-2 p-1 px-2">
            <div className="flex gap-1 items-center">
              {type === "Url" ? (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-lg p-1 bg-white hover:bg-[#f5e3d8] text-[#4b2e2e] transition duration-150 shadow-sm">
                    <ShareIcon />
                  </button>
                </a>
              ) : (
                <button
                  onClick={setNotes}
                  className="rounded-lg p-1 bg-white hover:bg-[#f5e3d8] text-[#4b2e2e] transition duration-150 shadow-sm"
                >
                  <Expand />
                </button>
              )}
              {setdelete && (
                <button
                  onClick={setdelete}
                  className="rounded-lg p-1 bg-white hover:bg-[#f5e3d8] text-[#4b2e2e] transition duration-150 shadow-sm"
                >
                  <Delete />
                </button>
              )}
            </div>
            <p className="text-xs text-[#7c5c5c]">{time}</p>
          </nav>
        </div>
      </div>
    </article>
  );
};

export default Card;
