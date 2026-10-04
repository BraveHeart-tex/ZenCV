import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import type { SectionId } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';
import { cn, getSectionContainerId } from '@/lib/utils/stringUtils';

export const DocumentSectionNavigation = observer(() => {
  const ui = builderSession.UIStore;
  const sections = (builderSession.document?.sections ?? []).filter(
    (section) => section.sectionKey !== 'websitesSocialLinks'
  );
  const sectionIds = sections.map((section) => section.id).join(',');
  const view = ui.currentView;

  useEffect(() => {
    if (view !== BUILDER_CURRENT_VIEWS.BUILDER) {
      return;
    }
    let frame = 0;
    const updateLocation = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const visibleSectionIds = sectionIds
          .split(',')
          .filter(Boolean)
          .map((id) => Number(id) as SectionId);
        const navigationBottom =
          document
            .getElementById('editor-section-navigation')
            ?.getBoundingClientRect().bottom ?? 140;
        let current = visibleSectionIds[0] ?? null;
        for (const id of visibleSectionIds) {
          const element = document.getElementById(getSectionContainerId(id));
          if (
            element &&
            element.getBoundingClientRect().top <= navigationBottom + 24
          ) {
            current = id;
          }
        }
        ui.setActiveSection(current);
      });
    };
    updateLocation();
    window.addEventListener('scroll', updateLocation, { passive: true });
    window.addEventListener('resize', updateLocation);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateLocation);
      window.removeEventListener('resize', updateLocation);
    };
  }, [sectionIds, ui, view]);

  const goToSection = (id: SectionId) => {
    ui.setActiveSection(id);
    const section = document.getElementById(getSectionContainerId(id));
    const navigationBottom =
      document
        .getElementById('editor-section-navigation')
        ?.getBoundingClientRect().bottom ?? 140;
    if (section) {
      window.scrollTo({
        top:
          window.scrollY +
          section.getBoundingClientRect().top -
          navigationBottom -
          20,
        behavior: 'instant',
      });
      section.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    }
  };

  return (
    <nav
      id='editor-section-navigation'
      aria-label='Resume sections'
      className='mx-auto max-w-2xl border-t border-border/50 px-3 py-2 md:px-0'
    >
      <div className='flex items-center gap-3 xl:hidden'>
        <label
          htmlFor='editor-section-select'
          className='text-muted-foreground shrink-0 text-xs'
        >
          Section
        </label>
        <select
          id='editor-section-select'
          value={ui.activeSectionId ?? sections[0]?.id ?? ''}
          onChange={(event) =>
            goToSection(Number(event.target.value) as SectionId)
          }
          className='border-border bg-card text-foreground focus-visible:ring-ring/40 h-10 min-w-0 flex-1 rounded-md border px-3 text-sm focus-visible:outline-hidden focus-visible:ring-2'
        >
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.title}
            </option>
          ))}
        </select>
      </div>
      <div className='hide-scrollbar hidden gap-1 overflow-x-auto xl:flex xl:flex-nowrap'>
        {sections.map((section) => (
          <button
            key={section.id}
            type='button'
            aria-current={
              ui.activeSectionId === section.id ? 'location' : undefined
            }
            onClick={() => goToSection(section.id)}
            className={cn(
              'min-h-9 shrink-0 rounded-md px-2.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none',
              ui.activeSectionId === section.id
                ? 'bg-secondary text-foreground font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {section.title}
          </button>
        ))}
      </div>
    </nav>
  );
});
