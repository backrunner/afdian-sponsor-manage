// This file is created by egg-ts-helper@1.27.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAfdianManage from '../../../app/controller/afdianManage';
import ExportWebhook from '../../../app/controller/webhook';

declare module 'egg' {
  interface IController {
    afdianManage: ExportAfdianManage;
    webhook: ExportWebhook;
  }
}
