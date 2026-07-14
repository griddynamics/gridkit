import { useEffect } from 'react';

export const CollapsibleSections = () => {
  useEffect(() => {
    const init = () => {
      const root =
        document.querySelector('.sbdocs-content') || document.querySelector('[class*="sbdocs"]') || document.body;

      root.querySelectorAll('h2, h3').forEach((heading) => {
        if ((heading as HTMLElement).dataset['collapsible']) return;
        (heading as HTMLElement).dataset['collapsible'] = 'true';

        const level = parseInt(heading.tagName[1], 10);
        const siblings: Element[] = [];
        let el = heading.nextElementSibling;

        while (el) {
          const m = el.tagName.match(/^H([1-6])$/i);
          if (m && parseInt(m[1], 10) <= level) break;
          siblings.push(el);
          el = el.nextElementSibling;
        }

        if (!siblings.length) return;

        const wrapper = document.createElement('div');
        siblings.forEach((s) => wrapper.appendChild(s));
        heading.insertAdjacentElement('afterend', wrapper);

        (heading as HTMLElement).style.cursor = 'pointer';
        (heading as HTMLElement).title = 'Click to collapse';
        let open = true;

        heading.addEventListener('click', () => {
          open = !open;
          (wrapper as HTMLElement).style.display = open ? '' : 'none';
          (heading as HTMLElement).style.opacity = open ? '' : '0.55';
          (heading as HTMLElement).title = open ? 'Click to collapse' : 'Click to expand';
        });
      });
    };

    const timer = setTimeout(init, 150);
    return () => clearTimeout(timer);
  }, []);

  return null;
};
