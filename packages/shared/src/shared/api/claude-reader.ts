import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type {
  DashboardStats,
  SessionInfo,
  SessionDetail,
  DailyUsage,
  PeakHour,
  ModelUsage,
  ProjectInfo,
  Message,
  CacheStats,
  ToolUsageItem,
  ConversationStats,
  ClaudeLifetime,
  ClaudeSettings,
  SkillInfo,
} from '../types/index';
import {
  calculateCost,
  getModelDisplayName,
  getModelColor,
  getModelShortName,
  getPricing,
} from '../config/pricing';

function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getClaudeDir(): string {
  return path.join(os.homedir(), '.claude');
}

export function getProjectsDir(): string {
  return path.join(getClaudeDir(), 'projects');
}

// --- Cache ---

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 30_000; // 30 seconds

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearCache(): void {
  cache.clear();
}

// --- Path helpers ---

export function decodeProjectPath(dirName: string): string {
  // Claude encodes project paths by replacing / with -
  // e.g. -Users-genie-Desktop-project -> /Users/genie/Desktop/project
  if (dirName.startsWith('-')) {
    return dirName.replace(/-/g, '/');
  }
  return dirName;
}

export function getProjectName(dirName: string): string {
  // worktree 감지: --worktree- 또는 --claude-worktrees- 패턴
  const worktreeMatch = dirName.match(/^(.+?)--(?:claude-worktrees|worktree)-(.+)$/);
  if (worktreeMatch) {
    const base = worktreeMatch[1]!.split('-').filter(Boolean).pop() ?? worktreeMatch[1]!;
    const label = worktreeMatch[2]!.split('-').slice(-2).join('-');
    return `${base} (${label})`;
  }

  // 서브디렉토리 감지: -apps-xxx, -packages-xxx, -src-xxx 패턴
  const subMatch = dirName.match(/-(apps|packages|src|libs|modules)-([^-]+)$/);
  if (subMatch) {
    const beforeSub = dirName.replace(/-(apps|packages|src|libs|modules)-[^-]+$/, '');
    const baseName = beforeSub.split('-').filter(Boolean).pop() ?? beforeSub;
    return `${baseName} (${subMatch[1]}-${subMatch[2]})`;
  }

  // 기본: 마지막 세그먼트
  return dirName.split('-').filter(Boolean).pop() ?? dirName;
}

// --- JSONL parsing ---

function parseJsonlFile(filePath: string): unknown[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter((line) => line.trim());
    return lines
      .map((line) => {
        try {
          return JSON.parse(line) as unknown;
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

interface ParsedSession {
  id: string;
  projectPath: string;
  projectDirName: string; // 원본 디렉토리명 (인코딩된 상태)
  filePath: string;
  messages: unknown[];
}

function getSessionsFromDir(projectsDir: string): ParsedSession[] {
  // Reuse cached raw sessions to avoid double disk scan within same TTL window
  const cacheKey = `raw:${projectsDir}`;
  const cached = getCached<ParsedSession[]>(cacheKey);
  if (cached) return cached;

  if (!fs.existsSync(projectsDir)) return [];

  const sessions: ParsedSession[] = [];

  try {
    const projectDirs = fs.readdirSync(projectsDir);

    for (const projectDir of projectDirs) {
      const projectDirPath = path.join(projectsDir, projectDir);
      let stat: fs.Stats;
      try {
        stat = fs.statSync(projectDirPath);
      } catch {
        continue;
      }
      if (!stat.isDirectory()) continue;

      const projectPath = decodeProjectPath(projectDir);

      try {
        const files = fs.readdirSync(projectDirPath);
        const jsonlFiles = files.filter((f) => f.endsWith('.jsonl'));

        for (const jsonlFile of jsonlFiles) {
          const sessionId = path.basename(jsonlFile, '.jsonl');
          const filePath = path.join(projectDirPath, jsonlFile);
          const messages = parseJsonlFile(filePath);

          sessions.push({
            id: sessionId,
            projectPath,
            projectDirName: projectDir,
            filePath,
            messages,
          });
        }
      } catch {
        // skip inaccessible project dirs
      }
    }
  } catch {
    return [];
  }

  setCached(cacheKey, sessions);
  return sessions;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMessage = Record<string, any>;

/**
 * Calculate cost from usage object.
 * Claude JSONL doesn't always have costUSD — calculate from token usage.
 * Cache read tokens are charged at ~10% of input price.
 */
function calcCostFromUsage(model: string, usage: AnyMessage): number {
  const inputTokens = (usage.input_tokens as number) || 0;
  const outputTokens = (usage.output_tokens as number) || 0;
  const cacheCreation = (usage.cache_creation_input_tokens as number) || 0;
  const cacheRead = (usage.cache_read_input_tokens as number) || 0;

  // Base cost
  let cost = calculateCost(model, inputTokens + cacheCreation, outputTokens);
  // Cache read is ~10% of input price
  cost += calculateCost(model, cacheRead, 0) * 0.1;
  return cost;
}

function extractSessionStats(session: ParsedSession): SessionInfo | null {
  const { messages } = session;
  if (messages.length === 0) return null;

  let inputTokens = 0;
  let outputTokens = 0;
  let cost = 0;
  let messageCount = 0;
  let toolCallCount = 0;
  const models = new Set<string>();
  let startTime: Date | null = null;
  let lastTime: Date | null = null;

  for (const msg of messages) {
    const m = msg as AnyMessage;

    // timestamp is at top level
    if (m.timestamp) {
      const t = new Date(m.timestamp as string);
      if (!isNaN(t.getTime())) {
        if (!startTime || t < startTime) startTime = t;
        if (!lastTime || t > lastTime) lastTime = t;
      }
    }

    if (m.type === 'assistant') {
      messageCount++;

      const model: string | undefined = m.message?.model ?? m.model;
      if (model && model !== '<synthetic>') models.add(model);

      const usage = m.message?.usage ?? m.usage;
      if (usage) {
        inputTokens += (usage.input_tokens as number) || 0;
        outputTokens += (usage.output_tokens as number) || 0;

        // Calculate cost — costUSD may not exist in newer Claude Code versions
        if (typeof m.costUSD === 'number' && m.costUSD > 0) {
          cost += m.costUSD as number;
        } else if (model) {
          cost += calcCostFromUsage(model, usage);
        }
      }

      // Count tool_use blocks in assistant content
      const content = m.message?.content ?? m.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if ((block as AnyMessage)?.type === 'tool_use') toolCallCount++;
        }
      }
    } else if (m.type === 'user') {
      messageCount++;
    }
    // skip: system, progress, file-history-snapshot, queue-operation
  }

  // Only skip sessions with literally no parseable content
  if (messageCount === 0 && !startTime) return null;

  if (!startTime) startTime = new Date();
  if (!lastTime) lastTime = startTime;

  const duration = lastTime.getTime() - startTime.getTime();

  return {
    id: session.id,
    projectPath: session.projectPath,
    projectName: getProjectName(session.projectDirName),
    startTime,
    lastTime,
    duration,
    messageCount,
    toolCallCount,
    cost,
    inputTokens,
    outputTokens,
    models: Array.from(models),
  };
}

export function getSessions(claudeDir?: string): SessionInfo[] {
  const cached = getCached<SessionInfo[]>('sessions');
  if (cached) return cached;

  const projectsDir = path.join(claudeDir ?? getClaudeDir(), 'projects');
  const rawSessions = getSessionsFromDir(projectsDir);

  // Pre-populate filePath index so getSessionDetail can skip full scan
  for (const raw of rawSessions) {
    setCached(`filepath:${raw.id}`, raw.filePath);
  }

  const sessions = rawSessions
    .map(extractSessionStats)
    .filter((s): s is SessionInfo => s !== null)
    .sort((a, b) => b.lastTime.getTime() - a.lastTime.getTime());

  setCached('sessions', sessions);
  return sessions;
}

export function getSessionDetail(
  sessionId: string,
  claudeDir?: string
): SessionDetail | null {
  const cacheKey = `session:${sessionId}`;
  const cached = getCached<SessionDetail>(cacheKey);
  if (cached) return cached;

  const projectsDir = path.join(claudeDir ?? getClaudeDir(), 'projects');

  // Fast path: if raw sessions are already cached, look up by id directly
  // instead of scanning the entire directory again
  const rawCached = getCached<ParsedSession[]>(`raw:${projectsDir}`);
  let session: ParsedSession | undefined;
  if (rawCached) {
    session = rawCached.find((s) => s.id === sessionId);
  } else {
    // filePath index: try to locate the session file without full scan
    // by checking the known filePath cache key
    const filePathCacheKey = `filepath:${sessionId}`;
    const knownFilePath = getCached<string>(filePathCacheKey);
    if (knownFilePath && fs.existsSync(knownFilePath)) {
      const messages = parseJsonlFile(knownFilePath);
      // Reconstruct minimal ParsedSession from file path
      const parts = knownFilePath.split(path.sep);
      const projectDir = parts[parts.length - 2] ?? '';
      session = {
        id: sessionId,
        projectPath: decodeProjectPath(projectDir),
        projectDirName: projectDir,
        filePath: knownFilePath,
        messages,
      };
    } else {
      const rawSessions = getSessionsFromDir(projectsDir);
      session = rawSessions.find((s) => s.id === sessionId);
      // Cache the filePath for future direct lookups
      if (session) {
        setCached(`filepath:${sessionId}`, session.filePath);
      }
    }
  }

  if (!session) return null;

  const info = extractSessionStats(session);
  if (!info) return null;

  // Build model breakdown
  const modelMap = new Map<string, ModelUsage>();
  const messages = session.messages as AnyMessage[];

  for (const m of messages) {
    if (m.type === 'assistant') {
      const model: string = (m.message?.model ?? m.model ?? 'unknown') as string;
      const usage = m.message?.usage ?? m.usage;

      let msgCost = 0;
      if (typeof m.costUSD === 'number' && m.costUSD > 0) {
        msgCost = m.costUSD as number;
      } else if (usage && model) {
        msgCost = calcCostFromUsage(model, usage);
      }

      if (!modelMap.has(model)) {
        modelMap.set(model, {
          model,
          displayName: getModelDisplayName(model),
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          cost: 0,
          messageCount: 0,
          color: getModelColor(model),
        });
      }

      const entry = modelMap.get(model)!;
      if (usage) {
        const inp = (usage.input_tokens as number) || 0;
        const out = (usage.output_tokens as number) || 0;
        entry.inputTokens += inp;
        entry.outputTokens += out;
        entry.totalTokens += inp + out;
      }
      entry.cost += msgCost;
      entry.messageCount++;
    }
  }

  const detail: SessionDetail = {
    ...info,
    messages: messages as unknown as Message[],
    modelBreakdown: Array.from(modelMap.values()).filter((m) => m.model !== '<synthetic>'),
  };

  setCached(cacheKey, detail);
  return detail;
}

export function getProjects(claudeDir?: string): ProjectInfo[] {
  const cached = getCached<ProjectInfo[]>('projects');
  if (cached) return cached;

  const sessions = getSessions(claudeDir);
  const projectMap = new Map<string, ProjectInfo>();

  for (const session of sessions) {
    const projectId = session.projectPath;

    if (!projectMap.has(projectId)) {
      projectMap.set(projectId, {
        id: projectId,
        path: session.projectPath,
        name: session.projectName,
        sessionCount: 0,
        totalCost: 0,
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        messageCount: 0,
        toolCallCount: 0,
        lastActivity: session.lastTime,
        models: [],
      });
    }

    const project = projectMap.get(projectId)!;
    project.sessionCount++;
    project.totalCost += session.cost;
    project.inputTokens += session.inputTokens;
    project.outputTokens += session.outputTokens;
    project.totalTokens += session.inputTokens + session.outputTokens;
    project.messageCount += session.messageCount;
    project.toolCallCount += session.toolCallCount;
    if (session.lastTime > project.lastActivity) {
      project.lastActivity = session.lastTime;
    }
    for (const m of session.models) {
      if (!project.models.includes(m)) project.models.push(m);
    }
  }

  const projects = Array.from(projectMap.values()).sort(
    (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
  );

  setCached('projects', projects);
  return projects;
}

export function getProjectSessions(
  projectId: string,
  claudeDir?: string
): SessionInfo[] {
  const sessions = getSessions(claudeDir);
  return sessions.filter((s) => s.projectPath === projectId);
}

export function getDashboardStats(claudeDir?: string): DashboardStats {
  const cached = getCached<DashboardStats>('stats');
  if (cached) return cached;

  const sessions = getSessions(claudeDir);
  const projects = getProjects(claudeDir);

  let totalCost = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalMessages = 0;
  let totalToolCalls = 0;

  const modelMap = new Map<string, ModelUsage>();
  const dailyMap = new Map<string, DailyUsage>();
  const hourMap = new Map<number, PeakHour>();

  // Initialize hours
  for (let h = 0; h < 24; h++) {
    hourMap.set(h, { hour: h, messages: 0, sessions: 0 });
  }

  for (const session of sessions) {
    totalCost += session.cost;
    totalInputTokens += session.inputTokens;
    totalOutputTokens += session.outputTokens;
    totalMessages += session.messageCount;
    totalToolCalls += session.toolCallCount;

    const dateKey = toLocalDateStr(session.startTime);
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, {
        date: dateKey,
        cost: 0,
        inputTokens: 0,
        outputTokens: 0,
        messages: 0,
        sessions: 0,
        toolCalls: 0,
        modelCosts: {},
      });
    }
    const daily = dailyMap.get(dateKey)!;
    daily.cost += session.cost;
    daily.inputTokens += session.inputTokens;
    daily.outputTokens += session.outputTokens;
    daily.messages += session.messageCount;
    daily.sessions++;
    daily.toolCalls += session.toolCallCount;

    // Peak hours
    const hour = session.startTime.getHours();
    const hourEntry = hourMap.get(hour)!;
    hourEntry.messages += session.messageCount;
    hourEntry.sessions++;

    // Initialize model entries from session
    for (const model of session.models) {
      if (!modelMap.has(model)) {
        modelMap.set(model, {
          model,
          displayName: getModelShortName(model),
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          cost: 0,
          messageCount: 0,
          color: getModelColor(model),
        });
      }
    }
  }

  // Deep parse for accurate per-model token+cost stats + cache + tool usage
  const projectsDir = path.join(claudeDir ?? getClaudeDir(), 'projects');
  const rawSessions = getSessionsFromDir(projectsDir);

  let totalCacheCreation = 0;
  let totalCacheRead = 0;
  const toolCountMap = new Map<string, number>();

  for (const rawSession of rawSessions) {
    for (const msg of rawSession.messages) {
      const m = msg as AnyMessage;
      if (m.type !== 'assistant') continue;

      const model: string | undefined = m.message?.model ?? m.model;
      if (!model || model === '<synthetic>') continue;

      const usage = m.message?.usage ?? m.usage;
      let msgCost = 0;
      if (typeof m.costUSD === 'number' && m.costUSD > 0) {
        msgCost = m.costUSD as number;
      } else if (usage) {
        msgCost = calcCostFromUsage(model, usage);
      }

      if (!modelMap.has(model)) {
        modelMap.set(model, {
          model,
          displayName: getModelShortName(model),
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          cost: 0,
          messageCount: 0,
          color: getModelColor(model),
        });
      }
      const entry = modelMap.get(model)!;
      if (usage) {
        const inp = (usage.input_tokens as number) || 0;
        const out = (usage.output_tokens as number) || 0;
        entry.inputTokens += inp;
        entry.outputTokens += out;
        entry.totalTokens += inp + out;
        totalCacheCreation += (usage.cache_creation_input_tokens as number) || 0;
        totalCacheRead += (usage.cache_read_input_tokens as number) || 0;
      }
      entry.cost += msgCost;
      entry.messageCount++;

      // Tool usage
      const content = m.message?.content ?? m.content;
      if (Array.isArray(content)) {
        for (const block of content as AnyMessage[]) {
          if (block?.type === 'tool_use' && block?.name) {
            const toolName = block.name as string;
            toolCountMap.set(toolName, (toolCountMap.get(toolName) ?? 0) + 1);
          }
        }
      }

      // Update daily model costs
      if (m.timestamp) {
        const dateKey = toLocalDateStr(new Date(m.timestamp as string));
        const dailyEntry = dailyMap.get(dateKey);
        if (dailyEntry) {
          dailyEntry.modelCosts[model] =
            (dailyEntry.modelCosts[model] ?? 0) + msgCost;
        }
      }
    }
  }

  // Cache stats
  // 적중률 = 캐시 읽기 / 전체 캐시 관련 토큰 (생성+읽기)
  const totalCacheTokens = totalCacheCreation + totalCacheRead;
  const cacheHitRate = totalCacheTokens > 0
    ? Math.round((totalCacheRead / totalCacheTokens) * 100)
    : 0;
  // 실제 모델별 가중평균 입력 단가로 절약 비용 계산
  // 캐시 읽기는 일반 입력의 ~10% 과금 → 절약 = 캐시 읽기 토큰 × 입력 단가 × 90%
  const totalModelTokens = Array.from(modelMap.values()).reduce((s, m) => s + m.inputTokens, 0);
  const weightedInputPrice = totalModelTokens > 0
    ? Array.from(modelMap.values()).reduce((s, m) => {
        const pricing = getPricing(m.model);
        return s + (m.inputTokens / totalModelTokens) * pricing.input;
      }, 0)
    : 3; // fallback: Sonnet 기본값
  const estimatedSavingsUsd = (totalCacheRead * weightedInputPrice * 0.9) / 1_000_000;
  const cacheStats: CacheStats = {
    totalCacheCreationTokens: totalCacheCreation,
    totalCacheReadTokens: totalCacheRead,
    cacheHitRate,
    estimatedSavingsUsd,
  };

  // Tool usage ranking
  const toolUsage: ToolUsageItem[] = Array.from(toolCountMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Conversation stats
  const sessionsWithDuration = sessions.filter((s) => s.duration > 0);
  const avgSessionDurationMs = sessionsWithDuration.length > 0
    ? sessionsWithDuration.reduce((sum, s) => sum + s.duration, 0) / sessionsWithDuration.length
    : 0;
  const avgMessagesPerSession = sessions.length > 0
    ? totalMessages / sessions.length
    : 0;
  const TEN_MIN = 10 * 60 * 1000;
  const ONE_HOUR = 60 * 60 * 1000;
  const conversationStats: ConversationStats = {
    avgSessionDurationMs,
    avgMessagesPerSession,
    avgInputTokensPerMessage: totalMessages > 0 ? totalInputTokens / totalMessages : 0,
    avgOutputTokensPerMessage: totalMessages > 0 ? totalOutputTokens / totalMessages : 0,
    shortSessions: sessions.filter((s) => s.duration < TEN_MIN).length,
    mediumSessions: sessions.filter((s) => s.duration >= TEN_MIN && s.duration < ONE_HOUR).length,
    longSessions: sessions.filter((s) => s.duration >= ONE_HOUR).length,
  };

  // Activity data (for heatmap) — use message count per day
  const activityMap = new Map<string, number>();
  for (const session of sessions) {
    const dateKey = toLocalDateStr(session.startTime);
    activityMap.set(dateKey, (activityMap.get(dateKey) ?? 0) + session.messageCount);
  }

  // Use model-level cost as source of truth for total cost (more accurate)
  const modelTotalCost = Array.from(modelMap.values()).reduce((sum, m) => sum + m.cost, 0);
  const finalTotalCost = modelTotalCost > 0 ? modelTotalCost : totalCost;

  const lifetime = getClaudeLifetime(claudeDir);

  const stats: DashboardStats = {
    totalCost: finalTotalCost,
    totalTokens: totalInputTokens + totalOutputTokens,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    totalSessions: sessions.length,
    totalProjects: projects.length,
    totalMessages,
    totalToolCalls,
    modelBreakdown: Array.from(modelMap.values())
      .filter((m) => m.messageCount > 0 && m.model !== '<synthetic>')
      .sort((a, b) => b.cost - a.cost),
    dailyUsage: Array.from(dailyMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    ),
    peakHours: Array.from(hourMap.values()),
    recentSessions: sessions.slice(0, 10),
    activityData: Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count,
    })),
    cacheStats,
    toolUsage,
    conversationStats,
    lifetime,
  };

  setCached('stats', stats);
  return stats;
}

// --- settings.json reader ---

export function getClaudeSettings(claudeDir?: string): ClaudeSettings {
  const filePath = path.join(claudeDir ?? getClaudeDir(), 'settings.json');
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      model: typeof parsed.model === 'string' ? parsed.model : undefined,
      enabledPlugins: typeof parsed.enabledPlugins === 'object' && parsed.enabledPlugins !== null
        ? parsed.enabledPlugins as Record<string, boolean>
        : undefined,
      permissions: typeof parsed.permissions === 'object' && parsed.permissions !== null
        ? parsed.permissions as { defaultMode?: string; allow?: string[] }
        : undefined,
    };
  } catch {
    return {};
  }
}

// --- skills reader ---

export function getSkills(claudeDir?: string): SkillInfo[] {
  const skillsDir = path.join(claudeDir ?? getClaudeDir(), 'skills');
  if (!fs.existsSync(skillsDir)) return [];

  const skills: SkillInfo[] = [];

  try {
    const entries = fs.readdirSync(skillsDir);
    for (const entry of entries) {
      const entryPath = path.join(skillsDir, entry);
      try {
        if (!fs.statSync(entryPath).isDirectory()) continue;
      } catch { continue; }

      // Find SKILL.md or skill.md
      let skillFile = path.join(entryPath, 'SKILL.md');
      if (!fs.existsSync(skillFile)) skillFile = path.join(entryPath, 'skill.md');
      if (!fs.existsSync(skillFile)) continue;

      try {
        const content = fs.readFileSync(skillFile, 'utf-8');
        const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!fmMatch) continue;
        const fm = fmMatch[1]!;

        // Parse name
        const nameMatch = fm.match(/^name:\s*(.+)$/m);
        const name = nameMatch?.[1]?.trim() ?? entry;

        // Parse description (handles block scalar with |)
        const descMatch = fm.match(/^description:\s*\|?\n?([\s\S]*?)(?=\n\w|\n---|\Z)/m);
        const rawDesc = descMatch?.[1] ?? '';
        const description = rawDesc
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .join(' ')
          .slice(0, 200);

        // Parse user-invocable
        const invocableMatch = fm.match(/^user-invocable:\s*(.+)$/m);
        const userInvocable = invocableMatch?.[1]?.trim() === 'true';

        // Body: everything after the closing ---
        const bodyMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
        const body = bodyMatch?.[1]?.trim() ?? '';

        skills.push({ name, description, userInvocable, body });
      } catch { continue; }
    }
  } catch { return []; }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

// --- stats-cache.json reader ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readStatsCache(claudeDir?: string): Record<string, any> | null {
  const filePath = path.join(claudeDir ?? getClaudeDir(), 'stats-cache.json');
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getClaudeLifetime(claudeDir?: string): ClaudeLifetime {
  const sc = readStatsCache(claudeDir);

  const firstSessionDate = sc?.firstSessionDate
    ? new Date(sc.firstSessionDate as string)
    : null;
  const daysActive = firstSessionDate
    ? Math.floor((Date.now() - firstSessionDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const longest = sc?.longestSession as Record<string, unknown> | undefined;
  const longestSessionDurationMs = typeof longest?.duration === 'number' ? longest.duration : 0;
  const longestSessionMessageCount = typeof longest?.messageCount === 'number' ? longest.messageCount : 0;

  return {
    firstSessionDate,
    daysActive,
    longestSessionDurationMs,
    longestSessionMessageCount,
  };
}

export function searchSessions(
  query: string,
  claudeDir?: string
): SessionInfo[] {
  const sessions = getSessions(claudeDir);
  if (!query.trim()) return sessions;

  const q = query.toLowerCase();
  return sessions.filter(
    (s) =>
      s.projectName.toLowerCase().includes(q) ||
      s.projectPath.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
  );
}
