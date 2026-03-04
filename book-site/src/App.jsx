import { useState, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TableOfContents from './components/TableOfContents';
import MarkdownPage from './components/MarkdownPage';
import WelcomePage from './components/WelcomePage';
import bookData from './data/book-structure.json';

function getTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function findTopicInfo(topicId) {
  if (!topicId) return null;
  for (const part of bookData.parts) {
    for (const chapter of part.chapters) {
      const topic = chapter.topics.find(t => t.id === topicId);
      if (topic) return { part, chapter, topic };
    }
  }
  return null;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(getTheme);
  const [headings, setHeadings] = useState([]);
  const { topicId } = useParams();
  const location = useLocation();

  const isTopicPage = location.pathname.startsWith('/topic/');
  const info = findTopicInfo(topicId);

  document.documentElement.setAttribute('data-theme', theme);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  const handleHeadingsChange = useCallback((h) => {
    setHeadings(h);
  }, []);

  return (
    <>
      <header className="topbar">
        <button
          className="topbar-menu-btn"
          onClick={() => setSidebarOpen(prev => !prev)}
          aria-label="Toggle sidebar"
        >
          &#9776;
        </button>
        <span className="topbar-title">{bookData.title}</span>
        {info && (
          <span className="topbar-breadcrumb">
            Part {info.part.partNumber} &rsaquo; Ch. {info.chapter.chapterNumber} &rsaquo;{' '}
            <span>{info.topic.title}</span>
          </span>
        )}
        <div className="topbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '\u2600' : '\u263E'}
          </button>
        </div>
      </header>

      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content">
          {isTopicPage ? (
            <MarkdownPage onHeadingsChange={handleHeadingsChange} />
          ) : (
            <WelcomePage />
          )}
        </main>
        {isTopicPage && <TableOfContents headings={headings} />}
      </div>
    </>
  );
}
