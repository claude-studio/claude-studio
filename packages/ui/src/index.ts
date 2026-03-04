// Utilities
export { cn } from './lib/utils';

// Components
export { Badge, badgeVariants } from './components/ui/badge';
export { Button, buttonVariants } from './components/ui/button';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './components/ui/card';
export { Dialog, DialogTrigger, DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from './components/ui/dialog';
export { Input } from './components/ui/input';
export { ScrollArea, ScrollBar } from './components/ui/scroll-area';
export { Separator } from './components/ui/separator';
export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from './components/ui/table';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/ui/tooltip';
export { Progress } from './components/ui/progress';
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectSeparator } from './components/ui/select';

// Layout
export { Sidebar } from './layout/sidebar';
export { StatCard } from './layout/stat-card';

// Charts
export { UsageOverTime } from './charts/usage-over-time';
export { ModelBreakdown } from './charts/model-breakdown';
export { ActivityHeatmap } from './charts/activity-heatmap';
export { PeakHours } from './charts/peak-hours';
export { CostChart } from './charts/cost-chart';

// Hooks / Provider
export { DataProviderWrapper, useStats, useProjects, useSessions, useSessionDetail, useProjectSessions } from './hooks/use-data';

// CSS (consumers must import separately)
// import '@repo/ui/globals.css'
