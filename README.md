
<img src="https://cwv.io/images/logo1Normal.svg" width="100">

### cwv.js
-----------------------

### Install

```
$ npm install @cwv/cwv.js
```

### Super simple to use

Setting up the network,cwv support network has testnet and prodnet
```js
const cwv=require('@cwv/cwv.js');
var rp = require('request-promise')
//set testnet network type
cwv.config.server_base='http://ta30.icwv.co:38000/fbs';
cwv.config.net_type='testnet'
//set prodnet network type
cwv.config.server_base='http://chain.cwv.one/block';
cwv.config.net_type='prodnet'
cwv.config.rpc_provider = rp;
```

Get balance and nonce
```js
const cwv=require('@cwv/cwv.js');
cwv.rpc.getBalance('8f3aa4f0f35ff81ba487f91f6b980c0ba2562245').then(function(result){
    console.log(result.account.balance)
    console.log(result.account.nonce)
})
```

Get block info by hash
```js
const cwv=require('@cwv/cwv.js');
cwv.rpc.getBlockByHash('03a15d84e6e29d2affab1ddc680f0aefc20586bd73ea3d81dcf6505924cfb86c').then(function(result){
    console.log(result)
})
```
Get block info by height
```js
const cwv=require('@cwv/cwv.js');
cwv.rpc.getBlockByNumber('1518059').then(function(result){
    console.log(result)
})
```
Get the current height of the CWV blockchain
```js
const cwv=require('@cwv/cwv.js');
cwv.rpc.getBlockByMax().then(function(result){
    console.log(result)
})
```

Create keystore.json、keypair

```java
const cwv=require('@cwv/cwv.js');
const fs=require('fs');
var kp = cwv.KeyPair.genRandomKey();
var json = keystore.exportJSON(kp,"000000");
let fd = fs.openSync('keystore.json', 'w+');
fs.writeSync(fd,JSON.stringify(json));
console.log('keypair',kp);
```

Send transfer，support balance transfer，token transfer， crypto token transfer 。

```js
const cwv=require('@cwv/cwv.js');
var kp = cwv.KeyPair.genFromPrikey(
  '89611e9ed751b2bb0f2a84d1b364bd6ef97a512a7ad0b1b50241168ff3add985')
/**
* transfer
* @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
* @param {*} exdata Plaintext
* @param {*} args 
* 	transfer balance
* 	args=[{"address":"","amount":100},{"address":"", "amount":20}]
* 
* 	transfer token
* 	args=[
* 		{"address":"","token":"AAA","tokenAmount":1000},
* 		{"address":"","token":"AAA","tokenAmount":2000}
*		]
* 
* 	transfer crc721 token
* 	args=[
* 		{"address":"","symbol":"house","cryptoToken":["hash0","hash1"]},
* 		{"address":"","symbol":"house","cryptoToken":["hash2","hash3"]}
* 	]
*/
kp.nonce=10;
var from={keypair:kp};
var args=[{"address":"066c03fcc3048863f72b051530e5a212fb9233f6","amount":1}]
cwv.rpc.transfer(from,exdata,args).then(function(result){
    console.log(result)
})
//transfer sign
cwv.rpc.signTransfer(from,exdata,args)
```

Get transaction information through transaction hash
```js
const cwv=require('@cwv/cwv.js');
cwv.rpc.getTransaction('f9bea09140e8e2eb2956976c3373418e2a935d821732d86bce33117d17314088').then(function(result){
    console.log(result)
})
```

Create a token transaction
```js
const cwv=require('@cwv/cwv.js');
/**
* create token
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} exdata Plaintext
* @param {*} args {"token":"AAA", "amount":10000000000000000000000000000,"opCode":0}
*/
cwv.rpc.publicToken(from, exdata, args).then(function(result){
    console.log(result)
})
//create token sign
cwv.rpc.signPublicToken(from, exdata, args)
```
Burn a token transaction

```js
const cwv=require('@cwv/cwv.js');
/**
* burn token
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} exdata Plaintext
* @param {*} args {"token":"AAA", "amount":10000000000000000000000000000,"opCode":1}
*/
cwv.rpc.burnToken(from,exdata,args).then(function(result){
    console.log(result)
})
// burn token sign
cwv.rpc.signBurnToken(from,exdata,args)
```

Additional a token transaction

```java
const cwv=require('@cwv/cwv.js');
/**
* Additional token
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} exdata Plaintext
* @param {*} args {"token":"AAA", "amount":10000000000000000000000000000,"opCode":2}
*/
cwv.rpc.mintToken(from,exdata,args).then(function(result){
    console.log(result)
})
// Additional token sign
cwv.rpc.signMintToken(from,exdata,args)
```

Create contract

```js
const cwv=require('@cwv/cwv.js');
/**
* createContract
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} exdata Plaintext
* @param {*} args {"data":"", "amount":""}
*/
cwv.rpc.createContract(from,exdata,args).then(function(result){
    console.log(result)
})
// createContract sign
cwv.rpc.signCreateContract(from,exdata,args);
```

Call contract

```js
const cwv=require('@cwv/cwv.js');
/**
* callContract
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} exdata Plaintext
* @param {*} args {"contract":"", "data":"", "amount":""}
*/
cwv.rpc.callContract(from,exdata,args).then(function(result){
    console.log(result)
})
//callContract sign
cwv.rpc.signCallContract(from,exdata,args);
```

Create crc721 token transaction
```js
const cwv=require('@cwv/cwv.js');
/**
* create CRC721 token
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} exdata Plaintext
* @param {*} args {"total":10, "symbol":"", "code":"","name":"",key:[],value:[]}
*/
cwv.rpc.createCrypto(from,exdata,args).then(function(result){
    console.log(result)
})
//create CRC721 token sign
cwv.rpc.signCreateCrypto(from,exdata,args);
```
signEvfsFileUpload sign

```js
const cwv=require('@cwv/cwv.js');
/**
* get evfs file upload sign
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} args {"evfs":""}
*/

var result=cwv.rpc.signEvfsFileUpload(from, exdata, args)

Return structure
{
    tx:""
}
```

signEvfsAuthFile

```js
const cwv=require('@cwv/cwv.js');
/**
* get evfs auth sign
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} args {"fileHash":"","addAddrs":["",""]}  //add auth list
									{"fileHash":"","removeAddrs":["",""]} //remove auth list
*/
var result=cwv.rpc.signEvfsAuthFile(from, exdata, args)

Return structure
{
    tx:""
}
```

signCustom

```java
const cwv=require('@cwv/cwv.js');
/**
* get evfs auth sign
* @param {*} from {"keypair":{"address":"","privateKey":""}}
* @param {*} args {data:""}
*/
cwv.rpc.signCustom(from, exdata, args)
```



### License

MIT
