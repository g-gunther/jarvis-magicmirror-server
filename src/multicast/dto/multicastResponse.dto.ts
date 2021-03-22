
import { computeBufferChecksum } from '@/helpers/buffer.helper';

/**
 * Class used to deserialize a given buffer
 */
export default class MulticastResponse {

    private bytes: number[];
    private currentIndex: number;
    private checksum: number;

    constructor(buffer: Buffer){
        this.bytes = [];
        let bufferValues = buffer.values();
        let next = bufferValues.next();
        while (!next.done) {
            this.bytes.push(next.value);
            next = bufferValues.next();
        }
        this.currentIndex = 0;

        // retrieve the checksum and compute it to compare them
        this.checksum = this.readChecksum();
        const computedBufferChecksum = computeBufferChecksum(this.bytes);
        if(this.checksum != computedBufferChecksum){
            throw new Error(`Checksums of the multicast response are differents. Received: ${this.checksum}, Computed: ${computeBufferChecksum}`);
        }
    }

    /**
     * Read the checksum of the buffer
     * It's a long value (8 bytes) at the end of the buffer
     */
    readChecksum(): number{
        if(this.bytes.length > 8){
            let checksumBytes = this.bytes.splice(-8, 8);
            return Number(Buffer.from(checksumBytes).readBigInt64BE()); // Reads a signed, big-endian 64-bit integer from buf at the specified offset.
        }
        throw new Error('The mutlicast response is too small and can\'t contain checksum');
    }

    /**
     * Read an integer value (4 bytes)
     */
    readInt(){
        return Number(Buffer.from(this.bytes.splice(0, 4)).readInt32BE());
    }

    /**
     * Read a long value (8 bytes)
     */
    readLong(){
        return Number(Buffer.from(this.bytes.splice(0, 8)).readBigInt64BE());
    }

    /**
     * Read a single byte
     */
    readByte(){
        return this.bytes.splice(0, 1)[0];
    }

    /**
     * Read a short value (2 bytes)
     */
    readShort(){
        return Number(Buffer.from(this.bytes.splice(0, 2)).readIntBE(0, 2));
    }

    /**
     * Read an ip address (15 bytes)
     */
    readIpAddress(){
        let result = "";
        for(let i = 0; i < 15; i++){
            result += String.fromCharCode(this.readByte());
        }

        let ipAddress = "";
        for(let ipPart of result.split(".")){
            ipAddress += parseInt(ipPart);
            ipAddress += ".";
        }

        return ipAddress.slice(0, -1);
    }

    /**
     * Read an UUID
     */
    readUUID(){
        let result = "";
        for(let i = 0; i < 36; i++){
            result += String.fromCharCode(this.readByte());
        }
        return result;
    }

    /**
     * Read a string
     * The string always starts with a short number which indicates the string length
     */
    readString(){
        // before the string data, there is its length
        let length = this.readShort();

        let result = "";
        for(let i = 0; i < length; i++){
            result += String.fromCharCode(this.readByte());
        }
        return result;
    }
}