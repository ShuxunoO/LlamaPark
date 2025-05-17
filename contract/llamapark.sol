// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyToken is ERC721Enumerable, Ownable {
    using Strings for uint256;
    
    string private baseURI; // nft metadata jsonURI
    string public baseExtension = ".json"; // 用以生成图片的URI后缀
    uint256 public cost = 0 ether; // mintNFT的价格
    uint256 public maxSupply = 16; // 最大供应量
    uint256 public maxMintAmount = 2; // 单次可以铸造的最大NFT数
    uint256 public maxTokenAmountForEachAddress = 1; // 仅在特殊mint通道中对账户中含有的token数量做限制，默认为1个
    bool public isPaused = false; //是否暂停mint活动，true表示暂停mint活动，false表示开始mint
    
    // 外部调用者的secret就是合约内部的signal 都代表"暗号的意思"
    struct Signal {
        string signalName; // 不同的暗号名字对应不同的mint渠道
        uint256 totalSupply; // 每个暗号对应的token供应量
        uint256 mintedNumber; // 记录每个暗号已经mint的token数量
    }
    Signal[3] private Signals; // 定义一个暗号数组，长度为3
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        setBaseURI(_initBaseURI);
    }

    // internal 拿到baseURI
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // 替换为合适的重写函数
    function _update(address to, uint256 tokenId, address auth) 
        internal 
        virtual 
        override 
        returns (address) 
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) 
        internal 
        virtual 
        override 
    {
        super._increaseBalance(account, value);
    }

    // public mint代币方法
    function mint(uint256 _mintAmount) public payable {
        require(!isPaused, "Minting is paused");
        require(
            _mintAmount > 0 && _mintAmount <= maxMintAmount,
            "Error: Mint Too Many Tokens For One Time"
        );
        require(
            totalSupply() + _mintAmount <= maxSupply,
            "Error: Insufficient Token Amount"
        );

        if (msg.sender != owner()) {
            require(msg.value >= cost * _mintAmount, "Insufficient funds"); // 如果合约的调用者不是合约的拥有者，那么要求调用者的余额≥mint总价值
        }

        uint256 supply = totalSupply();
        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }

    // 查看一个用户的钱包中有多少枚token
    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner); //输入地址，可以获取该地址token的余额
        uint256[] memory tokenIds = new uint256[](ownerTokenCount); // 创建一个memory数组的固定写法
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    // 拿到tokenURI
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "Error: BaseURI Not Found";
    }

    // 内部函数用于检查tokenId是否存在
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    // 设置交易手续费
    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    // 设置单次最大的mint数量
    function setmaxMintAmountOneTime(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmount = _newmaxMintAmount;
    }

    // 设置新的NFTmetadatajson baseURI
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    // 设置文件拓展名
    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    //设置是否暂停mint活动 true表示暂停，flase表示可以mint
    function pause(bool _state) public onlyOwner {
        isPaused = _state;
    }

    // internal 检查两个字符串是否相同
    // 相同返回true，不同返回false
    function isEqual(string memory _signal, string memory userInput)
        internal
        pure
        returns (bool)
    {
        if (
            keccak256(abi.encodePacked(_signal)) ==
            keccak256(abi.encodePacked(userInput))
        ) {
            return true;
        } else {
            return false;
        }
    }

    //设置暗号对应的属性
    function setSignalattributes(
        uint256 _ID,
        string memory secret,
        uint256 supplyAmount
    ) public onlyOwner {
        require(_ID >= 0 && _ID < Signals.length, "Error: Illegal ID");
        maxSupply = maxSupply + getRemainingtokenAmount(_ID); // 首先回收当前暗号中剩余的还未被mint的代币数量，防止浪费
        require(maxSupply >= supplyAmount, "Error: Insufficient Token Amount"); // token的供应量必须大于暗号的供应量
        Signals[_ID].signalName = secret;
        Signals[_ID].totalSupply = supplyAmount;
        Signals[_ID].mintedNumber = 0; // mintedNumber 在设置之初为0
        maxSupply = maxSupply - supplyAmount; // 总数中需要预先去掉这些被暗号预定的token数量
    }

    // 查看某个索引所对应的暗号属性
    function showSecretattributes(uint256 _ID)
        public
        view
        onlyOwner
        returns (Signal memory secret)
    {
        require(_ID >= 0 && _ID < Signals.length, "Error: Illegal ID");
        return Signals[_ID];
    }

    // 输入secret索引，获取剩余还没被mint的token数量
    function getRemainingtokenAmount(uint256 _ID)
        public
        view
        onlyOwner
        returns (uint256 amount)
    {
        require(_ID >= 0 && _ID < Signals.length, "Error: Illegal ID"); // 校验索引是否合法
        return (Signals[_ID].totalSupply - Signals[_ID].mintedNumber);
    }

    // 检查暗号是否正确
    function checkSecret(string memory userInput)
        public
        view
        returns (uint256 _ID)
    {
        uint256 index = 0;
        bool flag = false; // 状态变量，用以记录暗号的匹配状态,默认状态是false
        for (index; index < Signals.length; index++) {
            if (isEqual(Signals[index].signalName, userInput)) {
                flag = true;
                break; // 匹配到用户输入的信息之后就跳出循环
            }
        }
        require(flag, "Error: None secret Found");
        return (index); // 匹配到正确的字符之后会返回暗号在数组中的索引
    }

    // 设置特殊通道mint的时候地址钱包中对token总量的限制
    function setMaxTokenAmountForEachAddress(uint _MaxAmount)
        public
        onlyOwner
    {
        maxTokenAmountForEachAddress = _MaxAmount;
    }

    // 特殊的mint渠道
    function specialMint_tunnel(string memory userInput) public {
        uint256 _ID = checkSecret(userInput); // 验证用户输入的暗号是否是已经登记过的合法字符
        require(
            Signals[_ID].totalSupply - Signals[_ID].mintedNumber > 0,
            "Error: None Free Token Left "
        ); // 验证当前暗号时候还有剩余token没有被mint
        // 检查当前地址的token余额是不是超过了合约对单个地址token数量的限制
        // 如果超过了，就不能免费mint，哪怕之前并没有免费领过
        require(
            balanceOf(msg.sender) < maxTokenAmountForEachAddress,
            "Error: Overflow OF Your Wallet, You Already Have Too Many Tokens In your Wallet"
        );
        
        uint256 supply = totalSupply();
        _safeMint(msg.sender, supply + 1);
        Signals[_ID].mintedNumber++; // 当前暗号下已被mint的token数量+1
    }

    // 提款函数 超级重要
    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }
}

