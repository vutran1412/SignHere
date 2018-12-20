# Project

Private blockchain with RESTful API that allows users to register ownership of a star using their bitcoin wallet address.

# Framework used

Express.js

# Project requirements

* Postman to test api endpoints
..- You can also use cURL to test endpoints in terminal
* A bitcoin wallet (Electrum or Bitcoincore wallet works)
..- Although you can run test on the app without either

# Getting Started

make sure you have node installed on you machine

clone this repository to your machine

```
git clone https://github.com/vutran1412/SignHere.git
```

change into the cloned repo directory

```
cd SignHere
```

install the node modules

```
npm install 
```

in your project root directory create a new directory called data. **This is important!**

```
mkdir data
```

to run tests

```
npm test
```

to start the server

```
node app.js
```

open up postman and make a request to endpoint POST /localhost:8000/requestValidation

<img width="1392" alt="screen shot 2018-12-20 at 12 20 22 pm" src="https://user-images.githubusercontent.com/25469710/50306038-2375c800-045a-11e9-9341-ca43b78ad6a5.png">

