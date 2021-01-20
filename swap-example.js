const cwv=require('./dist/cwv.js');
const fs=require('fs');
var rp = require('request-promise')
//set testnet network type
cwv.config.server_base='http://ta30:8000/fbs';
cwv.config.rpc_provider = rp;
const web3=require("web3");

/** 
一，兑换：
1）币种列表：中心化实现
2）价格：poolBalance0/poolBalance1
3) 滑点限制：用户可接收的价格百分比变动
a)查询的合约价格【poolBalance0/poolBalance1】 a
b)用户提交时再次查询合约价格【poolBalance0/poolBalance1】b
c)用户的设置的滑点值<b-a/a 则大于滑点限制，交易取消
4）到账最小数量：poolBalance1-(poolBalance0*poolBalance1/（poolBalance0+token0输入数量) )
5）流动资金提供者费用：token0输入数量 * 0.3%

二，资金池
1）查询列表：中心化实现
2）查询资金池流动性金额：liquidBalances
3）token0金额：lp1 =(liquidBalances*poolLiquidity/（poolbalance1*2))/2
4）token1金额：lp1 * poolBalance0/poolbalance1
5）资金池分额：liquidBalances/(poolbalance1*2)
*/

/**
 * @result 
 * {
 *  "hexAddress": "59514f8d87c964520fcaf515d300e3f704bf6fcb",
 *  "hexPrikey": "865d9b25aa0296d4c8cc0780eaa4b03cf8ecf43f5a1c3624b18f75d96c681839",
 *  "hexPubkey": "7327211aabd20c452c2dc8cdf34351f991e9fbe0c0c390a91634b8b5e0fd3cd4633b6b835db706a9d839c8a48dc06e0c051e0536041bebae86ef0479d942fe47"
 * }
}
 */
var kp = cwv.default.genFromPrikey('865d9b25aa0296d4c8cc0780eaa4b03cf8ecf43f5a1c3624b18f75d96c681839')

var nonce=10;//需要动态查用户余额 参考 https://open.cwv.io/develop/#/api?id=_111-%e8%b4%a6%e6%88%b7%e4%bf%a1%e6%81%af
var hexPrikey=kp.hexPrikey,hexPubkey=kp.hexPubkey,hexAddress=kp.hexAddress;
var exdata="ff"
//1.1 发行token签名
/**
 * 1.1 发行token签名
 * @param nonce 必填，获取用户nonce，需要动态查用户余额
 * @param hexPrikey 必填，私钥
 * @param exdata=hexstring  选填，扩展字段，16进制
 * @param args={
 *  "token":"MMM", //必填，token名字
 *  "amount":"10000000000000000000000000000",//必填，总数量 带精度
 *  "opCode":0,//默认即可
 * }
 * @result string
 */
var args={"token":"MMM", "amount":"10000000000000000000000000000","opCode":0}
var sign=cwv.default.signPublicToken(nonce,hexPrikey, exdata, args)

//1.2 获取发布合约 合约编码
/**
 * @param bytecode 必填，hexstring 合约编码
 * @param token0=MMM 必填，token0
 * @param token1=NNN 必填，token1
 * @param mans=["0x0000000000"] 必填，管理地址
 * @result hexstring 合约编码
 */
var data=cwv.default.swap.byteCode("6080604052348","MMM","NNNN",["0xf5b86060ed7c8ed4dde93291d5cdef1d915c0679"])
//1.3 获取发布合约签名 需要传递data参数 
/**
 * get contract code
 * @param nonce 必填，获取用户nonce，需要动态查用户余额
 * @param hexPrikey 必填，私钥
 * @param exdata hexstring 选填，扩展字段
 * @param args={
 *  "data":"hexstring",//必填，合约编码
 *  "amount":"" //空着不用填
 * }
 * @result hexstring
 */
args={"data":data,"amount":""}
sign=cwv.default.signCreateContract(nonce,hexPrikey,exdata,args)

//1.4 调用合约方法签名
//1.4.1 调用合约方法initPool 
/**
 * @param token0 必填，数量 带精度
 * @param token1 必填，数量 带精度
 * @result hexstring
 */
data=cwv.default.swap.initPool("1000000000000000000000","2000000000000000000000")
//1.4.2 调用合约方法swap
/**
 * @param token0 必填，数量 带精度
 * @param token1 必填，数量 带精度
 * @result hexstring
 */
data=cwv.default.swap.swap("1000000000000000000000","2000000000000000000000")
//1.4.3 调用合约方法 用户添加流动性
/**
 * @param token0 必填，数量 带精度
 * @param token1 必填，数量 带精度
 * @result hexstring
 */
data=cwv.default.swap.addLiquid("1000000000000000000000","2000000000000000000000")
//1.4.4 调用合约方法 用户取出流动性
/**
 * @param lq 必填，数量 带精度，通过2.2.4 查询每个地址的流动代币
 * @result hexstring
 */
data=cwv.default.swap.removeLiquid("1000000000000000000000")
//1.4.5 调用合约方法 转让流动性代币
/**
 * @param address 必填，目标地址
 * @param lq 必填，数量 带精度，通过2.2.4 查询每个地址的流动代币
 * @result hexstring
 */
data=cwv.default.swap.transferLiquid("address","2000000000000000000000")

/**
* callContract
 * @param {*} nonce 必填，获取用户nonce，需要动态查用户余额
 * @param {*} hexPrikey 必填，私钥
 * @param {*} exdata 选填，hexstring 扩展字段
 * @param {*} args {
 *  "contract":"", //必填，合约地址
 *  "data":"", //必填，hexstring合约参数
 *  "amount":"" //选填，数量 默认为空
 * }
 * @result hexstring
*/
args={"contract":"4ca9d8adb0612c8805aeed8bc490c4cf13e9cdd2", "data":data, "amount":""}
sign=cwv.default.swap.signCallContract(nonce,hexPrikey,null,args)

/********以上4个步骤 通过SDK获取签名体 如下:*****************
 * @method:post
 * @param
 * {
 *     "tx":"tx" //签名信息
 * }
 * @path /fbs/tct/pbmtx.do
 * @result 
 *  {
 *      "retCode": 1, //1=成功 0=失败
 *      "hash": "70d994369495f2139102a8391e463418d0f6d62e4a2e1444949f3eba2e1ebf74b7"//交易hash
 *      "contractHash":""//合约地址 ,其他交易无此参数
 *  }
 * 使用者需要自行发起http请求并异步获取交易结果
 * 参考https://open.cwv.io/develop/#/api?id=_112-%e5%8f%91%e4%ba%a4%e6%98%93
 *******************************************************/
// 2.1 发交易 https://open.cwv.io/develop/#/api?id=_112-%e5%8f%91%e4%ba%a4%e6%98%93
// 2.1 查询交易结果 https://open.cwv.io/develop/#/api?id=_119-%e6%8c%89%e5%93%88%e5%b8%8c%e8%8e%b7%e5%8f%96%e4%ba%a4%e6%98%93%e4%bf%a1%e6%81%af

// 2.2 获取合约内变量 key
// 2.2.1 token0流动池余额大小 poolBalance0
/**
 * @result hexstring
 */
key=cwv.default.swap.poolBalance0()
// 2.2.2 token1流动池余额大小 poolBalance1
/**
 * @result hexstring
 */
key=cwv.default.swap.poolBalance1()
// 2.2.3 总流动性
/**
 * @result hexstring
 */
key=cwv.default.swap.poolLiquidity()
// 2.2.4 查询每个地址的流动代币
/**
 * @param 流动代币地址 必填
 * @result hexstring
 */
key=cwv.default.swap.liquidBalances("address")


// 3.1 查询合约变量结果
/**
 * @method:post 
 * @params {
 *      "address":"",//合约地址
 *      "keys":[{"key":""}] //参数根据2.2获取key
 * }
 * @path /fbs/act/pbqcs.do
 * @result {
        "retCode": 1,
        "items": [
            {
                "value": "0000000000000000000000000000000000000000000002db69e37f42bd640000" //16进制转为数字
            }
        ]
    }
 */





 