import { Readable } from 'stream';
import MulticastResponse from '@/multicast/dto/multicastResponse.dto';
import { toEvent } from '@/multicast/dto/event.dto';
import { listen, SocketRInfo } from '@/multicast/multicastManager'
import SSEBodyStream from '@/multicast/stream/sseBodyStream';

/**
 * Subscription stream. Listening to udp message
 * decrypt them and push them
 */
class MulticastSubscription extends Readable {

    constructor() {
        super();
        Readable.call(this);

        listen((msg: Buffer, rinfo: SocketRInfo) => this.onMessage(msg, rinfo))

        this.on('error', this.onError.bind(this));
        this.on('close', this.onClose.bind(this));
    }

    /**
     * When receiving a message, decrypt it and push it
     * @param {*} msg 
     * @param {*} rinfo 
     */
    onMessage(msg: Buffer, rinfo: SocketRInfo): void{
        try {
            let event = toEvent(new MulticastResponse(msg));
            console.log(`Event of type: ${event.toString()}`)

            this.push(JSON.stringify({
                event: event.eventName,
                data: event.data
            }));
        } catch(err){
            console.error(err);
        }
    }

    onError(err: Error){
        console.log(err);
    }

    onClose(){
        console.log('stream has been closed');
    }

    _read() {
        // do nothing, events to read comes from the socket and will be pushed directly
    };
}

const multicastSubscription = new MulticastSubscription();

/**
 * Returns a new subscription event
 */
export function subscribe(sseBody: SSEBodyStream){
    multicastSubscription.pipe(sseBody);
};

export function unsubscribe(sseBody: SSEBodyStream){
    multicastSubscription.unpipe(sseBody);
};
