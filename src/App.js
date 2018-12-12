import React, {Component} from 'react';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';
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
            transactionHash: '',
            files: [],
            userName: '',
            pubKey: '',
            privKey: '',
            time: {
                initial: 0,
                final: 0,
                iEncrypt: 0,
                fEncrypt: 0,
                iDecrypt: 0,
                fDecrypt: 0,
                iBufFile: 0,
                fBufFile: 0,
                iFileBuffer: 0,
                fFileBuffer: 0,
                iBufEncrypt: 0,
                fBufEncrypt: 0,
                iIpfsAdd: 0,
                fIpfsAdd: 0,
                iIpfsGet: 0,
                fIpfsGet: 0,
                iScAddFile: 0,
                fScAddFile: 0
            }
        };

        this.getFilesFromSC();

    };

    zera() {
        this.setState({
            time: {
                initial: 0,
                final: 0,
                iDecrypt: 0,
                fDecrypt: 0,
                iBufFile: 0,
                fBufFile: 0,
                iIpfsGet: 0,
                fIpfsGet: 0
            }
        });
    }

    getTime(time) {
        let d = new Date();
        this.setState(
            (e) => e.time[time] = d.getTime()
        );
        // console.log(time, d.getTime());
    }

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
        this.getTime("iFileBuffer");
        //file is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
        //set this buffer-using es6 syntax
        this.setState({buffer});
        this.getTime("fFileBuffer");
    };

    getKey = (event) => {
        let reader = new FileReader();
        if (event.target.files[0]) {
            let file = event.target.files[0];
            reader.readAsText(file);
            reader.onloadend = () => {
                this.setState({privKey: reader.result});
            };
        }
    };

    uploadFile = async (event) => {
        this.getTime("initial");
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

                        this.getTime("iEncrypt");
                        const encrypted = this.crypt.encrypt(this.state.pubKey, this.state.buffer);
                        this.getTime("fEncrypt");

                        this.getTime("iBufEncrypt");
                        const buffer = await Buffer.from(encrypted);
                        this.getTime("fBufEncrypt");

                        this.getTime("iIpfsAdd");
                        await ipfs.add(buffer, (err, ipfsHash) => {
                            if (err) {
                                console.log(err);
                            } else {
                                this.getTime("fIpfsAdd");

                                console.log(ipfsHash);
                                //setState by setting ipfsHash to ipfsHash[0].hash
                                this.setState({ipfsHash: ipfsHash[0].hash});

                                this.getTime("iScAddFile");
                                storehash.methods.addFile(this.state.fileName, this.state.ipfsHash).send({
                                    from: accounts[0]
                                }, (errorAddFile, transactionHash) => {
                                    if (errorAddFile) {
                                        console.log("error addFile: ", errorAddFile);
                                    } else {
                                        this.getTime("fScAddFile");
                                        console.log(transactionHash);
                                        this.setState({transactionHash});
                                        this.getTime("final");
                                    }
                                });
                            }
                        })
                    }
                }
            );
        }
    };

    downloadFile = async (hash, name) => {

        this.zera();

        this.getTime("initial");
        this.setState({fileName: name});

        this.getTime("iIpfsGet");

        await ipfs.get(hash, (err, ipfsResult) => {
            if (err) {
                console.log(err);
            } else {
                this.getTime("fIpfsGet");

                console.log("sucesso ", ipfsResult[0].content.toString());

                this.getTime("iDecrypt");
                let md = this.crypt.decrypt(this.state.privKey, ipfsResult[0].content.toString());
                this.getTime("fDecrypt");

                // console.log(md);
                this.getTime("iBufFile");
                const file = new Blob([md.message], {type: '.txt'});
                let url = window.URL.createObjectURL(file);
                let down = document.createElement('a');
                down.href = url;
                down.setAttribute('download', name);
                down.click();
                this.getTime("fBufFile");
                this.getTime("final");
            }
        })
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
                            newArray.sort(function (a, b) {
                                if (a.name > b.name) {
                                    return -1;
                                } else if (a.name < b.name) {
                                    return 1;
                                } else return 0;
                            });
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
                <a href={`https://ipfs.io/ipfs/` + this.state.ipfsHash}
                   target="_blank"
                   rel="noopener noreferrer">{this.state.ipfsHash}
                </a>
                <hr/>
                <input
                    type="file"
                    onChange={this.getKey}
                />
                <hr/>
                <p>Nome {this.state.fileName}</p>
                {/*UPLOAD*/}
                {/*<p>Buffer File {this.state.time.fFileBuffer - this.state.time.iFileBuffer}</p>*/}
                {/*<p>Encrypt {this.state.time.fEncrypt - this.state.time.iEncrypt}</p>*/}
                {/*<p>Buffer Encrypt {this.state.time.fBufEncrypt - this.state.time.iBufEncrypt}</p>*/}
                {/*<p>IPFS add {this.state.time.fIpfsAdd - this.state.time.iIpfsAdd}</p>*/}
                {/*<p>SC add {this.state.time.fScAddFile - this.state.time.iScAddFile}</p>*/}

                {/*DOWNLOAD*/}
                <p>IPFS get {this.state.time.fIpfsGet - this.state.time.iIpfsGet}</p>
                <p>Decrypt {this.state.time.fDecrypt - this.state.time.iDecrypt}</p>
                <p>Buf to File {this.state.time.fBufFile - this.state.time.iBufFile}</p>

                <p>Total {this.state.time.final - this.state.time.initial}</p>
                <hr/>
                <InteractiveList
                    files={this.state.files}
                    downloadFile={(hash, name) => {
                        this.downloadFile(hash, name);
                    }}/>
            </div>
        );
    }
}

export default App;