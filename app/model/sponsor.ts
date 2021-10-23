import { Application } from 'egg';
import { INTEGER } from 'sequelize';

export default (app: Application) => {
  const { STRING, BIGINT } = app.Sequelize;

  const Sponsor: any = app.model.define('sponsor', {
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
      type: BIGINT,
    },
    last_pay_time: {
      type: BIGINT,
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
    current_pay_month: {
      type: INTEGER,
    },
    current_pay_expire: {
      type: INTEGER,
    },
  });

  Sponsor.associate = function () {
    app.model.Sponsor.hasMany(app.model.Order, { foreignKey: 'user_id', constraints: false });
  }

  Sponsor.sync({ alter: true });

  return Sponsor;
};
