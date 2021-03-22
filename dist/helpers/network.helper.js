"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var ifaces = os_1.networkInterfaces();
var address;
Object.keys(ifaces).forEach(function (dev) {
    ifaces[dev].filter(function (details) {
        if (details.family === 'IPv4' && details.internal === false) {
            address = details.address;
        }
    });
});
exports.default = {
    ipAddress: function () {
        return address;
    }
};
