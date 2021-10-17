import { AfdianOrderInfo } from 'afdian-api/dist/src/types/request';
import { Controller } from '../../typings/app';

export default class WebhookController extends Controller {
  async handleOrder() {
    const { ctx } = this;
    const orderInfo: AfdianOrderInfo = ctx.request.body;
    await ctx.service.afdianManage.updateOrder(orderInfo);
  }
}
