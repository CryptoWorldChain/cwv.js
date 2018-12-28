import proto from './protos'
import config from './config'
import utils from './utils'



export default{

	test:function(){
		const KeyStoreValue = proto.load('KeyStoreValue')

		console.log("keystore=="+KeyStoreValue+",path="+config.keystore_path);
		var  	ks=KeyStoreValue.create({address:"0002232",prikey:'aaabb',pubkey:'test'});
		console.log(`ks = ${JSON.stringify(ks)}`);
		let buffer = KeyStoreValue.encode(ks).finish();
		console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);

		utils.loadJsonFile("keystore/"+config.net_type+"/keystore1.json").then(json => {
		    console.log("file lod ok:"+json);
		    //=> {foo: true}
		});


	}


}