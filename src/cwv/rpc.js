import Method from './method.js'
import _ from 'lodash'
import utils from './utils';
import config from "./config.js"
import TransactionInfo from "./transaction.js"
import KeyPair from "./keypair";

class PatternMethod extends Method {
	constructor(pattern, uri) {
		super(pattern)
		this.pattern = pattern;
		this.uri = uri;
	}
	static _(pattern, uri) {
		return new PatternMethod(pattern, uri)
	}
	static _(pattern, mod, cmd) {
		var uri = "/" + mod + "/pb" + cmd + ".do";
		return new PatternMethod(pattern, uri.toLowerCase());
	}
	request(args, opts) {
		var content;
		opts = opts || {};
		if (args.constructor.name == "String") {
			content = this.pattern({ 'args': [args] })
		} else
			if (args.constructor.name == "Array") {
				content = this.pattern({ 'args': args })
			} else {
				content = JSON.stringify(args);
			}
		// console.log("content="+content);
		// return utils.reqMan.request(this,content);
		var baseUrl = opts.server_base || global.server_base || config.server_base;
		var rpcprovider = config.rpc_provider;
		// console.log("request==>"+baseUrl+this.uri+",data="+content);
		if (rpcprovider) {
			return rpcprovider({
				baseUrl: baseUrl,
				uri: this.uri,
				method: 'POST',
				body: content
				//json:false
			})
		} else {
			return new Promise((resolve, reject) => {
				reject("rpc provider not found") 
			});;
		}
	}

}

var getBlockByNumber = PatternMethod._(_.template('{"height":"<%- args[0] %>"}'), "/bct/pbgbn.do");
var getBalance = PatternMethod._(_.template('{"address":"<%- args[0] %>"}'), "act", "gac");
var getBlockByMax = PatternMethod._(_.template('{"address":"<%- args[0] %>"}'), "act", "glb");
var getBlockByHash = PatternMethod._(_.template('{"hash":"<%- args[0] %>"}'), "bct", "gbh");
var getTransaction = PatternMethod._(_.template('{"hash":"<%- args[0] %>"}'), "txt", "gth");
var getStorageValue = PatternMethod._(_.template('{"address":"<%- args[0] %>","key":["<%- args[1] %>"]}'), "act", "qcs");
var sendRawTransaction = PatternMethod._(_.template('""'), "txt", "mtx");

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
var validOpts = function (opts) {
	var keypair = opts.keypair;
	var from = opts.from;
	if (!from) {
		return new Promise((resolve, reject) => {
			reject("cwv.rpc:from not set or type error:" + from);
		});
	}
	if (!keypair) {
		return new Promise((resolve, reject) => {
			reject("key pair not set")
		});
	}
}

/** 
 * from = {"keypair":{"address":"","privateKey":""}, "nonce": 0}
 * 
 * type = 	NONE: 0,
 *			PUBLICCRYPTOTOKEN: 1,
 *			OWNERTOKEN: 2,
 *			USERTOKEN: 3,
 *			PUBLICCONTRACT: 4,
 *			CALLCONTRACT: 5,
 *			CREATEUNIONACCOUNT: 6,
 *			PUBLICUNIONACCOUNT: 7,
 *			UNIONACCOUNTTRANSFER: 8,
 *			UNIONACCOUNTCONFIRM: 9
 *
 * create contract
 * args={"data":"", "amount":""}
 * 
 * call contract
 * args={"contract":"", "data":"", "amount":""}
 * 
 * public token
 * args={"token":"AAA", "amount":10000000000000000000000000000, "opCode":0} 
 * 
 * burn token
 * args={"token":"AAA", "amount":1000000000000000000000000, "opCode":1} 
 * 
 * mint token
 * args={"token":"AAA", "amount":1000000000000000000000000, "opCode":2} 
 * 
 * transfer balance
 * args=[{"address":"","amount":100},{"address":"", "amount":20}]
 * 
 * transfer token
 * args=[{"address":"","token":"AAA","tokenAmount":1000},{"address":"","token":"AAA","tokenAmount":2000}]
 * 
 * transfer crypto token
 * args=[{"address","symbol":"house","cryptoToken":["hash0","hash1"]},{"address","symbol":"house","cryptoToken":["hash2","hash3"]}]
*/

var __sendTxTransaction = function (from, nonce, type, exdata, args) {
	//发送交易
	opts = opts || {};
	var from = opts.from;
	if (!from) {
		return new Promise((resolve, reject) => {
			reject("cwv.rpc:from not set or type error:" + from);
		});
	}
	var keypair = opts.from.keypair;
	if (!keypair) {
		return new Promise((resolve, reject) => {
			reject("key pair not set")
		});
	}

	switch (type) {
		case transactionDataTypeEnum.PUBLICCRYPTOTOKEN:
			break;
		case transactionDataTypeEnum.OWNERTOKEN:
			if (!args.token || !args.amount || isNullOrUndefined(args.opCode)) {
				reject({ "msg": "缺少token 或 amount 或 opcode" });
			} else {
				transactionData.type = enums.OWNERTOKEN;

				transactionData.OwnerTokenData = {};
				transactionData.OwnerTokenData.token = Buffer.from(token, "ascii");
				transactionData.OwnerTokenData.amount = new BN(amount).toArrayLike(Buffer);
				transactionData.OwnerTokenData.opCode = opCode;
				opts = getTransactionOpts(from, nonce, null, transactionData);
			}
			break;
		case transactionDataTypeEnum.USERTOKEN:
			break;
		case transactionDataTypeEnum.PUBLICCONTRACT:
			/** 
			 * args = {"data":"", "amount":""}
			 * 
			*/
			if (isNullOrUndefined(args) || isNullOrUndefined(args.data)) {
				reject("缺少参数data");
			} else {
				let transactionData = {};
				transactionData.type = transactionDataTypeEnum.PUBLICCONTRACT;
				transactionData.publicContractData = {};
				transactionData.publicContractData.data = Buffer.from(args.data, "hex");
				transactionData.publicContractData.amount = new BN(args.amount).toArrayLike(Buffer)
				opts = getTransactionOpts(from, nonce, exdata, transactionData);
			}
			break;
		case transactionDataTypeEnum.CALLCONTRACT:
			/** 
			 * args = {"contract":"", "data":"", "amount":""}
			 * 
			*/
			if (!args.contract || !args.data) {
				reject("缺少参数contract 或 data");
			} else {
				let transactionData = {};
				transactionData.type = transactionDataTypeEnum.CALLCONTRACT;
				transactionData.callContractData = {};
				transactionData.callContractData.contract = Buffer.from(args.contract, "hex");
				transactionData.callContractData.data = Buffer.from(args.data, "hex");
				transactionData.callContractData.amount = new BN(args.amount).toArrayLike(Buffer);
				opts = getTransactionOpts(from, nonce, exdata, transactionData);
			}

			break;
		case transactionDataTypeEnum.CREATEUNIONACCOUNT:
			break;
		case transactionDataTypeEnum.PUBLICUNIONACCOUNT:
			break;
		case transactionDataTypeEnum.UNIONACCOUNTTRANSFER:
			break;
		case TransactionDataTypeEnum.UNIONACCOUNTCONFIRM:
			break;
		default:
			/** 
			 * args = [{"address":"","amount":100,"token":"CWV","tokenAmount":1000,"symbol":"house","cryptoToken":["hash0","hash1"]},{}]
			 * 
			*/
			let outs = generateOutputs(outputs);
			opts = getTransactionOpts(from, nonce, exdata, null, outs);
			break;
	}

	let trans = new TransactionInfo(opts);
	return sendRawTransaction.request(trans, opts);
};

var getTransactionOpts = function (from, nonce, exdata, data, outputs) {
	opts.from = from.keypair.address;
	opts.keypair = from.keypair;
	opts.nonce = (nonce === 0 || isNaN(nonce)) ? null : nonce;

	opts.exdata = exdata || null;
	opts.data = data || null;
	opts.outputs = outputs || null;

	return opts;
}
var transactionDataTypeEnum = {
	NONE: 0,
	PUBLICCRYPTOTOKEN: 1,
	OWNERTOKEN: 2,
	USERTOKEN: 3,
	PUBLICCONTRACT: 4,
	CALLCONTRACT: 5,
	CREATEUNIONACCOUNT: 6,
	PUBLICUNIONACCOUNT: 7,
	UNIONACCOUNTTRANSFER: 8,
	UNIONACCOUNTCONFIRM: 9
};

export default {
	getBalance: function (args, opts) { return getBalance.request(args, opts); },
	getBlockByNumber: function (args, opts) { return getBlockByNumber.request(args, opts); },
	getBlockByHash: function (args, opts) { return getBlockByHash.request(args, opts); },
	getBlockByMax: function (args, opts) { return getBlockByMax.request(args, opts); },
	getTransaction: function (args, opts) { return getTransaction.request(args, opts); },
	/**
	 * 
	 * @param {*} args 
	 * @param {*} opts ["","",""]
	 */
	getStorageValue: function (args, opts) { 
		return getStorageValue.request(args, opts); 
	},
	/**
	 * 转账
	 * @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
	 * @param {*} exdata 明文，方法里做ascii编码
	 * @param {*} outputs 
	 * 	transfer balance
	 * 	args=[{"address":"","amount":100},{"address":"", "amount":20}]
	 * 
	 * 	transfer token
	 * 	args=[{"address":"","token":"AAA","tokenAmount":1000},{"address":"","token":"AAA","tokenAmount":2000}]
	 * 
	 * 	transfer crypto token
	 * 	args=[{"address","symbol":"house","cryptoToken":["hash0","hash1"]},{"address","symbol":"house","cryptoToken":["hash2","hash3"]}]
	 */
	transfer: function (from, exdata, outputs) {
		return __sendTxTransaction(from, from.nonce, 0, exdata, outputs);
	},
	/**
	 * 创建合约
	 * @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
	 * @param {*} exdata 明文，方法里做ascii编码
	 * @param {*} args {"data":"", "amount":""}
	 */
	createContract: function (from, exdata, args) { 
		return __sendTxTransaction(from, from.nonce, 4, exdata, args);
	},
	/**
	 * 调用合约
	 * @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
	 * @param {*} exdata 明文，方法里做ascii编码
	 * @param {*} args {"contract":"", "data":"", "amount":""}
	 */
	callContract: function (from, exdata, args) { 
		return __sendTxTransaction(from, from.nonce, 5, exdata, args);
	},
	/**
	 * 发行ERC20 token
	 * @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
	 * @param {*} exdata 明文，方法里做ascii编码
	 * @param {*} args {"token":"AAA", "amount":10000000000000000000000000000}
	 */
	publicToken: function (from, exdata, args) { 
		args.opCode = 0;
		return __sendTxTransaction(from, from.nonce, 2, exdata, args);
	},
	/**
	 * 燃烧ERC20 token
	 * @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
	 * @param {*} exdata 明文，方法里做ascii编码
	 * @param {*} args {"token":"AAA", "amount":10000000000000000000000000000}
	 */
	burnToken: function (from, exdata, args) { 
		args.opCode = 1;
		return __sendTxTransaction(from, from.nonce, 2, exdata, args);
	},
	/**
	 * 增发ERC20 token
	 * @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
	 * @param {*} exdata 明文，方法里做ascii编码
	 * @param {*} args {"token":"AAA", "amount":10000000000000000000000000000}
	 */
	mintToken: function (from, exdata, args) {
		args.opCode = 2;
		return __sendTxTransaction(from, from.nonce, 2, exdata, args);
	}
}