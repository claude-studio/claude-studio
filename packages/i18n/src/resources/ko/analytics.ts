const analytics = {
  cost: {
    secondaryUsd: 'USD',
    fallbackLabel: '비용',
  },
  usageOverTime: {
    metrics: {
      messages: '메시지',
      sessions: '세션',
      toolCalls: '툴 호출',
      cost: '비용',
    },
  },
  cache: {
    labels: {
      hitRate: '캐시 적중률',
      estimatedSavings: '절약 비용',
      hit: '히트',
      miss: '미스',
      readTokens: '캐시 읽기 토큰',
      creationTokens: '캐시 생성 토큰',
    },
    tooltips: {
      hitRate:
        '캐시 생성+읽기 토큰 중 재사용(읽기) 비율입니다. 높을수록 같은 컨텍스트를 반복 활용한 것입니다.',
      estimatedSavings:
        '캐시 읽기 토큰에 실제 사용 모델의 가중평균 입력 단가를 적용한 예상 절약액입니다. 캐시 읽기는 일반 입력의 약 10% 과금됩니다.',
      creationTokens: '처음 캐시를 생성할 때 사용된 토큰 수입니다. 일반 입력보다 약 25% 비쌉니다.',
      readTokens: '이미 저장된 캐시를 재사용한 토큰 수입니다. 일반 입력 대비 약 90% 저렴합니다.',
    },
  },
  conversation: {
    labels: {
      averageSessionLength: '평균 세션 길이',
      averageMessagesPerSession: '세션당 평균 메시지',
      inputTokensPerMessage: '입력 토큰/메시지',
      outputTokensPerMessage: '출력 토큰/메시지',
      sessionLengthDistribution: '세션 길이 분포',
      shortSessions: '짧음 (<10분)',
      mediumSessions: '보통 (10분~1시간)',
      longSessions: '긴 세션 (>1시간)',
    },
    units: {
      messagesSuffix: '개',
      messagesCount: '메시지 {{count}}개',
    },
  },
  activityHeatmap: {
    less: '적음',
    more: '많음',
    cellTitle: '{{date}}: 메시지 {{count}}개',
  },
  toolUsage: {
    noData: '데이터 없음',
    countSuffix: '{{count}}회',
  },
  lifetime: {
    labels: {
      startedOn: '사용 시작일',
      longestSession: '역대 최장 세션',
      totalMessages: '총 메시지 수',
      totalToolCalls: '총 툴 호출 수',
    },
    sublabels: {
      dayCount: 'D+{{count}}',
      messageCount: '메시지 {{count}}개',
    },
  },
  peakHours: {
    messages: '메시지',
  },
} as const;

export default analytics;
