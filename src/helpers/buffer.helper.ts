const maxChecksumInteger = Math.pow(2, 32);

export function computeBufferChecksum(bytes:number[]): number{
    let s1 = 1
    let s2 = 0
    for (var i = 0; i < bytes.length; i++) {
        s1 = (s1 + bytes[i]) % 65521;
        s2 = (s2 + s1) % 65521;
    }
    let computedChecksum = Number((s2 << 16) + s1);
    if(computedChecksum < 0){
        return maxChecksumInteger + computedChecksum;
    }
    return computedChecksum;
}
