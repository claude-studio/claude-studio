import analytics from './analytics';
import common from './common';
import navigation from './navigation';
import settings from './settings';
import studio from './studio';

const ko = {
  analytics,
  common,
  navigation,
  settings,
  studio,
} as const;

export default ko;
