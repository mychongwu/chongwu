(function(window) {
	var mui_ext = {};
	/**
	 * 创建追加的标签节点
	 * @param {String} tagName 创建的标签名称
	 * @param {JSON|String} attrs 创建的标签属性及值(格式为json: 属性名1:值1,属性名2:值2…… )
	 * @param {String} value 显示内容
	 */
	create_tag = function(tagName, attrs, value) {
			if(typeof(attrs) != "object") {
				value = attrs;
				attrs = [];
			}
			var tag = document.createElement(tagName);
			for(var i in attrs) {
				tag.setAttribute(i, attrs[i]);
			}
			if(tagName.toLowerCase() == "input") {
				tag.value = value;
			} else {
				if(value != "") {
					tag.innerHTML = value;
				}
			}
			return tag;
		}
		/**
		 * 创建图文列表
		 * @param {String} id : 追加到的ID
		 * @param {JSON} data : 数据(数据库取出的二维数组)
		 * @param {JSON} data_columns : 数据库字段名称(格式为: m_src:"图片路径",m_title:"显示标题内容",m_content:"显示详细内容",m_href:"跳转页面",m_params:"传递参数") 
		 * @param {Int} type : 显示类型(1:缩略图居左,2:缩略图居右,3:右侧带导航箭头) 
		 */
	mui_ext.create_media_list = function(id, data, data_columns, type) {
		if(typeof(data) != "object") {
			data = eval("(" + data + ")");
		}
		var ul_class = "";
		if(type == 3) {
			ul_class = " mui-table-view-chevron";
		}
		var ul = create_tag("ul", {
			"class": "mui-table-view" + ul_class
		}, "");
		for(var i in data) {
			var p = create_tag("p", {
				"class": "mui-ellipsis"
			}, data[i][data_columns.m_content]);
			var div = create_tag("div", {
				"class": "mui-media-body"
			}, data[i][data_columns.m_title]);
			div.appendChild(p);
			var img_class = "mui-pull-left";
			if(type == 2) {
				img_class = "mui-pull-right";
			}
			var img = create_tag("img", {
				"class": "mui-media-object " + img_class,
				"src": data[i][data_columns.m_src]
			}, "");

			var a_class = "dzg-a-class";
			if(type == 3) {
				a_class += " mui-navigate-right";
			}
			if(typeof(data[i][data_columns.m_params]) == "object") {
				data[i][data_columns.m_params].href = data[i][data_columns.m_href];
				data[i][data_columns.m_params] = JSON.stringify(data[i][data_columns.m_params]);
			} else {
				data[i][data_columns.m_href] = eval("(" + data[i][data_columns.m_href] + ")");
				data[i][data_columns.m_params].href = data[i][data_columns.m_href];
				data[i][data_columns.m_params] = JSON.stringify(data[i][data_columns.m_params]);
			}
			var a = create_tag("a", {
				"href": "javascrip:;",
				"class": a_class,
				"data-params": data[i][data_columns.m_params]
			}, "");

			a.appendChild(img);
			a.appendChild(div);
			var li = create_tag("li", {
				"class": "mui-table-view-cell mui-media"
			}, "");
			li.appendChild(a);
			//			if(data[i][data_columns.m_href] != "") {
			//				a.addEventListener('tap', function() {
			//					mui.openWindow({
			//						id: data[i][data_columns.m_href],
			//						url: data[i][data_columns.m_href],
			//						extras: data[i][data_columns.m_params],
			//						waiting:{
			//							autoShow:true,//自动显示等待框，默认为true
			//    						title:'正在加载...',//等待对话框上显示的提示内容 
			//						}
			//					});
			//					console.log(JSON.stringify({id: data[i][data_columns.m_href]+Math.random(),url: data[i][data_columns.m_href],extras: data[i][data_columns.m_params]}));
			//				}, true);
			//			}
			ul.appendChild(li);
		}
		var obj = document.getElementById(id);
		obj.appendChild(ul);
		mui(".mui-table-view-cell").on('tap', ".dzg-a-class", function() {

			var data_params = eval("(" + this.getAttribute("data-params") + ")");
			var href = data_params['href'];
			delete data_params['href'];
			//			console.log(JSON.stringify(data_params));
			//			console.log(href);
			mui.openWindow({
				id: href,
				url: href,
				extras: data_params,
				waiting: {
					autoShow: true, //自动显示等待框，默认为true
					title: '正在加载...', //等待对话框上显示的提示内容 
				}
			});
		});
	}
	window.mui_ext = mui_ext;
})(window);