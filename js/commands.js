// ── Command Registry ──
// Each command: { description, usage?, hidden?, handler(args) => string[] | {html:string}[] }
// handler returns an array of lines (strings or {html} objects)

const COMMANDS = {};

function registerCommand(name, desc, handler, opts = {}) {
  COMMANDS[name] = { description: desc, handler, ...opts };
}

// ── help ──
registerCommand('help', 'List available commands', () => {
  const lines = [
    { html: '<span class="heading">Available Commands</span>' },
    '',
  ];
  const visible = Object.entries(COMMANDS)
    .filter(([, v]) => !v.hidden)
    .sort(([a], [b]) => a.localeCompare(b));
  for (const [name, cmd] of visible) {
    const pad = ' '.repeat(Math.max(1, 14 - name.length));
    lines.push({ html: `  <span style="color:var(--accent)">${name}</span>${pad}<span style="color:var(--text-dim)">${cmd.description}</span>` });
  }
  lines.push('');
  lines.push({ html: '<span class="info">Tip: Use Tab for autocomplete, arrow keys for history.</span>' });
  return lines;
});

// ── about ──
registerCommand('about', 'About Eric Liu', () => {
  return [
    '',
    '  ╔══════════════════════════════════════════════╗',
    '  ║              Hey, I\'m Eric Liu!              ║',
    '  ╠══════════════════════════════════════════════╣',
    '  ║                                              ║',
    '  ║  CS student at Texas A&M University          ║',
    '  ║  Minor in Statistics and English             ║',
    '  ║  Expected Graduation: May 2026               ║',
    '  ║                                              ║',
    '  ║  I build software that solves real            ║',
    '  ║  problems — from CI/CD pipelines at          ║',
    '  ║  Capital One to music discovery apps.         ║',
    '  ║                                              ║',
    '  ║  When I\'m not coding, you\'ll find me         ║',
    '  ║  playing ultimate frisbee, running            ║',
    '  ║  marathons, or reading classic lit.           ║',
    '  ║                                              ║',
    '  ╚══════════════════════════════════════════════╝',
    '',
    { html: '  Type <span style="color:var(--accent)">experience</span>, <span style="color:var(--accent)">projects</span>, or <span style="color:var(--accent)">skills</span> to learn more.' },
  ];
});

// ── experience ──
const EXPERIENCE_DATA = {
  'capitalone': {
    title: 'Software Engineer Intern',
    company: 'Capital One',
    date: 'June 2025 – Present',
    location: 'Plano, TX',
    bullets: [
      'Enhanced Capital One\'s CI/CD pipeline, supporting 10,000+ engineers and 2,000+ applications',
      'Deployed an OPA policy bundle as a Docker container on AWS Fargate, cutting policy update build time by 80%',
      'Developed a fault-detection pipeline step in Go, reducing build errors in the CI/CD pipeline by 5%',
      'Integrated New Relic metrics for containerized application, improving visibility into policy performance',
      'Achieved 90% test coverage by writing unit and integration tests for pipeline enhancements',
    ],
  },
  'finthrive': {
    title: 'Software Engineer Intern',
    company: 'FinThrive',
    date: 'May 2024 – November 2024',
    location: 'Plano, TX',
    bullets: [
      'Implemented Letter Service using .NET, automating generation of 1,000+ patient-facing documents weekly',
      'Optimized Azure CI/CD pipelines for faster deployments, reducing build and deployment time by 40%',
      'Queried and processed billing data from 50+ facilities using Microsoft SQL Server',
      'Integrated Letter Service with existing Payment Estimator backend and frontend for end-to-end functionality',
      'Engaged in Agile processes (sprint planning, daily stand-ups, retrospectives) to ensure timely delivery',
    ],
  },
  'engr': {
    title: 'Web Officer',
    company: 'ENGR TA Organization',
    date: 'February 2024 – Present',
    location: 'College Station, TX',
    bullets: [
      'Launched the organization website using Next.js, improving responsiveness and reaching 4,000+ users',
      'Integrated the Google Calendar API to automate display of 15+ monthly TA events',
      'Implemented dynamic routing and server-side rendering to optimize load times and SEO',
    ],
  },
  '180dc': {
    title: 'Consultant',
    company: '180 Degree Consulting',
    date: 'September 2024 – Present',
    location: 'College Station, TX',
    bullets: [
      'Provided consulting services to nonprofit organizations, enhancing operational efficiency',
      'Built a centralized database for 1,000+ manual records, cutting data retrieval time by 90%',
      'Delivered client presentations that led to cost-saving strategies projected to reduce overhead by 20%',
    ],
  },
};

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
    const e = EXPERIENCE_DATA[key];
    const lines = [
      '',
      { html: `  <span class="heading">${e.title}</span>` },
      { html: `  <span style="color:var(--accent)">${e.company}</span>  |  ${e.date}  |  ${e.location}` },
      '  ─'.repeat(1) + '─'.repeat(40),
    ];
    for (const b of e.bullets) {
      lines.push(`    • ${b}`);
    }
    lines.push('');
    return lines;
  }

  const lines = [
    '',
    { html: '<span class="heading">  Work Experience</span>' },
    '',
  ];
  for (const [key, e] of Object.entries(EXPERIENCE_DATA)) {
    lines.push({ html: `  <span style="color:var(--accent)">${e.title}</span> @ ${e.company}` });
    lines.push({ html: `  <span class="info">${e.date}  |  ${e.location}</span>` });
    lines.push('');
  }
  lines.push({ html: 'Type <span style="color:var(--accent)">experience &lt;company&gt;</span> for details (e.g. <span style="color:var(--accent)">experience capitalone</span>)' });
  return lines;
});

// ── projects ──
const PROJECTS_DATA = {
  'curious-collections': {
    name: 'Curious Collections',
    tech: 'React, TypeScript, Flask, Express, TailwindCSS, Notion',
    date: 'March 2024',
    bullets: [
      'Web application for music discovery with a Notion-powered catalog of 5,000 albums',
      'Song recommendation algorithm using TF-IDF vectorization to tailor suggestions',
      'Integrated Spotify and AUDD APIs for music data and song recognition',
      'Dual-backend system using Flask and Express.js for complex API requests',
    ],
  },
  'whimsiway': {
    name: 'WhimsiWay',
    tech: 'React, Flask, scikit-learn, pandas, folium, Mapbox API, Nominatim',
    date: 'February 2024',
    bullets: [
      'Vehicle safety dashboard with route finder to identify accident hotspots',
      'Folium maps to visualize accident clusters using DBSCAN and k-means algorithms',
      'Mapbox API integration for versatile navigation in accident-prone areas',
      'Severity model with random forest classifier — 95% accuracy',
    ],
  },
};

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
    const p = PROJECTS_DATA[key];
    const lines = [
      '',
      { html: `  <span class="heading">${p.name}</span>  <span class="info">(${p.date})</span>` },
      { html: `  <span style="color:var(--accent)">Stack:</span> ${p.tech}` },
      '  ' + '─'.repeat(40),
    ];
    for (const b of p.bullets) {
      lines.push(`    • ${b}`);
    }
    lines.push('');
    return lines;
  }

  const lines = [
    '',
    { html: '<span class="heading">  Projects</span>' },
    '',
  ];
  for (const [key, p] of Object.entries(PROJECTS_DATA)) {
    lines.push({ html: `  <span style="color:var(--accent)">${p.name}</span>  <span class="info">(${p.date})</span>` });
    lines.push({ html: `  <span class="info">${p.tech}</span>` });
    lines.push('');
  }
  lines.push({ html: 'Type <span style="color:var(--accent)">projects &lt;name&gt;</span> for details (e.g. <span style="color:var(--accent)">projects whimsiway</span>)' });
  return lines;
});

// ── skills ──
registerCommand('skills', 'Technical skills with visual breakdown', () => {
  const languages = [
    { name: 'Go', level: 85 },
    { name: 'Java', level: 80 },
    { name: 'Python', level: 90 },
    { name: 'C#', level: 75 },
    { name: 'C++', level: 70 },
    { name: 'JavaScript', level: 85 },
    { name: 'TypeScript', level: 80 },
    { name: 'SQL', level: 80 },
    { name: 'R', level: 60 },
  ];

  const lines = [
    '',
    { html: '<span class="heading">  Languages</span>' },
    '',
  ];

  for (const lang of languages) {
    const barWidth = Math.round(lang.level / 5);
    const bar = '█'.repeat(barWidth) + '░'.repeat(20 - barWidth);
    const pad = ' '.repeat(Math.max(1, 14 - lang.name.length));
    lines.push({ html: `  <span style="color:var(--text-dim)">${lang.name}</span>${pad}<span style="color:var(--accent)">${bar}</span> ${lang.level}%` });
  }

  lines.push('');
  lines.push({ html: '<span class="heading">  Frameworks & Libraries</span>' });
  lines.push('  React, Angular, .NET, Node.js, TailwindCSS, Flask, NumPy, pandas, Matplotlib');
  lines.push('');
  lines.push({ html: '<span class="heading">  Developer Tools</span>' });
  lines.push('  AWS, Azure, Git, PostgreSQL, MongoDB, Jira, Jenkins, Docker');
  lines.push('');
  lines.push({ html: '<span class="heading">  Certifications</span>' });
  lines.push('  • AWS Solutions Architect Associate');
  lines.push('  • Microsoft Azure Fundamentals');
  lines.push('');
  return lines;
});

// ── education ──
registerCommand('education', 'Education details', () => {
  return [
    '',
    { html: '<span class="heading">  Education</span>' },
    '',
    { html: '  <span style="color:var(--accent)">Texas A&M University</span>  |  College Station, TX' },
    '  B.S. Computer Science',
    '  Minor in Statistics and English',
    '  GPA: 3.913  |  Aug 2022 – May 2026',
    '',
    { html: '<span class="heading">  Honors</span>' },
    '  • Eagle Scout',
    '  • Craig and Galen Brown Engineering Honors',
    '  • University Honors',
    '  • President\'s Endowed Scholar',
    '',
    { html: '<span class="heading">  Relevant Coursework</span>' },
    '  Data Structures and Algorithms, Distributed Systems,',
    '  Machine Learning, Software Engineering',
    '',
  ];
});

// ── resume ──
registerCommand('resume', 'Open resume PDF', () => {
  window.open('assets/Eric-Liu-Resume.pdf', '_blank');
  return [
    '',
    { html: '  Resume opened in a new tab! 📄' },
    { html: '  If it didn\'t open, <a href="assets/Eric-Liu-Resume.pdf" target="_blank" rel="noopener">click here to download</a>.' },
    '',
  ];
});

// ── contact ──
registerCommand('contact', 'Contact information', () => {
  return [
    '',
    { html: '<span class="heading">  Contact</span>' },
    '',
    { html: '  📧  Email     <a href="mailto:sallure12345@tamu.edu">sallure12345@tamu.edu</a>' },
    { html: '  📱  Phone     <a href="tel:832-715-9765">832-715-9765</a>' },
    { html: '  💼  LinkedIn  <a href="https://linkedin.com/in/eric-cb-liu" target="_blank" rel="noopener">linkedin.com/in/eric-cb-liu</a>' },
    { html: '  🐙  GitHub    <a href="https://github.com/ericliu-12" target="_blank" rel="noopener">github.com/ericliu-12</a>' },
    '',
  ];
});

// ── theme ──
registerCommand('theme', 'Change color theme — usage: theme [name]', (args) => {
  const themes = ['green', 'amber', 'blue', 'dracula', 'light'];
  if (args.length === 0) {
    const current = document.documentElement.getAttribute('data-theme') || 'green';
    return [
      '',
      { html: `<span class="heading">  Available Themes</span>  (current: <span style="color:var(--accent)">${current}</span>)` },
      '',
      ...themes.map(t => {
        const marker = t === current ? ' ◀' : '';
        return { html: `  • <span style="color:var(--accent)">${t}</span>${marker}` };
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
    { html: '<span style="color:var(--accent)">      ███████╗██╗</span>        <span class="heading">eric@liu</span>' },
    { html: '<span style="color:var(--accent)">      ██╔════╝██║</span>        ────────────' },
    { html: '<span style="color:var(--accent)">      █████╗  ██║</span>        <span style="color:var(--text-dim)">OS:</span> EricLiu OS v1.0' },
    { html: '<span style="color:var(--accent)">      ██╔══╝  ██║</span>        <span style="color:var(--text-dim)">Host:</span> Texas A&M University' },
    { html: '<span style="color:var(--accent)">      ███████╗███████╗</span>   <span style="color:var(--text-dim)">Kernel:</span> CS Class of 2026' },
    { html: '<span style="color:var(--accent)">      ╚══════╝╚══════╝</span>   <span style="color:var(--text-dim)">Uptime:</span> 21 years' },
    { html: '                         <span style="color:var(--text-dim)">Shell:</span> Go / Python / JS' },
    { html: '                         <span style="color:var(--text-dim)">DE:</span> VS Code + vim' },
    { html: '                         <span style="color:var(--text-dim)">Certs:</span> AWS SA, Azure Fund.' },
    { html: '                         <span style="color:var(--text-dim)">GPA:</span> 3.913' },
    '',
  ];
});

// ── clear ──
registerCommand('clear', 'Clear the terminal', () => {
  const output = document.getElementById('output');
  const inputLine = document.getElementById('input-line');
  // Remove all children except the input line
  while (output.firstChild && output.firstChild !== inputLine) {
    output.removeChild(output.firstChild);
  }
  return [];
});

// ── history ──
registerCommand('history', 'Show command history', () => {
  const hist = JSON.parse(localStorage.getItem('terminal-history') || '[]');
  if (hist.length === 0) return ['  No commands in history.'];
  const lines = ['', { html: '<span class="heading">  Command History</span>' }, ''];
  hist.forEach((cmd, i) => {
    lines.push(`  ${String(i + 1).padStart(4)}  ${cmd}`);
  });
  lines.push('');
  return lines;
});

// ── Easter Eggs (hidden) ──
registerCommand('sudo', '', () => {
  return [{ html: '<span class="error">  visitor is not in the sudoers file. This incident will be reported. 🚨</span>' }];
}, { hidden: true });

registerCommand('rm', '', (args) => {
  if (args.join(' ').includes('-rf')) {
    return [
      { html: '<span class="error">  🛡️ System protected by plot armor. Nice try though.</span>' },
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
    { html: '  Great choice! 🎉' },
    { html: '  📧 <a href="mailto:sallure12345@tamu.edu">sallure12345@tamu.edu</a>' },
    { html: '  💼 <a href="https://linkedin.com/in/eric-cb-liu" target="_blank" rel="noopener">linkedin.com/in/eric-cb-liu</a>' },
    '',
  ];
}, { hidden: true });

registerCommand('cat', '', () => {
  return [{ html: '<span class="info">  🐱 Meow! Did you mean to type a command? Try \'help\'.</span>' }];
}, { hidden: true });

registerCommand('cd', '', () => {
  return [{ html: '<span class="info">  There\'s nowhere to go. You\'re already home.</span>' }];
}, { hidden: true });
