import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  static: false,
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
};

export default plugin;
