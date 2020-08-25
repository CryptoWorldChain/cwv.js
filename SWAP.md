
SWAP使用规范

### 1.编写swap合约 
### 2.发布CRC20Token
### 3.发布合约 使用nodejs sdk
- 初始参数 传入crc20token0和crc20token1
- 传入crc20token编码规范为：补0+crc20token编码转为16进制+"20"，总长度为40位
### 4.调用合约
- 初始化池子 initPool(uint256 value0,uint256 value1) 只有管理员才能操作
-  用户交换币 swap(uint256 value0,uint256 value1)
-  用户增加流动性 addLiquid(uint256 value0,uint256 value1)
- 用户取出流动性 removeLiquid(uint256 value)
- 转让流动性代币 transferLiquid(address to,uint256 value)

> 注意：编码规则遵循evm规范，调用nodejs sdk调用合约请去掉0x

> 每一对交易对都将创建新的合约
