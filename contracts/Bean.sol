// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ITRC21.sol";
import "./SafeMath.sol";

/**
 * @title Standard TRC21 token
 * @dev Implementation of the basic standard token.
 */
contract Bean is ITRC21 {
    using SafeMath for uint256;

    mapping(address => uint256) private _balances;
    uint256 private _minFee;
    address private _issuer;
    mapping(address => mapping(address => uint256)) private _allowed;
    uint256 private _totalSupply;

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    constructor() public {
        _name = "MR Bean";
        _symbol = "BC";
        _decimals = 10;
        _mint(msg.sender, 1000000000000 * 10**18);
        _changeIssuer(msg.sender);
        _changeMinFee(0);
    }

    /**
     * @return the name of the token.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @return the symbol of the token.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @return the number of decimals of the token.
     */
    function decimals() public view returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Total number of tokens in existence
     */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev  The amount fee that will be lost when transferring.
     */
    function minFee() public view returns (uint256) {
        return _minFee;
    }

    /**
     * @dev token's foundation
     */
    function issuer() public view returns (address) {
        return _issuer;
    }

    /**
     * @dev Gets the balance of the specified address.
     * @param owner The address to query the balance of.
     * @return An uint256 representing the amount owned by the passed address.
     */
    function balanceOf(address owner) public view returns (uint256) {
        return _balances[owner];
    }

    /**
     * @dev Estimate transaction fee.
     * @param value amount tokens sent
     */
    function estimateFee(uint256 value) public view returns (uint256) {
        return value.mul(0).add(_minFee);
    }

    /**
     * @dev Function to check the amount of tokens that an owner allowed to a spender.
     * @param owner address The address which owns the funds.
     * @param spender address The address which will spend the funds.
     * @return A uint256 specifying the amount of tokens still available for the spender.
     */
    function allowance(address owner, address spender)
        public
        view
        returns (uint256)
    {
        return _allowed[owner][spender];
    }

    /**
     * @dev Transfer token for a specified address
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    function transferWithFee(
        address to,
        uint256 value,
        uint256 transferFee
    ) public returns (bool) {
        uint256 total = value.add(transferFee);
        require(to != address(0));
        require(value <= total);
        _transfer(msg.sender, to, value);
        if (transferFee > 0) {
            _transfer(msg.sender, _issuer, transferFee);
            emit Fee(msg.sender, to, _issuer, transferFee);
        }
        return true;
    }

    /**
     * @dev Transfer token for a specified address
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    function transfer(address to, uint256 value) public returns (bool) {
        uint256 total = value.add(_minFee);
        require(to != address(0));
        require(value <= total);
        _transfer(msg.sender, to, value);
        if (_minFee > 0) {
            _transfer(msg.sender, _issuer, _minFee);
            emit Fee(msg.sender, to, _issuer, _minFee);
        }
        return true;
    }

    /**
     * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
     * Beware that changing an allowance with this method brings the risk that someone may use both the old
     * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
     * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     */
    function approve(address spender, uint256 value) public returns (bool) {
        require(spender != address(0));
        require(_balances[msg.sender] >= _minFee);
        _allowed[msg.sender][spender] = value;
        _transfer(msg.sender, _issuer, _minFee);
        emit Approval(msg.sender, spender, value);
        return true;
    }

    /**
     * @dev Transfer tokens from one address to another
     * @param from address The address which you want to send tokens from
     * @param to address The address which you want to transfer to
     * @param value uint256 the amount of tokens to be transferred
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool) {
        uint256 total = value.add(_minFee);
        require(to != address(0));
        require(value <= total);
        require(total <= _allowed[from][msg.sender]);

        _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(total);
        _transfer(from, to, value);
        _transfer(from, _issuer, _minFee);
        emit Fee(msg.sender, to, _issuer, _minFee);
        return true;
    }

    function setMinFee(uint256 value) public {
        require(msg.sender == issuer());
        _changeMinFee(value);
    }

    /**
     * @dev Function to mint tokens
     * @param to The address that will receive the minted tokens.
     * @param value The amount of tokens to mint.
     * @return A boolean that indicates if the operation was successful.
     */
    // function mint(address to, uint256 value) public onlyMinter returns (bool) {
    //     _mint(to, value);
    //     return true;
    // }

    /**
     * @dev Function to transfer from 1 to array of addresses
     * @param addresses array of addresses
     * @param values array of values
     * @param fee fee to send token
     * @return return i
     */
    function multiSend(
        address[] memory addresses,
        uint256[] memory values,
        uint256 fee
    ) public returns (uint256) {
        uint256 i = 0;
        while (i < addresses.length) {
            transferWithFee(addresses[i], values[i], fee);
            i += 1;
        }
        return (i);
    }

    /**
     * @dev Function to burn tokens
     * @param value The amount of tokens to mint.
     * @return A boolean that indicates if the operation was successful.
     */
    function burn(uint256 value) public returns (bool) {
        _burn(msg.sender, value);
        return true;
    }

    /**
     * @dev Transfer token for a specified addresses
     * @param from The address to transfer from.
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    function _transfer(
        address from,
        address to,
        uint256 value
    ) internal {
        require(value <= _balances[from]);
        require(to != address(0));
        _balances[from] = _balances[from].sub(value);
        _balances[to] = _balances[to].add(value);
        emit Transfer(from, to, value);
    }

    /**
     * @dev Internal function that mints an amount of the token and assigns it to
     * an account. This encapsulates the modification of balances such that the
     * proper events are emitted.
     * @param account The account that will receive the created tokens.
     * @param value The amount that will be created.
     */
    function _mint(address account, uint256 value) internal {
        require(account != address(0));
        _totalSupply = _totalSupply.add(value);
        _balances[account] = _balances[account].add(value);
        emit Transfer(address(0), account, value);
    }

    /**
     * @dev Internal function that burns an amount of the token of a given
     * account.
     * @param account The account whose tokens will be burnt.
     * @param value The amount that will be burnt.
     */
    function _burn(address account, uint256 value) internal {
        require(account != address(0));
        require(value <= _balances[account]);

        _totalSupply = _totalSupply.sub(value);
        _balances[account] = _balances[account].sub(value);
        emit Transfer(account, address(0), value);
    }

    /**
     * @dev Transfers token's foundation to new issuer
     * @param newIssuer The address to transfer ownership to.
     */
    function _changeIssuer(address newIssuer) internal {
        require(newIssuer != address(0));
        _issuer = newIssuer;
    }

    /**
     * @dev Change minFee
     * @param value minFee
     */
    function _changeMinFee(uint256 value) internal {
        _minFee = value;
    }
}

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping(address => bool) bearer;
    }

    /**
     * @dev give an account access to this role
     */
    function add(Role storage role, address account) internal {
        require(account != address(0));
        require(!has(role, account));

        role.bearer[account] = true;
    }

    /**
     * @dev remove an account's access to this role
     */
    function remove(Role storage role, address account) internal {
        require(account != address(0));
        require(has(role, account));

        role.bearer[account] = false;
    }

    /**
     * @dev check if an account has this role
     * @return bool
     */
    function has(Role storage role, address account)
        internal
        view
        returns (bool)
    {
        require(account != address(0));
        return role.bearer[account];
    }
}

contract MinterRole {
    using Roles for Roles.Role;

    event MinterAdded(address indexed account);
    event MinterRemoved(address indexed account);

    Roles.Role private minters;

    constructor() public {
        _addMinter(msg.sender);
    }

    modifier onlyMinter() {
        require(isMinter(msg.sender));
        _;
    }

    function isMinter(address account) public view returns (bool) {
        return minters.has(account);
    }

    function addMinter(address account) public onlyMinter {
        _addMinter(account);
    }

    function renounceMinter() public {
        _removeMinter(msg.sender);
    }

    function _addMinter(address account) internal {
        minters.add(account);
        emit MinterAdded(account);
    }

    function _removeMinter(address account) internal {
        minters.remove(account);
        emit MinterRemoved(account);
    }
}

// contract Bean is TRC21, MinterRole {
//     string private _name;
//     string private _symbol;
//     uint8 private _decimals;

//     constructor() public {
//         _name = "BeanSwapToken";
//         _symbol = "BST";
//         _decimals = 10;
//         _mint(msg.sender, 1000000000);
//         _changeIssuer(msg.sender);
//         _changeMinFee(0);
//     }

//     /**
//      * @return the name of the token.
//      */
//     function name() public view returns (string memory) {
//         return _name;
//     }

//     /**
//      * @return the symbol of the token.
//      */
//     function symbol() public view returns (string memory) {
//         return _symbol;
//     }

//     /**
//      * @return the number of decimals of the token.
//      */
//     function decimals() public view returns (uint8) {
//         return _decimals;
//     }

//     function setMinFee(uint256 value) public {
//         require(msg.sender == issuer());
//         _changeMinFee(value);
//     }

//     /**
//      * @dev Function to mint tokens
//      * @param to The address that will receive the minted tokens.
//      * @param value The amount of tokens to mint.
//      * @return A boolean that indicates if the operation was successful.
//      */
//     function mint(address to, uint256 value) public onlyMinter returns (bool) {
//         _mint(to, value);
//         return true;
//     }

//     /**
//      * @dev Function to transfer from 1 to array of addresses
//      * @param addresses array of addresses
//      * @param values array of values
//      * @param fee fee to send token
//      * @return return i
//      */
//     function multiSend(
//         address[] addresses,
//         uint256[] values,
//         uint256 fee
//     ) public returns (uint256) {
//         uint256 i = 0;
//         while (i < addresses.length) {
//             transfer(addresses[i], values[i], fee);
//             i += 1;
//         }
//         return (i);
//     }

//     /**
//      * @dev Function to burn tokens
//      * @param value The amount of tokens to mint.
//      * @return A boolean that indicates if the operation was successful.
//      */
//     function burn(uint256 value) public returns (bool) {
//         _burn(msg.sender, value);
//         return true;
//     }
// }
