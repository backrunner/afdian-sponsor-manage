import level from '../../utils/level';
import LRUCache from 'lru-cache';

export default {
  level,
  cache: new LRUCache<string, unknown>({
    maxAge: 3600,
    updateAgeOnGet: false,
  }),
};
