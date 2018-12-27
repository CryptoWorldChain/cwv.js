
import {Buffer} from 'buffer';

import KeyPair  from "./keypair.js";


var revertBuffer=function (buffer) {
      return  new Buffer().push(...buffer)

}

var bufferFromHex=function (str) {
  	return new Buffer(str,'hex');
}

var toHex = function (buff) {
  return buff.toString("hex");
}



export default {
   revertBuffer:revertBuffer,
   toHex:toHex,
   bufferFromHex:bufferFromHex,
   KeyPair:KeyPair

};
