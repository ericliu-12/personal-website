// ── Terminal Engine ──
(function () {
  const output = document.getElementById('output');
  const inputEl = document.getElementById('terminal-input');
  const inputDisplay = document.getElementById('input-display');
  const cursor = document.getElementById('cursor');
  const terminalBody = document.getElementById('terminal-body');
  const scrollIndicator = document.getElementById('scroll-indicator');

  // ── State ──
  let commandHistory = JSON.parse(localStorage.getItem('terminal-history') || '[]');
  let historyIndex = -1;
  let currentInput = '';
  let userScrolledUp = false;
  const MAX_OUTPUT_LINES = 500;

  // ── Theme persistence ──
  const savedTheme = localStorage.getItem('terminal-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // ── Output helpers ──
  function scrollToBottom() {
    userScrolledUp = false;
    terminalBody.scrollTo({
      top: terminalBody.scrollHeight,
      behavior: 'smooth',
    });
    if (scrollIndicator) scrollIndicator.classList.remove('visible');
  }

  // Track user scroll position
  terminalBody.addEventListener('scroll', () => {
    const distFromBottom = terminalBody.scrollHeight - terminalBody.scrollTop - terminalBody.clientHeight;
    if (distFromBottom > 60) {
      userScrolledUp = true;
      if (scrollIndicator) scrollIndicator.classList.add('visible');
    } else {
      userScrolledUp = false;
      if (scrollIndicator) scrollIndicator.classList.remove('visible');
    }
  });

  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', scrollToBottom);
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
    output.insertBefore(div, inputLine);
    if (!userScrolledUp) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }

  function printLines(lines, baseDelay) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    lines.forEach((line, i) => {
      const delay = reducedMotion ? 0 : (baseDelay || 0) + i * 25;
      printLine(line, null, delay);
    });
    cleanupOldLines();
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

  // ── DOM cleanup for long sessions ──
  function cleanupOldLines() {
    const lines = output.querySelectorAll('.line');
    if (lines.length > MAX_OUTPUT_LINES) {
      const toRemove = lines.length - MAX_OUTPUT_LINES;
      for (let i = 0; i < toRemove; i++) {
        if (lines[i] !== inputLine) {
          lines[i].remove();
        }
      }
    }
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

    if (commandHistory[commandHistory.length - 1] !== trimmed) {
      commandHistory.push(trimmed);
      if (commandHistory.length > 50) commandHistory.shift();
      localStorage.setItem('terminal-history', JSON.stringify(commandHistory));
    }
    historyIndex = -1;
    currentInput = '';

    printCommandEcho(trimmed);

    const parts = trimmed.split(/\s+/);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const cmd = COMMANDS[cmdName];
    if (cmd) {
      const result = cmd.handler(args);
      if (result && result.length > 0) {
        printLines(result);
      }
    } else {
      const suggestion = findClosestCommand(cmdName);
      printLine({ html: `<span class="error">Command not found: ${escapeHTML(cmdName)}</span>` });
      if (suggestion) {
        printLine({ html: `<span class="info">Did you mean <span style="color:var(--accent)">${suggestion}</span>? Type <span style="color:var(--accent)">help</span> for available commands.</span>` });
      } else {
        printLine({ html: `<span class="info">Type <span style="color:var(--accent)">help</span> to see available commands.</span>` });
      }
    }

    if (!userScrolledUp) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }

  // ── Tab autocomplete ──
  function autocomplete(partial) {
    if (!partial) return null;
    const matches = Object.keys(COMMANDS).filter(c => c.startsWith(partial.toLowerCase()));
    if (matches.length === 1) return matches[0];
    if (matches.length > 1) {
      let prefix = matches[0];
      for (const m of matches) {
        while (!m.startsWith(prefix)) {
          prefix = prefix.slice(0, -1);
        }
      }
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
      // On mobile, scroll to show output, then focus
      setTimeout(() => {
        terminalBody.scrollTop = terminalBody.scrollHeight;
        inputEl.focus();
      }, 50);
    });
  });

  // ── Mobile virtual keyboard handling ──
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      // When keyboard opens/closes, ensure input stays visible
      setTimeout(() => {
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }, 100);
    });
  }

  // ── Boot Sequence ──
  function boot() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      // Instant boot for reduced motion
      printLine('[BOOT] System initialized.', 'info');
      for (const line of ASCII_BANNER) {
        printLine({ html: `<span style="color:var(--accent)">${escapeHTML(line)}</span>` });
      }
      printLine({ html: 'Welcome! Type <span style="color:var(--accent)">help</span> to see available commands.' });
      printLine('');
      inputEl.focus();
      return;
    }

    // Animated boot sequence with progress bar
    const steps = [
      { text: '[BOOT] Initializing system...', delay: 0 },
      { text: '[BOOT] Loading modules...', delay: 300 },
      { text: '[BOOT] Establishing connection...', delay: 600 },
    ];

    steps.forEach(({ text, delay }) => {
      setTimeout(() => printLine(text, 'info'), delay);
    });

    // Progress bar animation
    const progressStages = [
      { bar: '[██░░░░░░░░] 10%', delay: 900 },
      { bar: '[████░░░░░░] 40%', delay: 1050 },
      { bar: '[███████░░░] 70%', delay: 1200 },
      { bar: '[██████████] 100%', delay: 1350 },
    ];

    let progressLine = null;
    progressStages.forEach(({ bar, delay }) => {
      setTimeout(() => {
        if (progressLine) progressLine.remove();
        progressLine = document.createElement('div');
        progressLine.classList.add('line', 'progress-bar');
        progressLine.textContent = bar;
        output.insertBefore(progressLine, inputLine);
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }, delay);
    });

    // ASCII art after progress
    setTimeout(() => {
      if (progressLine) {
        progressLine.textContent = '[BOOT] Ready.';
        progressLine.classList.remove('progress-bar');
        progressLine.classList.add('info');
      }

      ASCII_BANNER.forEach((line, i) => {
        setTimeout(() => {
          printLine({ html: `<span style="color:var(--accent)">${escapeHTML(line)}</span>` });
        }, i * 35);
      });

      const welcomeDelay = ASCII_BANNER.length * 35 + 100;
      setTimeout(() => {
        printLine('');
        printLine({ html: 'Welcome! Type <span style="color:var(--accent)">help</span> to see available commands.' });
        printLine('');
        inputEl.focus();
      }, welcomeDelay);
    }, 1500);
  }

  boot();
})();
