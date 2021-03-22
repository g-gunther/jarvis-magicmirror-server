import { computeBufferChecksum } from '@/helpers/buffer.helper';


export default class MulticastRequest {

    private bytes: number[];

    constructor(){
        this.bytes = [];
    }

    writeNumber(number: number, length: number){
        var byteArray = Array(length).fill(0);
        for ( var index = byteArray.length - 1; index >= 0; index-- ) {
            var byte = number & 0xff;
            byteArray [ index ] = byte;
            number = (number - byte) / 256 ;
        }
        this.bytes = this.bytes.concat(byteArray);
    }

    writeInt(intValue: number){
        this.writeNumber(intValue, 4);
    }

    writeLong(longValue: number){
        this.writeNumber(longValue, 8);
    }

    writeByte(byteValue: number){
        this.bytes.push(byteValue);
    }

    writeShort(shortValue: number){
        this.writeNumber(shortValue, 2);
    }

    writeIpAddress(ipAddress: string){
        let ipAddressValue = "";
        String(ipAddress).split(".").forEach(ipPart => {
            ipAddressValue += String(ipPart).padStart(3, '0');
            ipAddressValue += ".";
        });
        ipAddressValue = ipAddressValue.slice(0, -1);

        for(let i = 0; i < ipAddressValue.length; i++){
            this.writeByte(ipAddressValue.charCodeAt(i));
        }
    }

    writeUUID(uuid: string){
        for(let i = 0; i < uuid.length; i++){
            this.writeByte(uuid.charCodeAt(i));
        }
    }

    writeString(value: string){
        // before the string data, there is its length
        this.writeShort(value.length);

        for(let i = 0; i < value.length; i++){
            this.writeByte(value.charCodeAt(i));
        }
    }

    getBuffer(){
        let checksum = computeBufferChecksum(this.bytes);
        this.writeLong(checksum);

        return Buffer.from(this.bytes)
    }
}