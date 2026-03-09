// Utilities
export { cn } from './lib/utils';

// Components
export { Badge, badgeVariants } from './components/ui/badge';
export { Particles } from './components/ui/particles';
export { Button, buttonVariants } from './components/ui/button';
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog';
export { Input } from './components/ui/input';
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from './components/ui/dropdown-menu';
export { ScrollArea, ScrollBar } from './components/ui/scroll-area';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';

// Layout
export { StatCard } from './layout/stat-card';
export { CostDisplay } from './layout/cost-display';

// Sidebar primitives (shadcn)
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './components/ui/sidebar';

// Charts
export { ActivityHeatmap } from './charts/activity-heatmap';
export { CacheStatsCard } from './charts/cache-stats';
export { ClaudeLifetimeCard } from './charts/claude-lifetime';
export { ConversationStatsCard } from './charts/conversation-stats';
export { CostChart } from './charts/cost-chart';
export { ModelBreakdown } from './charts/model-breakdown';
export { PeakHours } from './charts/peak-hours';
export { ProjectCostChart } from './charts/project-cost-chart';
export { ToolUsageChart } from './charts/tool-usage';
export { UsageOverTime } from './charts/usage-over-time';

// Hooks / Provider
export { DataProviderWrapper, useProjects, useStats } from './hooks/use-data';
export { ThemeProvider, useTheme } from './hooks/use-theme';


// CSS (consumers must import separately)
// import '@repo/ui/globals.css'
