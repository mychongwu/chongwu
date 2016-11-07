(function(window) {
	var im_data = {};
	/**
	 * 缓存聊天记录
	 * @param {String} from 发起用户
	 * @param {String} to 发送到用户
	 * @param {JSON} data 发送数据
	 * @param {Function} callback 回调函数
	 */
	im_data.set = function(from, to, data, callback) {
			Cache.create_db("chat_data", 1024 * 1024 * 2);
			Cache.exec("create table if not exists  ch" + from + to + " (c_id INTEGER PRIMARY KEY autoincrement,sender INTEGER,type text,content text, dtime datetime)");

			if(data instanceof String) {
				data = eval("(" + data + ")");
			}
			data.dtime = im_data.get_now();
			//		console.log(JSON.stringify(data));
			Cache.add_data("ch" + from + to, data, function(tx) {
				if(typeof callback == 'function') {
					callback(tx);
				}
			});
		}
		/**
		 * 获取缓存的聊天记录
		 * @param {String} from 发起用户
		 * @param {String} to 发送到用户
		 * @param {Function} callback 回调函数
		 */
	im_data.get = function(from, to, callback) {
			Cache.create_db("chat_data", 1024 * 1024 * 2);
			Cache.fetch_data("select sender,type,content,dtime from ch" + from + to, function(tx) {
				callback(tx);
			});
		}
		/**
		 * 获取最后一次聊天时间
		 * @param {String} from 发起用户
		 * @param {String} to 发送到用户
		 * @param {Function} callback 回调函数
		 */
	im_data.get_max_time = function(from, to, callback) {
			Cache.create_db("chat_data", 1024 * 1024 * 2);
			Cache.exec("create table if not exists  ch" + from + to + " (c_id INTEGER PRIMARY KEY autoincrement,sender INTEGER,type text,content text, dtime datetime)");
			Cache.fetch_data("select max(dtime) as 'c' from ch" + from + to, function(tx) {
				callback(tx);
			});
		}
		/**
		 * 清除聊天缓存记录
		 * @param {String} to 用户id
		 * @param {Function} callback 回调函数
		 */
	im_data.clear = function(to, callback) {
			//		console.log(typeof(to) == "undefined");
			Cache.create_db("chat_data", 1024 * 1024 * 2);
			if(typeof(to) == "undefined") {
				to = "";
			} else if(typeof(to) == "function") {
				callback = to;
				to = "";
			}
			if(to == "") {
				//Cache.exec("DROP DATABASE IF EXISTS chat_data");
				Cache.fetch_data("select * from sqlite_master where type='table'", function(data) {
					var reg = new RegExp(/^ch.*$/);
					for(var i in data) {
						if(reg.test(data[i].name)) {
							Cache.exec("drop table " + data[i].name, function(tx) {});
						}
					}
					if(typeof(callback) == "function") {
						callback(true);
					}
				});
			} else {
				var user = localStorage.getItem("user");
				user = eval("(" + user + ")");
				Cache.exec("drop table ch" + user.id + to, function(tx) {
					if(typeof(callback) == "function") {
						callback(tx);
					}
				});
			}
		}
		/**
		 * 获取当前时间
		 */
	im_data.get_now = function() {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
		var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
		var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
	}
	im_data.catch_img = function(img_path){
		
	}
	window.im_data = im_data;
})(window);