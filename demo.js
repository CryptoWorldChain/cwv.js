const cwv=require('./dist/cwv.js');
const fs=require('fs');
var rp = require('request-promise')
//set testnet network type
cwv.config.server_base='http://ta30:8000/fbs';
cwv.config.rpc_provider = rp;
const web3=require("web3");

// hexPrikey: '6ebe6cce22c9f5295617cb1fb7bb247d01c67693f94627b7989eec9585eb03d6',
// hexPubkey: '720c607ccdf97da2c5eb2881bbc474eefdd68716d211126dfd1217f9dd6d8f8870d571d400a3f9362abcaae2040dc8ff75a095d4376c63784e7a2e519df9dd53',
// hexAddress: '07e96c97de8b2ef2dd05d59595af853bfe8f18eb',

// var kp=cwv.KeyPair.genRandomKey();
// console.log(kp);

// var kp = cwv.KeyPair.genFromPrikey('f768fb807e803fea9dfd434329e4bd6d7277afde4c3336d0e1413e304c587e2e')
// var kp = cwv.KeyPair.genFromPrikey('6b5e7ff06889bd3acea83d81a79eccef5cc0c02d2085fe70d07f6257fc3d0eec')
// var kp=cwv.KeyPair.genRandomKey();

// {
//     "address": "59514f8d87c964520fcaf515d300e3f704bf6fcb",
//     "privateKey": "865d9b25aa0296d4c8cc0780eaa4b03cf8ecf43f5a1c3624b18f75d96c681839",
//     "nonce": 0,
//     "fee": 0,
//     "exdata": "",
//     "timestamp": 0,
//     "outputs": [{
//      "address": "066c03fcc3048863f72b051530e5a212fb9233f6",
//      "amount": 10000000000000000000000000
//     }]
//    }



// args=[{"address":"07e96c97de8b2ef2dd05d59595af853bfe8f18eb","amount":'100000000000000000000'}];

// hexPrikey: 'b9a4af2c7cf45c1c53e6d45cd91aeef99ee87e1d9d1e1278603d4cdd6aeaa495',
//     hexPubkey: 'd8e6f1c71f3dfebc1288a08482aad84ebc352a9c835af1539e1fc730d2adeee24bd8161d25cba54997c5ef10e4b06962a5c8ccde96a7a8ac5f81d510235182ba',
//     hexAddress: '9165630e422dc884fb90b8707ad1212266621736',
// a5c31be225011ee6ecceaf3b9b3696db01a20d6c

// hexPrikey: 'c153092a00f00fe99a506f2de33df28a7410a23613b24852e36fa466a7f0c7a9',
//     hexPubkey: '381a2180f79efe9a4e27e452c20a50b5195d2f028349e6b09b5b0fb5fe8d1ad5d9d04fc48a57ca3a715c988be49aa8f124b04bf4ca30a656b1703511355e979d',
//     hexAddress: '6f0d4eb7a759ee5e2e1346a8e991b2254882f93c',

// ************************1.transfer************************
var kp = cwv.KeyPair.genFromPrikey('865d9b25aa0296d4c8cc0780eaa4b03cf8ecf43f5a1c3624b18f75d96c681839')
kp.nonce=0;
var from={
    keypair:kp
}
console.log(from)

// console.log(cwv.swap.byteCode("6080604052348","0xAAA","0xBBB",["0xf5b86060ed7c8ed4dde93291d5cdef1d915c0679"]))
// console.log(cwv.swap.initPool("1000000000000000000000","2000000000000000000000"));
// console.log(cwv.swap.swap("1000000000000000000000","2000000000000000000000"));
// console.log(cwv.swap.liquidBalances("9165630e422dc884fb90b8707ad1212266621736"));

console.log(cwv.swap.poolBalance0());

//ed3c0d4e5c876992953da933bef36e9e7c6c570a

cwv.rpc.getBalance(from.keypair.hexAddress).then(function(result){
    console.log(result);
    result=JSON.parse(result);
    from.keypair.nonce=result.account.value.nonce;
    // var args=[{"address":"f5b86060ed7c8ed4dde93291d5cdef1d915c0679","amount":"10000000000000000000000"}]
    // var extdata=Buffer.from('{"a":2,"b":"北京你好"}', 'utf8').toString('hex');
    // cwv.rpc.transfer(from,extdata,args).then(function(result){
    //     console.log(result)
    // })

    // var args=[{"address":"1b7e0df8e44938213138213e30e9c1cb1d7c4f5a","token":"CCC","tokenAmount":"5000000000000000000000000"}]
    // var extdata=Buffer.from('{"a":2,"b":"北京你好"}', 'utf8').toString('hex');
    // cwv.rpc.transfer(from,null,args).then(function(result){
    //     console.log(result)
    // })

    // var args=[{"address":"1b7e0df8e44938213138213e30e9c1cb1d7c4f5a","token":"EEE","tokenAmount":"5000000000000000000000000"}]
    // // var extdata=Buffer.from('{"a":2,"b":"北京你好"}', 'utf8').toString('hex');
    // cwv.rpc.transfer(from,null,args).then(function(result){
    //     console.log(result)
    // })
    
    var args={
        "data":"608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f342827c97908e5e2f71151c08502a66d44b6f758e3ac2f1de95f02eb95f0a73560405160405180910390a36102c2806100dc6000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063893d20e814610051578063a6f9dae1146100a8575b600080fd5b34801561005d57600080fd5b506100666100eb565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156100b457600080fd5b506100e9600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610114565b005b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156101d8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f43616c6c6572206973206e6f74206f776e65720000000000000000000000000081525060200191505060405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f342827c97908e5e2f71151c08502a66d44b6f758e3ac2f1de95f02eb95f0a73560405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505600a165627a7a72305820f7ad18bdc1b60f91ee9867fc0980065db403ccbfa09aa1c503c4a04eccf641d00029",
        "amount":""
    }
    cwv.rpc.createContract(from,null,args).then(function(result){
        console.log(result)
    })
    
    /**
    * callContract
    * @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
    * @param {*} exdata Plaintext
    * @param {*} args {"contract":"", "data":"", "amount":""}
    */
    // args={"contract":"4ca9d8adb0612c8805aeed8bc490c4cf13e9cdd2", "data":"277de711", "amount":""}
    // cwv.rpc.callContract(from,null,args).then(function(result){
    //     console.log(result)
    // })

    /**
    * create token
    * @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
    * @param {*} exdata Plaintext
    * @param {*} args {"token":"CETH", "amount":"10000000000000000000000000000","opCode":0}
    */
    // var args={"token":"MMMDDD", "amount":"10000000000000000000000000000","opCode":0}
    // cwv.rpc.publicToken(from, null, args).then(function(result){
    //     console.log(result)
    // })

    //58273c822a8b10817ee73426a1fe3f69ef4c2be8

}).catch(function (err) {
    console.log(err)
});


// hexPrikey: 'b9a4af2c7cf45c1c53e6d45cd91aeef99ee87e1d9d1e1278603d4cdd6aeaa495',
//     hexPubkey: 'd8e6f1c71f3dfebc1288a08482aad84ebc352a9c835af1539e1fc730d2adeee24bd8161d25cba54997c5ef10e4b06962a5c8ccde96a7a8ac5f81d510235182ba',
//     hexAddress: '9165630e422dc884fb90b8707ad1212266621736',
// console.log(cwv.KeyPair.ecHexVerify('ab8ddf22f2471d2ff41e85e7062762fa52c400126564ea963fef61a275f0978874',a))
// var a=cwv.rpc.signEvfsFileUpload(from,null,
//     {
//         evfs:"0ae001fec12c0df599dfd6d96b6a8df085df07ebbd6691dcc08f28f2e45ae407b32ee996627aadfa36150b687a5d23afcbcdaff8c0516238e0dc06c042eee8a556c4fadfbf1da2a3e22ff2b76db0d2bd835ab8742c53d774c020bfac2c1f51dfe02fc1d8c8ed74a527b22d98f3af69d433f0a5b8fe909fc64e806738d9d9f4bf01699e905a777973c5232c10acd7252f61233c7f5dd27843ed6e1892d3e1097c7f79c4ee99f0888e40777eb8fe909fc64e80672f47234673f6f64f3c48a9df7a35705710acd7252f61233c7f5dd27843ed6e1816665f3a02c6b27bd794dd32246decc212910104e2483b1178b27d7b39caf8c709b5910f16bab5991a9db9802b8a9535120681a8e2f55805ef5a65fb45bd03f8f7871452cef1f0789d68d3d1c3a4621ab0b3f1f2087abfb87acf4ad0882ae47aed77ec71159b94c51b33a808619bdfc52d3df8abd0140d124ec55574aaa9546055f8c935a5cddfcf7f0682bd160c1aa7e204011bafa70d81b310352472d48f6a9d6f23ae1a0476312e302214e3ac3979ff2ca886737472a8e6e86f7e38b4c7ba"
//     }
// )

// ************************2.getTransaction************************
// cwv.rpc.getTransaction("e6527d3a445bfd61b93325839969ce9bdfbbdbb65d602149909d4d3fdf4a6bb14d").then(function(result){
//     console.log(result)
// }).catch(function(error){
//     console.log(error)
// })

// ************************3.getBlockByNumber************************
// cwv.rpc.getBlockByNumber('2143').then(function(result){
//     console.log(result)
// })

// ************************4.getBlockByMax************************
// cwv.rpc.getBlockByMax().then(function(result){
//     console.log(result)
// })

// ************************5.getBalance************************
// cwv.rpc.getBalance('59514f8d87c964520fcaf515d300e3f704bf6fcb').then(function(result){
//     console.log(result);
// }).catch(function (err) {
//     console.log(err)
// });




console.log(BigInt("0x33b2e3c9fd0803ce8000000"))


// 0000000000000000000000000000004345544820
// 0000000000000000000000000000000044464b20