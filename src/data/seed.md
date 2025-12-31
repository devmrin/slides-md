===/===
title: React Server Components Architecture
by: Engineering Team
date: 2025-12-31
description: An overview of React Server Components and their architectural implications
===/===

# What Are React Server Components

- Components rendered on the server
- Do not ship JavaScript to the browser
- Designed for performance and scalability
- Integrated into modern React frameworks

> Rendering location is now an architectural choice

===

# Core Motivation

- Reduce client-side JavaScript bundle size
- Improve initial load performance
- Enable direct access to backend resources
- Simplify data fetching logic

===

# Server vs Client Components

- Server Components handle data and rendering
- Client Components handle interactivity
- Clear boundary enforced by architecture
- Explicit opt-in for client-side behavior

===

# Rendering Model

- Server renders component tree
- Output streamed to the client
- Client hydrates only interactive parts
- Non-interactive UI remains static

===

# Data Fetching Pattern

- Fetch data directly in components
- No need for API proxy layers
- Leverages server-only credentials
- Eliminates duplicated data logic

===

# Server Component Example

```jsx
import db from "./db";

export default async function UserProfile() {
  const user = await db.user.findFirst();

  return (
    <section>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </section>
  );
}
```

===

# When to Use Client Components

- Forms and user input
- Event handlers and state hooks
- Browser-only APIs
- Animations and effects

===

# Architectural Implications

- Rethink component boundaries
- Shift logic closer to data
- Improve performance by default
- Enforce clearer separation of concerns

===

# Q&A

thank you
