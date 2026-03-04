import { z } from 'zod';

export const TokenUsageSchema = z.object({
  inputTokens: z.number().default(0),
  outputTokens: z.number().default(0),
  cacheCreationInputTokens: z.number().default(0),
  cacheReadInputTokens: z.number().default(0),
});

export type TokenUsage = z.infer<typeof TokenUsageSchema>;

export const ModelUsageSchema = z.object({
  model: z.string(),
  displayName: z.string(),
  inputTokens: z.number(),
  outputTokens: z.number(),
  totalTokens: z.number(),
  cost: z.number(),
  messageCount: z.number(),
  color: z.string(),
});

export type ModelUsage = z.infer<typeof ModelUsageSchema>;

export const DailyUsageSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  cost: z.number(),
  inputTokens: z.number(),
  outputTokens: z.number(),
  messages: z.number(),
  sessions: z.number(),
  toolCalls: z.number(),
  modelCosts: z.record(z.string(), z.number()).default({}),
});

export type DailyUsage = z.infer<typeof DailyUsageSchema>;

export const PeakHourSchema = z.object({
  hour: z.number(), // 0-23
  messages: z.number(),
  sessions: z.number(),
});

export type PeakHour = z.infer<typeof PeakHourSchema>;

export const SessionInfoSchema = z.object({
  id: z.string(),
  projectPath: z.string(),
  projectName: z.string(),
  startTime: z.coerce.date(),
  lastTime: z.coerce.date(),
  duration: z.number(), // ms
  messageCount: z.number(),
  toolCallCount: z.number(),
  cost: z.number(),
  inputTokens: z.number(),
  outputTokens: z.number(),
  models: z.array(z.string()),
});

export type SessionInfo = z.infer<typeof SessionInfoSchema>;

export const MessageSchema = z.object({
  uuid: z.string().optional(),
  type: z.string(),
  role: z.enum(['user', 'assistant']).optional(),
  content: z.any(),
  timestamp: z.string().optional(),
  model: z.string().optional(),
  costUSD: z.number().optional(),
  usage: z
    .object({
      input_tokens: z.number().optional(),
      output_tokens: z.number().optional(),
      cache_creation_input_tokens: z.number().optional(),
      cache_read_input_tokens: z.number().optional(),
    })
    .optional(),
  isSidechain: z.boolean().optional(),
  isApiErrorMessage: z.boolean().optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export const SessionDetailSchema = z.object({
  id: z.string(),
  projectPath: z.string(),
  projectName: z.string(),
  startTime: z.coerce.date(),
  lastTime: z.coerce.date(),
  duration: z.number(),
  messageCount: z.number(),
  toolCallCount: z.number(),
  cost: z.number(),
  inputTokens: z.number(),
  outputTokens: z.number(),
  models: z.array(z.string()),
  messages: z.array(MessageSchema),
  modelBreakdown: z.array(ModelUsageSchema),
});

export type SessionDetail = z.infer<typeof SessionDetailSchema>;

export const ProjectInfoSchema = z.object({
  id: z.string(),
  path: z.string(),
  name: z.string(),
  sessionCount: z.number(),
  totalCost: z.number(),
  totalTokens: z.number(),
  inputTokens: z.number(),
  outputTokens: z.number(),
  messageCount: z.number(),
  toolCallCount: z.number(),
  lastActivity: z.coerce.date(),
  models: z.array(z.string()),
});

export type ProjectInfo = z.infer<typeof ProjectInfoSchema>;

export const CacheStatsSchema = z.object({
  totalCacheCreationTokens: z.number(),
  totalCacheReadTokens: z.number(),
  cacheHitRate: z.number(), // 0-100
  estimatedSavingsUsd: z.number(),
});

export type CacheStats = z.infer<typeof CacheStatsSchema>;

export const ToolUsageItemSchema = z.object({
  name: z.string(),
  count: z.number(),
});

export type ToolUsageItem = z.infer<typeof ToolUsageItemSchema>;

export const ConversationStatsSchema = z.object({
  avgSessionDurationMs: z.number(),
  avgMessagesPerSession: z.number(),
  avgInputTokensPerMessage: z.number(),
  avgOutputTokensPerMessage: z.number(),
  shortSessions: z.number(),   // < 10분
  mediumSessions: z.number(),  // 10분 ~ 1시간
  longSessions: z.number(),    // > 1시간
});

export type ConversationStats = z.infer<typeof ConversationStatsSchema>;

export const SkillInfoSchema = z.object({
  name: z.string(),
  description: z.string(),
  userInvocable: z.boolean(),
  body: z.string(), // SKILL.md frontmatter 제외 본문
});

export type SkillInfo = z.infer<typeof SkillInfoSchema>;

export const ClaudeSettingsSchema = z.object({
  model: z.string().optional(),
  enabledPlugins: z.record(z.string(), z.boolean()).optional(),
  permissions: z.object({
    defaultMode: z.string().optional(),
    allow: z.array(z.string()).optional(),
  }).optional(),
});

export type ClaudeSettings = z.infer<typeof ClaudeSettingsSchema>;

export const ClaudeLifetimeSchema = z.object({
  firstSessionDate: z.coerce.date().nullable(),
  daysActive: z.number(),           // D+N (days since first session)
  longestSessionDurationMs: z.number(),
  longestSessionMessageCount: z.number(),
});

export type ClaudeLifetime = z.infer<typeof ClaudeLifetimeSchema>;

export const TeamMemberSchema = z.object({
  agentId: z.string(),
  name: z.string(),
  agentType: z.string(),
  model: z.string().optional(),
  joinedAt: z.number(),
  isActive: z.boolean().optional(),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

export const TeamInfoSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.number(),
  members: z.array(TeamMemberSchema),
});

export type TeamInfo = z.infer<typeof TeamInfoSchema>;

export const TaskInfoSchema = z.object({
  id: z.string(),
  subject: z.string(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'deleted']),
  owner: z.string().optional(),
  blocks: z.array(z.string()).optional(),
  blockedBy: z.array(z.string()).optional(),
});

export type TaskInfo = z.infer<typeof TaskInfoSchema>;

export const InboxMessageSchema = z.object({
  from: z.string(),
  text: z.string(),
  timestamp: z.string(),
  color: z.string().optional(),
  read: z.boolean().optional(),
});

export type InboxMessage = z.infer<typeof InboxMessageSchema>;

export const TeamDetailSchema = z.object({
  team: TeamInfoSchema,
  tasks: z.array(TaskInfoSchema),
  inboxes: z.record(z.string(), z.array(InboxMessageSchema)).default({}),
});

export type TeamDetail = z.infer<typeof TeamDetailSchema>;

export const DashboardStatsSchema = z.object({
  totalCost: z.number(),
  totalTokens: z.number(),
  inputTokens: z.number(),
  outputTokens: z.number(),
  totalSessions: z.number(),
  totalProjects: z.number(),
  totalMessages: z.number(),
  totalToolCalls: z.number(),
  modelBreakdown: z.array(ModelUsageSchema),
  dailyUsage: z.array(DailyUsageSchema),
  peakHours: z.array(PeakHourSchema),
  recentSessions: z.array(SessionInfoSchema),
  activityData: z.array(
    z.object({
      date: z.string(),
      count: z.number(),
    })
  ),
  cacheStats: CacheStatsSchema,
  toolUsage: z.array(ToolUsageItemSchema),
  conversationStats: ConversationStatsSchema,
  lifetime: ClaudeLifetimeSchema.optional(),
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
