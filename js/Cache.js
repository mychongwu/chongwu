/**
 * 缓存操作插件
 * 
 */
(function(window) {
	var Cache = {};
	_error_message = '';
	_dataBase = null;
	_setting = {
		/*错误信息分隔符*/
		"error_split": "\n",
		/*数据库名称*/
		"sqlite_dbname" : "mydb",
		/*表名称*/
		"sqlite_table": "my_local_cache",
		/*数据库大小*/
		"sqlite_db_size" : 2*1024*1024 
	};
	/**
	 * 合并配置信息(obj2覆盖obj1)
	 * @param {JSON} obj1  
	 * @param {JSON} obj2 
	 */
	extend = function(obj1, obj2) {
			if(!(obj1 instanceof Object)) {
				obj1 = eval('(' + obj1 + ')');
			}
			if(!(obj2 instanceof Object)) {
				obj2 = eval('(' + obj2 + ')');
			}

			for(var index in obj2) {
				obj1[index] = obj2[index];
			}
			return obj1;
		}
		/**
		 * 替换字符串两侧空格为空
		 * @param {String} str
		 */
	trim = function(str) {
			var reg = new RegExp(/^\s*/);
			str = str.replace(reg, "");
			reg = new RegExp(/\s*$/);
			return str.replace(reg, "");
		}
		/**
		 * 创建sqlite数据库
		 * @param {String} dbname 数据库名称
		 * @param {Int} size 数据库大小
		 */
	Cache.create_db = function(dbname, size) {
			_dataBase = openDatabase(dbname, "1.0", '', size);
			if(!_dataBase) {
				set_error("数据库创建失败！");
				return false;
			}
			return true;
		}
		/**
		 * 执行sql，回调返回影响条数
		 * @param {String} sql
		 * @param {Array} param 替换sql中问号的数组
		 * @param {Function} callback 成功回调
		 */
	Cache.exec = function(sql, param, callback) {
			//参数处理  
			if(!param) {
				param = [];
			} else if(typeof param == 'function') {
				callback = param;
				param = [];
			}

			query(sql, param, function(result) {
				if(typeof callback == 'function') {
					callback(result.rowsAffected);
				}
			});
		}
		/**
		 * 执行sql，回调返回sql查询对象 
		 * 查询时，有数据返回数组，无数据返回0 
		 * 增删改时：返回int，影响条数 
		 * @param {String} sql
		 * @param {Array} param 替换sql中问号的数组
		 * @param {Function} callback 成功回调
		 */
	query = function(sql, param, callback) {
			//参数处理  
			if(!param) {
				param = [];
			} else if(typeof param == 'function') {
				callback = param;
				param = [];
			}

			//只有一个参数 
			_dataBase.transaction(function(tx) {
				//4个参数：sql，替换sql中问号的数组，成功回调，出错回调  
				tx.executeSql(sql, param, function(tx, result) {
					if(typeof callback == 'function') {
						callback(result);
					} 
				}, function(tx, e) {
					set_error('sql error: ' + e.message);
				});
			})
		}
		/**
		 * 添加数据到数据库
		 * @param {String} tablename 表名称
		 * @param {JSON} data 添加的值
		 * @param {Function} callback 回调函数:结果为新增数据主键值
		 */
	Cache.add_data = function(tablename, data, callback) {
			var fields = [];
			var values = [];
			var values_sign = [];

			for(var i in data) {
				fields.push(i);
				values.push(data[i]);
				values_sign.push("?");
			}
			var sql = "insert into " + tablename + " (" + fields.join(",") + ") values (" + values_sign.join(",") + ")";
			
			query(sql, values, function(result) {
				if(typeof callback == 'function') {
					callback(result.insertId);
				}
			});
		}
		/**
		 * 更新数据库数据
		 * @param {String} table 表名称
		 * @param {JSON} data 更新数据
		 * @param {String} where 条件(字段=?)
		 * @param {Array} param 替换数据
		 * @param {Function} callback 回调函数
		 */
	Cache.update_data = function(table, data, where, param, callback) {
			//参数处理  
			if(!param) {
				param = [];
			} else if(typeof param == 'function') {
				callback = param;
				param = [];
			}
			var set_info = mk_where(data);
			for(var i = set_info.param.length - 1; i >= 0; i--) {
				
				param.unshift(set_info.param[i]);
			}
			
			var sql = "UPDATE " + table + " SET " + set_info.sql;
			if(where) {
				sql += " WHERE " + where;
			}
			query(sql, param, function(result) {
				if(typeof callback == 'function') {
					callback(result.rowsAffected);
				}
			});
		}
		/**
		 * 删除数据库数据
		 * @param {String} table 表名称
		 * @param {String} where 条件(字段=?)
		 * @param {Array} param 替换数据
		 * @param {Function} callback 回调函数
		 */
	Cache.delete_data = function(table, where, param, callback) {
			//参数处理
			if(!param) {
				param = [];
			} else if(typeof param == 'function') {
				callback = param;
				param = [];
			}

			var sql = "DELETE FROM " + table + " WHERE " + where;
			query(sql, param, function(result) {
				if(typeof callback == 'function') {
					callback(result.rowsAffected);
				}
			});
		}
		/**
		 * 查询，回调返回结果集数组
		 * @param {String} sql Sql语句
		 * @param {Array} param 替换数据
		 * @param {Function} callback 回调函数
		 */
	Cache.fetch_data = function(sql, param, callback) {
			//参数处理
			if(!param) {
				param = [];
			} else if(typeof param == 'function') {
				callback = param;
				param = [];
			}

			query(sql, param, function(result) {
				if(typeof callback == 'function') {
					var out = [];

					if(result.rows.length) {
						for(var i = 0; i < result.rows.length; i++) {
							out.push(result.rows.item(i));
						}
					}

					callback(out);
				}
			});
		}
		/**
		 * 组装查询条件 
		 * @param {JSON} data
		 */
	mk_where = function(data) {
			var arr = [];
			var param = [];
			if(typeof data === 'object') {
				for(var i in data) {
					arr.push(i + "=?");
					param.push(data[i]);
					//console.log('data.i:' + i);
				}
			}
			return {
				sql: arr.join(' AND '),
				param: param
			};
		}
		/**
		 * 设置错误信息
		 * @param {String} $msg
		 */
	set_error = function(msg) {
			_error_message += msg + _setting.error_split;
		}
	/**
	 * 初始化缓存组件
	 * @param {JSON} setting 配置项
	 */
	Cache.init = function(setting){
		if(typeof setting == "undefined") {
			setting = {};
		}
		_setting = extend(_setting, setting);
	}
		/**
		 * 获取错误信息
		 */
	Cache.getError = function() {
			return _error_message;
		}
		/**
		 * 设置缓存
		 * @param {Object} c_name 缓存名称
		 * @param {Object} data 缓存数据
		 */
	Cache.set = function(c_name, data) {
		create_db(_setting.sqlite_dbname, _setting.sqlite_db_size);
		exec("create table if not exists "+_setting.sqlite_table+" (m_id INTEGER PRIMARY KEY,m_key text,m_value text)");
		if(data instanceof Object) {
			data = JSON.stringify(data);
		}
		fetch_data("select count(m_id) as 'c' from "+_setting.sqlite_table+" where m_key=?",[c_name],function(dd){
			if(dd[0].c == 0) {
				add_data(_setting.sqlite_table,{"m_id":null,"m_key":c_name,"m_value":data});
			} else {
				update_data(_setting.sqlite_table,{"m_value":data},"m_key=?",[c_name], function(d){
				});
			}
		});
	}
	/**
	 * 获取缓存
	 * @param {Object} c_name 缓存名称
	 * @param {Object} callback 成功回调函数
	 */
	Cache.get = function(c_name, callback) {
		create_db(_setting.sqlite_dbname, _setting.sqlite_db_size);
		fetch_data("select m_value from "+_setting.sqlite_table+" where m_key=?",[c_name],function(res){
			var r = null;
			for(var x in res){
				r = res[x].m_value;
				break;
			}
			callback(r);
		});
	}
	window.Cache = Cache;
})(window);