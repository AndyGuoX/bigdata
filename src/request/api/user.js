import {get, post} from '@/request/http'

export const login = (params) => post('/api/login', params)

export const getUserInfo = (params) => get('/api/getUserInfo', params)

export const logout = () => post('/api/logout')

export const getVisualList = () => get('api/getVisualList')


