import {
	config
} from '../config.js'
class HTTP {
	constructor() {
		this.baseUrl = config.base_url
	}
	request({
		url,
		data = {},
		method = 'GET'
	}) {
		return new Promise((resolve, reject) => {
			this._request(url, resolve, reject, data, method)
		})
	}
	_request(url, resolve, reject, data = {}, method = 'GET') {
		uni.request({
			url: `${this.baseUrl}${url}`,
			method: method,
			data: data,
			header: {
				'content-type': 'application/json',
				'appId': config.appId,
				'token': uni.getStorageSync('AuthTokens')
			},
			success: (response) => {
				const res = response.data
				if (!res) return false
				let code = null
				if (res.hasOwnProperty('status')) {
					code = +res.status
				} else {
					code = +res.code
				}
				switch (code) {
					case 0:
					case 200:
						const _success = res.success;
						if (_success) {
							return resolve(res)
						} else {
							const error_code = res.code
							const _message = res.message
							this._show_error(error_code, _message)
							return reject(res.message)
						}
						/**
						 * 10001 session失效
						 * 10002 redis用户记录为空
						 */
					case 10001:
					case 10002:
						this._show_error(1, res.message)
						return reject(res.message)
					case 20001:
						this._show_error(1, '权限不足！')
						return reject(res.message)
					default:
						if (!res.success) {
							this._show_error(1, res.message)
							return reject(res.message)
						} else {
							return resolve(res.data)
						}

				}
			},
			fail: (error) => {
				if (error.message === 'Network Error') {
					this._show_error(1, '网络连接错误，请检查网络连接！')
				} else if (error.code && error.code === 'ECONNABORTED') {
					this._show_error(1, '网络连接超时，请稍后重试！')
				} else {
					this._show_error(1, '服务器异常，请稍后重试！')
				}
				return reject(false)
			}
		})
	}
	_show_error(error_code, _message) {
		uni.showToast({
			title: `${_message}`,
			icon: 'none',
			duration: 2000
		})
	}
}
export {
	HTTP
}
