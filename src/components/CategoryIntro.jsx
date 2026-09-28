import { Link } from 'react-router-dom';
import { CATEGORY_INTROS, LANDING_PAGES } from '../seo/landings.js';

const LINK_KIND = {
  rudraksha: 'mukhi',
};

/** Short unique intro for category templates. Does not replace an existing page H1. */
const CategoryIntro = ({ id }) => {
  const copy = CATEGORY_INTROS[id];
  if (!copy) return null;
  const links = LINK_KIND[id]
    ? LANDING_PAGES.filter((page) => page.kind === LINK_KIND[id])
    : [];
  return (
    <section className="mb-6 rounded-2xl border border-amber-200/80 bg-amber-50/70 px-4 py-4 sm:px-6 sm:py-5">
      <h2 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">{copy.h1}</h2>
      <p className="mt-2 text-sm sm:text-base leading-relaxed text-stone-700 max-w-3xl">{copy.p}</p>
      {links.length ? (
        <ul className="mt-3 flex flex-wrap gap-2 list-none p-0 m-0">
          {links.map((page) => (
            <li key={page.path}>
              <Link
                to={page.path}
                className="inline-block rounded-full border border-primary/30 bg-white px-3 py-1 text-xs sm:text-sm font-semibold text-primary hover:bg-primary hover:text-white"
              >
                {page.h1}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};

export default CategoryIntro;
