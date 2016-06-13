/**
 * Created by Administrator on 2016/5/22.
 */

var YJSay = (function ($) {
    var token = "";
    var securityKey="";
    var alarmList="";
    var addSaleStatus;
    return {
        baseUrl:"http://src.yjsvip.com",
        getData: function (option) {
            var async = option.async;
            $.ajax({
                url:this.baseUrl+option.url,
                dataType:"JSON",
                type:"POST",
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
            history.go(-1);
        },
        setTitle: function (title) {
            if(this.is_weiXin()){
                document.title = title;
            }else{
                this.useNativeFunction("setTitle",title);
            }
        },
        setToken: function (value) {
            token = value;
        },
        getToken: function () {
            if(is_PC()){
                token = "7B21EB6853924625ACB1E45DFF6F3995";
                return token;
            }else{
                if(!token){
                    if(window.bridge){
                        token =  this.useNativeFunction("getToken");
                    }else if(this.is_weiXin()){
                        if(localStorage.getItem('weChartToken')){
                            token = localStorage.getItem('weChartToken');
                        }else{
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
        setSecurityKey: function (security) {
            securityKey = security;
        },
        getSecurityKey: function () {
            return securityKey;
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
            encodeURIComponent()
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
            if(type==5){
                _self.getData({
                    url:"/yjsWebService/point/getHunheZhuanFaPoint",
                    data:{token:_self.getToken(),sourceId:activeId,securityKey:_self.getSecurityKey()},
                    success: function (data) {
                        //alert(JSON.stringify(data));
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