# Web App Notes

## Assistant drawer behavior

The floating **Open Assistant** button is a toggle control on both policy list and policy detail pages.

You can close the drawer by:
- clicking the same floating button again,
- clicking the **X** close button in the drawer header,
- pressing the **Escape (ESC)** key,
- clicking the backdrop overlay.

## Policy Terms filters

The `/policy-terms` filters are URL-backed (`q`, `state`, `status`, `exp_from`, `exp_to`, `page`, `size`, `sort`), so filtered results can be refreshed, shared, and bookmarked.

## Running locally

Start the web app:

```bash
cd web
npm install
npm run dev
```

Default URL:
- `http://localhost:3000/policy-terms`

Optional URL params for `/policy-terms`:
- `q`, `state`, `status`, `exp_from`, `exp_to`, `page`, `size`, `sort`

Pagination defaults:
- `page=0`
- `size=20`

Example link:
- `http://localhost:3000/policy-terms?q=OH&state=AZ&page=0&size=20`
