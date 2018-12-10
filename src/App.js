import React, {Component} from 'react';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';
import {Button} from 'reactstrap';
import AppBar from "./AppBar";
import InteractiveList from "./InteractiveList";
import Btn from "./Btn";
import Typography from "@material-ui/core/es/Typography/Typography";

class App extends Component {
    constructor(props) {
        super(props);

        let Crypt = require('hybrid-crypto-js').Crypt;
        this.crypt = new Crypt();

        this.state = {
            ipfsHash: null,
            buffer: '',
            fileName: '',
            ethAddress: '',
            transactionHash: '',
            txReceipt: '',
            key: '',
            files: [],
            msgEncrypto: '',
            msgDecrypto: 'nada',
            userName: '',
            pubKey: '',
            privateKey: ''
        };

        this.getFilesFromSC();

    };

    // Take file input from user
    captureFile = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const file = event.target.files[0];
        this.setState({fileName: file.name});
        if (file) {
            let reader = new window.FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => this.convertToBuffer(reader)
        }
    };

    // Convert the file to buffer to store on IPFS
    convertToBuffer = async (reader) => {
        //file is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
        //set this buffer-using es6 syntax
        this.setState({buffer});
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

    uploadFile = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (event.target.files[0]) {
            this.captureFile(event);

            //bring in user's metamask account address
            const accounts = await web3.eth.getAccounts();
            storehash.methods.getUser(accounts[0]).call({
                    from: accounts[0]
                }, async (errGetUser, resGetUser) => {
                    if (errGetUser) {
                        console.log("error getUser: ", errGetUser);
                    } else {
                        this.setState({userName: resGetUser[0]});
                        this.setState({pubKey: resGetUser[1]});
                        const encrypted = this.crypt.encrypt(this.state.pubKey, this.state.buffer);
                        this.setState({msgEncrypto: encrypted});

                        const buffer = await Buffer.from(encrypted);
                        await ipfs.add(buffer, (err, ipfsHash) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(ipfsHash);
                                //setState by setting ipfsHash to ipfsHash[0].hash
                                this.setState({ipfsHash: ipfsHash[0].hash});
                                storehash.methods.addFile(this.state.fileName, this.state.ipfsHash).send({
                                    from: accounts[0]
                                }, (errorAddFile, transactionHash) => {
                                    if (errorAddFile) {
                                        console.log("error addFile: ", errorAddFile);
                                    } else {
                                        console.log(transactionHash);
                                        this.setState({transactionHash});
                                    }
                                });
                            }
                        })
                    }
                }
            );
        }
    };

    getFilesFromSC = async () => {
        // bring in user's metamask account address
        const accounts = await web3.eth.getAccounts();
        storehash.methods.getFilesUser().call({
            from: accounts[0]
        }, (errAllFiles, resAllFiles) => {
            if (errAllFiles) {
                console.log("error getFilesFromSC: ", errAllFiles);
            } else {
                // console.log("result: ", resAllFiles);
                for (let i = 0; i < resAllFiles.length; i++) {
                    storehash.methods.getFile(resAllFiles[i]).call({
                        from: accounts[0]
                    }, (errGetFile, resGetFile) => {
                        if (errGetFile) {
                            console.log("error getFile: ", errGetFile);
                        } else {
                            let file = {
                                id: i,
                                name: resGetFile[0],
                                usersWithAccess: resGetFile[1],
                                hash: resGetFile[2]
                            };
                            let newArray = this.state.files.slice();
                            newArray.push(file);
                            this.setState({files: newArray});
                        }
                    });
                }
            }
        });

    };

    // TODO validate account for the share https://web3js.readthedocs.io/en/1.0/web3-utils.html?highlight=isAddress#isaddress

    render() {
        return (
            <div className="App">
                <AppBar/>
                <Typography variant="subtitle1" color="inherit">
                    Escolha um arquivo para enviar para a blockchain
                </Typography>
                <Btn uploadFile={this.uploadFile}/>
                <hr/>
                <p>IPFS Hash</p>
                <a href={`https://ipfs.io/ipfs/` + this.state.ipfsHash} target="_blank"
                   rel="noopener noreferrer">{this.state.ipfsHash}</a>
                <hr/>
                <input
                    type="file"
                    onChange={this.getKey}
                />
                <Button onClick={this.decrypto}>Decrypto</Button>
                <p>{this.state.msgDecrypto}</p>
                <hr/>
                <InteractiveList files={this.state.files}/>
            </div>
        );
    }
}

export default App;