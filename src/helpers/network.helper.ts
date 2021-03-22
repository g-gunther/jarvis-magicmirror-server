import { networkInterfaces } from 'os'

const ifaces = networkInterfaces();
let address: string;

Object.keys(ifaces).forEach(dev => {
  ifaces[dev]!.filter(details => {
    if (details.family === 'IPv4' && details.internal === false) {
      address = details.address;
    }
  });
});

export default {
    ipAddress(){
        return address;
    }
};