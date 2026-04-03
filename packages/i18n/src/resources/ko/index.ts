import analytics from './analytics';
import common from './common';
import navigation from './navigation';
import settings from './settings';
import studio from './studio';
import web from './web';

const ko = {
  analytics,
  common,
  navigation,
  settings,
  studio,
  web,
} as const;

export default ko;
