
import {Buffer} from 'buffer';
import ecc from '../ecc/ecc'
// import * as CryptoJS from 'crypto-js';
// import elliptic from 'elliptic';
import HmacDRBG from 'hmac-drbg';

import sha2 from 'sha2'

window.ecc=ecc;
window.sha2=sha2;


function randomArray(length, max) {
    return Array.apply(null, Array(length)).map(function() {
        return Math.round(Math.random() * max);
    });
}

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
		
		hexPubkey = hexPubkey + new Buffer(key.getPublic().getY().clone().toArray().reverse()).toString('hex').slice(0,64);
		var hh=sha2.sha256(hexPubkey,'hex')
		var hexAddress =  hh.toString('hex').slice(0,40);	
		var kp=new KeyPair(hexPrikey,hexPubkey,hexAddress,key);
		return kp;
	}

//生成随机密钥对
	static genRandomKey(){
		var key = new ecc.ec('secp256r1').genKeyPair();
		return KeyPair.genFromECCKey(key);
	}
//数据签名
	ecHexSign(hexMsg){
		var sc=sha2.sha256(hexMsg,'hex');
		var s = this._ecKey.sign(sc);
		var result = this.hexPubkey;
		result+= new Buffer(randomArray(20,20)).toString('hex')
		result+= new Buffer(s.r.clone().toArray().reverse()).toString('hex').slice(0,64);
		result+= new Buffer(s.s.clone().toArray().reverse()).toString('hex').slice(0,64);
		return result;
	}

	ecHexVerify(hexMsg,hexSig){
		var sc=sha2.sha256(hexMsg,'hex');
		var s = this._ecKey.sign(sc);
		var result = this.hexPubkey;
		result+= new Buffer(randomArray(20,20)).toString('hex')
		result+= new Buffer(s.r.clone().toArray().reverse()).toString('hex').slice(0,64);
		result+= new Buffer(s.s.clone().toArray().reverse()).toString('hex').slice(0,64);
		return result;
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
