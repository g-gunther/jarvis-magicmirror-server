"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeBufferChecksum = void 0;
var maxChecksumInteger = Math.pow(2, 32);
function computeBufferChecksum(bytes) {
    var s1 = 1;
    var s2 = 0;
    for (var i = 0; i < bytes.length; i++) {
        s1 = (s1 + bytes[i]) % 65521;
        s2 = (s2 + s1) % 65521;
    }
    var computedChecksum = Number((s2 << 16) + s1);
    if (computedChecksum < 0) {
        return maxChecksumInteger + computedChecksum;
    }
    return computedChecksum;
}
exports.computeBufferChecksum = computeBufferChecksum;
