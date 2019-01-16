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
}

export default class MTxTransaction extends Transaction {
	constructor(txtype,args) {
		super(args);
		this.txtype=txtype;
	}
	genBody(){
		let MultiTransactionBody = proto.load('MultiTransactionBody');
		var txbody = NaN;
		let keypair = this.args.keypair;
		let timestamp = new Date().getTime();
		if(this.txtype>0){
			txbody = MultiTransactionBody.create({
				timestamp:timestamp,
				type:Number.parseInt(this.txtype)
			})
		}else{
			txbody = MultiTransactionBody.create({
				timestamp:timestamp,
			})
		}

		var jsonBody = {
			timestamp:timestamp,
			type:this.txtype
		};

		if(this.args.data){
			txbody.data = Buffer.from(this.args.data,'hex')
			jsonBody.data = this.args.data
		}
		if(this.args.exdata){
			txbody.exdata = Buffer.from(this.args.exdata,'hex')
			jsonBody.exdata = this.args.exdata
		}	

		let inputs = proto.load('MultiTransactionInput');
		jsonBody.inputs=[];
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
				amount: new BN(this.args.amount).toArrayLike(Buffer)
			}))	
		}
		jsonBody.inputs.push({
			nonce: keypair.nonce,
			address: this.removePrefix(this.args.from),
			amount: ""+this.args.amount
		});
		if(this.args.to){
			jsonBody.outputs=[];
			let MultiTransactionOutput = proto.load('MultiTransactionOutput');
			if(this.args.amount>0){
				txbody.outputs.push(MultiTransactionOutput.create({
					address:Buffer.from(this.removePrefix(this.args.to),'hex'),
					amount: new BN(this.args.amount).toArrayLike(Buffer)
				}))
			}else{
				txbody.outputs.push(MultiTransactionOutput.create({
					address:Buffer.from(this.removePrefix(this.args.to),'hex'),
					amount: new BN(this.args.amount).toArrayLike(Buffer)
				}))

			}
			jsonBody.outputs.push({
				address: this.removePrefix(this.args.to),
				amount: ""+this.args.amount
			});
		}

		var  ecdata = Buffer.from(MultiTransactionBody.encode(txbody).finish())
		if(this.txtype==0){
//			ecdata = ecdata.slice(0,ecdata.length-2);//slice for java!!!
		}
		// console.log("ecdata=="+ecdata.toString('hex'));
		var signdata = keypair.ecHexSign(ecdata.toString('hex'));

		// console.log("signdata=="+signdata+",signaddress="+keypair.hexAddress+",prikey="+keypair.hexPrikey+",pubkey="
			// +keypair.hexPubkey);
		// txbody.signatures.push(keypair.ecHexSign(ecdata.toString(16)));
		jsonBody.signatures=[];
		jsonBody.signatures.push({"signature":signdata});

		return {'transaction':{'txBody':jsonBody}};
	}
}

