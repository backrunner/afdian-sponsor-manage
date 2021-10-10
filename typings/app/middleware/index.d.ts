// This file is created by egg-ts-helper@1.27.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportNotFoundHandler from '../../../app/middleware/notFoundHandler';

declare module 'egg' {
  interface IMiddleware {
    notFoundHandler: typeof ExportNotFoundHandler;
  }
}
