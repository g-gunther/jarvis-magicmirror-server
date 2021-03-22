"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribe = exports.subscribe = void 0;
var stream_1 = require("stream");
var multicastResponse_dto_1 = __importDefault(require("../dto/multicastResponse.dto"));
var event_dto_1 = require("../dto/event.dto");
var multicastManager_1 = require("../multicastManager");
/**
 * Subscription stream. Listening to udp message
 * decrypt them and push them
 */
var MulticastSubscription = /** @class */ (function (_super) {
    __extends(MulticastSubscription, _super);
    function MulticastSubscription() {
        var _this = _super.call(this) || this;
        stream_1.Readable.call(_this);
        multicastManager_1.listen(function (msg, rinfo) { return _this.onMessage(msg, rinfo); });
        _this.on('error', _this.onError.bind(_this));
        _this.on('close', _this.onClose.bind(_this));
        return _this;
    }
    /**
     * When receiving a message, decrypt it and push it
     * @param {*} msg
     * @param {*} rinfo
     */
    MulticastSubscription.prototype.onMessage = function (msg, rinfo) {
        try {
            var event_1 = event_dto_1.toEvent(new multicastResponse_dto_1.default(msg));
            console.log("Event of type: " + event_1.toString());
            this.push(JSON.stringify({
                event: event_1.eventName,
                data: event_1.data
            }));
        }
        catch (err) {
            console.error(err);
        }
    };
    MulticastSubscription.prototype.onError = function (err) {
        console.log(err);
    };
    MulticastSubscription.prototype.onClose = function () {
        console.log('stream has been closed');
    };
    MulticastSubscription.prototype._read = function () {
        // do nothing, events to read comes from the socket and will be pushed directly
    };
    ;
    return MulticastSubscription;
}(stream_1.Readable));
var multicastSubscription = new MulticastSubscription();
/**
 * Returns a new subscription event
 */
function subscribe(sseBody) {
    multicastSubscription.pipe(sseBody);
}
exports.subscribe = subscribe;
;
function unsubscribe(sseBody) {
    multicastSubscription.unpipe(sseBody);
}
exports.unsubscribe = unsubscribe;
;
