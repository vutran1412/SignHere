# Project

Private blockchain with RESTful API that allows users to register ownership of a star using their bitcoin wallet address.

# Framework used

Express.js

# Project requirements

* Postman to test api endpoints (You can also use cURL to test endpoints in terminal).
* A bitcoin wallet (Electrum or Bitcoincore wallet works)

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

<img width="1139" alt="screen shot 2018-12-20 at 3 13 17 pm" src="https://user-images.githubusercontent.com/25469710/50311150-cf72df80-0469-11e9-8037-c1860e8cac54.png">

to start the server

```
node app.js
```
# POST requests
open up postman and make a request to endpoint POST /localhost:8000/requestValidation

<img width="1392" alt="screen shot 2018-12-20 at 2 47 37 pm" src="https://user-images.githubusercontent.com/25469710/50309971-44441a80-0466-11e9-8ff3-6d64dc739bdd.png">

sign the message in electrum wallet

<img width="952" alt="screen shot 2018-12-20 at 2 47 16 pm" src="https://user-images.githubusercontent.com/25469710/50310000-5920ae00-0466-11e9-96b9-de258bbef554.png">

send the POST request to localhost:8000/message-signature/validate with the wallet address and signature as the body

<img width="1392" alt="screen shot 2018-12-20 at 2 49 42 pm" src="https://user-images.githubusercontent.com/25469710/50310192-de0bc780-0466-11e9-99e0-30192b844f65.png">

if both the address and signature are valid, the address is now allowed to register a star

<img width="1392" alt="screen shot 2018-12-20 at 2 49 49 pm" src="https://user-images.githubusercontent.com/25469710/50310318-45c21280-0467-11e9-83af-b5aee2bc1477.png">

to register a star use the POST endpoint /localhost:8000/block
the star body cannot be empty

<img width="1392" alt="screen shot 2018-12-20 at 2 57 44 pm" src="https://user-images.githubusercontent.com/25469710/50310544-f03a3580-0467-11e9-9376-5f5e94a39515.png">

if successful, the block will be added to the blockchain. The block will contain the previous block's hash, current hash, timestamp, and the registered star information

<img width="1392" alt="screen shot 2018-12-20 at 3 01 01 pm" src="https://user-images.githubusercontent.com/25469710/50310654-4313ed00-0468-11e9-87a2-71849343cb62.png">

# GET Requests

GET /localhost:8000/block/{height} to get the block by height

<img width="1392" alt="screen shot 2018-12-20 at 3 06 38 pm" src="https://user-images.githubusercontent.com/25469710/50310836-dfd68a80-0468-11e9-81a1-beaa2ddca9f0.png">

GET /localhost:8000/stars/hash:{hash} to get block by hash value

<img width="1392" alt="screen shot 2018-12-20 at 3 08 01 pm" src="https://user-images.githubusercontent.com/25469710/50310911-12808300-0469-11e9-8e45-bc0f6b1681a6.png">

GET /localhost:8000/stars/address:{wallet address} to get all the stars registered to the address

<img width="1392" alt="screen shot 2018-12-20 at 3 09 58 pm" src="https://user-images.githubusercontent.com/25469710/50311051-7a36ce00-0469-11e9-820e-216efb23ebc2.png">
