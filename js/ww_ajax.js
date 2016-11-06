document.write('<script src="../js/config.js"></script>');
/**
 * 配置文件
 */
var option = {
	video_url:config.img_url+'Public/video/',
	img_url:config.img_url+'Public/upload/',
	anysc_a : true
	};
/**
 * 同步加载
 */

function ww_ajax_true(data){
			var strings='';
			for(n in data){
							strings +='<li style="position: relative;overflow: hidden;padding: 11px 15px;"><div class="mui-card" style="border:none;"><div class="mui-card-content"><div class="mui-card-content-inner" style="white-space:normal;">';
							
							//性别判断头像
							if(data[n].sex==1){
								if(data[n].login_img==''){
									strings +='<p><img style="width:30px;" src="../img/nan.png" align="left">';
								}else{
									strings +='<p><img style="width:30px;" src="'+option.img_url+data[n].login_img+'" align="left">';
								}
								
							}else{
								if(data[n].login_img==''){
									strings +='<p><img style="width:30px;" src="../img/nv.png" align="left">';
								}else{
									strings +='<p><img style="width:30px;" src="'+option.img_url+data[n].login_img+'" align="left">';
								}
							}
							strings +='<a href="#" style="color:#8F8F94 ;">'+data[n].nickname+'</a></p><div style="height: 10px;"></div>';
							strings +='<p class="news" onclick="xiangxi('+data[n].info_id+')" ids="新闻ID" style="color: #333;margin-top:3px;">'+data[n].info_content+'</p></div></div>';
							//判断是视频还是图片还是没有
							//信息类型，1：图文，2：视频 3：文本信息
							if(data[n].info_type==1){
								var imgarr =data[n].info_imgs.split(',');
								if(imgarr.length<=1){
									strings +='<div class="mui-card-header mui-card-media"><img style="width:100%;" src="'+option.img_url+imgarr[0]+'" /></div>';
								}else{
									
									strings +='<div class="mui-card-header mui-card-media imgs" >';//##
									for(i=0;i<imgarr.length;i++){
										strings +='<img style="width:29.5%;float: left;margin-left: 3%;margin-bottom: 5px; border-radius: 3px;" src="'+config.img_url+'Public/upload/'+imgarr[i]+'" />';
									}
									strings +='</div>';
								}
								
							}
							if(data[n].info_type==2){//视频 上头
								
								strings +='<div class="mui-card-header mui-card-media">';		
							strings +=	'<video style="width:90%;height:200px;background-color: black;margin-left: 5%;">';
							strings +=	'<source src="'+option.video_url+data[n].info_imgs+'" type="video/mp4"></source>'
							strings +=	'<object style="width:90%;height:200px;background-color: black;margin-left: 5%;" type="application/x-shockwave-flash" data="'+option.video_url+data[n].info_imgs+'">';
							strings +=	'	<param name="movie" value="'+option.video_url+data[n].info_imgs+'" />';
							strings +=	'	<param name="flashvars" value="autostart=true&amp;file='+option.video_url+data[n].info_imgs+'" />';
							strings +=	'</object>';
							strings +=	'</video>';
								strings +='</div>';
							}
							strings +='<div id="bnt" style="width: 100%;height: 30px;margin-left:0;line-height: 30px;margin-left:5px;margin-top:20px;">';
							strings +='<div id="" style="color: #8F8F94;width: 50%;height: 30px;background-color: ;float: left;">发表于'+data[n].info_time+'</div>';
							strings +='<div onclick="zan('+data[n].info_zan+','+data[n].info_id+',this)" style="width: 25%;height: 30px;background-color: ;float: right;"><span class="mui-icon-extra mui-icon-extra-like" style="text-align:center;font-size:15px;line-height: 28px;color: #EBEBF1;"></span>';
							strings +='<span   style="color: #8F8F94;font-size: 12px;text-align:right;">'+data[n].info_zan+'</span></div>';
							strings +='<div style="width: 25%;height: 30px;background-color: ;float: right;"><span class="mui-icon mui-icon-chat" style="text-align:right;margin-left:5px;font-size:16px;line-height: 32px;color: #8F8F94;"></span>';
							strings +='<span style="color: #8F8F94;font-size: 12px;text-align:right;">'+data[n].info_count+'</span></div></div></div></li>';
						}
			return strings;
				
}
/**
 * 异步加载
 */
function ww_ajax_false(){
	
}
