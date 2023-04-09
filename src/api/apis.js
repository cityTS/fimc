import fetch from '../request'

/**
 * 确认手机号是否注册
 * @param data
 * @returns {Promise<*>|*}
 */
export const ackPhone = data => fetch('/signin/ack/phone', data, 'GET')

/**
 * 手机+验证码登录
 * @param data
 * @returns {Promise<*>|*}
 */
export const signInPhone = data => fetch('/signin/phone', data, 'GET')

/**
 * 邮箱登录
 * @param data
 * @returns {Promise<*>|*}
 */
export const signInEmail = data => fetch('/signin/email', data, 'GET')


/**
 * 查询用户的基本信息 avatar, id, username, status
 * @param data
 * @returns {Promise<*>|*}
 */
export const queryUserBasicInfo = data => fetch('/user/basic', data, 'GET')

/**
 * 添加好友
 * @param data
 * @returns {Promise<*>|*}
 */
export const addFriend = data => fetch('/user/add', data, 'GET')

/**
 * 查询用户头像
 * @param data
 * @returns {Promise<*>|*}
 */
export const queryUserAvatarUrl = data => fetch('/user/avatar', data, 'GET')

/**
 * 查询好友
 * @param data
 * @returns {Promise<*>|*}
 */
export const queryUserFriends = data => fetch('/friend', data, 'GET')

/**
 * 查询申请列表
 * @param data
 * @returns {Promise<*>|*}
 */
export const queryApplyList = data => fetch('/apply', data, 'GET')

/**
 * 同意好友申请
 * @param data
 * @returns {Promise<*>|*}
 */
export const agreeApply = data => fetch('/apply/agree', data, 'GET')

/**
 * 拒绝好友申请
 * @param data
 * @returns {Promise<*>|*}
 */
export const refuseApply = data => fetch('/apply/refuse', data, 'GET')


/**
 * 修改用户信息
 * @param data
 * @returns {Promise<*>|*}
 */
export const saveUser = data => fetch('/user/update', data, 'GET')

/**
 * 删除好友
 * @param data
 * @returns {Promise<*>|*}
 */
export const deleteFriend = data => fetch('/friend/delete', data, 'GET')