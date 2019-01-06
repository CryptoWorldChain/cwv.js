"use strict";

import proto from './protos'
import config	from "./config.js"
import enums from "./enums.js"
import utils from './utils'
export default class Transaction extends Method {
	/**
	 * 
	 * @param {*} args 
	 * args:{
	 * 	from:"",to:"",amount:"",
	 * }
	 */
	constructor(args) {
		// code
		super(args);
		this.uri = "/txt/pbmtx.do"
	}
	getBody(){	
		let multiTransactionBody = proto.load('MultiTransactionBody');
		let txbody=multiTransactionBody.create()

		if(opts.type==enums.TYPE_DEFAULT){
			let inputs = proto.load('MultiTransactionInput');
			txbody.inputs.push(inputs.create({
				address:Buffer.from(arg.from),
				nonce:arg.nonce,
				amount:Buffer.from(args.amount),
			}))

			let outputs = proto.load('MultiTransactionOutput');
			txbody.outputs.push(outputs.create({
				address:Buffer.from(arg.to),
				amount:Buffer.from(args.amount)
			}))
		}
		txbody.signatures.push(getSignatures())
	}

	getSignatures(){

	}
    //
	// methods
	toJSONPayload(args){
		return {"address":this.args[0]};
	}

}
