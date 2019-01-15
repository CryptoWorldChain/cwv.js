/*
 * @Author: camulos 
 * @Date: 2019-01-11 16:12:01 
 * @Last Modified by: camulos
 * @Last Modified time: 2019-01-12 19:47:11
 */
import enums from "./enums.js"
import Method from './method'
import BN from 'bn.js';
import proto from './protos'

export default class CRC721 extends Method {
    constructor(args) {
		super(args);
        this.args = args;
        this.multiTransaction = proto.load('MultiTransaction');
		this.multiTransactionBody = proto.load('MultiTransactionBody');
        this.inputs = proto.load('MultiTransactionInput');
        if(Object.is(this.args.txtype,enums.TYPE_CryptoTokenTransaction)){
            this.outputs=proto.load('MultiTransactionOutput');
        }
        if(Object.is(this.args.txtype,enums.TYPE_CreateCryptoToken)){
            this.cryptotokendata = proto.load('CryptoTokenData');
        }
    }
    /**
     * signatures
     * @param {*} txbody 
     */
    signatures(txbody){
        let  ecdata = Buffer.from(txbody)
		return this.args.keypair.ecHexSign(ecdata.toString('hex'));
    }
    /**
     * create crc token
     */
    create(){
        let timestamp = new Date().getTime();
        let names=[],codes=[];
        this.args.names.map(m=>{
            names.push(m.name);
            codes.push(m.code);
        })
        let data=this.cryptotokendata.create({
            total:this.args.total,
            exdata:Buffer.from(this.args.exdata,'hex'),
            name:names,
            symbol:this.args.symbol,
            code:codes
        });
        let txbody = this.multiTransactionBody.create({
            timestamp:timestamp,
            type:Number.parseInt(enums.TYPE_CreateCryptoToken),
            data:Buffer.from(this.cryptotokendata.encode(data).finish(),'hex')
        })
		let jsonBody = {
			timestamp:timestamp,
			type:enums.TYPE_CreateCryptoToken,
            data:Buffer.from(this.cryptotokendata.encode(data).finish()).toString('hex')
		};
        jsonBody.inputs=[];
		txbody.inputs.push(this.inputs.create({
            address:Buffer.from(this.removePrefix(this.args.from),'hex'),
            amount: new BN('0').toArrayLike(Buffer),
            symbol:this.args.symbol,
            nonce: Number.parseInt(this.args.keypair.nonce)
        }))			
        jsonBody.inputs.push({
            address: this.removePrefix(this.args.from),
            amount: '0',
            symbol:this.args.symbol,
            nonce: this.args.keypair.nonce
        });
		jsonBody.signatures=[];
		jsonBody.signatures.push({
            signature:this.signatures(this.multiTransactionBody.encode(txbody).finish())
        });

        // console.log("create crc721 txbody====>",JSON.stringify(jsonBody));
        return {
            transaction:{txBody:jsonBody}
        };
    }

    call(){
        let timestamp = new Date().getTime();
        let txbody = this.multiTransactionBody.create({
            timestamp:timestamp,
            type:Number.parseInt(enums.TYPE_CryptoTokenTransaction)
        })
		let jsonBody = {
			timestamp:timestamp,
			type:enums.TYPE_CryptoTokenTransaction
		};
        jsonBody.inputs=[];
		txbody.inputs.push(this.inputs.create({
            address:Buffer.from(this.removePrefix(this.args.from),'hex'),
            amount: new BN(this.args.amount||'0').toArrayLike(Buffer),
            cryptotoken:this.args.cryptotoken,
            symbol:this.args.symbol,
            nonce:Number.parseFloat(this.args.keypair.nonce)
        }))	

        jsonBody.inputs.push({
            address:this.removePrefix(this.args.from),
            amount: this.args.amount||'0',
            cryptotoken:this.args.cryptotoken,
            symbol:this.args.symbol,
            nonce:this.args.keypair.nonce
        })     
        jsonBody.outputs=[];   	
        this.args.to.map(m=>{
            txbody.outputs.push(this.outputs.create({
                address:Buffer.from(this.removePrefix(m),'hex'),
                amount: new BN(this.args.amount||'0').toArrayLike(Buffer),
                symbol:this.args.symbol,
                cryptotoken:this.args.cryptotoken
            }))
            jsonBody.outputs.push({
                address:this.removePrefix(m),
                amount: this.args.amount||'0',
                symbol:this.args.symbol,
                cryptotoken:this.args.cryptotoken
            })
        })
		jsonBody.signatures=[];
		jsonBody.signatures.push({
            signature:this.signatures(this.multiTransactionBody.encode(txbody).finish())
        });
        // console.log("call crc721 txbody====>",JSON.stringify(jsonBody));
        return {
            transaction:{txBody:jsonBody}
        };
    }
}