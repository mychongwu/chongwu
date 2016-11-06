document.write("<script language=javascript src='js/common.js'></script>");
document.write("<script language=javascript src='js/img-tool/image-new.js'></script>");
document.write("<script src='../js/config.js'></script>");
//配置文件
function peizhi(){
var o = imageTool.options;
				console.log(JSON.stringify(o));
				o.uploadUrl = config.ajax_url+'/Home/Ww/up_imgs'; //图片上传链接
				
				o.multiple = true; //默认只上传一张图片 ，如果要选择多张，请设置为true
				o.maxPicsCount = 9; //默认一次最多选择10张图片,
				o.ZoomBox = 1200; //缩放宽高，默认1200px,横图缩放宽度，高度根据比例计算，同理竖图
				o.ZoomQuality = 50; //压缩图片的质量
				o.isUpload = false; //默认不上传
			}
//上拉菜单
function shangla(){
	
				
			//	mui('#popover').popover('toggle');
				
				if (mui.os.plus) { 
                var a = [{ 
                    title: "拍照" 
                },{ 
                    title: "手机相册选择" 
                },{ 
                    title: "录制爱宠视频" 
                },{ 
                    title: "文本心情发布" 
                }]; 
                plus.nativeUI.actionSheet({ 
                    title: "发布宠物咨询", 
                    cancel: "取消", 
                    buttons: a 
                }, function(b) { /*actionSheet 按钮点击事件*/ 
                    switch (b.index) { 
                        case 0: 
                            break; 
                        case 1: 
                        	peizhi();
                            console.log("拍照");
							getPics(true);
                            break; 
                        case 2: 
							peizhi();
                            console.log("相册选择");
							getPics();
                            break; 
                        case 3://视频录制
                         videoCapture('up_video');
                        	break;
                        case 4://文本信息;
                        localStorage.setItem("types",'up_text');//传id
							mui.openWindow({
						  	url:'testup.html',
						    id:'testup',
						    
						    });
                        	break;	
                        default: 
                            break; 
                    } 
                }) 
            } 
				
			
	
}


////上传图片
//function getImage(id) {
//          var c = plus.camera.getCamera(); 
//          c.captureImage(function(e) { 
//              plus.io.resolveLocalFileSystemURL(e, function(entry) { 
//                  var s = entry.toLocalURL() + "?version=" + new Date().getTime(); 
//                  uploadHead(s,id); /*上传图片*/ 
//              }, function(e) { 
//                  console.log("读取拍照文件错误：" + e.message); 
//              }); 
//          }, function(s) { 
//              console.log("error" + s); 
//          }, { 
//              filename: "aaa" 
//          }) 
//      }
//			  
//
//		function uploadHead(imgPath) { 
//          console.log("imgPath = " + imgPath);
//         	var image = new Image(); 
//          image.src = imgPath; 
//          image.onload = function() { 
//              var imgData = getBase64Image(image); 
//              /*在这里调用上传接口*/ 
//              mui.ajax("http://192.168.1.112/pet/index.php/Home/Ww/up_img", { 
//                  data: { 
//                     'img':imgData  
//                  }, 
//                  dataType: 'json', 
//                  type: 'post', 
//                  timeout: 10000, 
//                  success: function(data) { 
//                  	if(data==1){
//                      console.log('上传成功'); 
//                  		
//                  	}else{
//                  		console.log(333);
//                  	}
//
//                  }, 
//                  error: function(xhr, type, errorThrown) { 
//                      mui.toast('网络异常，请稍后再试！'); 
//                  } 
//              }); 
//          } 
//          
//        
//  } 
//  
//   function galleryImg() { 
//          plus.gallery.pick(function(a) { 
//              plus.io.resolveLocalFileSystemURL(a, function(entry) { 
//                  plus.io.resolveLocalFileSystemURL("_doc/", function(root) { 
//                      root.getFile("head.png", {}, function(file) { 
//                          //文件已存在 
//                          file.remove(function() { 
//                              console.log("file remove success"); 
//                              entry.copyTo(root, 'head.png', function(e) { 
//                                      var e = e.fullPath + "?version=" + new Date().getTime(); 
//                                      uploadHead(e); /*上传图片*/ 
//                                      //变更大图预览的src 
//                                      //目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现 
//                                  }, 
//                                  function(e) { 
//                                      console.log('copy image fail:' + e.message); 
//                                  }); 
//                          }, function() { 
//                              console.log("delete image fail:" + e.message); 
//                          }); 
//                      }, function() { 
//                          //文件不存在 
//                          entry.copyTo(root, 'head.png', function(e) { 
//                                  var path = e.fullPath + "?version=" + new Date().getTime(); 
//                                  uploadHead(path); /*上传图片*/ 
//                              }, 
//                              function(e) { 
//                                  console.log('copy image fail:' + e.message); 
//                              }); 
//                      }); 
//                  }, function(e) { 
//                      console.log("get _www folder fail"); 
//                  }) 
//              }, function(e) { 
//                  console.log("读取拍照文件错误：" + e.message); 
//              }); 
//          }, function(a) {}, { 
//              filter: "image" 
//          }) 
//      };
//  
//      //将图片压缩转成base64 
//      function getBase64Image(img) {
//      	console.log('dasdasd');
//	        	var canvas = document.createElement("canvas"); 
//	            canvas.width=img.width;
//	            canvas.height=img.height;
//	            var width = img.width; 
//	            var height = img.height; 
//	// calculate the width and height, constraining the proportions 
//	//          if (width > height) { 
//	//              if (width > 100) { 
//	//                  height = Math.round(height *= 100 / width); 
//	//                  width = 100; 
//	//              } 
//	//          } else { 
//	//              if (height > 100) { 
//	//                  width = Math.round(width *= 100 / height); 
//	//                  height = 100; 
//	//              } 
//	//          } 
//	//          canvas.width = width;   /*设置新的图片的宽度*/ 
//	//          canvas.height = height; /*设置新的图片的长度*/ 
//	            var ctx = canvas.getContext("2d"); 
//	            ctx.drawImage(img, 0, 0, width, height); /*绘图*/ 
//	            var dataURL = canvas.toDataURL("image/png", 0.8); 
//	            return dataURL.replace("data:image/png;base64,", ""); 
//      }
//      

//上传视频
// 扩展API加载完毕后调用onPlusReady回调函数 
document.addEventListener( "plusready", onPlusReady, false );
// 扩展API加载完毕，现在可以正常调用扩展API 
function onPlusReady() {
	console.log("plusready");
}
var cmr=null;
			function videoCapture(id){
				var cmr = plus.camera.getCamera();
				var res = cmr.supportedVideoResolutions[0];
				var fmt = cmr.supportedVideoFormats[0];
				console.log("Resolution: "+res+", Format: "+fmt+"1");
				cmr.startVideoCapture( function( path ){
						console.log( "Capture video success: " + path + "2" ); 
						plus.io.resolveLocalFileSystemURL(path, function(entry) { 
		                    var s = entry.toLocalURL(); 
		                   	
		                   		localStorage.setItem("types",id);//传id
								localStorage.setItem("path",s);//传id
								
								mui.openWindow({
									
								  	url:'testup.html',
								    id:'testup',
								   
								});	                    
		                }, function(path) { 
		                    console.log("读取拍照文件错误：" + path.message); 
		                });
						
					},
					function( error ) {
						console.log( "Capture video failed: " + error.message );
					},
					{resolution:res,format:fmt}
				);
				// 拍摄60s后自动提示 
				setTimeout( stopCapture, 60000 );
			}
			// 友情提示;
				function stopCapture(){
					mui.toast('为控制您的流量，视频时常请控制在1分钟之内');
				}
	document.addEventListener( "plusready", onPlusReady, false );
	var r = null; 
	// 扩展API加载完毕，现在可以正常调用扩展API 
	function onPlusReady() {
	}

		// 创建上传任务视频
		function createUpload(fullPath,types,content) {
			var wt = plus.nativeUI.showWaiting();
			var url_s;
				if(types=='up_img'){
					 url_s = 'up_imgs';
				}else if(types=='up_video'){
					 url_s = 'up_video';
				}else if(types=='up_text'){
					url_s = 'up_text';
				}
					var task = plus.uploader.createUpload(config.ajax_url+"/Home/Ww/"+url_s, 
						{ method:"POST",blocksize:102400,priority:100 },
						function ( t, status ) {
							// 上传完成
							if ( status == 200 ) { 
								mui.toast('发布成功');
								wt.close();
								mui.back();
								
								
							} else {
								mui.toast('失败！');
								wt.close();
							}
						}
					);
					if(types=='up_img'){
						for (var i = 0; i < fullPath.length; i++) { 
						
				            task.addFile(fullPath[i], { 
				                key: Math.floor(Math.random() * 100000000 + 10000000).toString() 
				            }); 
				     } 
					}else if(types=='up_video'){
						
						task.addFile(fullPath,{key:Math.floor(Math.random() * 100000000 + 10000000).toString()});
					}
					
					
					task.addData('content',content);
					if(!localStorage.getItem('user')){
						mui.openWindow({
						  	url:"../Mine/login.html",
						    id:'login',
						    });
						    return false;
					}
					task.addData('user',localStorage.getItem('user'));
					task.start();
				}
					
		
//第三方上传图片


function getPics(isCamera) {
				//				plus.nativeUI.showWaiting();
				//可以设置mask
				//main.setStyle({
				//	mask: '#ccc'
				//});
				if (!isCamera) {
					imageTool.galleryImgs(doPics);
				} else {
					imageTool.camera(doPics);
				}
			}
			function doPics(err, list) {
				//因为dcloud官方上传地址上传后返回的格式并不是插件定义的规范，
				//"responseText":"{\"strings\":{\"uid\":\"39106184\",\"client\":\"HelloH5+\"},\"error\":\"0\",\"files\":{\"phillyx_72192431\":{\"name\":\"1464411747097.jpg\",\"url\":\"files\\/1464411747097.jpg\",\"type\":\"image\\/jpeg\",\"size\":245329}}}"
				//所以list内部数据都为空
				var err = '';
				var files = [];
				if (err) {
					console.log(err+'这里');
				}
				if (list) {
					mui.each(list, function(index, item) {
						console.log("err " + item.error);
						if (item.imgUrl) {
							files.push(item.imgUrl);
						}
					});
				}
				console.log('上传图片地址：' + JSON.stringify(files));
				//关掉mask
				//main.setStyle({
				//	mask: 'none'
				//});
				if (files.length > 0) {
					//在这里做项目的逻辑，可以打开新页面将files传过去
				}
			};



//三方插件函数

function getPics(isCamera) {
				//				plus.nativeUI.showWaiting();
				//可以设置mask
				//main.setStyle({
				//	mask: '#ccc'
				//});
				if (!isCamera) {
					imageTool.galleryImgs(doPics);
				} else {
					imageTool.camera(doPics);
				}
			}
			function doPics(err, list) {
				//因为dcloud官方上传地址上传后返回的格式并不是插件定义的规范，
				//"responseText":"{\"strings\":{\"uid\":\"39106184\",\"client\":\"HelloH5+\"},\"error\":\"0\",\"files\":{\"phillyx_72192431\":{\"name\":\"1464411747097.jpg\",\"url\":\"files\\/1464411747097.jpg\",\"type\":\"image\\/jpeg\",\"size\":245329}}}"
				//所以list内部数据都为空
				var err = '';
				var files = [];
				if (err) {
					console.log(err+'这里');
				}
				if (list) {
					mui.each(list, function(index, item) {
						console.log("err " + item.error);
						if (item.imgUrl) {
							files.push(item.imgUrl);
						}
					});
				}
				console.log('上传图片地址：' + JSON.stringify(files));
				//关掉mask
				//main.setStyle({
				//	mask: 'none'asd
				//});
				if (files.length > 0) {
					//在这里做项目的逻辑，可以打开新页面将files传过去
					localStorage.setItem("types",'up_img');//传id
					localStorage.setItem("files",JSON.stringify(files));//传id
							mui.openWindow({
						  	url:'testup.html',
						    id:'testup',
						    
						    });
							
				}
			};