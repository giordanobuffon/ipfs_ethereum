import web3 from './web3';
//Your contract address
const address = '0x52b0b7e238743289f41659d7ec2d7f76ad93aaf7';
//Your contract ABI
const abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_name",
                "type": "string"
            },
            {
                "name": "_hash",
                "type": "string"
            }
        ],
        "name": "addFile",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "i",
                "type": "uint256"
            },
            {
                "name": "_aUser",
                "type": "address"
            },
            {
                "name": "_hash",
                "type": "string"
            }
        ],
        "name": "shareFile",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "i",
                "type": "uint256"
            }
        ],
        "name": "getFile",
        "outputs": [
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "address[]"
            },
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getFilesUser",
        "outputs": [
            {
                "name": "",
                "type": "uint256[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_aUser",
                "type": "address"
            }
        ],
        "name": "getUser",
        "outputs": [
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

export default new web3.eth.Contract(abi, address);