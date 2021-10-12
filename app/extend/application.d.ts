import 'egg';
import { LevelDown } from 'leveldown';
import { LevelUp } from 'levelup';
import LRUCache from 'lru-cache';
import ExtendApplication from '../../typings/app/extend/application';

type ExtendApplicationType = typeof ExtendApplication;
declare module 'egg' {
  interface Application extends ExtendApplicationType {
    level: LevelUp<LevelDown>;
    cache: LRUCache<string, unknown>;
  }
}
