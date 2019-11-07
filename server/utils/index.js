/**
 * @param {Array}roles
 * @returns {Array}
 */

/* 根据用户角色获取到完整的查询条件 */
function getInquire(roles) {
  let InquireArr = []
  for (let item of roles) {
    let Inquire = {}
    Inquire.roles = item
    InquireArr.push(Inquire)
  }
  return InquireArr
}

module.exports = {
  getInquire
}
