"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRequest = exports.toEvent = void 0;
var uuid_1 = __importDefault(require("uuid"));
var multicastRequest_dto_1 = __importDefault(require("./multicastRequest.dto"));
var network_helper_1 = __importDefault(require("../../helpers/network.helper"));
var Event = /** @class */ (function () {
    function Event() {
    }
    /**
     * Build a multicast request from an event & data
     * @param {*} eventName
     * @param {*} data
     */
    Event.prototype.toRequest = function (eventName, data) {
        this.eventName = eventName;
        this.magic = Event.MAGIC;
        this.version = Event.VERSION;
        this.ipAddress = network_helper_1.default.ipAddress();
        this.port = Event.VERSION;
        this.timestamp = Math.floor(Date.now() / 1000);
        this.uuid = uuid_1.default.v4();
        this.data = eventName + "@" + JSON.stringify(data);
        var request = new multicastRequest_dto_1.default();
        request.writeInt(this.magic);
        request.writeByte(this.version);
        request.writeIpAddress(this.ipAddress);
        request.writeInt(this.port);
        request.writeLong(this.timestamp);
        request.writeUUID(this.uuid);
        request.writeString(this.data);
        return request;
    };
    /**
     * Parse a multicast response to an event
     * @param {*} multicastResponse
     */
    Event.prototype.fromMulticastResponse = function (multicastResponse) {
        this.magic = multicastResponse.readInt();
        if (this.magic != Event.MAGIC) {
            throw new Error("Wrong magic number of event: " + this.magic + " - was expected: " + Event.MAGIC);
        }
        this.version = multicastResponse.readByte();
        if (this.version != Event.VERSION) {
            throw new Error("Wrong version number of event: " + this.version + " - was expected: " + Event.VERSION);
        }
        this.ipAddress = multicastResponse.readIpAddress();
        this.port = multicastResponse.readInt();
        this.timestamp = multicastResponse.readLong();
        this.uuid = multicastResponse.readUUID();
        var data = multicastResponse.readString();
        this.eventName = data.substring(0, data.indexOf("@"));
        this.data = JSON.parse(data.substring(data.indexOf("@") + 1));
        return this;
    };
    Event.prototype.toString = function () {
        return "[" + this.ipAddress + ":" + this.port + "] - " + this.uuid + " - eventName=" + this.eventName + "}";
    };
    Event.MAGIC = 1684368752;
    Event.VERSION = 2;
    Event.PORT = 9999;
    return Event;
}());
function toEvent(multicastResponse) {
    return new Event().fromMulticastResponse(multicastResponse);
}
exports.toEvent = toEvent;
;
function toRequest(eventName, data) {
    return new Event().toRequest(eventName, data);
}
exports.toRequest = toRequest;
;
