import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import bookData from '../data/book-structure.json';

export default function Sidebar({ isOpen, onClose }) {
  const { topicId } = useParams();
  const [openParts, setOpenParts] = useState({});
  const [openChapters, setOpenChapters] = useState({});

  // Auto-expand the current topic's part and chapter
  useEffect(() => {
    if (!topicId) return;
    for (const part of bookData.parts) {
      for (const chapter of part.chapters) {
        const found = chapter.topics.find(t => t.id === topicId);
        if (found) {
          setOpenParts(prev => ({ ...prev, [part.partNumber]: true }));
          setOpenChapters(prev => ({ ...prev, [chapter.chapterNumber]: true }));
          return;
        }
      }
    }
  }, [topicId]);

  const togglePart = (num) => {
    setOpenParts(prev => ({ ...prev, [num]: !prev[num] }));
  };

  const toggleChapter = (num) => {
    setOpenChapters(prev => ({ ...prev, [num]: !prev[num] }));
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        {bookData.parts.map(part => (
          <div key={part.partNumber} className="sidebar-part">
            <div
              className="sidebar-part-header"
              onClick={() => togglePart(part.partNumber)}
            >
              <span className={`chevron ${openParts[part.partNumber] ? 'open' : ''}`}>&#9654;</span>
              Part {part.partNumber}: {part.name}
            </div>
            {openParts[part.partNumber] && (
              <div>
                {part.chapters.map(chapter => (
                  <div key={chapter.chapterNumber} className="sidebar-chapter">
                    <div
                      className="sidebar-chapter-header"
                      onClick={() => toggleChapter(chapter.chapterNumber)}
                    >
                      <span className={`chevron ${openChapters[chapter.chapterNumber] ? 'open' : ''}`}>&#9654;</span>
                      <span className="chapter-num">{chapter.chapterNumber}.</span>
                      {chapter.name}
                    </div>
                    {openChapters[chapter.chapterNumber] && (
                      <div>
                        {chapter.topics.map(topic => (
                          topic.exists ? (
                            <Link
                              key={topic.id}
                              to={`/topic/${topic.id}`}
                              className={`sidebar-topic ${topicId === topic.id ? 'active' : ''}`}
                              onClick={onClose}
                            >
                              <span className="topic-id">{topic.id}</span>
                              {topic.title}
                            </Link>
                          ) : (
                            <span key={topic.id} className="sidebar-topic missing">
                              <span className="topic-id">{topic.id}</span>
                              {topic.title}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
