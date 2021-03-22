"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_helper_1 = require("../../helpers/buffer.helper");
var MulticastRequest = /** @class */ (function () {
    function MulticastRequest() {
        this.bytes = [];
    }
    MulticastRequest.prototype.writeNumber = function (number, length) {
        var byteArray = Array(length).fill(0);
        for (var index = byteArray.length - 1; index >= 0; index--) {
            var byte = number & 0xff;
            byteArray[index] = byte;
            number = (number - byte) / 256;
        }
        this.bytes = this.bytes.concat(byteArray);
    };
    MulticastRequest.prototype.writeInt = function (intValue) {
        this.writeNumber(intValue, 4);
    };
    MulticastRequest.prototype.writeLong = function (longValue) {
        this.writeNumber(longValue, 8);
    };
    MulticastRequest.prototype.writeByte = function (byteValue) {
        this.bytes.push(byteValue);
    };
    MulticastRequest.prototype.writeShort = function (shortValue) {
        this.writeNumber(shortValue, 2);
    };
    MulticastRequest.prototype.writeIpAddress = function (ipAddress) {
        var ipAddressValue = "";
        String(ipAddress).split(".").forEach(function (ipPart) {
            ipAddressValue += String(ipPart).padStart(3, '0');
            ipAddressValue += ".";
        });
        ipAddressValue = ipAddressValue.slice(0, -1);
        for (var i = 0; i < ipAddressValue.length; i++) {
            this.writeByte(ipAddressValue.charCodeAt(i));
        }
    };
    MulticastRequest.prototype.writeUUID = function (uuid) {
        for (var i = 0; i < uuid.length; i++) {
            this.writeByte(uuid.charCodeAt(i));
        }
    };
    MulticastRequest.prototype.writeString = function (value) {
        // before the string data, there is its length
        this.writeShort(value.length);
        for (var i = 0; i < value.length; i++) {
            this.writeByte(value.charCodeAt(i));
        }
    };
    MulticastRequest.prototype.getBuffer = function () {
        var checksum = buffer_helper_1.computeBufferChecksum(this.bytes);
        this.writeLong(checksum);
        return Buffer.from(this.bytes);
    };
    return MulticastRequest;
}());
exports.default = MulticastRequest;
