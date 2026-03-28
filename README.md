# Inventory Search

This project is a Next.js inventory search app with server-side filtering and pagination over a local JSON dataset.

## Run Locally

```bash
npm install
npm run dev
```

The development server runs on `http://localhost:3000`.

## Deployment

This app is deployed on Vercel.

- Production URL: `https://inventory-search-brown.vercel.app`
- Project URL: `https://vercel.com/chetanshimpi2001-2539s-projects/inventory-search`
- The GitHub repository is connected to Vercel, so pushes to `main` trigger new deployments automatically.

## Environment Variables

No environment variables are required for the current codebase.

- Use `.env.local` for any future secrets or deployment-specific values.
- A starter template is included in `.env.example`.
- No confidential values are currently hardcoded in this repository.
- No Vercel environment variables are currently required for deployment.

## API Endpoints

- `GET /search` searches inventory with optional `q`, `category`, `minPrice`, `maxPrice`, `page`, and `pageSize` query params.
- `GET /api/search` is kept as a compatibility alias for the same search handler.
- `GET /api/categories` returns the available categories.

## Search Logic

- The search starts from the full inventory dataset and applies filters only when they are provided.
- `q` performs a case-insensitive partial match on `productName` by lowercasing both the query and stored product names before using substring matching.
- `category` is treated as an exact, case-insensitive filter.
- `minPrice` and `maxPrice` are inclusive numeric filters, so multiple filters can be combined in the same request.
- If no filters are provided, the API still returns all records. When pagination parameters are sent by the UI, the API returns the matching records page by page.
- Invalid price ranges are rejected before results are returned.

## Performance Improvement

Server-side pagination keeps the frontend from requesting and rendering every matching record at once. The search layer also precomputes lowercase product names and a category index in memory so repeated searches avoid repeated normalization and can start from a smaller candidate set when a category filter is present.

For a production-scale dataset beyond this assessment, the next step would be moving the search to a database such as PostgreSQL and adding indexes on `productName`, `category`, and `price`.
