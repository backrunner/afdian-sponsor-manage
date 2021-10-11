import { Application } from '../../typings/app';

export default (app: Application) => {
  const { STRING, INTEGER } = app.Sequelize;

  const Order = app.model.define('order', {
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
      type: INTEGER,
    },
    total_amount: {
      type: STRING,
    },
  });

  Order.sync({ alter: true });

  return Order;
};
