import {get, post} from '@/request/http'

export const login = (params) => post('/api/login', params) // 登录

export const getUserInfo = (params) => get('/api/getUserInfo', params) // 获取用户基本信息

export const logout = () => post('/api/logout') // 登出

export const getVisualList = () => get('api/getVisualList') // 获取用户的可视化页面列表

export const saveVisualPage = (params) => post('/api/saveVisualPage', params) // 保存用户的可视化页面

export const viewVisualPage = (params) => post('api/viewVisualPage', params) // 查看用户的可视化页面

export const delVisualPage = (params) => post('api/delVisualPage', params) // 删除用户的可视化页面




