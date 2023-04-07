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