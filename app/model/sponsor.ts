import { Application } from '../../typings/app';

export default (app: Application) => {
  const { STRING, INTEGER } = app.Sequelize;

  const Sponsor = app.model.define('sponsor', {
    user_id: {
      type: STRING,
      primaryKey: true,
    },
    name: {
      type: STRING,
    },
    avatar: {
      type: STRING(2048),
    },
    first_pay_time: {
      type: INTEGER,
    },
    last_pay_time: {
      type: INTEGER,
    },
    all_sum_amount: {
      type: STRING,
    },
    current_plan_id: {
      type: STRING,
    },
    current_plan_name: {
      type: STRING,
    },
    current_plan_price: {
      type: STRING,
    },
  });

  Sponsor.sync({ alter: true });

  return Sponsor;
};
