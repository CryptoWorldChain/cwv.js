"use strict";

import proto from './protos'
import config	from "./config.js"
import enums from "./enums.js"
import utils from './utils'
import Method from './method'
import BN from 'bn.js';

 class Transaction extends Method {
	/**
	 * 
	 * @param {*} this.args 
	 * this.args:{
	 * 	from:"",to:"",amount:"",
	 * }
	 */
	constructor(args) {
		// code
		super(args);
		this.args = args;
		this.uri = "/txt/pbmtx.do"
	}
	genBody(){	//override by implements
		return {};
	}
    //
	// methods
	toJSONPayload(args){
		return {"address":args[0]};
	}

	removePrefix(addr){
		if(addr.startsWith('0x')){
			return addr.substring(2);
		}else{
			return addr;
		}
	}
}

export default class MTxTransaction extends Transaction {
	constructor(txtype,args) {
		// code
		super(args);
		this.txtype=txtype;
	}

	getType(){
		return this.txtype;
	}

	genBody(){
		//let MultiTransaction = proto.load('MultiTransaction');
		let MultiTransactionBody = proto.load('MultiTransactionBody');
		let txbody=MultiTransactionBody.create()
		let keypair = this.args.keypair;
		let timestamp = new Date().getTime();
		txbody.timestamp = timestamp
		txbody.type = this.getType();

		var jsonBody = {
			"timestamp":timestamp,
			"type":this.getType()
		};

		if(this.args.data){
			txbody.data = Buffer.from(this.args.data,'hex')
			jsonBody['data'] = this.args.data
		}
		if(this.args.exdata){
			txbody.exdata = Buffer.from(this.args.exdata,'hex')
			jsonBody['exdata'] = this.args.exdata
		}	

		let inputs = proto.load('MultiTransactionInput');
		jsonBody.inputs=[];
		// console.log(new BN(this.args.amount).toArrayLike(Buffer).toString('hex'))
		if(keypair.nonce>0){
			txbody.inputs.push(inputs.create({
				address:Buffer.from(this.removePrefix(this.args.from),'hex'),
				nonce: keypair.nonce,
				amount: new BN(this.args.amount).toArrayLike(Buffer)
			}))
		}
		else{
			txbody.inputs.push(inputs.create({
				address:Buffer.from(this.removePrefix(this.args.from),'hex'),
				// nonce: keypair.nonce,
				amount: new BN(this.args.amount).toArrayLike(Buffer)
			}))
		}
		jsonBody.inputs.push({
				"nonce": keypair.nonce,
				"address": this.removePrefix(this.args.from),
				"amount": ""+this.args.amount
		});

		let outputs = proto.load('MultiTransactionOutput');
		txbody.outputs.push(outputs.create({
			address:Buffer.from(this.removePrefix(this.args.to),'hex'),
			amount: new BN(this.args.amount).toArrayLike(Buffer)
		}))
		jsonBody.outputs=[];
		jsonBody.outputs.push({
				"address": this.removePrefix(this.args.to),
				"amount": ""+this.args.amount
		});

		var  ecdata = Buffer.from(MultiTransactionBody.encode(txbody).finish())
		ecdata = ecdata.slice(0,ecdata.length-2);//slice for java!!!
		// console.log("ecdata=="+ecdata.toString('hex'));
		var signdata = keypair.ecHexSign(ecdata.toString('hex'));

		// console.log("signdata=="+signdata+",signaddress="+keypair.hexAddress+",prikey="+keypair.hexPrikey+",pubkey="
			// +keypair.hexPubkey);
		// txbody.signatures.push(keypair.ecHexSign(ecdata.toString(16)));
		jsonBody.signatures=[];
		jsonBody.signatures.push({"signature":signdata});

		// console.log("senddata=="+JSON.stringify(jsonBody));
		return {'transaction':{'txBody':jsonBody}};
	}

}

