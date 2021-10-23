import { AfdianOrderInfo } from 'afdian-api/dist/src/types/request';
import { Service } from 'egg';
import moment from 'moment';
import { transformResult, transformResults } from '../../utils';

const cacheKey = {
  monthSum: (month: number) => `month-sum_${month}`,
  monthSponsors: (month: number) => `month-sponsors_${month}`,
};

interface SponsorInfo {
  user_id: string;
  name: string;
  avatar: string;
  first_pay_time: number;
  last_pay_time: number;
  all_sum_amount: string;
  current_plan_id: string;
  current_plan_name: string;
  current_plan_price: string;
}

export default class AfdianManageService extends Service {
  // 当月发电额（按可提取计算）
  async getMonthSum(month: number): Promise<number> {
    const { ctx } = this;
    const now = moment();
    const key = cacheKey.monthSum(month);
    const cached = ctx.app.cache.get(key) as number | null;
    if (cached) {
      return cached;
    }
    const diff = now.diff(moment().month(month), 'month');
    if (diff < 0) {
      return 0;
    }
    const { lte, gte } = ctx.app.Sequelize.Op;
    const end = moment()
      .subtract(diff, 'month')
      .endOf('month')
      .hour(23)
      .minute(59)
      .second(59)
      .unix();
    const res = transformResult<{ total: number }>(
      await ctx.model.Order.findOne({
        attributes: [[ctx.app.Sequelize.fn('sum', ctx.app.Sequelize.col('amount')), 'total']],
        where: {
          expire_time: {
            [gte]: end,
          },
          pay_time: {
            [lte]: end,
          },
        },
        raw: false,
      }),
    );
    if (!res) {
      throw new Error('No result');
    }
    ctx.app.cache.set(key, res.total);
    return res.total;
  }
  async getTotalSum(): Promise<number> {
    const { ctx } = this;
    const cached = ctx.app.cache.get('total-sum') as number | null;
    if (cached) {
      return cached;
    }
    const res = transformResult<{ total: number }>(
      await ctx.model.Order.findOne({
        attributes: [[ctx.app.Sequelize.fn('sum', ctx.app.Sequelize.col('total_amount')), 'total']],
      }),
    );
    if (!res) {
      throw new Error('No result');
    }
    ctx.app.cache.set('total-sum', res.total);
    return res.total;
  }
  async updateOrder(order: AfdianOrderInfo) {
    const { ctx } = this;
    const { out_trade_no: tradeNo } = order;
    // e.g.: 202110122117524810199520801
    const time = tradeNo.substr(0, 14);
    const payTime = moment(time, 'YYYYMMDDHHmmss').valueOf();
    const expireTime = moment(time, 'YYYYMMDDHHmmss')
        .add(order.month - 1, 'month')
        .endOf('month')
        .hour(23)
        .minute(59)
        .second(59)
        .unix();
    const transformed = {
      trade_no: tradeNo,
      user_id: order.user_id,
      plan_id: order.plan_id,
      month: order.month,
      amount: `${parseFloat(order.total_amount) / order.month}`,
      total_amount: order.total_amount,
      pay_time: payTime,
      expire_time: expireTime,
    };
    await ctx.model.Sponsor.bulkCreate([transformed], {
      updateOnDuplicate: ['user_id'],
    });
  }
  // 获得当月发电赞助者（不含长期）
  async getMonthSponsors(month: number): Promise<SponsorInfo[]> {
    const { ctx } = this;
    const now = moment();
    const key = cacheKey.monthSponsors(month);
    const cached = ctx.app.cache.get(key) as SponsorInfo[] | null;
    if (cached) {
      return cached;
    }
    const diff = now.diff(moment().month(month), 'month');
    if (diff < 0) {
      return [];
    }
    const { lte, gte } = ctx.app.Sequelize.Op;
    const end = moment().subtract(diff, 'month').endOf('month').hour(23).minute(59).second(59).unix();
    const sponsors = transformResults<SponsorInfo>(
      await ctx.model.Sponsor.findAll({
        include: [{
          model: ctx.model.Order,
          where: {
            expire_time: {
              [gte]: end,
            },
            pay_time: {
              [lte]: end,
            },
          },
        }],
      }),
    );
    ctx.app.cache.set('current-sponsor', sponsors);
    return sponsors;
  }
  // 获得当前发电赞助者（含长期）
  async getCurrentSponsors(): Promise<SponsorInfo[]> {
    const { ctx } = this;
    const cached = ctx.app.cache.get('current-sponsors') as SponsorInfo[] | null;
    if (cached) {
      return cached;
    }
    const { ne } = ctx.app.Sequelize.Op;
    const sponsors = transformResults<SponsorInfo>(
      await ctx.model.Sponsor.findAll({
        where: {
          current_plan_id: {
            [ne]: null,
          },
        },
        raw: false,
      }),
    ).map((item) => {
      const { last_pay_time } = item;
      const start = moment().startOf('month').hour(0).minute(0).second(0).unix();
      const end = moment().endOf('month').hour(23).minute(59).second(59).unix();
      const current_month_pay = last_pay_time >= start && last_pay_time < end;
      return {
        ...item,
        current_month_pay,
      };
    });
    ctx.app.cache.set('current-sponsor', sponsors);
    return sponsors;
  }
  // 获得所有赞助者（含历史）
  async getAllSponsors(): Promise<SponsorInfo[]> {
    const { ctx } = this;
    const cached = ctx.app.cache.get('all-sponsors') as SponsorInfo[] | null;
    if (cached) {
      return cached;
    }
    const sponsors = transformResults<SponsorInfo>(await ctx.model.Sponsor.findAll());
    ctx.app.cache.set('all-sponsor', sponsors);
    return sponsors;
  }
}
