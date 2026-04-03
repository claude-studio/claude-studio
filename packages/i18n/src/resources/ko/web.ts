const web = {
  meta: {
    title: 'Claude Studio | Claude Code 로컬 분석 대시보드',
    description:
      '로컬 데이터를 바탕으로 Claude Code의 비용, 토큰, 세션을 분석하고 실시간 픽셀 오피스에서 에이전트 상태를 확인하세요.',
  },
  header: {
    githubLabel: 'GitHub에서 Claude Studio 열기',
    languageLabel: '언어',
  },
  hero: {
    badge: '로컬 기반 분석 · 오픈소스',
    titlePrefix: 'Claude Code 사용량을',
    titleHighlight: '한눈에',
    description:
      '로컬 데이터를 바탕으로 비용, 토큰, 프로젝트를 추적하고 픽셀 오피스에서 Claude Code의 현재 작업을 실시간으로 확인하세요.',
    cta: 'GitHub에서 시작하기',
  },
  features: {
    eyebrow: '기능',
    title: '사용량 분석에 필요한 모든 것',
    description:
      'Claude Code 활동의 모든 층위를 시각화하고 로컬 데이터로 더 나은 개발 결정을 내리세요.',
    liveCard: {
      badge: 'Beta',
      title: '라이브 모니터링',
      status: '자동 연결',
      description:
        '실행 중인 Claude Code 세션을 픽셀 캐릭터로 확인하세요. JSONL 변경이 감지되면 도구 실행부터 세션 종료까지 상태가 즉시 갱신됩니다.',
      points: {
        multiAgent: '여러 세션이 동시에 움직이는 멀티 에이전트 화면',
        fileWatch: 'fs.watch 기반 즉시 JSONL 변경 감지',
        subagents: 'Task 서브에이전트도 별도 캐릭터로 표시',
        states: '실행, 완료, 대기 상태를 한눈에 확인',
      },
    },
    cards: {
      cost: {
        title: '비용 분석',
        description: '모델별 비용, 일별 추이, 월간 비교를 로케일에 맞는 통화 형식으로 확인하세요.',
      },
      projects: {
        title: '프로젝트 구성',
        description:
          '프로젝트, 워크트리, 서브디렉토리 단위로 사용량을 세분화해도 맥락을 잃지 않습니다.',
      },
      activity: {
        title: '활동 인사이트',
        description: '히트맵, 피크 시간대, 대화 패턴으로 실제 작업 습관을 파악하세요.',
      },
      skills: {
        title: '스킬과 설정',
        description: '커스텀 스킬과 Claude Code 설정을 한 곳에서 점검할 수 있습니다.',
      },
    },
  },
  livePreview: {
    eyebrow: '라이브 Beta',
    title: 'Claude가 일하는 모습을 실시간으로',
    description:
      'JSONL 변경을 즉시 감지해 도구 실행부터 세션 종료까지 에이전트 상태 전이를 실시간으로 반영합니다.',
    builtWith: '기반:',
    windowTitle: 'Claude Studio — 라이브',
    workingCount: '{{count}}명 작업 중',
    idle: '대기 중',
    cards: {
      fileChanges: {
        label: '파일 변경 감지',
        description: 'fs.watch로 JSONL 변경을 즉시 감지',
      },
      multiAgent: {
        label: '멀티 에이전트',
        description: '여러 세션이 동시에 오피스에서 움직이는 흐름 확인',
      },
      subagents: {
        label: '서브에이전트',
        description: 'Task 서브에이전트도 별도 캐릭터로 표시',
      },
    },
  },
  dashboardPreview: {
    eyebrow: '미리보기',
    title: '대시보드를 한눈에 읽어보세요',
    description: '설치 직후 바로 사용할 수 있는 빠르고 직관적인 인터페이스입니다.',
    windowTitle: 'Claude Studio — 대시보드',
    stats: {
      monthlyCost: {
        label: '이번 달 비용',
        sub: '이 기기에 저장됨',
      },
      totalTokens: {
        label: '총 토큰',
        sub: '입력 + 출력',
      },
      sessionCount: {
        label: '세션 수',
        sub: '최근 30일',
      },
      activeProjects: {
        label: '활성 프로젝트',
        sub: '진행 중',
      },
    },
    chartLabel: '일별 비용 추이',
    ticks: {
      day1: '1일',
      day7: '7일',
      day14: '14일',
      day21: '21일',
      today: '오늘',
    },
    sidebar: {
      overview: '개요',
      projects: '프로젝트',
      live: '라이브',
      costs: '비용',
      skills: '스킬',
      settings: '설정',
    },
  },
  highlights: {
    eyebrow: '차별점',
    title: '왜 Claude Studio인가',
    items: {
      localData: {
        title: '로컬 데이터',
        description:
          '서버 없이 ~/.claude/를 직접 읽어 분석합니다. 데이터는 사용자의 컴퓨터에만 남습니다.',
      },
      realtime: {
        title: '실시간 갱신',
        description:
          '파일 워처가 세션 변경을 즉시 감지하므로 작업 중에도 비용과 활동 상태가 바로 업데이트됩니다.',
      },
      free: {
        title: '완전 무료',
        description:
          '오픈소스이면서 로컬에서 실행되며, 구독료나 별도 계정 등록 없이 사용할 수 있습니다.',
      },
    },
  },
  cta: {
    title: '지금 바로 시작하세요',
    description:
      '이미 Claude Code를 사용하고 있다면 Claude Studio를 실행하는 순간 분석할 데이터가 준비되어 있습니다.',
    command: 'git clone && pnpm install && pnpm dev',
    button: 'GitHub에서 보기',
  },
} as const;

export default web;
