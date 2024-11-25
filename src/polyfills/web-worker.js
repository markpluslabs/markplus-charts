export default class BrowserWorker {
  constructor(url) {
    return new Worker(url);
  }
}
