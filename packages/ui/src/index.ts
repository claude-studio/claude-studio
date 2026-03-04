// Utilities
export { cn } from './lib/utils';

// Components
export { Badge, badgeVariants } from './components/ui/badge';
export { Button, buttonVariants } from './components/ui/button';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/ui/card';
export {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/ui/dialog';
export { Input } from './components/ui/input';
export { ScrollArea, ScrollBar } from './components/ui/scroll-area';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/ui/tooltip';

// Layout
export { Sidebar } from './layout/sidebar';
export { StatCard } from './layout/stat-card';

// Charts
export { UsageOverTime } from './charts/usage-over-time';
export { ModelBreakdown } from './charts/model-breakdown';
export { ActivityHeatmap } from './charts/activity-heatmap';
export { PeakHours } from './charts/peak-hours';
export { CostChart } from './charts/cost-chart';
export { CacheStatsCard } from './charts/cache-stats';
export { ToolUsageChart } from './charts/tool-usage';
export { ConversationStatsCard } from './charts/conversation-stats';
export { ClaudeLifetimeCard } from './charts/claude-lifetime';
export { ProjectCostChart } from './charts/project-cost-chart';

// Hooks / Provider
export {
  DataProviderWrapper,
  useStats,
  useProjects,
  useSessions,
  useSessionDetail,
  useProjectSessions,
  TeamsProviderWrapper,
  useTeams,
} from './hooks/use-data';

// Pages
export {
  OverviewPage,
  CostsPage,
  SessionsPage,
  SessionDetailPage,
  ProjectsPage,
  ProjectDetailPage,
  TeamsPage,
  SkillsPage,
  DataPage,
} from './pages/index';

// CSS (consumers must import separately)
// import '@repo/ui/globals.css'
