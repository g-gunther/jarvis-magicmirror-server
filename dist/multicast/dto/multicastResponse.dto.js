"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_helper_1 = require("../../helpers/buffer.helper");
/**
 * Class used to deserialize a given buffer
 */
var MulticastResponse = /** @class */ (function () {
    function MulticastResponse(buffer) {
        this.bytes = [];
        var bufferValues = buffer.values();
        var next = bufferValues.next();
        while (!next.done) {
            this.bytes.push(next.value);
            next = bufferValues.next();
        }
        this.currentIndex = 0;
        // retrieve the checksum and compute it to compare them
        this.checksum = this.readChecksum();
        var computedBufferChecksum = buffer_helper_1.computeBufferChecksum(this.bytes);
        if (this.checksum != computedBufferChecksum) {
            throw new Error("Checksums of the multicast response are differents. Received: " + this.checksum + ", Computed: " + buffer_helper_1.computeBufferChecksum);
        }
    }
    /**
     * Read the checksum of the buffer
     * It's a long value (8 bytes) at the end of the buffer
     */
    MulticastResponse.prototype.readChecksum = function () {
        if (this.bytes.length > 8) {
            var checksumBytes = this.bytes.splice(-8, 8);
            return Number(Buffer.from(checksumBytes).readBigInt64BE()); // Reads a signed, big-endian 64-bit integer from buf at the specified offset.
        }
        throw new Error('The mutlicast response is too small and can\'t contain checksum');
    };
    /**
     * Read an integer value (4 bytes)
     */
    MulticastResponse.prototype.readInt = function () {
        return Number(Buffer.from(this.bytes.splice(0, 4)).readInt32BE());
    };
    /**
     * Read a long value (8 bytes)
     */
    MulticastResponse.prototype.readLong = function () {
        return Number(Buffer.from(this.bytes.splice(0, 8)).readBigInt64BE());
    };
    /**
     * Read a single byte
     */
    MulticastResponse.prototype.readByte = function () {
        return this.bytes.splice(0, 1)[0];
    };
    /**
     * Read a short value (2 bytes)
     */
    MulticastResponse.prototype.readShort = function () {
        return Number(Buffer.from(this.bytes.splice(0, 2)).readIntBE(0, 2));
    };
    /**
     * Read an ip address (15 bytes)
     */
    MulticastResponse.prototype.readIpAddress = function () {
        var result = "";
        for (var i = 0; i < 15; i++) {
            result += String.fromCharCode(this.readByte());
        }
        var ipAddress = "";
        for (var _i = 0, _a = result.split("."); _i < _a.length; _i++) {
            var ipPart = _a[_i];
            ipAddress += parseInt(ipPart);
            ipAddress += ".";
        }
        return ipAddress.slice(0, -1);
    };
    /**
     * Read an UUID
     */
    MulticastResponse.prototype.readUUID = function () {
        var result = "";
        for (var i = 0; i < 36; i++) {
            result += String.fromCharCode(this.readByte());
        }
        return result;
    };
    /**
     * Read a string
     * The string always starts with a short number which indicates the string length
     */
    MulticastResponse.prototype.readString = function () {
        // before the string data, there is its length
        var length = this.readShort();
        var result = "";
        for (var i = 0; i < length; i++) {
            result += String.fromCharCode(this.readByte());
        }
        return result;
    };
    return MulticastResponse;
}());
exports.default = MulticastResponse;
