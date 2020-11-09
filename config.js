let BASE_URL = ''
if (process.env.NODE_ENV == 'development') {
    BASE_URL = 'http://192.168.43.202:9191' // qe环境
	//BASE_URL = 'http://test.api.webtax.com.cn/mp/'
} else {
    BASE_URL = 'https://www.baidu.com' // 生产环境
}
const config = {
	base_url: BASE_URL,
	appId: 'wxeb407bb6c397aa4c',
	appKey: '675aeecfdac05b6b82b9910a8fd00e88'
}

export { config }