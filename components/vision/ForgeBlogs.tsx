"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import Prisma from "react-syntax-highlighter/dist/esm/prism";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactPlayer from "react-player";
import {
  ClipboardIcon,
  CheckBadgeIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";

const ForgeBlogs: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch("./md/Vision.md");
        if (!response.ok) {
          throw new Error("Failed to fetch markdown");
        }
        const content = await response.text();
        setMarkdown(content);
      } catch (error) {
        console.error("Error fetching markdown:", error);
        setMarkdown("Error loading content");
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, []);

  const codeComponent: Components = {
    code({ node, inline, className, children, style, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");

      return !inline && match ? (
        <div className="relative">
          {(() => {
            const [copied, setCopied] = React.useState(false);

            const handleCopyClick = () => {
              navigator.clipboard.writeText(String(children));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            };

            return (
              <button
                onClick={handleCopyClick}
                className="absolute top-2 right-2 p-2 cursor-pointer rounded-lg hover:bg-black/50"
                aria-label="Copy code"
              >
                {copied ? (
                  <CheckBadgeIcon className="w-5 h-5 text-white/60" />
                ) : (
                  <ClipboardIcon className="w-5 h-5 text-white/60" />
                )}
              </button>
            );
          })()}
          <Prisma
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </Prisma>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  const renderLink = (props: any) => {
    const { href, children } = props;
    const vimeoRegex = /https?:\/\/(www\.)?vimeo\.com\/(\d+)/;
    const match = vimeoRegex.exec(href);

    if (match) {
      const videoId = match[2];
      return (
        <div className="my-4">
          <ReactPlayer url={`https://vimeo.com/${videoId}`} controls />
        </div>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline"
      >
        {children}
      </a>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-start items-center min-h-screen text-white p-4">
        <div className="prose prose-invert max-w-3xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center min-h-screen text-white p-4">
      <div className="w-full max-w-3xl mb-8 p-4 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-white manrope">
            Background Music
          </h3>
          <p className="text-white/60 text-sm">
            Play this for crazy motivation while reading.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5 text-white" />
            ) : (
              <PlayIcon className="w-5 h-5 text-white" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <SpeakerWaveIcon
              className={`w-5 h-5 ${isMuted ? "text-red-400" : "text-white"}`}
            />
          </button>
        </div>
      </div>
      <audio
        ref={audioRef}
        src="https://cms-public-artifacts.artlist.io/content/music/aac/826957_Artem_Vyacheslavovich_Hramushkin_-_Tokyo_-_Taito_-_CE-000014-7_-_Master_-_88_Bpm_-_211222_-_BOV_-_ORG_-_2444.aac"
        loop
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="prose prose-invert prose-p:text-xl prose-h3:text-3xl prose-p:leading-relaxed prose-img:rounded-lg prose-img:shadow-lg prose-ul:text-white prose-li:text-white prose-li:text-lg max-w-3xl">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            ...codeComponent,
            a: renderLink,
            h1: ({ node, ...props }) => (
              <h1 className="font-bold manrope" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="font-bold manrope" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="font-bold manrope" {...props} />
            ),
            h4: ({ node, ...props }) => (
              <h4 className="font-bold manrope" {...props} />
            ),
            h5: ({ node, ...props }) => (
              <h5 className="font-bold manrope" {...props} />
            ),
            h6: ({ node, ...props }) => (
              <h6 className="font-bold manrope" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-blue-500 pl-4 italic bg-blue-500/10 py-2 rounded-r"
                {...props}
              />
            ),
            img: ({ node, src, alt, ...props }) => (
              <img
                src={src}
                alt={alt}
                className="rounded-lg shadow-lg w-full h-auto my-4 md:max-w-full"
                {...props}
              />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ForgeBlogs;
