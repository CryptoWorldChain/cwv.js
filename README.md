
<img src="https://cwv.io/images/logo1Normal.svg" width="100">

### cwv.js
-----------------------

### Install

```
$ npm install @cwv/cwv.js
```

### Super simple to use

```js
var cwv=require('@cwv/cwv.js');
//send transaction
cwv.rpc.sendTxTransaction(txtype,toAddr,amount,opts).then(function(body){
    console.log(body);
})

```
### License

MIT
