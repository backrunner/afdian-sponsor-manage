import type { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const config = {} as PowerPartial<EggAppConfig>;

  config.cluster = {
    hostname: '127.0.0.1',
  };

  config.keys = `${appInfo.name}_1633789077018_3908`;

  config.cors = {
    origin: '*',
    allowMethods: 'GET,POST',
  };

  config.security = {
    xframe: {
      value: 'SAMEORIGIN',
    },
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ['https://pixiviz.pwp.app'],
  };

  config.validate = {
    convert: true,
    widelyUndefined: true,
  };

  config.onerror = {
    all: (_err, ctx) => {
      if (ctx.status === 422) {
        ctx.body = {
          code: 10001,
          success: false,
          message: 'Request validation failed.',
        };
      } else {
        ctx.body = {
          code: 10000,
          success: false,
          message: 'Unknown internal error occured.',
        };
      }
      ctx.set({
        'Content-Type': 'application/json',
      });
    },
  };

  config.logrotator = {
    maxFileSize: 100 * 1024 * 1024, // 100 MB
    maxFiles: 10,
    maxDays: 14,
  };

  config.sequelize = {
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      paranoid: false,
      underscored: true,
      freezeTableName: true,
    },
  };

  config.middleware = ['notFoundHandler'];

  return {
    ...config,
  };
};
