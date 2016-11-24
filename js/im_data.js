(function(window) {
	var im_data = {};
	/**
	 * 添加内容到缓存
	 * @param {Object} from
	 * @param {Object} to
	 * @param {Object} data
	 */
	add_data = function(from, to, data) {
			data = swap_json(data);
			data.dtime = im_data.get_now();
			var arr = [];
			var res = {};
			var from_to = plus.storage.getItem(from + to);
			console.log(from_to);
			if(from_to == null) {
				res.lasttime = data.dtime;
				arr.push(swap_json(data));
				res.data = arr;
				plus.storage.setItem(from + to, swap_str(res));
			} else {
				res = swap_json(from_to);
				arr = res.data;
				if(typeof(arr) == "undefined") {
					arr = [];
				}
				res.lasttime = data.dtime;
				arr.push(swap_json(data));
				res.data = arr;
				plus.storage.setItem(from + to, swap_str(res));
			}
		}
		/**
		 * json对象转换为字符串
		 * @param {Object} json_obj
		 */
	swap_str = function(json_obj) {
			if(typeof(json_obj) == "string") {
				return json_obj;
			}
			return JSON.stringify(json_obj);
		}
		/**
		 * json字符串转换为json对象
		 * @param {Object} json_str
		 */
	swap_json = function(json_str) {
//		if(typeof(json_str) == "undefined" || json_str == null){
//				return {dtime:null};
//			}
			if(typeof(json_str) == "object") {
				return json_str;
			}
			
			return eval("(" + json_str + ")");
		}
		/**
		 * 缓存聊天记录
		 * @param {String} from 发起用户
		 * @param {String} to 发送到用户
		 * @param {JSON} data 发送数据
		 */
	im_data.set = function(from, to, data) {
			add_data(from , to, data);
		}
		/**
		 * 获取缓存的聊天记录
		 * @param {String} from 发起用户
		 * @param {String} to 发送到用户
		 * @return {Object}
		 */
	im_data.get = function(from, to) {
			var chat = swap_json(plus.storage.getItem(from + to));
			if(chat == null || chat == '') {
				chat = {};
				chat.data = [];
			}
			return swap_json(chat.data);
		}
		/**
		 * 获取最后一次聊天时间
		 * @param {String} from 发起用户
		 * @param {String} to 发送到用户
		 */
	im_data.get_max_time = function(from, to) {
			var chat = swap_json(plus.storage.getItem(from + to));
			if(chat == null) {
				return null;
			}
			return chat.lasttime;
		}
	im_data.set_max_time = function(from, to){
		var chat = swap_json(plus.storage.getItem(from + to));
		if(chat == null) {
			chat = {};
			chat.lasttime = im_data.get_now(); 
		} else {
			chat.lasttime = im_data.get_now();
		}
		plus.storage.setItem(from + to, swap_str(chat));
	}
		/**
		 * 清除聊天缓存记录
		 * @param {String} to 用户id
		 * @param {Function} callback 回调函数
		 */
	im_data.clear = function(to) {
			//		console.log(typeof(to) == "undefined");
			if(typeof(to) == "undefined") {
				plus.storage.clear();
			} else {
				var user = localStorage.getItem('user');
				user = eval("(" + user + ")");
				plus.storage.removeItem(user.login_id + to);
			}
		}
		/**
		 * 获取当前时间
		 */
	im_data.get_now = function() {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() < 9 ? "0" + (parseInt(date.getMonth())+1) : (parseInt(date.getMonth())+1);
		var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
		var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
	}
	im_data.catch_img = function(img_path) {

	}
	window.im_data = im_data;
})(window);