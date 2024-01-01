---
sidebar_position: 1
---

# Create a Page

Add **Markdown or React** files to `site/src/pages` to create a **standalone page**:

- `site/src/pages/index.js` → `localhost:3000/`
- `site/src/pages/foo.md` → `localhost:3000/foo`
- `site/src/pages/foo/bar.js` → `localhost:3000/foo/bar`

## Create your first React Page

Create a file at `site/src/pages/my-react-page.js`:

```jsx title="site/src/pages/my-react-page.js"
import React from 'react';
import Layout from '@theme/Layout';

export default function MyReactPage() {
  return (
    <Layout>
      <h1>My React page</h1>
      <p>This is a React page</p>
    </Layout>
  );
}
```

A new page is now available at [http://localhost:3000/my-react-page](http://localhost:3000/my-react-page).

## Create your first Markdown Page

Create a file at `site/src/pages/my-markdown-page.md`:

```mdx title="site/src/pages/my-markdown-page.md"
# My Markdown page

This is a Markdown page
```

A new page is now available at [http://localhost:3000/my-markdown-page](http://localhost:3000/my-markdown-page).
