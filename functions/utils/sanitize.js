
// Add -1); waitfor delay '0:0:9.456' -- at
// Add -1;select pg_sleep(14.184); -- at
// Add 1'||DBMS_PIPE.RECEIVE_MESSAGE(CHR(98)||CHR(98)||CHR(98),4.728)||' at
// Add '.print(md5(31337)).' at
module.exports = function isClean(str) {
  const value = str || ''
  if (value.length < 3) {
    return false
  }
  const matches = value.match(/\.\.\/|bxss\.me|\|\|\);|';|0:0:|\)\)|\(\(|\(\),|\.xml|\/\/\/|\.\.%/g)
  if (matches) {
    return false
  }
  return true
}
