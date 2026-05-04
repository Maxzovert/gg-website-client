import React from 'react';
import { FaYoutube } from 'react-icons/fa';
import {
  YOUTUBE_CHANNEL_URL,
  YOUTUBE_FEATURED_PODCAST,
  getYoutubePodcastEmbedSrc,
} from '../../config/youtubeHome';

const embedShell =
  'overflow-hidden rounded-2xl border-2 border-amber-300/85 bg-stone-900 shadow-[0_8px_24px_-6px_rgba(62,47,28,0.22)]';

const YouTubePodcastSection = () => {
  const embedSrc = getYoutubePodcastEmbedSrc();

  return (
    <section
      className="w-full overflow-x-hidden bg-[#FFFAEB] py-10 sm:py-14 md:py-16 lg:py-20"
      aria-labelledby="youtube-podcast-heading"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <span
              className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FF0000] text-white shadow-md sm:mx-0 sm:h-16 sm:w-16"
              aria-hidden
            >
              <FaYoutube className="text-2xl sm:text-3xl" />
            </span>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2
                id="youtube-podcast-heading"
                className="font-heading text-[clamp(1.375rem,4.5vw,2rem)] font-bold leading-tight tracking-tight text-stone-900 sm:text-3xl md:text-[2rem]"
              >
                Gawri Ganga on YouTube
              </h2>
              <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-stone-600 sm:text-base">
                Catch our podcast and longer conversations on Rudraksha, devotion, and the stories behind
                the brand—subscribe on{' '}
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  @gawri-ganga
                </a>{' '}
                so you don’t miss new episodes.
              </p>
            </div>
          </div>
          <div className="flex w-full min-w-0 shrink-0 flex-col gap-3 sm:flex-row sm:justify-end lg:w-auto lg:flex-col lg:items-end">
            <a
              href={YOUTUBE_FEATURED_PODCAST.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-stone-900 bg-transparent px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm transition-colors hover:bg-stone-900 hover:text-white sm:w-auto sm:px-7 sm:py-3.5"
            >
              <FaYoutube className="text-lg" aria-hidden />
              Open on YouTube
            </a>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-stone-800 sm:w-auto sm:px-7 sm:py-3.5"
            >
              <FaYoutube className="text-lg" aria-hidden />
              View channel
            </a>
          </div>
        </div>

        <div className={`relative mx-auto mt-8 w-full min-w-0 max-w-5xl sm:mt-10 ${embedShell}`}>
          <div className="relative aspect-video w-full min-h-[200px] max-w-full">
            <iframe
              className="absolute inset-0 h-full w-full max-w-full border-0"
              src={embedSrc}
              title={YOUTUBE_FEATURED_PODCAST.embedTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubePodcastSection;
