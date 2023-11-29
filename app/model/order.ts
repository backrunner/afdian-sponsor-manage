import type { Application } from 'egg';

export default (app: Application) => {
  const { STRING, BIGINT } = (app as any).Sequelize;

  const Order: any = (app as any).model.define('order', {
    trade_no: {
      type: STRING,
      primaryKey: true,
    },
    user_id: {
      type: STRING,
    },
    plan_id: {
      type: STRING,
    },
    month: {
      type: BIGINT,
    },
    amount: {
      type: STRING,
    },
    total_amount: {
      type: STRING,
    },
    pay_time: {
      type: BIGINT,
    },
    expire_time: {
      type: BIGINT,
    },
  });

  Order.associate = function () {
    (app as any).model.Order.belongsTo((app as any).model.Sponsor, { foreignKey: 'user_id',  constraints: false });
  }

  Order.sync({ alter: true });

  return Order;
};
