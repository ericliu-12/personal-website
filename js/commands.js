// ── Command Registry ──
// Each command: { description, usage?, hidden?, handler(args) => string[] | {html:string}[] }
// handler returns an array of lines (strings or {html} objects)

const COMMANDS = {};

function registerCommand(name, desc, handler, opts = {}) {
  COMMANDS[name] = { description: desc, handler, ...opts };
}

// ── Shared ASCII Art ──
const ASCII_BANNER = [
  '',
  '      ███████╗██████╗ ██╗ ██████╗',
  '      ██╔════╝██╔══██╗██║██╔════╝',
  '      █████╗  ██████╔╝██║██║     ',
  '      ██╔══╝  ██╔══██╗██║██║     ',
  '      ███████╗██║  ██║██║╚██████╗',
  '      ╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝',
  '',
];

// ── help ──
registerCommand('help', 'List available commands', () => {
  const infoCommands = ['about', 'experience', 'projects', 'skills', 'education'];
  const actionCommands = ['resume', 'contact', 'theme', 'clear', 'history', 'banner'];

  const lines = [
    { html: '<span class="heading">Available Commands</span>' },
    '',
    { html: '<span style="color:var(--text-dim)">  ── Info ──</span>' },
  ];

  for (const name of infoCommands) {
    const cmd = COMMANDS[name];
    if (!cmd) continue;
    const pad = ' '.repeat(Math.max(1, 14 - name.length));
    lines.push({ html: `  <span style="color:var(--accent)">${name}</span>${pad}<span style="color:var(--text-dim)">${cmd.description}</span>` });
  }

  lines.push('');
  lines.push({ html: '<span style="color:var(--text-dim)">  ── Actions ──</span>' });

  for (const name of actionCommands) {
    const cmd = COMMANDS[name];
    if (!cmd) continue;
    const pad = ' '.repeat(Math.max(1, 14 - name.length));
    lines.push({ html: `  <span style="color:var(--accent)">${name}</span>${pad}<span style="color:var(--text-dim)">${cmd.description}</span>` });
  }

  lines.push('');
  lines.push({ html: '<span class="info">Tip: Use Tab for autocomplete, arrow keys for history.</span>' });
  lines.push({ html: '<span class="info">There are also some hidden easter eggs... try common shell commands.</span>' });
  return lines;
});

// ── about ──
registerCommand('about', 'About Eric Liu', () => {
  return [
    '',
    { html: `<div class="output-card">
      <div class="card-header">
        <span class="card-title">Eric Liu</span>
        <span class="card-subtitle">Software Engineer &middot; AWS Certified</span>
      </div>
      <hr class="card-divider">
      <div class="card-body">
        <div>Software Engineer with production experience in <strong style="color:var(--accent)">CI/CD infrastructure</strong>, <strong style="color:var(--accent)">cloud services (AWS/Azure)</strong>, and <strong style="color:var(--accent)">full-stack development</strong>. Currently at Capital One, building tooling that supports 10,000+ engineers.</div>
        <br>
        <div>B.S. Computer Science from Texas A&M University (3.91 GPA) with minors in Statistics and English. Background spans distributed systems, machine learning, and enterprise .NET — comfortable shipping code in Go, Python, TypeScript, and C#.</div>
        <br>
        <div style="color:var(--text-dim)">Interests: ultimate frisbee, marathon running, classic literature.</div>
        <hr class="card-divider">
        <div class="quick-links">
          <a href="https://github.com/ericliu-12" target="_blank" rel="noopener">GitHub</a>
          <a href="https://linkedin.com/in/eric-cb-liu" target="_blank" rel="noopener">LinkedIn</a>
          <a href="mailto:sallure12345@tamu.edu">Email</a>
        </div>
      </div>
    </div>` },
    '',
    { html: 'Type <span style="color:var(--accent)">experience</span>, <span style="color:var(--accent)">projects</span>, or <span style="color:var(--accent)">skills</span> to learn more.' },
  ];
});

// ── experience ──
const EXPERIENCE_DATA = {
  'capitalone': {
    title: 'Software Engineer',
    company: 'Capital One',
    date: 'June 2025 – Present',
    location: 'Plano, TX',
    bullets: [
      'Own and enhance enterprise CI/CD pipeline infrastructure serving 10,000+ engineers across 2,000+ applications',
      'Architected and deployed an OPA policy bundle as a containerized service on AWS Fargate, reducing policy update build time by 80%',
      'Built a fault-detection pipeline step in Go that cut CI/CD build errors by 5% across the platform',
      'Instrumented containerized services with New Relic observability, enabling real-time policy performance monitoring',
      'Maintained 90% test coverage through comprehensive unit and integration testing of pipeline components',
    ],
  },
  'finthrive': {
    title: 'Software Engineer',
    company: 'FinThrive',
    date: 'May 2024 – November 2024',
    location: 'Plano, TX',
    bullets: [
      'Built a .NET Letter Service from the ground up, automating generation of 1,000+ patient-facing documents weekly',
      'Optimized Azure CI/CD pipelines, cutting build and deployment time by 40% across multiple teams',
      'Designed and executed SQL Server queries processing billing data from 50+ healthcare facilities',
      'Integrated Letter Service end-to-end with the existing Payment Estimator backend and frontend',
      'Shipped features on a sprint cadence within an Agile team (planning, standups, retrospectives)',
    ],
  },
  'engr': {
    title: 'Lead Web Developer',
    company: 'ENGR TA Organization',
    date: 'February 2024 – Present',
    location: 'College Station, TX',
    bullets: [
      'Designed and launched the organization\'s Next.js website, serving 4,000+ active users',
      'Integrated Google Calendar API to dynamically display 15+ monthly events with zero manual upkeep',
      'Implemented dynamic routing and server-side rendering for sub-second load times and strong SEO',
    ],
  },
  '180dc': {
    title: 'Technology Consultant',
    company: '180 Degree Consulting',
    date: 'September 2024 – Present',
    location: 'College Station, TX',
    bullets: [
      'Delivered technology consulting engagements for nonprofit clients, driving measurable operational improvements',
      'Engineered a centralized database replacing 1,000+ manual records, reducing data retrieval time by 90%',
      'Presented data-driven recommendations that led to projected 20% reduction in client overhead costs',
    ],
  },
};

function renderExperienceCard(e) {
  const bullets = e.bullets.map(b => `<div class="bullet">${b}</div>`).join('');
  return { html: `<div class="output-card">
    <div class="card-header">
      <span class="card-title">${e.title}</span>
      <span class="card-subtitle">${e.date}</span>
    </div>
    <div style="color:var(--accent);margin-bottom:6px">${e.company} &middot; ${e.location}</div>
    <div class="card-body">${bullets}</div>
  </div>` };
}

registerCommand('experience', 'Work experience — usage: experience [company]', (args) => {
  if (args.length > 0) {
    const query = args.join('').toLowerCase();
    const key = Object.keys(EXPERIENCE_DATA).find(k =>
      k.includes(query) || EXPERIENCE_DATA[k].company.toLowerCase().includes(query)
    );
    if (!key) {
      return [
        { html: `<span class="error">Company not found: "${args.join(' ')}"</span>` },
        { html: `Available: ${Object.values(EXPERIENCE_DATA).map(e => `<span style="color:var(--accent)">${e.company}</span>`).join(', ')}` },
      ];
    }
    return ['', renderExperienceCard(EXPERIENCE_DATA[key]), ''];
  }

  const lines = [
    '',
    { html: '<span class="heading">Work Experience</span>' },
    '',
  ];
  for (const e of Object.values(EXPERIENCE_DATA)) {
    lines.push(renderExperienceCard(e));
  }
  lines.push('');
  lines.push({ html: 'Type <span style="color:var(--accent)">experience &lt;company&gt;</span> for a specific role.' });
  return lines;
});

// ── projects ──
const PROJECTS_DATA = {
  'curious-collections': {
    name: 'Curious Collections',
    tech: ['React', 'TypeScript', 'Flask', 'Express', 'TailwindCSS', 'Notion API'],
    date: 'March 2024',
    bullets: [
      'Full-stack music discovery platform backed by a 5,000-album Notion-powered catalog',
      'Implemented TF-IDF vectorization recommendation engine for personalized album suggestions',
      'Integrated Spotify and AUDD APIs for real-time music data and audio recognition',
      'Architected a dual-backend system (Flask + Express.js) to handle complex API orchestration',
    ],
  },
  'whimsiway': {
    name: 'WhimsiWay',
    tech: ['React', 'Flask', 'scikit-learn', 'pandas', 'Mapbox', 'Nominatim'],
    date: 'February 2024',
    bullets: [
      'Built a vehicle safety analytics dashboard with real-time route risk assessment',
      'Applied DBSCAN and k-means clustering to visualize accident hotspots on Folium maps',
      'Integrated Mapbox API for turn-by-turn navigation with hazard-aware routing',
      'Trained a random forest severity classifier achieving 95% prediction accuracy',
    ],
  },
};

function renderProjectCard(p) {
  const bullets = p.bullets.map(b => `<div class="bullet">${b}</div>`).join('');
  const tags = p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
  return { html: `<div class="output-card">
    <div class="card-header">
      <span class="card-title">${p.name}</span>
      <span class="card-subtitle">${p.date}</span>
    </div>
    <div style="margin:6px 0">${tags}</div>
    <div class="card-body">${bullets}</div>
  </div>` };
}

registerCommand('projects', 'Projects — usage: projects [name]', (args) => {
  if (args.length > 0) {
    const query = args.join('').toLowerCase();
    const key = Object.keys(PROJECTS_DATA).find(k =>
      k.includes(query) || PROJECTS_DATA[k].name.toLowerCase().includes(query)
    );
    if (!key) {
      return [
        { html: `<span class="error">Project not found: "${args.join(' ')}"</span>` },
        { html: `Available: ${Object.values(PROJECTS_DATA).map(p => `<span style="color:var(--accent)">${p.name}</span>`).join(', ')}` },
      ];
    }
    return ['', renderProjectCard(PROJECTS_DATA[key]), ''];
  }

  const lines = [
    '',
    { html: '<span class="heading">Projects</span>' },
    '',
  ];
  for (const p of Object.values(PROJECTS_DATA)) {
    lines.push(renderProjectCard(p));
  }
  lines.push('');
  lines.push({ html: 'Type <span style="color:var(--accent)">projects &lt;name&gt;</span> for details.' });
  return lines;
});

// ── skills ──
registerCommand('skills', 'Technical skills with visual breakdown', () => {
  const languages = [
    { name: 'Python', level: 90 },
    { name: 'Go', level: 85 },
    { name: 'JavaScript', level: 85 },
    { name: 'TypeScript', level: 80 },
    { name: 'Java', level: 80 },
    { name: 'SQL', level: 80 },
    { name: 'C#', level: 75 },
    { name: 'C++', level: 70 },
    { name: 'R', level: 60 },
  ];

  const lines = [
    '',
    { html: '<span class="heading">Languages</span>' },
    '',
  ];

  for (const lang of languages) {
    lines.push({ html: `<div class="skill-bar-container">
      <span class="skill-bar-label">${lang.name}</span>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" style="--bar-width:${lang.level}%"></div>
      </div>
      <span class="skill-bar-pct">${lang.level}%</span>
    </div>` });
  }

  const frameworks = ['React', 'Angular', '.NET', 'Node.js', 'TailwindCSS', 'Flask', 'NumPy', 'pandas', 'Matplotlib'];
  const tools = ['AWS', 'Azure', 'Git', 'PostgreSQL', 'MongoDB', 'Jira', 'Jenkins', 'Docker'];

  lines.push('');
  lines.push({ html: '<span class="heading">Frameworks & Libraries</span>' });
  lines.push({ html: '<div style="margin:6px 0">' + frameworks.map(f => `<span class="tech-tag">${f}</span>`).join('') + '</div>' });

  lines.push('');
  lines.push({ html: '<span class="heading">Developer Tools</span>' });
  lines.push({ html: '<div style="margin:6px 0">' + tools.map(t => `<span class="tech-tag">${t}</span>`).join('') + '</div>' });

  lines.push('');
  lines.push({ html: '<span class="heading">Certifications</span>' });
  lines.push({ html: `<div class="output-card">
    <div class="bullet">AWS Solutions Architect Associate</div>
    <div class="bullet">Microsoft Azure Fundamentals</div>
  </div>` });
  lines.push('');
  return lines;
});

// ── education ──
registerCommand('education', 'Education details', () => {
  return [
    '',
    { html: `<div class="output-card">
      <div class="card-header">
        <span class="card-title">Texas A&M University</span>
        <span class="card-subtitle">Graduated May 2026</span>
      </div>
      <div style="color:var(--accent)">B.S. Computer Science &middot; 3.91 GPA</div>
      <div style="color:var(--text-dim);margin-bottom:8px">Minors in Statistics and English &middot; College Station, TX</div>
      <hr class="card-divider">
      <div class="card-body">
        <div style="color:var(--prompt-color);font-weight:700;margin:4px 0">Honors & Awards</div>
        <div class="bullet">President's Endowed Scholar</div>
        <div class="bullet">Craig and Galen Brown Engineering Honors</div>
        <div class="bullet">University Honors</div>
        <div class="bullet">Eagle Scout</div>
        <hr class="card-divider">
        <div style="color:var(--prompt-color);font-weight:700;margin:4px 0">Key Coursework</div>
        <div>Distributed Systems, Machine Learning, Data Structures & Algorithms, Software Engineering</div>
      </div>
    </div>` },
    '',
  ];
});

// ── resume ──
registerCommand('resume', 'Open resume PDF', () => {
  window.open('assets/Eric-Liu-Resume.pdf', '_blank');
  return [
    '',
    { html: '  Resume opened in a new tab!' },
    { html: '  If it didn\'t open, <a href="assets/Eric-Liu-Resume.pdf" target="_blank" rel="noopener">click here to download</a>.' },
    '',
  ];
});

// ── contact ──
registerCommand('contact', 'Contact information', () => {
  return [
    '',
    { html: `<div class="output-card">
      <div class="card-title" style="margin-bottom:4px">Get in Touch</div>
      <div style="color:var(--text-dim);margin-bottom:10px;font-size:0.9em">Open to full-time roles, contract work, and interesting collaborations.</div>
      <hr class="card-divider">
      <div class="card-body">
        <div style="margin:4px 0">Email &nbsp;&nbsp;&nbsp;&nbsp; <a href="mailto:sallure12345@tamu.edu">sallure12345@tamu.edu</a></div>
        <div style="margin:4px 0">Phone &nbsp;&nbsp;&nbsp;&nbsp; <a href="tel:832-715-9765">832-715-9765</a></div>
        <div style="margin:4px 0">LinkedIn &nbsp; <a href="https://linkedin.com/in/eric-cb-liu" target="_blank" rel="noopener">linkedin.com/in/eric-cb-liu</a></div>
        <div style="margin:4px 0">GitHub &nbsp;&nbsp;&nbsp; <a href="https://github.com/ericliu-12" target="_blank" rel="noopener">github.com/ericliu-12</a></div>
      </div>
    </div>` },
    '',
  ];
});

// ── theme ──
const THEME_COLORS = {
  green: '#00ff41',
  amber: '#ffb000',
  blue: '#5cb8ff',
  dracula: '#50fa7b',
  light: '#0066cc',
};

registerCommand('theme', 'Change color theme — usage: theme [name]', (args) => {
  const themes = Object.keys(THEME_COLORS);
  if (args.length === 0) {
    const current = document.documentElement.getAttribute('data-theme') || 'green';
    return [
      '',
      { html: `<span class="heading">Available Themes</span>  <span style="color:var(--text-dim)">(current: ${current})</span>` },
      '',
      ...themes.map(t => {
        const marker = t === current ? ' ◀' : '';
        return { html: `  <span class="theme-swatch" style="background:${THEME_COLORS[t]}"></span><span style="color:var(--accent)">${t}</span>${marker}` };
      }),
      '',
      { html: 'Usage: <span style="color:var(--accent)">theme &lt;name&gt;</span>' },
    ];
  }
  const name = args[0].toLowerCase();
  if (!themes.includes(name)) {
    return [{ html: `<span class="error">Unknown theme "${name}". Available: ${themes.join(', ')}</span>` }];
  }
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem('terminal-theme', name);
  return [{ html: `Theme switched to <span style="color:var(--accent)">${name}</span>.` }];
});

// ── neofetch ──
registerCommand('neofetch', 'System info — Eric Liu edition', () => {
  return [
    '',
    { html: '<span style="color:var(--accent)">      ███████╗██████╗ ██╗ ██████╗</span>     <span class="heading" style="border:none;padding:0;margin:0">eric@liu</span>' },
    { html: '<span style="color:var(--accent)">      ██╔════╝██╔══██╗██║██╔════╝</span>     ─────────────' },
    { html: '<span style="color:var(--accent)">      █████╗  ██████╔╝██║██║     </span>     <span style="color:var(--text-dim)">Role:</span> Software Engineer' },
    { html: '<span style="color:var(--accent)">      ██╔══╝  ██╔══██╗██║██║     </span>     <span style="color:var(--text-dim)">Org:</span> Capital One' },
    { html: '<span style="color:var(--accent)">      ███████╗██║  ██║██║╚██████╗</span>     <span style="color:var(--text-dim)">Stack:</span> Go / Python / TS / C#' },
    { html: '<span style="color:var(--accent)">      ╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝</span>     <span style="color:var(--text-dim)">Cloud:</span> AWS (Certified SA) / Azure' },
    { html: '                                      <span style="color:var(--text-dim)">Infra:</span> Docker / CI-CD / Fargate' },
    { html: '                                      <span style="color:var(--text-dim)">Editor:</span> VS Code + vim' },
    { html: '                                      <span style="color:var(--text-dim)">Edu:</span> Texas A&M, CS, 3.91 GPA' },
    { html: '                                      <span style="color:var(--text-dim)">Status:</span> Open to opportunities' },
    '',
    { html: '      <span style="color:#ff5f57">███</span><span style="color:#febc2e">███</span><span style="color:#28c840">███</span><span style="color:#5cb8ff">███</span><span style="color:#a78bfa">███</span><span style="color:#ff79c6">███</span><span style="color:#f8f8f2">███</span><span style="color:#6272a4">███</span>' },
    '',
  ];
});

// ── clear ──
registerCommand('clear', 'Clear the terminal', () => {
  const output = document.getElementById('output');
  const inputLine = document.getElementById('input-line');
  while (output.firstChild && output.firstChild !== inputLine) {
    output.removeChild(output.firstChild);
  }
  return [];
});

// ── history ──
registerCommand('history', 'Show command history', () => {
  const hist = JSON.parse(localStorage.getItem('terminal-history') || '[]');
  if (hist.length === 0) return ['  No commands in history.'];
  const lines = ['', { html: '<span class="heading">Command History</span>' }, ''];
  hist.forEach((cmd, i) => {
    lines.push(`  ${String(i + 1).padStart(4)}  ${cmd}`);
  });
  lines.push('');
  return lines;
});

// ── banner ──
registerCommand('banner', 'Display the welcome banner', () => {
  const lines = ASCII_BANNER.map(line => ({
    html: `<span style="color:var(--accent)">${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`
  }));
  lines.push({ html: '      Type <span style="color:var(--accent)">help</span> to see available commands.' });
  lines.push('');
  return lines;
});

// ── Easter Eggs (hidden) ──
registerCommand('sudo', '', () => {
  return [{ html: '<span class="error">  visitor is not in the sudoers file. This incident will be reported.</span>' }];
}, { hidden: true });

registerCommand('rm', '', (args) => {
  if (args.join(' ').includes('-rf')) {
    return [
      { html: '<span class="error">  System protected by plot armor. Nice try though.</span>' },
    ];
  }
  return [{ html: '<span class="error">  Permission denied. This is a read-only portfolio.</span>' }];
}, { hidden: true });

registerCommand('vim', '', () => {
  return [
    '  You\'ve entered Vim. Good luck getting out.',
    '  (Just kidding. But seriously, try :q! )',
  ];
}, { hidden: true });

registerCommand('exit', '', () => {
  return [
    '  There is no escape. But you can close the tab.',
    '  Or better yet, type \'contact\' and say hello!',
  ];
}, { hidden: true });

registerCommand('ls', '', () => {
  return [
    '',
    '  drwxr-xr-x  about/',
    '  drwxr-xr-x  experience/',
    '  drwxr-xr-x  projects/',
    '  drwxr-xr-x  skills/',
    '  -rw-r--r--  resume.pdf',
    '  -rw-r--r--  contact.txt',
    '',
    { html: '<span class="info">  Hint: These aren\'t real directories — try the commands instead!</span>' },
  ];
}, { hidden: true });

registerCommand('pwd', '', () => {
  return ['  /home/visitor/ericliu-portfolio'];
}, { hidden: true });

registerCommand('echo', '', (args) => {
  return [args.length ? '  ' + args.join(' ') : ''];
}, { hidden: true });

registerCommand('cowsay', '', (args) => {
  const msg = args.length ? args.join(' ') : 'Moo! Type help for commands.';
  const border = '─'.repeat(msg.length + 2);
  return [
    '',
    `  ┌${border}┐`,
    `  │ ${msg} │`,
    `  └${border}┘`,
    '         \\   ^__^',
    '          \\  (oo)\\_______',
    '             (__)\\       )\\/\\',
    '                 ||----w |',
    '                 ||     ||',
    '',
  ];
}, { hidden: true });

const FORTUNES = [
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"The best error message is the one that never shows up." — Thomas Fuchs',
  '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
  '"Simplicity is the soul of efficiency." — Austin Freeman',
  '"Make it work, make it right, make it fast." — Kent Beck',
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"The only way to go fast is to go well." — Robert C. Martin',
  '"Programs must be written for people to read, and only incidentally for machines to execute." — Harold Abelson',
  '"Debugging is twice as hard as writing the code in the first place." — Brian Kernighan',
];

registerCommand('fortune', '', () => {
  const f = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  return ['', `  ${f}`, ''];
}, { hidden: true });

registerCommand('whoami', '', () => {
  return ['  visitor@ericliu ~ (guest)'];
}, { hidden: true });

registerCommand('date', '', () => {
  return ['  ' + new Date().toString()];
}, { hidden: true });

registerCommand('hire', '', () => {
  return [
    '',
    { html: '  I like the way you think.' },
    { html: '  <a href="mailto:sallure12345@tamu.edu">sallure12345@tamu.edu</a> &middot; <a href="https://linkedin.com/in/eric-cb-liu" target="_blank" rel="noopener">LinkedIn</a> &middot; <a href="assets/Eric-Liu-Resume.pdf" target="_blank" rel="noopener">Resume</a>' },
    '',
  ];
}, { hidden: true });

registerCommand('cat', '', () => {
  return [{ html: '<span class="info">  Meow! Did you mean to type a command? Try \'help\'.</span>' }];
}, { hidden: true });

registerCommand('cd', '', () => {
  return [{ html: '<span class="info">  There\'s nowhere to go. You\'re already home.</span>' }];
}, { hidden: true });
