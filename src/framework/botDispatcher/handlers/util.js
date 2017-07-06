module.exports = {
  vCodeNeeded(vCode) {
    return vCode && vCode != 'https://accounts.ctrip.com/member/images/pic_verificationcode.gif'
  }
}