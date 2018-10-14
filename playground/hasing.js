const SHA256 = require('crypto-js/sha256');
const jwt = require('jsonwebtoken');

let data = {
    id: 10
};

let token = jwt.sign(data, '123abc');
let verify = jwt.verify(token, '123abc');

console.log(token);
console.log('decoded', verify);

// let string = 'Eksa Pramindanata';
// let hash = SHA256(string + 'salt').toString();

// console.log(`Message: ${string}`);
// console.log(`Hash: ${hash}`);

// let data = {
//     id: 4
// };
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data + 'garam segar')).toString()
// }

// let result = SHA256(JSON.stringify(data + 'garam segar')).toString();

// if (token.hash === result) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed');
// }