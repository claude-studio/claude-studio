const analytics = {
  cost: {
    secondaryUsd: 'USD',
    fallbackLabel: 'Cost',
  },
  usageOverTime: {
    metrics: {
      messages: 'Messages',
      sessions: 'Sessions',
      toolCalls: 'Tool calls',
      cost: 'Cost',
    },
  },
  cache: {
    labels: {
      hitRate: 'Cache hit rate',
      estimatedSavings: 'Estimated savings',
      hit: 'Hit',
      miss: 'Miss',
      readTokens: 'Cache read tokens',
      creationTokens: 'Cache creation tokens',
    },
    tooltips: {
      hitRate:
        'The share of cache creation and read tokens that came from cache reuse. Higher is better when you repeat the same context.',
      estimatedSavings:
        'Estimated savings from cache read tokens using the weighted average input price of the models you actually used. Cache reads are billed at roughly 10% of normal input cost.',
      creationTokens:
        'Tokens spent creating cache entries for the first time. Cache creation is typically about 25% more expensive than normal input.',
      readTokens:
        'Tokens served from previously stored cache entries. Cache reads are typically about 90% cheaper than normal input.',
    },
  },
  conversation: {
    labels: {
      averageSessionLength: 'Average session length',
      averageMessagesPerSession: 'Average messages per session',
      inputTokensPerMessage: 'Input tokens per message',
      outputTokensPerMessage: 'Output tokens per message',
      sessionLengthDistribution: 'Session length distribution',
      shortSessions: 'Short (<10m)',
      mediumSessions: 'Medium (10m-1h)',
      longSessions: 'Long (>1h)',
    },
    units: {
      messagesSuffix: ' messages',
      messagesCount: '{{count}} messages',
    },
  },
  activityHeatmap: {
    less: 'Less',
    more: 'More',
    cellTitle: '{{date}}: {{count}} messages',
  },
  toolUsage: {
    noData: 'No data',
    countSuffix: '{{count}} uses',
  },
  lifetime: {
    labels: {
      startedOn: 'Started on',
      longestSession: 'Longest session',
      totalMessages: 'Total messages',
      totalToolCalls: 'Total tool calls',
    },
    sublabels: {
      dayCount: 'Day {{count}}',
      messageCount: '{{count}} messages',
    },
  },
  peakHours: {
    messages: 'Messages',
  },
} as const;

export default analytics;
