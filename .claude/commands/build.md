Create a production build of the book site.

## Steps

1. Run /sync first to ensure all content is up to date
2. cd ./book-site && npm run build
3. The output will be in ./book-site/dist/

## Report

- Build size
- Total pages/topics included
- Any build warnings
- How to preview: npx serve dist
- How to deploy: the dist/ folder is a static site, deployable to Netlify, Vercel, GitHub Pages, or any static host
