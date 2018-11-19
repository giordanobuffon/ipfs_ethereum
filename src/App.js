import React, {Component} from 'react';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';
import {Button} from 'reactstrap';

class App extends Component {
    constructor(props) {
        super(props);

        let Crypt = require('hybrid-crypto-js').Crypt;
        this.crypt = new Crypt();

        this.state = {
            ipfsHash: null,
            buffer: '',
            ethAddress: '',
            transactionHash: '',
            txReceipt: '',
            key: '',
            arquivos: [],
            msgEncrypto: '',
            msgDecrypto: '',
            publicKeyJohn: "-----BEGIN PUBLIC KEY-----\n" +
            "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCiv9f2i3ENZTNtLisetKS8ETKb\n" +
            "A04+Hs9dgy46yJGmqlh3sjRCT6NxxHIq59FF0AWx3g21oOSJbVyh+mzFLuGOILMk\n" +
            "p0tZGdEGP6ybG53eRKlXk/PL99H/U9IT7+9QxhNPpEVjTikmI3Ns29I4g6GqNyEI\n" +
            "wy8wDzYMTmjlzTw3TwIDAQAB\n" +
            "-----END PUBLIC KEY-----",
            privateKey: ''
            // "-----BEGIN RSA PRIVATE KEY-----\n" +
            // "MIICXAIBAAKBgQCiv9f2i3ENZTNtLisetKS8ETKbA04+Hs9dgy46yJGmqlh3sjRC\n" +
            // "T6NxxHIq59FF0AWx3g21oOSJbVyh+mzFLuGOILMkp0tZGdEGP6ybG53eRKlXk/PL\n" +
            // "99H/U9IT7+9QxhNPpEVjTikmI3Ns29I4g6GqNyEIwy8wDzYMTmjlzTw3TwIDAQAB\n" +
            // "AoGARFLXnkgx4NbAfTBpp81cbxulLBB6M3gJxA9DRChZhSd0VmO4rrHyQtuetkZ1\n" +
            // "w6IuEdrP1JVD/DGuNs4EBc/Fno7wCb4EkF4nNqHTdFzY29xpuS85q/2y9HwCrA3E\n" +
            // "ZiLJmHnxsNlnZAwUxyhuVJ7K1g8A6JktttCMG/RzZ5/U4tECQQD8lt+600zY0qF7\n" +
            // "YEXYJTJXlwC7y/pyNwcR5EHfPARRtgH3XBHogpJY0qE8/HY9fFNKnMbm/7HmInnD\n" +
            // "VnCTS5LHAkEApPJrcdIpBG7x9xK1FJoA8ybGrYz6H8Z6Du2y8j3uHzEaiods2rX2\n" +
            // "jBCitK2IwrQaUuykGSWe35HxsBUzvNovOQJAZ4DPhvfk6ohNIYhOtoZvfZLj+xBX\n" +
            // "vQutevhkwbwPLQh+/8SblgJDQ+Bzr9DoBsP2QYHCw4+Nb3c7G/9EvCbgqwJAQSDr\n" +
            // "Jc0anwKDjdAYKeNJHrkf16UDmgpPZZebgaTMYgqMdUhVxeH1UIa9B+RBTMe6YSXJ\n" +
            // "AZjmK1a//IvSmu33mQJBAOcthb3RWmMU30HDO/D7K2LLTTfdrG3JwDuYovrmuhrh\n" +
            // "96WXzN9TAXbOVAAPYU53/dIijKn5WUtNSgBpwSOS57Q=\n" +
            // "-----END RSA PRIVATE KEY-----"
        };

        this.getFilesFromSC();
    };

    //Take file input from user
    captureFile = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const file = event.target.files[0];
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => this.convertToBuffer(reader)
    };

    //Convert the file to buffer to store on IPFS
    convertToBuffer = async (reader) => {
        //file is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
        //set this buffer-using es6 syntax
        this.setState({buffer});
    };

    encrypto = async () => {
        // const accounts = await web3.eth.getAccounts();
        // const ethAddress = await storehash.options.address;
        // this.setState({ethAddress});
        // // const a = await storehash.methods.getHash().call;
        // // console.log("a: ", a);
        // storehash.methods.getHash().call({
        //         from: accounts[0]
        //     }, (error, transactionHash) => {
        //         console.log(transactionHash);
        //         this.setState({msgOrigin: transactionHash});
        //     });

        const encrypted = this.crypt.encrypt(this.state.publicKeyJohn, this.state.buffer);
        console.log(encrypted.toString());
        this.setState({msgEncrypto: encrypted});
        const buffer = await Buffer.from(encrypted);
        await ipfs.add(buffer, (err, ipfsHash) => {
            console.log(err, ipfsHash);
            //setState by setting ipfsHash to ipfsHash[0].hash
            this.setState({ipfsHash: ipfsHash[0].hash});
        })
    };

    decrypto = async () => {
        let md = this.crypt.decrypt(this.state.privateKey, this.state.msgEncrypto);
        this.setState({msgDecrypto: md.message});
        console.log(md.message);
    };

    getKey = (event) => {
        let reader = new FileReader();

        let file = event.target.files[0];
        reader.readAsText(file);
        reader.onloadend = () => {
            this.setState({privateKey: reader.result});
        };
    };

    onSubmit = async (event) => {
        event.preventDefault();
        //bring in user's metamask account address
        const accounts = await web3.eth.getAccounts();
        //obtain contract address from storehash.js
        const ethAddress = await storehash.options.address;
        this.setState({ethAddress});
        //save document to IPFS,return its hash#, and set hash# to state
        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
            console.log(err, ipfsHash);
            //setState by setting ipfsHash to ipfsHash[0].hash
            this.setState({ipfsHash: ipfsHash[0].hash});
            // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract
            //return the transaction hash from the ethereum contract
            storehash.methods.setHash(this.state.ipfsHash).send({
                from: accounts[0]
            }, (error, transactionHash) => {
                console.log(transactionHash);
                this.setState({transactionHash});
            });
        })
    };

    getFilesFromSC = async () => {
        // bring in user's metamask account address
        const accounts = await web3.eth.getAccounts();
        storehash.methods.getTodosArquivosUsuario().call({
            from: accounts[0]
        }, (error, result) => {
            if (error) {
                console.log("error: ", error);
            } else {
                console.log("result: ", result);

                for (let i = 0; i < result.length; i++) {
                    storehash.methods.getArquivo(i).call({
                        from: accounts[0]
                    }, (error, result) => {
                        if (error) {
                            console.log("error: ", error);
                        } else {
                            let arquivo = {
                                id: i,
                                nome: result[0],
                                usuariosAcesso: result[1],
                                hash: result[2]
                            };
                            let newArray = this.state.arquivos.slice();
                            newArray.push(arquivo);
                            this.setState({arquivos: newArray});
                        }
                    });
                }
            }
        });

    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>Ethereum e IPFS</h1>
                </header>
                <hr/>
                {this.state.arquivos.length > 0 ?
                    this.state.arquivos.map((arquivo) => {
                        return <p key={arquivo.id}>
                            {arquivo.nome}.  .
                            {arquivo.usuariosAcesso}.  .
                            {arquivo.hash}
                        </p>
                    }) : ""
                }
                <hr/>
                <h3> Escolha um arquivo para enviar para a blockchain</h3>
                <form>
                    <input
                        type="file"
                        onChange={this.captureFile}
                    />
                </form>
                <hr/>
                <Button onClick={this.encrypto}>Encrypto</Button>
                <p>IPFS Hash</p>
                <a href={`https://ipfs.io/ipfs/` + this.state.ipfsHash} target="_blank"
                   rel="noopener noreferrer">{this.state.ipfsHash}</a>
                <hr/>
                <input
                    type="file"
                    onChange={this.getKey}
                />
                <p>{this.state.privateKey}</p>
                <Button onClick={this.decrypto}>Decrypto</Button>
                <p>{this.state.msgDecrypto}</p>
                <hr/>
            </div>
        );
    }
}

export default App;