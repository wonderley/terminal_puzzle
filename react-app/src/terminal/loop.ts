import { App } from '../App';

export class Loop {
  static readonly TICK_INTERVAL_MILLIS = 10;
  requestID = -1;
  lastLoop = new Date().getTime();
  constructor(private _app: App) {}

  loop() {
    const now = new Date().getTime();
    if (now - this.lastLoop >= Loop.TICK_INTERVAL_MILLIS) {
      this._app.onTick(now);
    }
    this.lastLoop = now;
    this.requestID = window.requestAnimationFrame(this.loop.bind(this));
  }

  start() {
    this.loop();
  }

  stop() {
    window.cancelAnimationFrame(this.requestID);
    this.requestID = -1;
  }
}
