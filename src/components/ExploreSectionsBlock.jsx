import React from 'react';
import ExploreCollectionSection from './ExploreCollectionSection';
import { getExploreSectionsForPage } from '../utils/exploreSections';

export default function ExploreSectionsBlock({ excludeCategory }) {
  const sections = getExploreSectionsForPage(excludeCategory);

  return (
    <>
      {sections.map(({ key, heading, category, linkTo, linkText }) => (
        <ExploreCollectionSection
          key={key}
          heading={heading}
          category={category}
          linkTo={linkTo}
          linkText={linkText}
        />
      ))}
    </>
  );
}
