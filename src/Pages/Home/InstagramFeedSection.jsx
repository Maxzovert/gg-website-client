import React from 'react';
import { FaInstagram, FaPlay, FaExternalLinkAlt } from 'react-icons/fa';
import { getInstagramReelItems, getInstagramPostItems, INSTAGRAM_PROFILE_URL } from '../../config/instagramEmbeds';
import reelCoverFallback from '../../assets/RudraksPageImg/rd1.webp';

const PROFILE_URL = INSTAGRAM_PROFILE_URL;
const HANDLE = '@gawriganga.in';

const instagramCardShell =
  'group relative block w-full min-h-0 overflow-hidden rounded-2xl border-2 border-amber-300/85 bg-stone-900 shadow-[0_8px_24px_-6px_rgba(62,47,28,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-[0_16px_36px_-10px_rgba(62,47,28,0.32)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFAEB]';

function InstagramReelCard({ url, poster }) {
  const codeMatch = url.match(/\/(p|reel|tv)\/([^/?]+)/i);
  const code = codeMatch ? codeMatch[2] : 'reel';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch Instagram reel ${code} on ${HANDLE}`}
      className={`${instagramCardShell} aspect-9/16`}
    >
      {poster ? (
        <img
          src={poster}
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 bg-linear-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]"
          aria-hidden
        />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/35" />

      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:left-3 sm:top-3 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[11px]">
        <FaInstagram className="text-xs sm:text-sm" aria-hidden />
        Reel
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-1.5 sm:px-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-white sm:h-14 sm:w-14">
          <FaPlay className="ml-0.5 text-base sm:ml-1 sm:text-xl" aria-hidden />
        </span>
        <span className="mt-2 text-center text-[11px] font-semibold leading-tight text-white drop-shadow-md sm:mt-3 sm:text-sm">
          Watch on Instagram
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent px-2 pb-2 pt-8 sm:px-3 sm:pb-3 sm:pt-10">
        <p className="truncate text-center text-[10px] font-medium text-white/95 sm:text-xs">{HANDLE}</p>
      </div>
    </a>
  );
}

function InstagramPostCard({ url, poster, openProfile }) {
  const codeMatch = url.match(/\/(p|reel|tv)\/([^/?]+)/i);
  const code = codeMatch ? codeMatch[2] : 'post';
  const label = openProfile ? 'Profile' : 'Post';
  const cta = openProfile ? 'See all posts' : 'Open post';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        openProfile ? `View ${HANDLE} on Instagram` : `Open Instagram post ${code} on ${HANDLE}`
      }
      className={`${instagramCardShell} aspect-4/5`}
    >
      {poster ? (
        <img
          src={poster}
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 bg-linear-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]"
          aria-hidden
        />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-black/30" />

      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:left-3 sm:top-3 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[11px]">
        <FaInstagram className="text-xs sm:text-sm" aria-hidden />
        {label}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-1.5 sm:px-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-white sm:h-14 sm:w-14">
          <FaExternalLinkAlt className="text-sm sm:text-lg" aria-hidden />
        </span>
        <span className="mt-2 text-center text-[11px] font-semibold leading-tight text-white drop-shadow-md sm:mt-3 sm:text-sm">
          {cta}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent px-2 pb-2 pt-8 sm:px-3 sm:pb-3 sm:pt-10">
        <p className="truncate text-center text-[10px] font-medium text-white/95 sm:text-xs">{HANDLE}</p>
      </div>
    </a>
  );
}

function InstagramHeroFallback() {
  return (
    <a
      href={PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Get the best offers on Instagram at ${HANDLE}`}
      className="group relative mt-8 block w-full max-w-3xl overflow-hidden rounded-2xl bg-stone-900 shadow-lg ring-1 ring-stone-900/10 transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#dd2a7b] focus-visible:ring-offset-2"
    >
      <div className="relative aspect-video min-h-[260px] sm:min-h-[320px]">
        <img
          src={reelCoverFallback}
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-8 pt-12 text-center">
          <span
            className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-lg"
            aria-hidden
          >
            <FaInstagram className="text-2xl" />
          </span>
          <p className="font-heading text-xl font-bold tracking-tight text-white sm:text-2xl text-pretty">
            Get the best offers
          </p>
          <p className="mt-2 max-w-md text-pretty text-sm text-white/95 sm:text-base">
            Explore Instagram for exclusive deals and spiritual drops.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition-colors group-hover:bg-[#FFFAEB]">
            <FaInstagram className="text-lg text-[#dd2a7b]" aria-hidden />
            Open {HANDLE}
          </span>
        </div>
      </div>
    </a>
  );
}

function SubsectionHeader({ id, title, hint, count }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 border-b border-amber-200/70 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 text-left">
        <h3
          id={id}
          className="font-heading text-lg font-bold tracking-tight text-stone-900 sm:text-xl md:text-2xl"
        >
          {title}
        </h3>
        <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-stone-600 sm:text-sm">{hint}</p>
      </div>
      {count != null ? (
        <p className="shrink-0 text-left text-xs font-semibold uppercase tracking-[0.2em] text-stone-400 sm:text-right">
          {count} featured
        </p>
      ) : null}
    </div>
  );
}

const InstagramFeedSection = () => {
  const reelItems = getInstagramReelItems();
  const postItems = getInstagramPostItems();

  return (
    <section
      className="w-full overflow-x-hidden bg-[#FFFAEB] py-10 sm:py-14 md:py-16 lg:py-20"
      aria-labelledby="instagram-feed-heading"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1400px] px-3 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <span
              className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-md sm:mx-0 sm:h-16 sm:w-16"
              aria-hidden
            >
              <FaInstagram className="text-2xl sm:text-3xl" />
            </span>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2
                id="instagram-feed-heading"
                className="font-heading text-[clamp(1.375rem,4.5vw,2rem)] font-bold leading-tight tracking-tight text-stone-900 sm:text-3xl md:text-[2rem]"
              >
                Gawri Ganga on Instagram
              </h2>
              <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-stone-600 sm:text-base">
                Get the best offers, flash codes, and new Rudraksha &amp; mala drops—follow{' '}
                <a
                  href={PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  {HANDLE}
                </a>{' '}
                for what doesn’t always make it to the shop first.
              </p>
            </div>
          </div>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-stone-800 sm:w-auto sm:px-7 sm:py-3.5"
          >
            <FaInstagram className="text-lg" aria-hidden />
            View profile
          </a>
        </div>

        {reelItems.length > 0 ? (
          <div className="mt-10 space-y-5">
            <SubsectionHeader
              id="instagram-reels-heading"
              title="Reels"
              hint="Short videos with sound—tap any card to watch on Instagram."
              count={reelItems.length}
            />
            <div className="grid w-full grid-cols-2 gap-3 min-w-0 sm:gap-4 md:gap-5 lg:grid-cols-4 lg:gap-6">
              {reelItems.map((item) => (
                <div key={item.url} className="min-w-0">
                  <InstagramReelCard url={item.url} poster={item.poster} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 flex justify-center">
            <InstagramHeroFallback />
          </div>
        )}

        {postItems.length > 0 ? (
          <div className="mt-12 space-y-5 border-t border-amber-200/60 pt-10">
            <SubsectionHeader
              id="instagram-posts-heading"
              title="Posts"
              hint="Photos and carousels from the feed—tap to view or comment on Instagram."
              count={postItems.length}
            />
            <div className="grid w-full grid-cols-2 gap-3 min-w-0 sm:gap-4 md:gap-5 lg:grid-cols-4 lg:gap-6">
              {postItems.map((item) => (
                <div key={`${item.url}-${item.openProfile ? 'profile' : 'post'}`} className="min-w-0">
                  <InstagramPostCard
                    url={item.url}
                    poster={item.poster}
                    openProfile={Boolean(item.openProfile)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default InstagramFeedSection;
