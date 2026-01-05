@@@
title: Testing Frontmatter Config
presenter: Test User
date: 2026-01-05
align: top
text: center
size: 24
@@@

# First Slide

This slide should inherit the frontmatter config:
- align: top
- text: center
- size: 24px (custom numeric size!)

===

# Second Slide

This slide also inherits the same config from frontmatter.
Font size is 24px.

=== align=center text=left size=16

# Third Slide with Override

This slide has:
- align: center (overrides frontmatter's "top")
- text: left (overrides frontmatter's "center")
- size: 16px (overrides frontmatter's 24px)

=== size=xl

# Fourth Slide with Predefined Size

This slide uses predefined size:
- align: top (inherited)
- text: center (inherited)
- size: xl (predefined Tailwind size)

=== size=invalid123abc

# Fifth Slide with Invalid Size

Invalid size value (invalid123abc) falls back to frontmatter default:
- size: 24px (fallback to frontmatter)
