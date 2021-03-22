import { toRequest } from '@/multicast/dto/event.dto';
import SSEBodyStream from '@/multicast/stream/sseBodyStream';
import { subscribe, unsubscribe } from '@/multicast/stream/multicastStream';
import { send } from '@/multicast/multicastManager';

import Router from "koa-router";

var router = new Router({
    prefix: '/api/events'
});

/**
 * Expose the sse endpoint which streams data coming from the jarvis backend
 */
router.get('/subscribe', async (ctx) => {
    console.log('subscribe to sse');
  
    // otherwise node will automatically close this connection in 2 minutes
    // max 32 bits signed integer
    ctx.req.setTimeout(2147483647);
  
    ctx.type = 'text/event-stream; charset=utf-8';
    ctx.set('Cache-Control', 'no-cache');
    ctx.set('Connection', 'keep-alive');
  
    const body = ctx.body = new SSEBodyStream();
  
    subscribe(body);
  
    // if the connection closes or errors -> stop the SSE
    const socket = ctx.socket;
    socket.on('error', close);
    socket.on('close', close);
  
    function close() {
      console.log('unsubscribe to sse');
      unsubscribe(body);
      socket.removeListener('error', close);
      socket.removeListener('close', close);
    }
  });

/**
 * 
 */
router.put('/', async (ctx) => {
    let body = ctx.request.body;
    
    if(!body.eventName){
        ctx.status = 400;
        return;
    }

    let multicastRequest = toRequest(body.eventName, body.data || {});
    let requestBuffer = multicastRequest.getBuffer();

    send(requestBuffer);

    ctx.status = 200;
});

export default router;