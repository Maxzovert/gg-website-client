/** Explore blocks shown at the bottom of collection pages (category names must match DB). */
export const EXPLORE_COLLECTION_SECTIONS = [
  {
    key: 'rudraksha',
    heading: 'Explore Rudraksha Collection',
    category: 'Rudraksha',
    linkTo: '/rudraksha',
    linkText: 'View all Rudraksha',
  },
  {
    key: 'sprays',
    heading: 'Explore Sprays Collection',
    category: 'Sprays',
    linkTo: '/sprays',
    linkText: 'View all Sprays',
  },
  {
    key: 'tulsi',
    heading: 'Explore Tulsi Mala Collection',
    category: 'Tulsi Mala',
    linkTo: '/tulsimala',
    linkText: 'View all Tulsi Mala',
  },
  {
    key: 'accessories',
    heading: 'Explore Accessories Collection',
    category: 'Accessories',
    linkTo: '/accessories',
    linkText: 'View all Accessories',
  },
  {
    key: 'combos',
    heading: 'Explore Our Combo Collection',
    category: 'Combos',
    linkTo: '/combos',
    linkText: 'View all Combos',
  },
];

/** Sections for a page, omitting the current collection (e.g. hide Rudraksha on /rudraksha). */
export function getExploreSectionsForPage(excludeCategory) {
  const norm = String(excludeCategory ?? '').trim().toLowerCase();
  return EXPLORE_COLLECTION_SECTIONS.filter(
    (section) => section.category.trim().toLowerCase() !== norm,
  );
}
