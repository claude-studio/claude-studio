export interface ModelPricing {
  input: number; // per million tokens
  output: number; // per million tokens
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  'claude-opus-4-5': { input: 15, output: 75 },
  'claude-opus-4-5-20251101': { input: 15, output: 75 },
  'claude-sonnet-4-5': { input: 3, output: 15 },
  'claude-sonnet-4-5-20251101': { input: 3, output: 15 },
  'claude-haiku-4-5': { input: 0.8, output: 4 },
  'claude-haiku-4-5-20251001': { input: 0.8, output: 4 },
  'claude-opus-4': { input: 15, output: 75 },
  'claude-opus-4-20250514': { input: 15, output: 75 },
  'claude-opus-4-6': { input: 15, output: 75 },
  'claude-sonnet-4': { input: 3, output: 15 },
  'claude-sonnet-4-20250514': { input: 3, output: 15 },
  'claude-sonnet-4-6': { input: 3, output: 15 },
  'claude-sonnet-4-6-20250514': { input: 3, output: 15 },
  'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
  'claude-3-5-sonnet-20240620': { input: 3, output: 15 },
  'claude-3-5-haiku-20241022': { input: 0.8, output: 4 },
  'claude-3-opus-20240229': { input: 15, output: 75 },
  'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
  'claude-3-sonnet-20240229': { input: 3, output: 15 },
};

const DEFAULT_PRICING: ModelPricing = { input: 3, output: 15 };

export function getPricing(model: string): ModelPricing {
  const exact = MODEL_PRICING[model];
  if (exact) return exact;

  // Try prefix matching
  for (const [key, pricing] of Object.entries(MODEL_PRICING)) {
    if (model.startsWith(key) || key.startsWith(model)) return pricing;
  }

  // Model family matching
  if (model.includes('opus')) return { input: 15, output: 75 };
  if (model.includes('haiku')) return { input: 0.8, output: 4 };

  return DEFAULT_PRICING;
}

export function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = getPricing(model);
  return (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
}

const MODEL_DISPLAY_NAMES: Record<string, string> = {
  opus: 'Claude Opus',
  sonnet: 'Claude Sonnet',
  haiku: 'Claude Haiku',
};

export function getModelDisplayName(model: string): string {
  for (const [key, name] of Object.entries(MODEL_DISPLAY_NAMES)) {
    if (model.includes(key)) return name;
  }
  const parts = model.split('-');
  if (parts.length >= 2) {
    return parts
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }
  return model;
}

export function getModelColor(model: string): string {
  if (model.includes('opus')) return 'var(--chart-1)';
  if (model.includes('sonnet')) return 'var(--chart-2)';
  if (model.includes('haiku')) return 'var(--chart-3)';
  return 'var(--chart-4)';
}

export function getModelShortName(model: string): string {
  if (model.includes('opus-4-6')) return 'Opus 4.6';
  if (model.includes('opus-4-5')) return 'Opus 4.5';
  if (model.includes('opus-4')) return 'Opus 4';
  if (model.includes('sonnet-4-6')) return 'Sonnet 4.6';
  if (model.includes('sonnet-4-5')) return 'Sonnet 4.5';
  if (model.includes('sonnet-4')) return 'Sonnet 4';
  if (model.includes('haiku-4-5')) return 'Haiku 4.5';
  if (model.includes('haiku-4')) return 'Haiku 4';
  if (model.includes('3-5-sonnet')) return 'Sonnet 3.5';
  if (model.includes('3-5-haiku')) return 'Haiku 3.5';
  if (model.includes('3-opus')) return 'Opus 3';
  if (model.includes('3-haiku')) return 'Haiku 3';
  if (model.includes('3-sonnet')) return 'Sonnet 3';
  return model.split('-').slice(-2).join(' ');
}
