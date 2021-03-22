import { Transform } from 'stream';

/**
 * Class which transform the readable stream (udp listener)
 * to writable stream (for koa context body)
 */
export default class SSEBodyStream extends Transform {

  constructor() {
    super();
    Transform.call(this);
  }

  _transform(data: string, enc: string, cb: Function) {
    let parsedData = JSON.parse(data);

    // if the event if a display type, push it with event name = DISPLAY_EVENT
    // in order to be handled properly by the front app
    if(parsedData.event == "DISPLAY_EVENT"){
      this.push(`event: DISPLAY_EVENT\ndata: ${data}\n\n`);
    } 
    // else push the event for log purpose
    else {
      console.log(`event: LOG\ndata: ${data}\n\n`);
      this.push(`event: LOG\ndata: ${data}\n\n`);
    }
    cb();
  }
}
