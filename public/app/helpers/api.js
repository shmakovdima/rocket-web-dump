import axios from 'axios'
import cookie from 'react-cookie'
var MD5 = require('md5.js')
var uuid = require('node-uuid')

export const APN_TOKEN = '0c2c476d4c5dd54b6b429bd9c00159f36f50b13338df728326e8fb8976936330'
export const API_URL = 'https://rocketbank.ru/api/v5/'
export const DEVICE_ID = (cookie.load('device') && cookie.load('device').length > 0) ? cookie.load('device') : uuid.v1()

let default_headers = {
    'x-app-version': '4.7.2 (73)',
    'x-device-os': 'iPhone OS 10.0',
    'x-device-id': DEVICE_ID,
    'x-device-locale' : 'en_RU'
}

export function api(headers = {}) {
    // headers['Content-Type'] = 'text/plain'
    // headers['User-Agent'] = 'rocketbank/70 CFNetwork/758.4.3 Darwin/15.5.0'
    headers = Object.assign({}, headers, default_headers)

    return axios.create(Object.assign({}, {
        baseURL: window.location.origin + '/rocketbank_api/',
        headers: headers
    }))
}
export function get_headers(headers = {}) {
    let now = parseInt(new Date().getTime() / 1000);
    let sig = new MD5().update('0Jk211uvxyyYAFcSSsBK3+etfkDPKMz6asDqrzr+f7c=_' + now + '_dossantos').digest('hex')
    // let sig = md5('0Jk211uvxyyYAFcSSsBK3+etfkDPKMz6asDqrzr+f7c=_' + now + '_dossantos');
    headers = Object.assign({
        'x-time': now,
        'x-sig': sig
    }, headers, default_headers)

    return headers
}