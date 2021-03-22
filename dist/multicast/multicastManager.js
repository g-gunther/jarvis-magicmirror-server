"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.send = void 0;
var dgram_1 = __importDefault(require("dgram"));
var MulticastManager = /** @class */ (function () {
    function MulticastManager() {
        this.messageListeners = [];
        this.socketServer = dgram_1.default.createSocket('udp4');
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
    MulticastManager.prototype.onSocketListening = function () {
        var address = this.socketServer.address();
        console.log("socket server open and listening to " + address.port);
        //this.socketServer.setBroadcast(true);
    };
    /**
     *
     * @param {*} err
     */
    MulticastManager.prototype.closeOnError = function (err) {
        console.log(err);
        this.closeSocket();
    };
    /**
     *
     */
    MulticastManager.prototype.closeSocket = function () {
        console.log('close socket');
        this.socketServer.close();
    };
    /**
     * When receiving a message, decrypt it and push it
     * @param {*} msg
     * @param {*} rinfo
     */
    MulticastManager.prototype.onSocketMessage = function (msg, rinfo) {
        console.log('multicast message received');
        this.messageListeners.forEach(function (listener) {
            try {
                listener(msg, rinfo);
            }
            catch (err) {
                console.log('Error while calling listener', err);
            }
        });
    };
    /**
     *
     * @param {*} requestBuffer
     */
    MulticastManager.prototype.send = function (requestBuffer) {
        this.socketServer.send(requestBuffer, 0, requestBuffer.length, 9999, "224.0.0.1");
    };
    /**
     *
     * @param {*} listener
     */
    MulticastManager.prototype.registerListener = function (listener) {
        this.messageListeners.push(listener);
    };
    return MulticastManager;
}());
var multicastManager = new MulticastManager();
function send(request) {
    multicastManager.send(request);
}
exports.send = send;
;
function listen(listener) {
    multicastManager.registerListener(listener);
}
exports.listen = listen;
