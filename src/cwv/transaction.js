"use strict";

import proto from './protos'
import config	from "./config.js"
import enums from "./enums.js"
import utils from './utils'
import Method from './method'
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

export default class NormalTransaction extends Transaction {
	constructor(args) {
		// code
		super(args);
	}

	getType(){
		return enums.TYPE_DEFAULT;
	}

	genBody(){
		let multiTransactionBody = proto.load('MultiTransactionBody');
		let txbody=multiTransactionBody.create()
		let keypair = this.args.keypair;
		let timestamp = new Date().getTime();
		txbody.timestamp = timestamp
		txbody.type = this.getType();

		var jsonBody = {
			"timestamp":timestamp,
			"type":this.getType()
		};

		if(this.args.data){
			txbody.data = this.args.data
			jsonBody['data'] = this.args.data
		}
		if(this.args.exdata){
			txbody.exdata = this.args.exdata
			jsonBody['exdata'] = this.args.exdata
		}
		

		let inputs = proto.load('MultiTransactionInput');
		jsonBody.inputs=[];
		txbody.inputs.push(inputs.create({
			address:Buffer.from(this.args.from),
			nonce: keypair.nonce,
			amount:Buffer.from(this.args.amount),
		}))
		jsonBody.inputs.push({
				"nonce": keypair.nonce,
				"address": this.args.from,
				"amount": this.args.amount
		});

		let outputs = proto.load('MultiTransactionOutput');
		txbody.outputs.push(outputs.create({
			address:Buffer.from(this.args.to),
			amount:Buffer.from(this.args.amount)
		}))
		jsonBody.outputs=[];
		jsonBody.outputs.push({
				"address": this.args.to,
				"amount": this.args.amount
		});

		

		let  ecdata = Buffer.from(multiTransactionBody.encode(ks).finish())
		var signdata = keypair.ecHexSign(ecdata.toString(16));
		console.log("signdata=="+signdata);
		// txbody.signatures.push(keypair.ecHexSign(ecdata.toString(16)));
		jsonBody.signatures=[];
		jsonBody.signatures.push(signdata);

		return jsonBody;
	}

}

