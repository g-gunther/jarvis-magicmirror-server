import uuid from 'uuid';
import MulticastRequest from '@/multicast/dto/multicastRequest.dto';
import MulticastResponse from '@/multicast/dto/multicastResponse.dto'
import networkHelper from '@/helpers/network.helper';


class Event {

    static MAGIC = 1684368752;
    static VERSION = 2;
    static PORT = 9999;

    public eventName?: string;
    private magic?: number;
    private version?: number;
    private ipAddress?: string;
    private port?: number;
    private timestamp?: number;
    private uuid?: string;
    public data?: string;

    /**
     * Build a multicast request from an event & data
     * @param {*} eventName 
     * @param {*} data 
     */
    toRequest(eventName: string, data: string){
        this.eventName = eventName;
        this.magic = Event.MAGIC;
        this.version = Event.VERSION;
        this.ipAddress = networkHelper.ipAddress();
        this.port = Event.VERSION;
        this.timestamp = Math.floor(Date.now() / 1000);
        this.uuid = uuid.v4();
        this.data = `${eventName}@${JSON.stringify(data)}`;

        let request = new MulticastRequest();
        request.writeInt(this.magic);
        request.writeByte(this.version);
        request.writeIpAddress(this.ipAddress);
        request.writeInt(this.port);
        request.writeLong(this.timestamp);
        request.writeUUID(this.uuid);
        request.writeString(this.data);

        return request;
    }

    /**
     * Parse a multicast response to an event
     * @param {*} multicastResponse 
     */
    fromMulticastResponse(multicastResponse: MulticastResponse){
        this.magic = multicastResponse.readInt();
        if(this.magic != Event.MAGIC){
            throw new Error(`Wrong magic number of event: ${this.magic} - was expected: ${Event.MAGIC}`);
        }

        this.version = multicastResponse.readByte();
        if(this.version != Event.VERSION){
            throw new Error(`Wrong version number of event: ${this.version} - was expected: ${Event.VERSION}`);
        }

        this.ipAddress = multicastResponse.readIpAddress();
        this.port = multicastResponse.readInt();
        this.timestamp = multicastResponse.readLong();
        this.uuid = multicastResponse.readUUID();

        let data = multicastResponse.readString();
        this.eventName = data.substring(0, data.indexOf("@"));
        this.data = JSON.parse(data.substring(data.indexOf("@") + 1));

        return this;
    }

    toString(){
        return `[${this.ipAddress}:${this.port}] - ${this.uuid} - eventName=${this.eventName}}`;
    }
}

export function toEvent(multicastResponse: MulticastResponse){
    return new Event().fromMulticastResponse(multicastResponse);
};

export function toRequest(eventName: string, data: string) {
    return new Event().toRequest(eventName, data);
};