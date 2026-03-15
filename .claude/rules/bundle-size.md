# Bundle Size Rules

## Critical (REQUEST_CHANGES)

- No full library default imports when named imports are available
  - `import _ from 'lodash'` → use `import { debounce } from 'lodash-es'` or native JS
  - `import * as icons from 'lucide-react'` → import individual icons
- Large components (charts, editors, modals) must use `React.lazy` + `Suspense` if not on initial render path

## Warning (COMMENT)

- Prefer native browser APIs over utility libraries for simple operations
  - `Array.from`, `Object.entries`, `structuredClone` over lodash equivalents
- `framer-motion` animations on list items should use `AnimatePresence` correctly to avoid layout thrashing
- Recharts: import only needed chart types (`BarChart`, `LineChart`) — avoid importing the full bundle
- Images should use appropriate formats (WebP/AVIF) and include `width`/`height` to prevent layout shift

## Patterns to Flag

```tsx
// ❌ Full lodash import
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ Named import from lodash-es (tree-shakable)
import { debounce } from 'lodash-es';
const result = debounce(fn, 300);

// ✅ Or use native
const result = useCallback(fn, []); // for React debounce patterns

// ❌ All icons imported
import * as Icons from 'lucide-react';

// ✅ Only what's needed
import { Search, Settings, ChevronDown } from 'lucide-react';

// ❌ Heavy component not lazy-loaded
import { HeavyChart } from './HeavyChart';

// ✅ Lazy loaded
const HeavyChart = React.lazy(() => import('./HeavyChart'));
```
