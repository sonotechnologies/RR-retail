'use client';

import { useState } from 'react';
import { PlayIcon } from '@/components/ui/icons';
import { Photo } from '@/components/ui/Photo';

type Embed = { platform: 'tiktok' | 'instagram'; url: string; poster: string; views?: string };

function embedSrc(e: Embed): string | null {
  if (e.platform === 'tiktok') {
    const id = e.url.match(/\/video\/(\d+)/)?.[1];
    return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
  }
  const m = e.url.match(/instagram\.com\/(p|reel)\/([\w-]+)/);
  return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed` : null;
}

/** 9:16 poster with a play button. The embed loads only on tap; profile links open in a new tab. */
export function VideoTile({ embed, label }: { embed: Embed; label: string }) {
  const [playing, setPlaying] = useState(false);
  const src = embedSrc(embed);
  const play = () => (src ? setPlaying(true) : window.open(embed.url, '_blank', 'noopener'));
  return (
    <div className={`relative aspect-[9/16] shrink-0 snap-start overflow-hidden rounded-card bg-[#2a241f] ${playing ? 'shadow-[inset_0_0_0_2px_var(--accent)]' : ''} w-[150px] lg:w-[228px]`}>
      {playing && src ? (
        <iframe src={src} title={label} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 size-full border-0" />
      ) : (
        <button type="button" onClick={play} className="group absolute inset-0 flex items-center justify-center" aria-label={`Play: ${label}`} data-cursor="view">
          <Photo src={embed.poster} alt="" sizes="(min-width:1024px) 228px, 150px" className="transition-transform duration-700 ease-out-expo group-hover:scale-105" />
          <span className="relative flex size-11 items-center justify-center rounded-full bg-paper/90 text-coal transition-transform group-hover:scale-110 lg:size-[52px]">
            <PlayIcon width={20} height={20} className="ml-0.5" />
          </span>
          {embed.views && (
            <span className="absolute bottom-2.5 left-2.5 text-[12px] font-semibold text-paper [text-shadow:0_1px_4px_#0008] lg:bottom-3.5 lg:left-3.5 lg:text-[13px]">
              ▶ {embed.views}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
