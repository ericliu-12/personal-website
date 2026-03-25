# Eric Liu — Terminal Portfolio

A fully interactive terminal emulator as a personal portfolio. Type commands to explore my experience, projects, skills, and more — complete with tab autocomplete, command history, fuzzy matching, and hidden easter eggs.

**[ericliu-12.github.io/personal-website](https://ericliu-12.github.io/personal-website/)**

---

## Features

**Terminal Experience**
- Real command parsing with tab autocomplete and arrow-key history
- Fuzzy matching with "did you mean?" suggestions
- Keyboard shortcuts: `Ctrl+C` cancel, `Ctrl+L` clear
- Persistent command history via localStorage

**Visual Design**
- Glassmorphism terminal window with backdrop blur and layered shadows
- Animated particle constellation background that reacts to theme changes
- Card-based layouts for experience, projects, skills, education, and contact
- HTML skill bars with animated gradient fill
- Tech stack tag pills
- CRT scanline overlay for retro authenticity
- Smooth slide-in animations for output lines

**5 Color Themes**
- `green` — classic terminal
- `amber` — warm retro
- `blue` — modern cool
- `dracula` — popular dark palette
- `light` — clean light mode

Theme preference persists across sessions.

**Mobile First**
- Responsive layout with simplified mobile header
- Pill-shaped quick-command buttons in scrollable rows (44px touch targets)
- Virtual keyboard handling with viewport resize detection
- Safe area insets for notched devices
- Optimized breakpoints at 768px and 480px

**Accessibility & Performance**
- `prefers-reduced-motion` respected — all animations disabled
- ARIA roles, live regions, and semantic HTML
- DOM cleanup after 500 lines to prevent memory bloat
- Low-end device detection disables canvas animation
- Print stylesheet for clean output
- `<noscript>` fallback

## Commands

| Command | Description |
|---------|-------------|
| `help` | List available commands (categorized) |
| `about` | About me |
| `experience` | Work experience — supports `experience <company>` |
| `projects` | Project portfolio — supports `projects <name>` |
| `skills` | Languages with skill bars, frameworks & tools as tags |
| `education` | Degree, honors, coursework |
| `resume` | Open resume PDF |
| `contact` | Contact info and links |
| `theme` | Switch color themes with preview swatches |
| `neofetch` | System info — Eric Liu edition |
| `banner` | Re-display the welcome ASCII art |
| `history` | Show command history |
| `clear` | Clear the terminal |

Plus hidden easter eggs — try common shell commands like `sudo`, `vim`, `ls`, `cowsay`, `fortune`, and more.

## Tech Stack

Vanilla HTML + CSS + JavaScript. Zero dependencies. No build step.

- **CSS**: Custom properties for theming, glassmorphism, CSS Grid/Flexbox, `@keyframes` animations, responsive breakpoints, print media query
- **JS**: IIFE modules, MutationObserver for theme reactivity, Canvas API for particle background, Web API (`localStorage`, `visualViewport`, `requestAnimationFrame`)
- **Deploy**: GitHub Pages via GitHub Actions

## Project Structure

```
.
├── index.html              # Main HTML with semantic structure
├── css/
│   └── terminal.css        # Themes, glassmorphism, cards, responsive, print
├── js/
│   ├── commands.js         # Command registry and output templates
│   ├── terminal.js         # Terminal engine, boot sequence, input handling
│   └── background.js       # Particle constellation canvas animation
├── assets/
│   └── Eric-Liu-Resume.pdf
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

## Run Locally

```bash
# Just open the file — no server needed
open index.html

# Or use any static server
npx serve .
```

## License

MIT
