/**
 * Created by Administrator on 2016/5/22.
 */

var YJSay = (function ($) {
    var token = "";
    var securityKey="";
    var alarmList="";
    var addSaleStatus;
	var weixin = {appId:"wx2ce5de42f31757ea",timestamp:parseInt(new Date().getTime()/1000)};
    //var weixin = {appId:"wx93ccd8dccdd06205",nonceStr:"V79ub0LNlSzUqiEs",timestamp:1466063208};
	return {
        baseUrl:"http://src.yjsvip.com",
        getData: function (option) {
            var async = option.async;
            $.ajax({
                url:this.baseUrl+option.url,
                dataType:"JSON",
                type:option.type||"POST",
                beforeSend: function () {
                    $(".mask1").removeClass("hidden");
                },
                async:async==undefined,
                data:option.data||{},
                success:option.success,
                complete: function () {
                    $(".mask1").addClass("hidden");
                },
                error: function () {
                    console.log("获取数据失败："+option.url);
                }
            });
        },
        goBack: function () {
            if($(".mask").is(":visible")){
                $(".mask").addClass('hidden');
            }
			history.back();
        },
        setTitle: function (title) {
            this.useNativeFunction("setTitle",title);
        },
		randomString:function(len) {
		　　len = len || 32;
		　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
		　　var maxPos = $chars.length;
		　　var pwd = '';
		　　for (i = 0; i < len; i++) {
		　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		　　}
		　　return pwd;
		},
        setToken: function (value) {
            token = value;
        },
        getToken: function () {
            if(is_PC()){
                token = "74635F3E49E34155B459FF231D6C4CD0";
                return token;
            }else{
                if(!token){
                    if(window.bridge){
                        token =  this.useNativeFunction("getToken");
                    }else if(this.is_weiXin()){
                        if(localStorage.getItem('weChartToken')){
                            token = localStorage.getItem('weChartToken');
                        }else{
							localStorage.setItem("locationHref",location.hash);
                            location.href="login.html";
                        }
                    }else{
                        this.useNativeFunction("YJSay.setToken");
                    }
                    return token;
                }else{
                    return token;
                }
            }
        },
		getWXTicket:function(){
			var _self = this;
			_self.getData({
				url:"/yjsWebService/weixin/config/getWeiXinTicket",
				async:false,
				data:{token:_self.getToken()},
				success:function(data){
					alert(JSON.stringify(data));
					if(data.ticket){
						localStorage.setItem("wxTicket",data.ticket);
					}
				}
			});
		},
		initWXSDK:function(){
			this.getWXTicket();
			/*$.ajax({
			  type : "get",
			  url : "http://test.qingniao8.com/loveShe_admin/index.php/ajaxWeChart/createSign/?url="+this.baseUrl+"/img/YJPersonal/index.html",
			  dataType : "jsonp",
			  success : function(data){
				  wx.config({
					appId: data.data.appId,
					timestamp: data.data.timestamp,
					nonceStr: data.data.nonceStr,
					signature: data.data.signature,
					jsApiList: [
						  'checkJsApi',
						  'onMenuShareTimeline',
						  'onMenuShareAppMessage',
						  'onMenuShareQQ',
						  'onMenuShareWeibo',
						  'onMenuShareQZone',
						  'hideMenuItems',
						  'showMenuItems',
						  'hideAllNonBaseMenuItem',
						  'showAllNonBaseMenuItem',
						  'translateVoice',
						  'startRecord',
						  'stopRecord',
						  'onVoiceRecordEnd',
						  'playVoice',
						  'onVoicePlayEnd',
						  'pauseVoice',
						  'stopVoice',
						  'uploadVoice',
						  'downloadVoice',
						  'chooseImage',
						  'previewImage',
						  'uploadImage',
						  'downloadImage',
						  'getNetworkType',
						  'openLocation',
						  'getLocation',
						  'hideOptionMenu',
						  'showOptionMenu',
						  'closeWindow',
						  'scanQRCode',
						  'chooseWXPay',
						  'openProductSpecificView',
						  'addCard',
						  'chooseCard',
						  'openCard'
					]
				  });
				  wx.ready(function () {
					 wx.onMenuShareQQ({
					  title: '我的分享',
					  desc: '分享分享分享',
					  link: 'http://movie.douban.com/subject/25785114/',
					  imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
					  trigger: function (res) {
						alert('触发分享了');
					  },
					  complete: function (res) {
						alert(JSON.stringify(res));
					  },
					  success: function (res) {
						alert('分享成功了');
					  },
					  cancel: function (res) {
						alert('分享取消了');
					  },
					  fail: function (res) {
						alert(JSON.stringify(res));
					  }
					});
					alert('分享'); 
				  });
			  },
			  error:function(data){
				  alert("连接失败！");
			  }
		  });*/
			//alert(localStorage.getItem("wxTicket")+'&noncestr='+weixin.nonceStr+'&timestamp='+weixin.timestamp+'&url='+this.baseUrl+'/img/YJPersonal/index.html');
			weixin.nonceStr = this.randomString();
			alert(JSON.stringify(weixin));
			alert(hex_sha1("jsapi_ticket="+localStorage.getItem("wxTicket")+"&noncestr="+weixin.nonceStr+"&timestamp="+weixin.timestamp+"&url="+this.baseUrl+"/img/YJPersonal/index.html"));
			wx.config({
			  debug: true,
			  appId: "wx2ce5de42f31757ea",
			  timestamp: weixin.timestamp,
			  nonceStr: weixin.nonceStr,
			  signature: hex_sha1("jsapi_ticket="+localStorage.setItem("wxTicket")+"&noncestr="+weixin.nonceStr+"&timestamp="+weixin.timestamp+"&url="+this.baseUrl+"/img/YJPersonal/index.html"),
			  jsApiList: [
				'checkJsApi',
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'onMenuShareWeibo',
				'onMenuShareQZone',
				'hideMenuItems',
				'showMenuItems',
				'hideAllNonBaseMenuItem',
				'showAllNonBaseMenuItem',
				'translateVoice',
				'startRecord',
				'stopRecord',
				'onVoiceRecordEnd',
				'playVoice',
				'onVoicePlayEnd',
				'pauseVoice',
				'stopVoice',
				'uploadVoice',
				'downloadVoice',
				'chooseImage',
				'previewImage',
				'uploadImage',
				'downloadImage',
				'getNetworkType',
				'openLocation',
				'getLocation',
				'hideOptionMenu',
				'showOptionMenu',
				'closeWindow',
				'scanQRCode',
				'chooseWXPay',
				'openProductSpecificView',
				'addCard',
				'chooseCard',
				'openCard'
			  ]
		  });
		  wx.ready(function () {
					 wx.onMenuShareQQ({
					  title: '我的分享',
					  desc: '分享分享分享',
					  link: 'http://movie.douban.com/subject/25785114/',
					  imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
					  trigger: function (res) {
						alert('触发分享了');
					  },
					  complete: function (res) {
						alert(JSON.stringify(res));
					  },
					  success: function (res) {
						alert('分享成功了');
					  },
					  cancel: function (res) {
						alert('分享取消了');
					  },
					  fail: function (res) {
						alert(JSON.stringify(res));
					  }
					});
					alert('分享'); 
				  });
		},
		scanQRCode:function(){
			wx.scanQRCode({
				needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
				scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
				success: function (res) {
					//var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
				}
			});
		},
		transmitWX:function(){
			wx.onMenuShareTimeline({
			  title: '我的分享',
			  desc: '分享内容啦',
			  link: 'http://movie.douban.com/subject/25785114/',
			  imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
			  trigger: function (res) {
				alert('触发了');
			  },
			  complete: function (res) {
				alert(JSON.stringify(res));
			  },
			  success: function (res) {
				alert('成功了');
			  },
			  cancel: function (res) {
				alert('取消了');
			  },
			  fail: function (res) {
				alert(JSON.stringify(res));
			  }
			});
		},
        setSecurityKey: function (security) {
            securityKey = security;
        },
        getSecurityKey: function () {
            return securityKey;
        },
        checkSecurityKey: function (type,activeId) {
            var _self = this;
            if(!this.getSecurityKey()){
                this.getData({
                    url:"/yjsWebService/web/security/getManagerStartSecurity",
                    data:(type==0?{token:this.getToken(),buildId:activeId}:{token:this.getToken(),type:type,activeId:activeId}),
                    async:false,
                    success: function (data) {
                        data = eval("("+data+")");
                        _self.setSecurityKey(data.securityKey);
                    }
                });
            }
        },
        changeToLocalSecurity: function (security) {
            var _self = this;
            _self.getData({
                url:"/yjsWebService/web/security/checkMySecurity",
                data:{token:_self.getToken(),securityKey:security},
                async:false,
                success: function (data) {
                    _self.setSecurityKey(data.securityKey);
                }
            });
        },
        is_weiXin:function(){
            var ua = navigator.userAgent.toLowerCase();
            return ua.match(/MicroMessenger/i)=="micromessenger";
        },
        hideBottom: function (value) {
            this.useNativeFunction("hideBottom",value);
        },
        transmit: function (url) {
            this.useNativeFunction("transmit",url);
        },
        callTel: function (tel) {
            this.useNativeFunction("callTel",tel);
        },
        sendMessage: function (name,img,tel) {
            this.useNativeFunction("sendMessage",name,img,tel);
        },
        hideTop: function (value) {
            this.useNativeFunction("hideTop",value);
        },
        alarmMe: function (id,time) {
            this.useNativeFunction("alarmMe",id,time);
            if(window.bridge){
                alarmList =  bridge.getAlarmList("a","b","c");
            }
        },
        setAlarmList: function (list) {
            alarmList = list;
        },
        getAlarmList: function () {
            if (is_PC()||this.is_weiXin()){
                return alarmList;
            }else{
                if(!test&&!alarmList){
                    if(window.bridge){
                        alarmList =  bridge.getAlarmList("a","b","c");
                    }else{
                        this.useNativeFunction("YJSay.setAlarmList");
                    }
                    return alarmList;
                }else{
                    return alarmList;
                }
            }
        },
        addSale: function (id) {
            this.useNativeFunction("addSale",id);
        },
        changeToMoney: function (val) {
            return (val/100).toFixed(2)+"元";
        },
        showImage: function (type,src) {
            if(type=="image"){
                $(".mask").removeClass('hidden').find(".ewm-img").html("<img src="+src+" style='width: 180px;'>");
            }else if(type=="qrcode"){
                $(".mask").removeClass('hidden').find(".ewm-img").html("<div class='qrcode' style='width: 180px;'></div>")
                    .find(".qrcode").qrcode({width:180,height:180,text: src});
            }
            $(".ios-qy").removeClass('hidden');
        },
        isEmptyObject: function (e) {
            var t;
            for (t in e){
                return !1;
            }
            return !0;
        },
        calculateLeftTime: function (time) {
            var cur = new Date();
            var startTime = new Date(time==undefined?"":time.replace(/\./g, "/"));
            var xiangcha = (startTime.getTime()-cur.getTime())/1000;
            var hours = parseInt(xiangcha/3600);
            var minus = parseInt((xiangcha%3600)/60);
            var second = parseInt(xiangcha%60);
            if (hours>24){
                return parseInt(hours/24)+"天";
            }else if (second>=0){
                return (hours<10?"0"+hours:hours)+":"+(minus<10?"0"+minus:minus)+":"+(second<10?"0"+second:second);
            }else{
                return "00:00:00";
            }
        },
        utf16to8:function(str) {
            var out, i, len, c;
            out = "";
            len = str.length;
            for(i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if ((c >= 0x0001) && (c <= 0x007F)) {
                    out += str.charAt(i);
                } else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
                } else {
                    out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
                }
            }
            return out;
        },
        zhuanFa: function (activeId,type) {
            var _self = this;
            _self.checkSecurityKey(type,activeId);
            if(type==5){
                _self.getData({
                    url:"/yjsWebService/point/getHunheZhuanFaPoint",
                    data:{token:_self.getToken(),sourceId:activeId,securityKey:_self.getSecurityKey()},
                    success: function (data) {
                        //console.log(JSON.stringify(data));
                        _self.setSecurityKey(data.pointInfo.securityKey);
                    }
                });
            }else if(type==3){
                _self.getData({
                    url:"/yjsWebService/point/getHaibaoZhuanFaPoint",
                    data:{token:_self.getToken(),sourceId:activeId,securityKey:_self.getSecurityKey()},
                    success: function (data) {
                        //alert(JSON.stringify(data));
                        _self.setSecurityKey(data.pointInfo.securityKey);
                    }
                });
            }else if(type==1){
                _self.getData({
                    url:"/yjsWebService/point/getLoushuZhuanfaPoint",
                    data:{token:_self.getToken(),sourceId:activeId,securityKey:_self.getSecurityKey()},
                    success: function (data) {
                        //alert(JSON.stringify(data));
                        _self.setSecurityKey(data.pointInfo.securityKey);
                    }
                });
            }
        },
        getUrlParamValue: function (url,param) {
            console.log(url+" "+param);
            var params=[],values=[],value="";
            $.each(url.split("?")[1].split("&"), function () {
                params.push(this.split("=")[0]);
                values.push(this.split("=")[1]);
            });
            console.log(params);
            console.log(values);
            console.log(params.length);
            console.log(params[0]);
            if(params.length==1){
                if(params[0]==param){
                    value = values[0];
                }
            }else{
                $.each(params, function (index,ele) {
                    console.log(this);
                    if(this==param){
                        console.log(index);
                        value = values[index];
                        return false;
                    }
                });
            }
            console.log("value:"+value);
            return value;
        },
        useNativeFunction:function (funcName,data1,data2,data3){
            if(window.bridge){ return window.bridge[funcName](data1,data2,data3);}
            var myIframe = document.createElement('iframe');
            myIframe.style.display = 'none';
            myIframe.src = 'bridge:@/'+funcName+"@/"+data1+"@/"+data2+"@/"+data3;
            document.documentElement.appendChild(myIframe);
            setTimeout(function() { document.documentElement.removeChild(myIframe) }, 0);
        }
    }
})(jQuery);