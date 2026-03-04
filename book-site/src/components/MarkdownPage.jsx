import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import bookData from '../data/book-structure.json';
import TableOfContents from './TableOfContents';

function findTopicInfo(topicId) {
  for (const part of bookData.parts) {
    for (const chapter of part.chapters) {
      const topicIndex = chapter.topics.findIndex(t => t.id === topicId);
      if (topicIndex !== -1) {
        return { part, chapter, topic: chapter.topics[topicIndex], topicIndex };
      }
    }
  }
  return null;
}

function getAllTopics() {
  const topics = [];
  for (const part of bookData.parts) {
    for (const chapter of part.chapters) {
      for (const topic of chapter.topics) {
        if (topic.exists) {
          topics.push({ ...topic, chapter, part });
        }
      }
    }
  }
  return topics;
}

export default function MarkdownPage({ onHeadingsChange }) {
  const { topicId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const info = findTopicInfo(topicId);
  const allTopics = getAllTopics();
  const currentIndex = allTopics.findIndex(t => t.id === topicId);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  useEffect(() => {
    if (!info) {
      setError('Topic not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const url = `/content/${info.chapter.folder}/${info.topic.file}`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('File not found');
        return res.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [topicId]);

  // Extract headings after content renders
  useEffect(() => {
    if (!content || loading) return;
    const timer = setTimeout(() => {
      const headings = [];
      const els = document.querySelectorAll('.markdown-body h2, .markdown-body h3');
      els.forEach(el => {
        headings.push({
          id: el.id,
          text: el.textContent,
          depth: el.tagName === 'H3' ? 3 : 2,
        });
      });
      onHeadingsChange(headings);
    }, 100);
    return () => clearTimeout(timer);
  }, [content, loading, onHeadingsChange]);

  if (loading) {
    return (
      <div className="content-wrapper">
        <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-wrapper">
        <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>
          <h2>Content not available</h2>
          <p>This topic hasn't been written yet.</p>
          <Link to="/" style={{ color: 'var(--color-primary)' }}>Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      {info && info.topicIndex === 0 && (
        <div className="chapter-header">
          Chapter {info.chapter.chapterNumber}: {info.chapter.name}
        </div>
      )}
      <div className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug, rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
      </div>

      <nav className="page-nav">
        {prevTopic ? (
          <Link to={`/topic/${prevTopic.id}`} className="page-nav-link prev">
            <span className="page-nav-label">&larr; Previous</span>
            <span className="page-nav-title">{prevTopic.id} {prevTopic.title}</span>
          </Link>
        ) : <div />}
        {nextTopic ? (
          <Link to={`/topic/${nextTopic.id}`} className="page-nav-link next">
            <span className="page-nav-label">Next &rarr;</span>
            <span className="page-nav-title">{nextTopic.id} {nextTopic.title}</span>
          </Link>
        ) : <div />}
      </nav>
    </div>
  );
}
