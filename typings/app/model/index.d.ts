// This file is created by egg-ts-helper@1.27.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportOrder from '../../../app/model/order';
import ExportSponsor from '../../../app/model/sponsor';

declare module 'egg' {
  interface IModel {
    Order: ReturnType<typeof ExportOrder>;
    Sponsor: ReturnType<typeof ExportSponsor>;
  }
}
