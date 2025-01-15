import React from 'react';
import { observer } from 'mobx-react-lite';
import { Section } from '@/lib/schema';
import EditableSectionTitle from '@/components/EditableSectionTitle';

const DocumentSection = observer(({ section }: { section: Section }) => {
  return (
    <section>
      <EditableSectionTitle sectionId={section.id} />
    </section>
  );
});

export default DocumentSection;
