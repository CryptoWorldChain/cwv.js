import Method from './method.js'
import 	_ from 'lodash'
import utils from './utils';
// import rp from 'request-promise';
import config	from "./config.js"
import MTxTransaction	from "./transaction.js"
import KeyPair from "./keypair";
// var mockrp = rp;
import enums from "./enums.js"


class PatternMethod extends Method{
	constructor(pattern,uri){
		super(pattern)
		this.pattern = pattern;
		this.uri = uri;
	}
	static _(pattern,uri){
		return new PatternMethod(pattern,uri)
	}
	static _(pattern,mod,cmd){
		var uri = "/"+mod+"/pb"+cmd+".do";
		return new PatternMethod(pattern,uri.toLowerCase());
	}
	request(args,opts){
		var content;
		opts = opts||{};
		if(args.constructor.name=="String")
		{
			content=this.pattern({'args':[args]})
		}else{
			content=JSON.stringify(args);
		}
		// console.log("content="+content);
		// return utils.reqMan.request(this,content);
		var baseUrl = opts.server_base || global.server_base || config.server_base;
		var rpcprovider = config.rpc_provider;
		console.log("request==>"+baseUrl+this.uri+",data="+content);
		if(rpcprovider){
			return rpcprovider({
				baseUrl: baseUrl,
				uri:this.uri,
				method:'POST',
				body: content
				//json:false
			})
		}else{
			return new Promise((resolve, reject) => {
				reject("rpc provider not found")
			});;
		}
	}

}

var getBlockByNumber = PatternMethod._(_.template('{"number":"<%- args[0] %>"}'),"/bct/pbgbn.do");
var getBalance = PatternMethod._(_.template('{"address":"<%- args[0] %>"}'),"act","gac");
var getBlockByHash = PatternMethod._(_.template('{"hash":"<%- args[0] %>"}'),"bct","GBA");
var getTransaction = PatternMethod._(_.template('{"hash":"<%- args[0] %>"}'),"TXT","GTX");
var sendRawTransaction = PatternMethod._(_.template('""'),"TXT","MTX");

// 		   getBlockTransactionCount,
//         getBlockUncleCount,
//         getTransaction,
//         getTransactionFromBlock,
//         getTransactionReceipt,
//         getTransactionCount,
//         call,
//         estimateGas,
//         sendRawTransaction,
//         signTransaction,
//         sendTransaction,
//         sign,
//         submitWork,
//         getLogs,
//         getWork

var __sendTxTransaction = function(txtype,toAddr,amount,opts){
		//发送交易
		opts = opts || {};
		var from = opts.from;
		if(!from){
			return new Promise((resolve, reject) => {
				reject("cwv.rpc:from not set or type error:"+from);
			});
		}
		var keypair = opts.keypair;
		if(!keypair){
			return new Promise((resolve, reject) => {
				reject("key pair not set")
			});
		}
		opts.to = toAddr;
		opts.amount = amount;
		let trans=new MTxTransaction(txtype,opts);
		return sendRawTransaction.request(trans.genBody(),opts);
};

export default{
	getBalance:function(args,opts){ return getBalance.request(args,opts);},
	getBlockByNumber:function(args,opts){ return getBlockByNumber.request(args,opts);},
	getBlockByHash:function(args,opts){ return getBlockByHash.request(args,opts);},
	getTransaction:function(args,opts){ return getTransaction.request(args,opts);},
	transfer:function(toAddr,amount,opts){
		return __sendTxTransaction(enums.TYPE_DEFAULT,toAddr,amount,opts);
	},
	sendTxTransaction: __sendTxTransaction,
}