import proto from './protos'
import config from './config'
import utils from './utils'
import aesjs from 'aes-js';

import MD5 from 'md5.js';
import sha3 from 'sha3';



const testnet_keystore1 = require('!Keystore/testnet/keystore1.json')


var pbkdfmd5 = function(password,salt,bytesNeeded)
{
	
    var buf=[];// byte[]  buf = new byte[digest.getDigestSize()];
    var  key="";//= new byte[bytesNeeded];
    var digest = new MD5();
    
    for (;;)
    {
        digest.update(password);
        digest.update(salt);

        var buf = digest.digest();
        
        var len = (bytesNeeded > buf.length) ? buf.length : bytesNeeded;
        key=key+new Buffer(buf.slice(0,len)).toString('hex');
        //System.arraycopy(buf, 0, key, offset, len);
        bytesNeeded -= len;
        if (bytesNeeded == 0)
        {
            break;
        }
        // do another round
        digest = new MD5();
        digest.update(buf);
    }
    
    return key;
}





var self={

	pbkdfmd5:pbkdfmd5,

	decrypt:function(ksJSON,passwd){

		var encryptedBytes=utils.hexToArray(ksJSON.cipherText);
		var iv=utils.hexToArray(ksJSON.cipherParams.iv);
		var salt=Buffer.from(ksJSON.params.salt,'hex')

		var hash=sha3(256);
		hash.update(Buffer.from("000000"));

		var hashpasswd=utils.toHex(hash.digest());

		// console.log("hashpasswd=="+hashpasswd);

		var pkcs5_passwd=utils.toHex(hashpasswd.split('').map(x=>x.charCodeAt(0)))


		var derivedKey = pbkdfmd5(cwv.Buffer.from(pkcs5_passwd,'hex'), salt, 32);
		var aesCbc = new aesjs.ModeOfOperation.cbc(Buffer.from(derivedKey,'hex'),iv);
		var result=aesCbc.decrypt(encryptedBytes).slice(0,ksJSON.params.l);
		// console.log("get result:"+utils.toHex(result));
		return result;

	},
	test:function(){
		const KeyStoreValue = proto.load('KeyStoreValue')

		var decryptret = self.decrypt(testnet_keystore1,'000000');
		var ks = KeyStoreValue.decode(decryptret);

		console.log("ks=="+JSON.stringify(ks));


		// console.log("keystore=="+KeyStoreValue+",path="+config.keystore_path);
		// var  	ks=KeyStoreValue.create({address:"0002232",prikey:'aaabb',pubkey:'test'});
		// console.log(`ks = ${JSON.stringify(ks)}`);
		// let buffer = KeyStoreValue.encode(ks).finish();
		// console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);

		// console.log("ks=="+testnet_keystore1.pwd);




		// utils.loadJsonFile("keystore/"+config.net_type+"/keystore1.json").then(json => {
		//     console.log("file lod ok:"+json);
		//     //=> {foo: true}
		// });

	}

}


export default self;