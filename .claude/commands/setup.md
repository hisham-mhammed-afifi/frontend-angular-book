You are a book site builder. Scaffold a React app that renders the "Frontend to Framework" book from markdown files.

## Step 1: Discovery

1. Read ./PROGRESS.md to understand the full book structure
2. The hierarchy is:
   - **Phase** (6 total) = sidebar group
   - **Section** (44 total) = chapter in the sidebar
   - Each **.md file** = a topic page
3. Scan ./output/section-XX/ folders to find which chapters have content
4. Cross-reference PROGRESS.md: [x] = file exists, [ ] = not yet written

## Step 2: Scaffold the React app

Create a Vite + React project in ./book-site/:

```bash
npm create vite@latest book-site -- --template react
cd book-site
npm install
npm install react-markdown remark-gfm rehype-highlight rehype-slug rehype-raw
npm install react-router-dom
npm install highlight.js
```

## Step 3: Build the app structure

```
book-site/
  src/
    App.jsx            # Layout with sidebar + content area
    main.jsx           # Router setup
    components/
      Sidebar.jsx      # Navigation tree: Parts > Chapters > Topics
      MarkdownPage.jsx # Renders a single .md file
      TableOfContents.jsx # In-page heading navigation (right side)
    data/
      book-structure.json  # Generated from PROGRESS.md scan
    styles/
      globals.css      # Book-like typography, code blocks, responsive layout
  public/
    content/           # Symlink or copy of output/section-XX/ folders
```

## Step 4: Generate book-structure.json

Scan all available files and produce:

```json
{
  "title": "Frontend to Framework: A Complete Path to Angular Mastery",
  "subtitle": "A Practical Guide to Building Production-Grade Angular Applications from the Ground Up",
  "author": "AUTHOR_NAME_HERE",
  "parts": [
    {
      "partNumber": 1,
      "name": "Web Fundamentals",
      "phase": "Phase 1",
      "chapters": [
        {
          "chapterNumber": 1,
          "name": "HTML Deep Dive",
          "folder": "section-01",
          "topics": [
            { "id": "1.1", "file": "1.1-document-structure.md", "title": "Document Structure", "exists": true },
            { "id": "1.2", "file": "1.2-semantic-elements.md", "title": "Semantic Elements", "exists": true }
          ]
        }
      ]
    }
  ]
}
```

## Step 5: Copy content files

Copy (not symlink) all ./output/section-XX/ folders into ./book-site/public/content/:

```bash
cp -r ./output/section-* ./book-site/public/content/
```

## Step 6: Design requirements

The site should look like a clean technical book reader:

- **Left sidebar** (collapsible on mobile):
  - Parts as collapsible groups
  - Chapters as collapsible sub-groups
  - Topics as links, with a subtle indicator for current page
  - Show chapter number and name
  - Dim or hide topics that do not exist yet (exists: false)

- **Main content area** (centered, max-width ~800px):
  - Renders markdown with proper typography
  - Code blocks with syntax highlighting (highlight.js)
  - Styled tables, blockquotes, lists
  - "Chapter N: [Name]" header at the top of each chapter's first topic
  - Previous/Next navigation at the bottom of each topic

- **Right sidebar** (hidden on mobile):
  - In-page table of contents generated from headings in the current .md file

- **Top bar**:
  - Book title
  - Current chapter/topic breadcrumb
  - Mobile menu toggle

- **Typography** (book-like):
  - Body: system font stack, 16px/1.7 line-height
  - Headings: bold, clear hierarchy
  - Code blocks: monospace, light gray background, subtle border, horizontal scroll
  - Inline code: monospace with slight background
  - Links: colored, underlined on hover only

- **Responsive**: sidebar collapses to hamburger on mobile, content goes full width

- **Dark/light mode**: respect system preference via prefers-color-scheme, with a toggle in the top bar

- **URL structure**: /part/1/chapter/1/topic/1.1 or similar readable pattern

## Step 7: Report

After scaffolding, show:
- Total parts, chapters, topics discovered
- How many topics have content vs missing
- How to run: cd book-site && npm run dev
- Tell user to run /sync after adding new content files
