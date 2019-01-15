
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
//set testnet network type
cwv.config.server_base='http://ta30.icwv.co:38000/fbs';
cwv.config.net_type='testnet'
//set prodnet network type
cwv.config.server_base='http://chain.cwv.one/block';
cwv.config.net_type='prodnet'
```

Create keystore.json、keypair
```js
const cwv=require('@cwv/cwv.js');
const fs=require('fs');
var kp = cwv.KeyPair.genRandomKey();
var json = keystore.exportJSON(kp,"000000");
let fd = fs.openSync('keystore.json', 'w+');
fs.writeSync(fd,JSON.stringify(json));
console.log('keypair',kp);
```

Declare global variables

```js
var opts={
    keypair:kp,from:'0x'+kp.hexAddress
};
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

Send transaction,Can create contracts, execute contracts, send regular transactions，Transaction type supported by cwv main chain

```js
const cwv=require('@cwv/cwv.js');
//Create contract type=7
opts.data="" //set contract content;
cwv.rpc.sendTxTransaction(type,NaN,amount,opts).then(function(result){
    console.log(result);
})
//Execution contract type=8
opts.data="" //set contract content;
let to='' //set contract address
cwv.rpc.sendTxTransaction(type,to,amount,opts).then(function(result){
    console.log(result);
})
```

Get transaction information through transaction hash
```js
const cwv=require('@cwv/cwv.js');
cwv.rpc.getTransaction('f9bea09140e8e2eb2956976c3373418e2a935d821732d86bce33117d17314088').then(function(result){
    console.log(result)
})
```

Create a crc20 token transaction
```js
const cwv=require('@cwv/cwv.js');
//Issue 10 billion
cwv.rpc.createCRC20({'token':'CWC','amount':'1000000000000000000000000000'},opts).then(function(result){
    console.log(result)
})
```
Execute the crc20 token transaction
```js
const cwv=require('@cwv/cwv.js');
//Transfer out 6 cwc and transfer to three users
cwv.rpc.callCRC20({
    'token':'CWC','amount':'60000000000000000000',to:[
        {'addr':'ba363efb1742f0a0487efbdf57f023374c9c40d3','amount':'20000000000000000000'},
        {'addr':'4ea1f354e61932422eb3cfc45e50446a831a7407','amount':'20000000000000000000'},
        {'addr':'38e2d6af03bce30f5b4040456242f66519636a48','amount':'20000000000000000000'}
    ]
}).then(function(result){
    console.log(result)
})
```
Create crc721 token transaction
```js
const cwv=require('@cwv/cwv.js');
let names=[{'name':'test','code':'1'}]
cwv.rpc.createCRC721({
    'symbol':'good','total':'10000','exdata':'Extended data','names':names
}).then(function(result){
    console.log(result)
})
```
Execute crc721 token transaction,Check the balance to get cryptotoken
```js
const cwv=require('@cwv/cwv.js');
cwv.rpc.callCRC721({
    'symbol':'good',
    'cryptotoken':'c2f651cea3b93b4fa95b27bb1c0139f021fcd4a8a0fd9cc25fcbefde4008a0f3',
    'amount':'20000000000000000000',
    'to':"ba363efb1742f0a0487efbdf57f023374c9c40d3"
}).then(function(result){
    console.log(result)
})
```

### License

MIT
