import web3 from './web3';
//Your contract address
const address = '0xD2c0b6BABd175ABcF937b12AE3c634fb1229605d';
//Your contract ABI
const abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "i",
                "type": "uint256"
            },
            {
                "name": "nUser",
                "type": "address"
            },
            {
                "name": "_hash",
                "type": "string"
            }
        ],
        "name": "compartilharArquivo",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_nome",
                "type": "string"
            },
            {
                "name": "_hash",
                "type": "string"
            }
        ],
        "name": "criarArquivo",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "i",
                "type": "uint256"
            }
        ],
        "name": "getArquivo",
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
        "name": "getTodosArquivosUsuario",
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
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }
];

export default new web3.eth.Contract(abi, address);