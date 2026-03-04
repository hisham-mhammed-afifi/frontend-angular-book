import { Link } from 'react-router-dom';
import bookData from '../data/book-structure.json';

export default function WelcomePage() {
  let totalTopics = 0;
  let availableTopics = 0;
  let totalChapters = 0;

  bookData.parts.forEach(part => {
    part.chapters.forEach(chapter => {
      totalChapters++;
      chapter.topics.forEach(topic => {
        totalTopics++;
        if (topic.exists) availableTopics++;
      });
    });
  });

  // Find first available topic
  let firstTopic = null;
  for (const part of bookData.parts) {
    for (const chapter of part.chapters) {
      for (const topic of chapter.topics) {
        if (topic.exists) {
          firstTopic = topic;
          break;
        }
      }
      if (firstTopic) break;
    }
    if (firstTopic) break;
  }

  return (
    <div className="content-wrapper">
      <div className="welcome-page">
        <h1>{bookData.title}</h1>
        <p className="subtitle">{bookData.subtitle}</p>

        <div className="welcome-stats">
          <div className="welcome-stat">
            <div className="welcome-stat-num">{bookData.parts.length}</div>
            <div className="welcome-stat-label">Parts</div>
          </div>
          <div className="welcome-stat">
            <div className="welcome-stat-num">{totalChapters}</div>
            <div className="welcome-stat-label">Chapters</div>
          </div>
          <div className="welcome-stat">
            <div className="welcome-stat-num">{availableTopics}/{totalTopics}</div>
            <div className="welcome-stat-label">Topics Ready</div>
          </div>
        </div>

        <div className="welcome-parts">
          {bookData.parts.map(part => (
            <div key={part.partNumber} className="welcome-part-item">
              <div className="welcome-part-num">{part.partNumber}</div>
              <div className="welcome-part-name">
                {part.name}
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                  {part.chapters.length} chapters
                </span>
              </div>
            </div>
          ))}
        </div>

        {firstTopic && (
          <Link to={`/topic/${firstTopic.id}`} className="welcome-start-link">
            Start Reading
          </Link>
        )}
      </div>
    </div>
  );
}
