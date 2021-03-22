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
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("stream");
/**
 * Class which transform the readable stream (udp listener)
 * to writable stream (for koa context body)
 */
var SSEBodyStream = /** @class */ (function (_super) {
    __extends(SSEBodyStream, _super);
    function SSEBodyStream() {
        var _this = _super.call(this) || this;
        stream_1.Transform.call(_this);
        return _this;
    }
    SSEBodyStream.prototype._transform = function (data, enc, cb) {
        var parsedData = JSON.parse(data);
        // if the event if a display type, push it with event name = DISPLAY_EVENT
        // in order to be handled properly by the front app
        if (parsedData.event == "DISPLAY_EVENT") {
            this.push("event: DISPLAY_EVENT\ndata: " + data + "\n\n");
        }
        // else push the event for log purpose
        else {
            console.log("event: LOG\ndata: " + data + "\n\n");
            this.push("event: LOG\ndata: " + data + "\n\n");
        }
        cb();
    };
    return SSEBodyStream;
}(stream_1.Transform));
exports.default = SSEBodyStream;
