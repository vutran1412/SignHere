const db = require('level')('./data/star')
const bitcoinMessage = require('bitcoinjs-message')

// Validation class, this will be used to validate wallet address, signature and star registration request
class Validation {
	constructor (req) {
    this.req = req
  }

  // Address parameter must not be empty when sending the post request
  validateAddressParameter() {
    if (!this.req.body.address) {
      throw new Error('Fill the address parameter')
    }

    return true
  }

  // Signature parameter must not be empty when sending the post request
  validateSignatureParameter() {
    if (!this.req.body.signature) {
      throw new Error('Fill the signature parameter')
    }
  }

  // Validate the new star registration request, the request parameters must be strings and must not be empty
  validateNewStarRequest() {
    const MAX_STORY_BYTES = 500
    const { star } = this.req.body
    const { dec, ra, story} = star

    // The address and the body of the star request must not be empty
    if (!this.validateAddressParameter() || !this.req.body.star) {
      throw new Error('Fill the address and star parameters')
    }

    // The star properties ra, dec, and story cannot be empty and must be in strings
    if (typeof dec !== 'string' || typeof ra !== 'string' || typeof story !== 'string' || !dec.length || !ra.length || !story.length) {
      throw new Error("Your star information should include non-empty string properties 'dec', 'ra' and 'story'")
    }

    // Star story cannot exceed max bytes of 500
    if (new Buffer(story).length > MAX_STORY_BYTES) {
      throw new Error('Your star story is too long. Maximum size is 500 bytes')
    }

    // Story must contain only ASCII symbols
    const isASCII = ((str) => /^[\x00-\x7F]*$/.test(str))

    if (!isASCII(story)) {
      throw new Error('Your star story contains non-ASCII symbols')
    }
  }

  // Check to see if the wallet address has been validated
  isValid() {
    return db.get(this.req.body.address)
      .then((value) => {
        value = JSON.parse(value)
        return value.messageSignature === 'valid'
      })
      .catch(() => {throw new Error('Not authorized')})
  }

  // Remove the address from from list of validated address in db
  invalidate(address) {
    db.del(address)
  }

  // Message signature must be signed in the bitcoin wallet in 5 minute or less
  async validateMessageSignature(address, signature) {
    return new Promise((resolve, reject) => {
      db.get(address, (error, value) => {
        if (value === undefined) {
          return reject(new Error('Not found'))
        } else if (error) {
          return reject(error)
        }

        value = JSON.parse(value)

        if (value.messageSignature === 'valid') {
          return resolve({
            registerStar: true,
            status: value
        }) 
        } else {
          const nowSubFiveMinutes = Date.now() - (5 * 60 * 1000)
          const isExpired = value.requestTimeStamp < nowSubFiveMinutes
          let isValid = false
  
          if (isExpired) {
              value.validationWindow = 0
              value.messageSignature = 'Validation window was expired'
          } else {
              value.validationWindow = Math.floor((value.requestTimeStamp - nowSubFiveMinutes) / 1000) 
  
              try {
                isValid = bitcoinMessage.verify(value.message, address, signature)
              } catch (error) {
                isValid = false
              }
            
              value.messageSignature = isValid ? 'valid' : 'invalid'
          }
  
          db.put(address, JSON.stringify(value))
  
          return resolve({
              registerStar: !isExpired && isValid,
              status: value
          }) 
        }
      })
    })
  }

  // Save the wallet address and data in db, and return the message to in a response
  saveNewRequestValidation(address) {
    const timestamp = Date.now()
    const message = `${address}:${timestamp}:starRegistry`
    const validationWindow = 300
  
    const data = {
      address: address,
      message: message,
      requestTimeStamp: timestamp,
      validationWindow: validationWindow
    }
  
    db.put(data.address, JSON.stringify(data))

    return data
  }

  // Retrieve the pending request address from the db and check to see if the validation window has expired
  async getPendingAddressRequest(address) {
    return new Promise((resolve, reject) => {
      db.get(address, (error, value) => {
        if (value === undefined) {
          return reject(new Error('Not found'))
        } else if (error) {
          return reject(error)
        }

        value = JSON.parse(value)

        const nowSubFiveMinutes = Date.now() - (5 * 60 * 1000)
        const isExpired = value.requestTimeStamp < nowSubFiveMinutes

        // If validation window is expired then a new request with the same address must be made to continue
        if (isExpired) {
            resolve(this.saveNewRequestValidation(address))
        } else {
          const data = {
            address: address,
            message: value.message,
            requestTimeStamp: value.requestTimeStamp,
            validationWindow: Math.floor((value.requestTimeStamp - nowSubFiveMinutes) / 1000)
          }

          resolve(data)
        }
      })
    })
  }
}

module.exports = Validation
