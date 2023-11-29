/* eslint-disable no-await-in-loop */
import type { AfdianSponsorInfo, AfdianSponsorResponse } from 'afdian-api/dist/src/types/request';
import Afdian from 'afdian-api';
import moment from 'moment';
import { Subscription } from 'egg';
import { sleep } from '../../utils';
import { taskIntervals } from '../../config/task';

export default class FetchSponsors extends Subscription {
  public static get schedule() {
    return {
      interval: taskIntervals.fetchSponsors,
      type: 'worker',
    };
  }

  public async updateSponsors(sponsors: AfdianSponsorInfo[]) {
    const { ctx } = this;
    const transformed = sponsors.map((item) => {
      const currentPayExpire = moment
        .unix(item.last_pay_time)
        .add(item.current_plan.pay_month - 1, 'month')
        .endOf('month')
        .hour(23)
        .minute(59)
        .second(59)
        .unix();
      return {
        user_id: item.user.user_id,
        name: item.user.name,
        avatar: item.user.avatar,
        first_pay_time: item.first_pay_time,
        last_pay_time: item.last_pay_time,
        all_sum_amount: item.all_sum_amount,
        current_plan_id: item.current_plan.plan_id,
        current_plan_name: item.current_plan.name,
        current_plan_price: item.current_plan.price,
        current_pay_month: item.current_plan.pay_month,
        current_pay_expire: currentPayExpire,
      };
    });
    await ctx.model.Sponsor.bulkCreate(transformed, {
      updateOnDuplicate: ['user_id'],
    });
  }

  // 全量获取赞助者（赞助者是动态数据，每次需要全量刷新）
  public async fetchSponsors(afdian: Afdian) {
    // 先获取第一面的数据，请求总页数
    const firstRes = await afdian.querySponsor(1);
    const totalPage = firstRes.data.total_page;
    const pages: number[] = [];
    for (let i = 2; i < totalPage; i++) {
      pages.push(i);
    }
    const pageRes: AfdianSponsorResponse[] = [];
    for (const page of pages) {
      const r = await afdian.querySponsor(page);
      pageRes.push(r);
      // 1秒发一个包，避免QPS过高出错
      await sleep(1000);
    }
    const sponsors = [...firstRes.data.list].concat(
      pageRes.reduce((res, curr) => {
        return res.concat(curr.data.list);
      }, new Array<AfdianSponsorInfo>()),
    );
    await this.updateSponsors(sponsors);
  }

  public async subscribe() {
    const { ctx } = this;
    const { userId, token } = ctx.app.config.afdian;
    const afdian = new Afdian({
      userId,
      token,
    });
    await this.fetchSponsors(afdian);
    await (ctx.app as any).redis.set(
      'last-fetch-sponsor-time',
      JSON.stringify({
        time: Date.now(),
      }),
    );
  }
}
