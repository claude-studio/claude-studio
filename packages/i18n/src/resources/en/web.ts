const web = {
  meta: {
    title: 'Claude Studio | Local analytics for Claude Code',
    description:
      'Monitor Claude Code usage with local-first cost, token, and session analytics, then watch active agents in a real-time pixel office.',
  },
  header: {
    githubLabel: 'Open Claude Studio on GitHub',
    languageLabel: 'Language',
  },
  hero: {
    badge: 'Local-first analytics · open source',
    titlePrefix: 'See your Claude Code usage',
    titleHighlight: 'at a glance',
    description:
      'Track cost, tokens, and projects from local data, then watch Claude Code work in real time through a pixel office.',
    cta: 'Start on GitHub',
  },
  features: {
    eyebrow: 'Features',
    title: 'Everything you need to understand usage',
    description:
      'Visualize every layer of Claude Code activity and make better engineering decisions with local data.',
    liveCard: {
      badge: 'Beta',
      title: 'Live monitoring',
      status: 'Auto connected',
      description:
        'Watch active Claude Code sessions as pixel characters. JSONL changes update agent state immediately, from tool execution to session finish.',
      points: {
        multiAgent: 'Multi-agent activity across parallel sessions',
        fileWatch: 'Instant JSONL change detection with fs.watch',
        subagents: 'Task subagents show up as their own characters',
        states: 'See running, completed, and idle states at a glance',
      },
    },
    cards: {
      cost: {
        title: 'Cost analysis',
        description:
          'Track model costs, daily trends, and month-over-month changes with locale-aware currency display.',
      },
      projects: {
        title: 'Project organization',
        description:
          'Break usage down by project, worktree, and subdirectory without losing context.',
      },
      activity: {
        title: 'Activity insights',
        description:
          'Use heatmaps, peak-hour charts, and conversation patterns to understand how you work.',
      },
      skills: {
        title: 'Skills and settings',
        description: 'Review custom skills and Claude Code configuration from one place.',
      },
    },
  },
  livePreview: {
    eyebrow: 'Live beta',
    title: 'Watch Claude work in real time',
    description:
      'Detect JSONL changes instantly and reflect agent state transitions from tool execution to session close.',
    builtWith: 'Built with',
    windowTitle: 'Claude Studio — Live',
    workingCount: '{{count}} working',
    idle: 'Idle',
    cards: {
      fileChanges: {
        label: 'File change detection',
        description: 'Instantly detect JSONL updates with fs.watch',
      },
      multiAgent: {
        label: 'Multi-agent view',
        description: 'Watch multiple sessions move through the office together',
      },
      subagents: {
        label: 'Subagents',
        description: 'Task subagents appear as their own characters',
      },
    },
  },
  dashboardPreview: {
    eyebrow: 'Preview',
    title: 'A dashboard you can read in seconds',
    description: 'A fast interface you can use immediately after setup.',
    windowTitle: 'Claude Studio — Dashboard',
    stats: {
      monthlyCost: {
        label: 'Cost this month',
        sub: 'Approx. ₩16,420',
      },
      totalTokens: {
        label: 'Total tokens',
        sub: 'Input + output',
      },
      sessionCount: {
        label: 'Sessions',
        sub: 'Last 30 days',
      },
      activeProjects: {
        label: 'Active projects',
        sub: 'In progress',
      },
    },
    chartLabel: 'Daily cost trend',
    ticks: {
      day1: 'Day 1',
      day7: 'Day 7',
      day14: 'Day 14',
      day21: 'Day 21',
      today: 'Today',
    },
    sidebar: {
      overview: 'Overview',
      projects: 'Projects',
      live: 'Live',
      costs: 'Costs',
      skills: 'Skills',
      settings: 'Settings',
    },
  },
  highlights: {
    eyebrow: 'Why it stands out',
    title: 'Why Claude Studio',
    items: {
      localData: {
        title: 'Local data',
        description:
          'No server required. Claude Studio reads directly from ~/.claude/ so your data stays on your machine.',
      },
      realtime: {
        title: 'Real-time updates',
        description:
          'File watchers detect session changes immediately, so cost and activity keep up while you work.',
      },
      free: {
        title: 'Completely free',
        description:
          'Open source, local-first, and usable without subscriptions or account registration.',
      },
    },
  },
  cta: {
    title: 'Get started now',
    description:
      "If you're already using Claude Code, your data is ready the moment you launch Claude Studio.",
    command: 'git clone && pnpm install && pnpm dev',
    button: 'View on GitHub',
  },
} as const;

export default web;
