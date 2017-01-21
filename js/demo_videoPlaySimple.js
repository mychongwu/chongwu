/**
 * 作者：dailc rayChenDay
 * 时间：2016-03-10 18:12:45
 * 描述：  html5 视频播放方案,两种实现:
		1.iOS和Android中内联播放
		2.iOS和Android中全屏播放  
	注: ios版本无法 preload视频
 */
(function() {
	//是否采用内联播放模式
	var isInlinePlay = false;
	//var videoMedia = document.getElementById('videoMedia');
	//获取视频应该得宽和高
//	var videoWidth = Zepto('#videoContainer').attr('offsetWidth');
//	var videoHeight = Zepto('#videoContainer').attr('offsetHeight');
	//普通初始化
	//init();
	//plus下的初始化
	mui.plusReady(function() {
		//plus.screen.lockOrientation("portrait-primary");
		mui('.mui-table-view').on('tap','.video_player', function() {
			console.log(this.getAttribute('data-src'));
			play(this.getAttribute('data-src'));
		});
		//Zepto('#TypeSwitch').show();s
		mui(".mui-table-view").on('tap','.audio_player',function(){
			console.log(this.getAttribute("data-src"));
					dataURL2Audio(this.getAttribute("data-src"),function(e){
					var plays = plus.audio.createPlayer(e.toLocalURL());
					plays.play();
				});
		});
		mui(".mui-table-view").on('tap','.ios_player',function(){
				this.nextElementSibling.play();

		});
//		mui(".one-to-one-response-box").on('click', '.audio_player', function() {
//				console.log(this.getAttribute("data-src"));
//				dataURL2Audio(this.getAttribute("data-src"),function(e){
//					
//					var plays = plus.audio.createPlayer(e.toLocalURL());
//					plays.play();
//				});
//		});
//		
	});
	
	/**
	 * @description 初始化 
	 */
	//function init() {
		//隐藏选择控件栏
//		Zepto('#TypeSwitch').hide();
		//Zepto('.switchBtn').on('tap', switchPlayType);
		//给视频也点击播放,用来在内联时控制某些android的暂停
		//因为某些机型被改的控制栏自动隐藏了
//		mui('.mui-table-view').on('tap','.videoMedia', function() {
//			console.log(this.getAttribute('data-src'));
//			play(this);
//		});
		
		//console.log('视频宽:' + videoWidth + ',高:' + videoHeight);
	//};
	/**
	 * @description 播放
	 */
	function play(videoMedia_src) {
//		console.log('readyState:' + videoMedia.readyState);

		//内联播放时,隐藏图片,非内联直接就用原生打开了
		//ios下的非内联也可以(不是必须)隐藏图片
		//普通浏览器也要隐藏,ios plus下也要隐藏
		//android下因为非内联使用原生播放的,所以直接隐藏video
//		if (isInlinePlay || !(window.plus && plus.os.name == 'Android')) {
//			switchDefaultImgShow(false);
//		}
		var url = videoMedia_src;
		
		var Intent = plus.android.importClass("android.content.Intent");
		var Uri = plus.android.importClass("android.net.Uri");
		var main = plus.android.runtimeMainActivity();
		var intent = new Intent(Intent.ACTION_VIEW);
		var uri = Uri.parse(url);
		intent.setDataAndType(uri, "video/*");
		main.startActivity(intent);
		
//		playHtml5Video(url, videoMedia, function(isPlay) {
//			if (isPlay) {
//				console.log('播放了');
//			} else {
//				console.log('暂停了');
//			}
//		}, isInlinePlay);
	};
	/**
	 * @description 播放Html5视频
	 * plus下android:通过NJS,在android上用原生播放器打开视频
	 * plus下iOS:直接play视频,会自动调用原生播放器播放
	 * 非plus下: 直接play视频
	 * @param {String} url 视频的地址,可以是网络地址或者本地地址
	 * @param {HTMLElement} mediaTarget 目标video的dom对象
	 * @param {Function} callback(isPlay) 回调函数,true为正在播放,false为暂停,
	 * 只有非plus情况才能回调
	 * @param {Boolean} isInlinePlay 是否内联播放,默认为false
	 * ios 下内联播放:  	  非全屏,h5播放方式
	 * ios 下非内联播放:  全屏,h5播放方式
	 * Android 下内联播放:  	  非全屏,h5播放方式
	 * Android 下非内联播放:  全屏,NJS原生播放器播放方式
	 */
	function playHtml5Video(url, mediaTarget, callback, isInlinePlay) {
		if (!url || !mediaTarget) {
			//url 和video元素不存在
			return;
		}
		isInlinePlay = isInlinePlay || false;

		if (plus.os.name == 'Android') {
			//非内联模式下的plus下的android才用到
			var Intent = plus.android.importClass("android.content.Intent");
			var Uri = plus.android.importClass("android.net.Uri");
			var main = plus.android.runtimeMainActivity();
			var intent = new Intent(Intent.ACTION_VIEW);
			var uri = Uri.parse(url);
			intent.setDataAndType(uri, "video/*");
			main.startActivity(intent);
		} else {
			if (!isInlinePlay) {
				//如果是非内敛,ios需要去除内联样式
				mediaTarget.removeAttribute('webkit-playsinline');
			} else {
				mediaTarget.setAttribute('webkit-playsinline', 'webkit-playsinline');
			}
			if (mediaTarget.paused || mediaTarget.ended) {
				//暂停时播放
				if (mediaTarget.ended) {
					mediaTarget.currentTime = 0;
				}
				mediaTarget.play();
				callback && callback(true);
			} else {
				//播放时暂停
				mediaTarget.pause();
				callback && callback(false);
			}
		}
	};
	/**
	 * @description 更换视频默认图的显示,内联模式下隐藏
	 * 否则显示
	 * @param {Boolean} isShow
	 */
	function switchDefaultImgShow(isShow) {
		if (isShow) {
			Zepto('#videoMediaDefaultImg').show();
			Zepto('#videoMedia').css('width', '1px');
			Zepto('#videoMedia').css('height', '1px');
		} else {
			Zepto('#videoMediaDefaultImg').hide();
			Zepto('#videoMedia').css('width', '300px');
			Zepto('#videoMedia').css('height', '200px');
		}
	};
	/**
	 * @description 更换播放类型
	 * @param {Event} e
	 */
	function switchPlayType(e) {
		Zepto(e.target).addClass('choosed').siblings().removeClass('choosed');
		if (e.target.id == 'inlinePlayBtn') {
			//内联播放
			isInlinePlay = true;
		} else {
			//非内联
			isInlinePlay = false;
			
		}
		//这个模式隐藏video,防止点击重复冲突,并暂停
		videoMedia.pause();
		switchDefaultImgShow(true);
	};

})();
		/**
		 * base64字符串转成语音文件(参考http://ask.dcloud.net.cn/question/16935)
		 * @param {Object} base64Str
		 * @param {Object} callback
		 */
		function dataURL2Audio(base64Str, callback) {
			var base64Str = base64Str.replace('data:audio/amr;base64,', '');
			var audioName = (new Date()).valueOf() + '.amr';

			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
				fs.root.getFile(audioName, {
					create: true
				}, function(entry) {
					// 获得平台绝对路径
					var fullPath = entry.fullPath;
					if(mui.os.android) {
						// 读取音频
						var Base64 = plus.android.importClass("android.util.Base64");
						var FileOutputStream = plus.android.importClass("java.io.FileOutputStream");
						try {
							var out = new FileOutputStream(fullPath);
							var bytes = Base64.decode(base64Str, Base64.DEFAULT);
							out.write(bytes);
							out.close();
							// 回调
							callback && callback(entry);
						} catch(e) {
							console.log(e.message);
						}
					} else if(mui.os.ios) {
						var NSData = plus.ios.importClass('NSData');
						var nsData = new NSData();
						nsData = nsData.initWithBase64EncodedStringoptions(base64Str, 0);
						if(nsData) {
							nsData.plusCallMethod({
								writeToFile: fullPath,
								atomically: true
							});
							plus.ios.deleteObject(nsData);
						}
						// 回调
						callback && callback(entry);
					}
				})
			})
		}