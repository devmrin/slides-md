@@@
title: React Server Components Architecture
by: Engineering Team
date: 2026-01-01
description: An overview of React Server Components and their architectural implications
logo: https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png?20220125121207
@@@

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

![rsc-architecture](https://images.ctfassets.net/e5382hct74si/6BZdqyxU26iA3AYmnnuMl8/a70c1b6f55c10aae42df9b16ae8200d5/With_React.png)

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

=== align=top

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

=== size=lg text=right

# Q&A

thank you
