import { Application } from "egg";

export default class AfdianManageApp {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  async didReady() {
    // 检查是否有全量获取过订单
  }
}
