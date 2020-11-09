"use strict";
const path = require("path");

function resolve(dir) {
	return path.join(__dirname, dir);
}
const name = "法规库";
module.exports = {
	lintOnSave: process.env.NODE_ENV === "development",
	// 路径别名
	configureWebpack: {
		name: name,
		resolve: {
			alias: {
				"api": resolve("models"),
				"utils": resolve("./utils"),
				"views": resolve("./pages"),
				"static": resolve("./static"),
				"components": resolve("./components")
				// "images":"https://webtax-sz.oss-cn-shenzhen.aliyuncs.com/static/www/mini/images/"
			}
		}
	}
}
