import { useState, useEffect } from 'react';

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  return (
    <aside className="toc-sidebar">
      <div className="toc-title">On this page</div>
      {headings.map(h => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`toc-link ${h.depth === 3 ? 'depth-3' : ''} ${activeId === h.id ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(h.id);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setActiveId(h.id);
            }
          }}
        >
          {h.text}
        </a>
      ))}
    </aside>
  );
}
