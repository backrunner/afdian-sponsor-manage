import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/current', controller.afdianManage.getCurrentStatus);
  router.get('/allSponsors', controller.afdianManage.getAllSponsors);

  router.post('/webhook', controller.webhook.handleOrder);
};
