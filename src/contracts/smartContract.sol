pragma solidity ^0.4.25;

contract ContractIPFS{ 

    struct User {
        string name;
        address account;
        string pubKey;
        uint[] userFiles;
    }
    
    struct File {
        string name;
        address[] usersWithAccess;
        mapping(address => string[]) hash;
    }
    
    File[] filesList;
    
    // maps users by account address
    mapping(address => User[]) usersList;
    
    // constructor to initialize user list
    constructor() public {
        usersList[0x9b08DDFe9F51662E1D0688b84169F9a2053EE343].push(
            User("John",
                0x9b08DDFe9F51662E1D0688b84169F9a2053EE343,
                '-----BEGIN PUBLIC KEY-----\n' +
                'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCiv9f2i3ENZTNtLisetKS8ETKb\n' +
                'A04+Hs9dgy46yJGmqlh3sjRCT6NxxHIq59FF0AWx3g21oOSJbVyh+mzFLuGOILMk\n' +
                'p0tZGdEGP6ybG53eRKlXk/PL99H/U9IT7+9QxhNPpEVjTikmI3Ns29I4g6GqNyEI\n' +
                'wy8wDzYMTmjlzTw3TwIDAQAB\n' +
                '-----END PUBLIC KEY-----',
                new uint[](0))
            );
        usersList[0x0f922FED3E00D6291da863c0f4f6dDF563cB2493].push(
            User("San",
                0x0f922FED3E00D6291da863c0f4f6dDF563cB2493,
                '-----BEGIN PUBLIC KEY-----\n' +
                'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCIzDSRWR6NgjV84q5g0xaGFkEL\n' +
                'btla0MGk2KcheeB77Q+sOYr+tOR52WB3f0/xoLkP97W58Lro9dL4dIz6RcE7ktU1\n' +
                'hP58Beie9FU5KzCV734Uo9qB4jlMwNiVKOZ61EV1xBsA9vn3uZw0cO8tMZy5szJq\n' +
                'cOlSayajglvds+Qe+QIDAQAB\n' +
                '-----END PUBLIC KEY-----\n',
                new uint[](0))
            );
    }

    // modifier that validates if the user is allowed to call the function (if it is in the Users list)
    modifier onlyAuthorized {
        require(usersList[msg.sender].length > 0, "Unauthorized user!");
        _;
    }
    
     // modifier that validates if the user has access to the file (if this is in usersWithAccess)
     modifier hasAccess(uint i) {
        address[] memory users = filesList[i].usersWithAccess;
        bool access = false;
        for (uint p = 0; p < users.length; p++) {
            if (msg.sender == users[p]) {
                access = true;
                break;
            }
        }
        require(access == true, "No file access.");
        _;
    }

    // add a file
    function addFile(string _name, string _hash) onlyAuthorized public {
        filesList.push(File(_name, new address[](0)));
        // adds the user in the access list to the file
        filesList[filesList.length-1].usersWithAccess.push(msg.sender);
        // adds the file in user list
        usersList[msg.sender][0].userFiles.push(filesList.length-1);
        // adds hash to user
        filesList[filesList.length-1].hash[msg.sender].push(_hash);
    }
    
    // getFilesUser return an array with the ids of user files
    function getFilesUser() onlyAuthorized public view returns (uint[]) {
        return (usersList[msg.sender][0].userFiles);
    }

    // get file
    function getFile(uint i) onlyAuthorized hasAccess(i) public view returns (string, address[], string) {
        return (filesList[i].name, filesList[i].usersWithAccess, filesList[i].hash[msg.sender][0]);
    }
    
    // shareFile adds the hash of a file in the filesList, mapped by user
    function shareFile(uint i, address _aUser, string _hash) onlyAuthorized hasAccess(i) public {
        // check if the user selected for the share has permission (if it is in the list)
        require(usersList[_aUser].length > 0, "error");
        // check if the user selected for the share is not himself
        require(_aUser != msg.sender, "error");
        
        filesList[i].usersWithAccess.push(_aUser);
        filesList[i].hash[_aUser].push(_hash);
        // adds the file in user list
        usersList[_aUser][0].userFiles.push(i);
    }

    function getUser(address _aUser) onlyAuthorized public view returns (string, string) {
        // check if the user selected has permission (if it is in the list)
        require(usersList[_aUser].length > 0, "error");
        return (usersList[_aUser][0].name, usersList[_aUser][0].pubKey);
    }
    
}