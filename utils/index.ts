import { Model } from "sequelize/types";

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const transformResults = <T>(result: Array<Model<any, any>>): T[] => {
  return result.map(ins => ins.get({ plain: true })) as T[];
};

export const transformResult = <T>(result: Model<any, any> | null): T | null => {
  if (!result) {
    return null;
  }
  return result.get({ plain: true })
};
