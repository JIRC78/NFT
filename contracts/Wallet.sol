// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.0;
 
contract WalletMultisig{
address [] public owners;
uint public requiredApprovals;
mapping (address => bool)   public isOwner;
 
struct Transaction{
    address to;
    uint amount;
    uint approvalCount;
    bool executed;
}
Transaction [] public transactions;
mapping (uint => mapping (address => bool)) public approvals;
event Deposit(address indexed sender , uint amount);
 
constructor (address [] memory _owners, uint _requiredApprovals){
    require(_owners.length>0,"Debes tener owners");
    require(_requiredApprovals>0 && _requiredApprovals<= _owners.length,"Numero invalido de aprovaciones");
    for (uint i = 0;i<_owners.length; i++) {
        isOwner[_owners[i]] = true;
       
    }
    _owners=_owners;
    requiredApprovals=_requiredApprovals;
}
modifier onlyOwner(){
    require(isOwner[msg.sender],"No es un owner");
    _;
}
    function submitTransaction(address _to, uint _amount) public onlyOwner {
        transactions.push(Transaction({
            to: _to,
            amount: _amount,
            approvalCount: 0,
            executed: false
        }));
    }
function approveTransaction(uint _transactionId)public onlyOwner{
    Transaction storage transaction = transactions[_transactionId];
    require(!transaction.executed,"Transaccion ya executada");
    require(!approvals [_transactionId][msg.sender],"Ya aprobada");
    approvals[_transactionId][msg.sender]= true;
    transaction.approvalCount+=1;
   
}
function executeTransaction (uint _transactionId) public onlyOwner{
    Transaction storage transaction = transactions[_transactionId];
    require(transaction.approvalCount>= requiredApprovals,"No suficientes aprobaciones");
    require(!transaction .executed,"Transaccion ya executada");
    transaction.executed=true;
    payable(transaction.to).transfer(transaction.amount);
}
function getTransactions() public view returns(Transaction [] memory){
    return transactions;
   
}
function deposit()public payable {
    require(msg.value>0,"Debes mandar ether");
    emit Deposit(msg.sender, msg.value);
 
   
}
}