// ── Terminal Engine ──
(function () {
  const output = document.getElementById('output');
  const inputEl = document.getElementById('terminal-input');
  const inputDisplay = document.getElementById('input-display');
  const cursor = document.getElementById('cursor');
  const terminalBody = document.getElementById('terminal-body');

  // ── State ──
  let commandHistory = JSON.parse(localStorage.getItem('terminal-history') || '[]');
  let historyIndex = -1;
  let currentInput = '';

  // ── Theme persistence ──
  const savedTheme = localStorage.getItem('terminal-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // ── Output helpers ──
  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  const inputLine = document.getElementById('input-line');

  function printLine(content, className, delay) {
    const div = document.createElement('div');
    div.classList.add('line');
    if (className) div.classList.add(className);
    if (typeof content === 'object' && content.html) {
      div.innerHTML = content.html;
    } else {
      div.textContent = content;
    }
    if (delay !== undefined) {
      div.style.animationDelay = delay + 'ms';
    }
    // Insert before the input line so it always stays last
    output.insertBefore(div, inputLine);
    scrollToBottom();
  }

  function printLines(lines, baseDelay) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    lines.forEach((line, i) => {
      const delay = reducedMotion ? 0 : (baseDelay || 0) + i * 25;
      printLine(line, null, delay);
    });
  }

  function printCommandEcho(cmd) {
    printLine(
      { html: `<span class="echo-prompt">visitor@ericliu:~$</span> ${escapeHTML(cmd)}` },
      'cmd-echo'
    );
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Levenshtein distance for fuzzy matching ──
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }

  function findClosestCommand(input) {
    let best = null, bestDist = Infinity;
    for (const name of Object.keys(COMMANDS)) {
      const dist = levenshtein(input.toLowerCase(), name);
      if (dist < bestDist && dist <= 3) {
        best = name;
        bestDist = dist;
      }
    }
    return best;
  }

  // ── Command execution ──
  function executeCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // Save to history
    if (commandHistory[commandHistory.length - 1] !== trimmed) {
      commandHistory.push(trimmed);
      if (commandHistory.length > 50) commandHistory.shift();
      localStorage.setItem('terminal-history', JSON.stringify(commandHistory));
    }
    historyIndex = -1;
    currentInput = '';

    // Echo the command
    printCommandEcho(trimmed);

    // Parse
    const parts = trimmed.split(/\s+/);
    let cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Special case: "rm -rf /" should route to 'rm'
    // Already handled by splitting

    const cmd = COMMANDS[cmdName];
    if (cmd) {
      const result = cmd.handler(args);
      if (result && result.length > 0) {
        printLines(result);
      }
    } else {
      // Fuzzy match
      const suggestion = findClosestCommand(cmdName);
      printLine({ html: `<span class="error">Command not found: ${escapeHTML(cmdName)}</span>` });
      if (suggestion) {
        printLine({ html: `<span class="info">Did you mean <span style="color:var(--accent)">${suggestion}</span>? Type <span style="color:var(--accent)">help</span> for available commands.</span>` });
      } else {
        printLine({ html: `<span class="info">Type <span style="color:var(--accent)">help</span> to see available commands.</span>` });
      }
    }

    scrollToBottom();
  }

  // ── Tab autocomplete ──
  function autocomplete(partial) {
    if (!partial) return null;
    const matches = Object.keys(COMMANDS).filter(c => c.startsWith(partial.toLowerCase()));
    if (matches.length === 1) return matches[0];
    if (matches.length > 1) {
      // Find common prefix
      let prefix = matches[0];
      for (const m of matches) {
        while (!m.startsWith(prefix)) {
          prefix = prefix.slice(0, -1);
        }
      }
      // Show options
      printCommandEcho(partial);
      printLine({ html: `<span class="info">${matches.join('  ')}</span>` });
      return prefix.length > partial.length ? prefix : null;
    }
    return null;
  }

  // ── Sync display with real input ──
  function syncDisplay() {
    inputDisplay.textContent = inputEl.value;
  }

  // ── Input events ──
  inputEl.addEventListener('input', syncDisplay);

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = inputEl.value;
      inputEl.value = '';
      syncDisplay();
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIndex === -1) {
        currentInput = inputEl.value;
        historyIndex = commandHistory.length - 1;
      } else if (historyIndex > 0) {
        historyIndex--;
      }
      inputEl.value = commandHistory[historyIndex];
      syncDisplay();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        inputEl.value = commandHistory[historyIndex];
      } else {
        historyIndex = -1;
        inputEl.value = currentInput;
      }
      syncDisplay();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const parts = inputEl.value.split(/\s+/);
      if (parts.length <= 1) {
        const result = autocomplete(parts[0]);
        if (result) {
          inputEl.value = result;
          syncDisplay();
        }
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      printCommandEcho(inputEl.value + '^C');
      inputEl.value = '';
      syncDisplay();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      while (output.firstChild && output.firstChild !== inputLine) {
        output.removeChild(output.firstChild);
      }
    }
  });

  // ── Focus management ──
  terminalBody.addEventListener('click', (e) => {
    // Don't steal focus if clicking a link
    if (e.target.tagName === 'A') return;
    inputEl.focus();
  });

  document.addEventListener('click', (e) => {
    const terminal = document.getElementById('terminal-window');
    if (terminal.contains(e.target) && e.target.tagName !== 'A') {
      inputEl.focus();
    }
  });

  // ── Mobile buttons ──
  document.querySelectorAll('#mobile-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      executeCommand(cmd);
      inputEl.focus();
    });
  });

  // ── Boot Sequence ──
  function boot() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const bootLines = [
      { text: '[BOOT] Initializing system...', delay: 0 },
      { text: '[BOOT] Loading modules... done.', delay: reducedMotion ? 0 : 400 },
      { text: '[BOOT] Establishing connection... done.', delay: reducedMotion ? 0 : 800 },
    ];

    const asciiArt = [
      '',
      '      ███████╗██╗',
      '      ██╔════╝██║     Welcome to EricLiu OS v1.0',
      '      █████╗  ██║     ────────────────────────────',
      '      ██╔══╝  ██║     Type \'help\' to get started.',
      '      ███████╗███████╗',
      '      ╚══════╝╚══════╝',
      '',
    ];

    bootLines.forEach(({ text, delay }) => {
      setTimeout(() => {
        printLine(text, 'info');
      }, delay);
    });

    const artStart = reducedMotion ? 0 : 1300;
    setTimeout(() => {
      asciiArt.forEach((line, i) => {
        const d = reducedMotion ? 0 : i * 40;
        setTimeout(() => {
          printLine({ html: `<span style="color:var(--accent)">${escapeHTML(line)}</span>` });
        }, d);
      });
    }, artStart);

    // Focus input after boot
    setTimeout(() => {
      inputEl.focus();
    }, reducedMotion ? 100 : artStart + asciiArt.length * 40 + 200);
  }

  boot();
})();
