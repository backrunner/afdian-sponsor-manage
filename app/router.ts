import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/sponsor/currentMonth', controller.sponsor.getCurrentMonth);
  router.get('/sponsor/all', controller.sponsor.getAllSponsors);
};
