import 'egg';
import LRUCache from 'lru-cache';
import ExtendApplication from '../../typings/app/extend/application';

type ExtendApplicationType = typeof ExtendApplication;
declare module 'egg' {
  interface Application extends ExtendApplicationType {
    cache: LRUCache<string, unknown>;
  }
}
