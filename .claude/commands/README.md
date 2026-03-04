# Angular Mastery Book Site - Claude Code Commands

## Installation

```bash
mkdir -p .claude/commands
cp setup.md sync.md status.md build.md .claude/commands/
```

## Book Structure Mapping

Your PROGRESS.md maps to the site as:

| PROGRESS.md | Site Element |
|-------------|-------------|
| Phase | Sidebar group (Part I, II, etc.) |
| Section | Chapter (collapsible in sidebar) |
| Topic .md file | Individual page with rendered markdown |

## Workflow

```
/setup      Scaffolds a Vite + React app in ./book-site/
            Generates book-structure.json from PROGRESS.md
            Copies existing content into the site

/sync       Detects new/changed .md files in output/
            Copies them into book-site/public/content/
            Updates book-structure.json
            Dev server hot-reloads automatically

/status     Shows content coverage per chapter

/build      Runs /sync then creates a production build in dist/
```

## Typical session

```bash
# First time
/setup
cd book-site && npm run dev    # opens at localhost:5173

# After writing more content
/sync                          # new files appear in the site instantly

# Check progress
/status

# Deploy
/build                         # static site in book-site/dist/
```

## Site features

- Sidebar navigation with Parts > Chapters > Topics
- Markdown rendering with syntax-highlighted code blocks
- In-page table of contents from headings
- Previous/Next topic navigation
- Dark/light mode toggle
- Responsive (hamburger menu on mobile)
- Missing topics dimmed in sidebar
- Breadcrumb showing current location
