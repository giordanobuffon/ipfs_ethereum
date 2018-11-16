import web3 from './web3';
//Your contract address
const address = '0x2664a1e660d9792893e8e060ee6c47830c01c243';
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
    }
];

export default new web3.eth.Contract(abi, address);