import Method from './method.js'
import 	_ from 'lodash'
import utils from './utils';
import rp from 'request-promise';
import config	from "./config.js"

var mockrp = rp;

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
	request(args){
		var content;
		if(args.constructor.name=="String")
		{
			content=this.pattern({'opt':[args]})
		}else{
			content=this.pattern({'opt':args})
		}
		console.log("content="+content);
		// return utils.reqMan.request(this,content);
		console.log("request==>"+config.server_base+this.uri+",data="+content);
		return mockrp({
			baseUrl:config.server_base,
			uri:this.uri,
			method:'POST',
			body: content,
			json:true
		})
	}

}

var getBlockByNumber = PatternMethod._(_.template('{"number":<%- opt[0] %>}'),"/bct/pbgbn.do");
var getBalance = PatternMethod._(_.template('{"address":<%- opt[0] %>}'),"act","gac");
var getBlockByHash = PatternMethod._(_.template('{"hash":<%- opt[0] %>}'),"bct","GBA");
var getTransaction = PatternMethod._(_.template('{"hash":<%- opt[0] %>}'),"TXT","GTX");
var sendRawTransaction = PatternMethod._(_.template('{"transaction":<%- opt %>}'),"TXT","MTX");

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

export default{
	setMockRequest:function(rp){ mockrp = rp; return mockrp;},

	getBalance:function(args){ return getBalance.request(args);},
	getBlockByNumber:function(args){ return getBlockByNumber.request(args);},
	getBlockByHash:function(args){ return getBlockByHash.request(args);},
	getTransaction:function(args){ return getTransaction.request(args);},
	sendRawTransaction:function(args){ return sendRawTransaction.request(args);},
	
}