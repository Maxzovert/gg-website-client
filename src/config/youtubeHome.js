/**
 * Featured YouTube content on the home page (e.g. podcast).
 * https://www.youtube.com/@gawri-ganga
 */

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@gawri-ganga';

/** Single featured watch URL — embed is derived from the video id */
export const YOUTUBE_FEATURED_PODCAST = {
  videoId: 'tS4bpGuOCJk',
  watchUrl: 'https://www.youtube.com/watch?v=tS4bpGuOCJk',
  /** Shown as the iframe title for screen readers */
  embedTitle: 'Gawri Ganga — podcast on YouTube',
};

export function getYoutubePodcastEmbedSrc() {
  const { videoId } = YOUTUBE_FEATURED_PODCAST;
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}
