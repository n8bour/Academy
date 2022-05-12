// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract GasContract is Ownable {
    uint256 public totalSupply; // cannot be updated
    uint256 public paymentCounter;
    uint256 public tradePercent = 12;
    address public contractOwner;
    uint256 public tradeMode;
    address[5] public administrators;
    bool tradingMode = true;
    enum PaymentType {
        Unknown,
        BasicPayment,
        Refund,
        Dividend,
        GroupPayment
    }

    mapping(address => uint256) public balances;
    mapping(address => Payment[]) public payments;
    History[] public paymentHistory; // when a payment was updated
    mapping(address => uint256) public whitelist;

    struct Payment {
        uint256 paymentID;
        bool adminUpdated;
        PaymentType paymentType;
        address recipient;
        string recipientName; // max 8 characters
        address admin; // administrators address
        uint256 amount;
    }

    struct History {
        uint256 lastUpdate;
        address updatedBy;
        uint256 blockNumber;
    }

    event AddedToWhitelist(address userAddress, uint256 tier);

    modifier onlyAdminOrOwner() {
        require(
            checkForAdmin(msg.sender),
            "Caller not admin"
        );
        _;
    }

    event supplyChanged(address indexed, uint256 indexed);
    event Transfer(address recipient, uint256 amount);
    event PaymentUpdated(
        address admin,
        uint256 ID,
        uint256 amount,
        string recipient
    );
    event WhiteListTransfer(address indexed);

    constructor(address[] memory _admins, uint256 _totalSupply) {
        contractOwner = msg.sender;
        totalSupply = _totalSupply;

        balances[msg.sender] = totalSupply;
        emit supplyChanged(msg.sender, totalSupply);

        
        for (uint256 ii; ii < administrators.length; ii++) {
            if (_admins[ii] != address(0)) {
                administrators[ii] = _admins[ii];
            }
        }
    }

    function getPaymentHistory()
        external view
        returns (History[] memory paymentHistory_)
    {
        return paymentHistory;
    }

    function checkForAdmin(address _user) public view returns (bool admin_) {
        bool admin = false;
        for (uint256 ii; ii < administrators.length; ii++) {
            if (administrators[ii] == _user) {
                admin = true;
                break;
            }
        }
        return admin;
    }

    function balanceOf(address _user) external view returns (uint256 balance_) {
        uint256 balance = balances[_user];
        return balance;
    }

    function getTradingMode() external view returns (bool) {
        return tradingMode;
    }

    function addHistory(address _updateAddress, bool _tradeMode)
        internal
    {
        History memory history;
        history.blockNumber = block.number;
        history.lastUpdate = block.timestamp;
        history.updatedBy = _updateAddress;
        paymentHistory.push(history);
    }

    function getPayments(address _user)
        external
        view
        returns (Payment[] memory payments_)
    {
        require(
            _user != address(0),
            "User must have a valid non zero address"
        );
        return payments[_user];
    }

    function transfer(
        address _recipient,
        uint256 _amount,
        string calldata _name
    ) external returns (bool status_) {
        require(
            balances[msg.sender] >= _amount,
            "Sender has insufficient Balance"
        );
        require(
            bytes(_name).length < 9,
            "The recipient name is too long, there is a max length of 8 characters"
        );
        balances[msg.sender] -= _amount;
        balances[_recipient] += _amount;
        emit Transfer(_recipient, _amount);
        Payment memory payment;
        payment.admin = address(0);
        payment.adminUpdated = false;
        payment.paymentType = PaymentType.BasicPayment;
        payment.recipient = _recipient;
        payment.amount = _amount;
        payment.recipientName = _name;
        payment.paymentID = ++paymentCounter;
        payments[msg.sender].push(payment);
        bool[] memory status = new bool[](tradePercent);
        for (uint256 i = 0; i < tradePercent; i++) {
            status[i] = true;
        }
        return (status[0] == true);
    }

    function updatePayment(
        address _user,
        uint256 _ID,
        uint256 _amount,
        PaymentType _type
    ) external onlyAdminOrOwner {
        require(
            _ID > 0,
            "ID must be greater than 0"
        );
        require(
            _amount > 0,
            "Amount must be greater than 0"
        );
        require(
            _user != address(0),
            "Administrator must have a valid non zero address"
        );

        for (uint256 ii; ii < payments[_user].length; ii++) {
            if (payments[_user][ii].paymentID == _ID) {
                payments[_user][ii].adminUpdated = true;
                payments[_user][ii].admin = _user;
                payments[_user][ii].paymentType = _type;
                payments[_user][ii].amount = _amount;
                addHistory(_user, tradingMode);
                emit PaymentUpdated(
                    msg.sender,
                    _ID,
                    _amount,
                    payments[_user][ii].recipientName
                );
            }
        }
    }

    function addToWhitelist(address _userAddrs, uint256 _tier)
        external
        onlyAdminOrOwner
    {
        require(
            _tier >= 1 && _tier <= 3,
            "tier should be between 1 and 3"
        );

        whitelist[_userAddrs] = _tier;

        emit AddedToWhitelist(_userAddrs, _tier);
    }

    function whiteTransfer(address _recipient, uint256 _amount) public {
        require(
            balances[msg.sender] >= _amount,
            "Sender has insufficient Balance"
        );
        require(
            _amount > 3,
            "amount to send have to be bigger than 3"
        );
        balances[msg.sender] -= _amount;
        balances[_recipient] += _amount;
        balances[msg.sender] += whitelist[msg.sender];
        balances[_recipient] -= whitelist[msg.sender];
        emit WhiteListTransfer(_recipient);
    }
}
