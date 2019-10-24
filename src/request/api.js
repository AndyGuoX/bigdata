// eslint-disable-next-line no-unused-vars
import {get, post} from '@/request/http'

export const login = (params) => post('/api/login', params)

export const getUserInfo = (params) => get('/api/getUserInfo', params)
