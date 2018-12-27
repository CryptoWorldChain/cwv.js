
import {Buffer} from 'buffer';
import ecc from '../ecc/ecc'
// import * as CryptoJS from 'crypto-js';
// import elliptic from 'elliptic';


// window.CryptoJS = CryptoJS;
window.ecc=ecc;

class KeyPair {

	constructor(pri,pub,addr,eckey){
		this.hexPrikey = pri;
		this.hexPubkey = pub;
		this.hexAddress = addr;
		this._ecKey = eckey;
	}

	static genFromPrikey(hexPrikey){
		// var key = new ecc.ECKey(ecc.ECCurves.secp256r1, new Buffer(hexPrikey,'hex'));
		var key = new ecc.ec('secp256r1').keyFromPrivate(hexPrikey);
		return KeyPair.genFromECCKey(key);

	}

	static genFromECCKey(key){
		var hexPrikey = key.getPrivate().toString(16);
		
		var hexPubkey = new Buffer(key.getPublic().getX().clone().toArray().reverse()).toString('hex').slice(0,64)
				+ Buffer(key.getPublic().getY().clone().toArray().reverse()).toString('hex').slice(0,64)
		var hexAddress = ""
		var kp=new KeyPair(hexPrikey,hexPubkey,hexAddress,key);
		return kp;


	}
//生成随机密钥对
	static genRandomKey(){
		var key = new ecc.ec('secp256r1').genKeyPair();
		return KeyPair.genFromECCKey(key);
	}
//数据签名
	ecSign(msg){
		// var key = new ecc.ECKey(ecc.ECCurves.secp256r1, new Buffer(hexPrikey,'hex'));

	}

};



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
