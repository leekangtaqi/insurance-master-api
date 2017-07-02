class WechatAppBizCipherer {
  
  verifySignature(rawData, sessionKey, signature) {
    if (typeof rawData === 'object') {
      rawData = JSON.stringify(rawData)
    }
    sha1 = crypto.createHash('sha1')
    sha1.update(rawData + sessionKey)
    return sha1.digest('hex') === signature
  }

  decode(rawData, sessionKey, signature, encryptedData, iv) {
    if(!this.verifySignature(rawData, sessionKey, signature)) {
      return 
    }
    sessionKey = new Buffer(sessionKey, 'base64')
    encryptedData = new Buffer(encryptedData, 'base64')
    iv = new Buffer(iv, 'base64')

    try {
      let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
      decipher.setAutoPadding(true)
      let decoded = decipher.update(encryptedData, 'binary', 'utf8')
      decoded += decipher.final('utf8')
      decoded = JSON.parse(decoded)
    } catch (err) {
      throw new Error('Illegal Buffer')
    }

    if (decoded.watermark.appid !== this.appId) {
      throw new Error('Illegal Buffer')
    }

    return decoded
  }
}

export default WechatAppBizCipherer