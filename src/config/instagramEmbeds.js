/**
 * Instagram on the home page — reel + post link cards (no iframes).
 *
 * Optional: VITE_INSTAGRAM_EMBED_URLS appends extra reels without posters.
 */

import reelThumb1 from '../assets/HomePage/Instasection/Reels/1.webp';
import reelThumb2 from '../assets/HomePage/Instasection/Reels/2.webp';
import reelThumb3 from '../assets/HomePage/Instasection/Reels/3.webp';
import reelThumb4 from '../assets/HomePage/Instasection/Reels/4.webp';

import postThumb1 from '../assets/HomePage/Instasection/Posts/1.webp';
import postThumb2 from '../assets/HomePage/Instasection/Posts/2.webp';
import postThumb3 from '../assets/HomePage/Instasection/Posts/3.webp';
import postThumb4 from '../assets/HomePage/Instasection/Posts/4.webp';

export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/gawriganga.in/';

/** Reels — thumbnails from Instasection/Reels; opens on Instagram */
export const INSTAGRAM_REEL_CARDS = [
  { url: 'https://www.instagram.com/reel/DX6HM4EEiIV/', poster: reelThumb1 },
  { url: 'https://www.instagram.com/reel/DX1SfsEzex-/', poster: reelThumb2 },
  { url: 'https://www.instagram.com/reel/DVsh6BzE07m/', poster: reelThumb3 },
  { url: 'https://www.instagram.com/reel/DX3Tp9_zkE1/', poster: reelThumb4 },
];

/**
 * Feed posts — your exported thumbnails + permalinks.
 * Fourth tile: profile link until you add another /p/ URL (replace `url` + remove `openProfile: true`).
 */
export const INSTAGRAM_POST_CARDS = [
  { url: 'https://www.instagram.com/p/DX1cH1Xk_Ir/', poster: postThumb1 },
  { url: 'https://www.instagram.com/p/DXRff68mOyP/', poster: postThumb2 },
  { url: 'https://www.instagram.com/p/DXRPWVFGDyo/', poster: postThumb3 },
  {
    url: INSTAGRAM_PROFILE_URL,
    poster: postThumb4,
    openProfile: true,
  },
];

function parseEnvUrls() {
  const raw = import.meta.env.VITE_INSTAGRAM_EMBED_URLS;
  if (typeof raw !== 'string' || !raw.trim()) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((u) => /^https:\/\/(www\.)?instagram\.com\/(p|reel|tv)\//i.test(u));
}

export function getInstagramReelItems() {
  const knownUrls = new Set(INSTAGRAM_REEL_CARDS.map((c) => c.url));
  const extra = parseEnvUrls().filter((u) => !knownUrls.has(u));
  return [...INSTAGRAM_REEL_CARDS, ...extra.map((url) => ({ url, poster: null }))];
}

export function getInstagramPostItems() {
  return INSTAGRAM_POST_CARDS;
}

/** @deprecated */
export function getInstagramEmbedUrls() {
  return getInstagramReelItems().map((c) => c.url);
}
