import dgram, { Socket } from 'dgram';
import { AddressInfo } from 'net'

export interface SocketRInfo {
    address: string;
    family: string;
    port: number;
    size: number;
}

export type listenerFunction = (msg: Buffer, rinfo: SocketRInfo) => void;

class MulticastManager {

    private socketServer: Socket;
    private messageListeners: listenerFunction[] = [];

    constructor() {
        this.socketServer = dgram.createSocket('udp4');
        this.socketServer.on('message', this.onSocketMessage.bind(this));
        this.socketServer.on('listening', this.onSocketListening.bind(this));
        this.socketServer.on('error', this.closeOnError.bind(this));

        // open the socket
        //this.socketServer.bind(9999);
        this.socketServer.bind(9999, "224.0.0.1");
    }

    /**
     * 
     */
    onSocketListening(){
        const address = this.socketServer.address();
        console.log(`socket server open and listening to ${(<AddressInfo>address).port}`);
        //this.socketServer.setBroadcast(true);
    }

    /**
     * 
     * @param {*} err 
     */
    closeOnError(err: Error){
        console.log(err);
        this.closeSocket();
    }

    /**
     * 
     */
    closeSocket() {
        console.log('close socket');
        this.socketServer.close();
    }

    /**
     * When receiving a message, decrypt it and push it
     * @param {*} msg 
     * @param {*} rinfo 
     */
    onSocketMessage(msg: Buffer, rinfo: SocketRInfo) {
        console.log('multicast message received');

        this.messageListeners.forEach(listener => {
            try {
                listener(msg, rinfo);
            } catch(err){
                console.log('Error while calling listener', err);
            }
        });
    }

    /**
     * 
     * @param {*} requestBuffer 
     */
    send(requestBuffer: Buffer){
        this.socketServer.send(requestBuffer, 0, requestBuffer.length, 9999, "224.0.0.1");
    }

    /**
     * 
     * @param {*} listener 
     */
    registerListener(listener: listenerFunction){
        this.messageListeners.push(listener);
    }
}

const multicastManager = new MulticastManager();

export function send(request: Buffer){
    multicastManager.send(request);
};

export function listen(listener: listenerFunction){
    multicastManager.registerListener(listener);
}