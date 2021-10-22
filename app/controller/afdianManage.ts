import { Controller } from 'egg';
import moment from 'moment';
import R from '../../utils/R';

export default class AfdianManageController extends Controller {
  // 获取当前发电情况
  async getCurrentStatus() {
    const { ctx } = this;
    const sponsors = await ctx.service.afdianManage.getCurrentSponsors();
    const now = moment();
    const lastMonthSum = await ctx.service.afdianManage.getMonthSum(
      now.subtract(1, 'month').month(),
    );
    const currentMonthSum = await ctx.service.afdianManage.getMonthSum(now.month());
    const totalSum = await ctx.service.afdianManage.getTotalSum();
    const { time: lastFetchSponsorTime } = JSON.parse(
      (await ctx.app.redis.get('last-fetch-sponsor-time')) || '{}',
    );
    const { time: lastFetchOrderTime } = JSON.parse(
      (await ctx.app.redis.get('last-fetch-order-time')) || '{}',
    );
    const lastUpdateTime =
      lastFetchSponsorTime && lastFetchOrderTime
        ? Math.max(lastFetchOrderTime, lastFetchSponsorTime)
        : lastFetchOrderTime || lastFetchSponsorTime;
    return R.success({
      sponsors,
      amount: {
        last_month: lastMonthSum,
        current_month: currentMonthSum,
        total: totalSum,
      },
      count: {
        current_month: 0,
      },
      last_update_time: lastUpdateTime,
    });
  }
  // 获取所有赞助者
  async getAllSponsors() {
    const { ctx } = this;
    return R.success(await ctx.service.afdianManage.getAllSponsors());
  }
}
