import LRUCache from 'lru-cache';

export default {
  cache: new LRUCache<string, unknown>({
    maxAge: 3600,
    updateAgeOnGet: false,
  }),
};
