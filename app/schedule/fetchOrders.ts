/* eslint-disable no-await-in-loop */
import { AfdianOrderInfo, AfdianOrderResponse } from 'afdian-api/dist/src/types/request';
import Afdian from 'afdian-api';
import { Subscription } from 'egg';
import { sleep } from '../../utils';
import { taskIntervals } from '../../config/task';
import moment from 'moment';

export default class FetchOrders extends Subscription {
  static get schedule() {
    return {
      interval: taskIntervals.fetchOrders,
      type: 'worker',
    };
  }

  async updateOrders(orders: AfdianOrderInfo[]) {
    const { ctx } = this;
    const transformed = orders.map((item) => {
      const { out_trade_no: tradeNo } = item;
      // e.g.: 202110122117524810199520801
      const time = tradeNo.substr(0, 14);
      // 付费时间
      const payTime = moment(time, 'YYYYMMDDHHmmss').unix();
      // 订单过期时间
      const expireTime = moment(time, 'YYYYMMDDHHmmss')
        .add(item.month - 1, 'month')
        .endOf('month')
        .hour(23)
        .minute(59)
        .second(59)
        .unix();
      return {
        trade_no: tradeNo,
        user_id: item.user_id,
        plan_id: item.plan_id,
        month: item.month,
        amount: `${(parseFloat(item.total_amount) / item.month).toFixed(2)}`,
        total_amount: item.total_amount,
        pay_time: payTime,
        expire_time: expireTime,
      };
    });
    await ctx.model.Order.bulkCreate(transformed, {
      updateOnDuplicate: ['trade_no'],
    });
  }

  async fetchOrders(afdian: Afdian) {
    const firstRes = await afdian.queryOrder(1);
    const totalPage = firstRes.data.total_page;
    const pages: number[] = [];
    for (let i = 2; i < totalPage; i++) {
      pages.push(i);
    }
    const pageRes: AfdianOrderResponse[] = [];
    for (const page of pages) {
      const r = await afdian.queryOrder(page);
      pageRes.push(r);
      // 1秒发一个包，避免QPS过高出错
      await sleep(1000);
    }
    const orders = [...firstRes.data.list].concat(
      pageRes.reduce((res, curr) => {
        return res.concat(curr.data.list);
      }, new Array<AfdianOrderInfo>()),
    );
    await this.updateOrders(orders);
  }

  async subscribe() {
    const { ctx } = this;
    const { userId, token } = ctx.app.config.afdian;
    const afdian = new Afdian({
      userId,
      token,
    });
    await this.fetchOrders(afdian);
    await ctx.app.redis.set(
      'last-fetch-order-time',
      JSON.stringify({
        time: Date.now(),
      }),
    );
  }
}
