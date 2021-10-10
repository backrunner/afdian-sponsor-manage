// This file is created by egg-ts-helper@1.27.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSponsor from '../../../app/controller/sponsor';

declare module 'egg' {
  interface IController {
    sponsor: ExportSponsor;
  }
}
