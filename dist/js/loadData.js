/**
 * Created by Administrator on 2016/5/23.
 */
function loadData(id){
    console.log(id);
    console.log($("#YJ_louPanIntro").is(":visible"));
    if(id===""||id=="#YJ_HOME"){
        if(!test){
            YJSay.hideBottom(false);
			YJSay.setTitle("1家说");
            //YJSay.hideTop(false);
        }
        YJSay.getData({
            url:"/yjsWebService/index/getMyIndex",
            data:{token:YJSay.getToken(),pageOffset:0,pageSize:99},
            success: function (data) {
				alert(JSON.stringify(data));
                if(data.code==8003&&YJSay.is_weiXin()){
					localStorage.setItem("locationHref",location.hash);
                    location.href="login.html";
					return;
                }
                var _userInfo = data.userInfo;
                console.log(_userInfo);
                if(_userInfo&&!YJSay.isEmptyObject(_userInfo)){
                    $("#YJ_HOME_USERNAME").text(_userInfo.name.length>6?_userInfo.name.substring(0,6)+"...":_userInfo.name);//用户名
                    $("#YJ_HOME_IMGURL").attr("src",_userInfo.imgUrl);//用户头像
                    $("#YJ_HOME_VANTAGES").text(_userInfo.vantages);//总积分
                    $("#YJ_HOME_VALID_VANTAGES").text(_userInfo.validVantages/100);//余额
                    $('#YJ_HOME_DAILY_POINT').text(_userInfo.dailyPoint/100);//今日收入
                    $("#YJ_HOME").find(".paiMing").text(_userInfo.myIndex);//排名
                    $("#YJ_HOME").find(".level").attr("src",_userInfo.rankImage);//等级
                    var _buildList = data.buildList;
                    console.log(_buildList);
                    var _html="";
					//_buildList = [];
                    $.each(_buildList, function (index,ele) {
                        var sale = {saleUserAccountId:this.saleUserAccountId,tel:this.tel,saleName:this.saleName,saleImage:this.saleImage};
                        var buildName = this.buildName;
                        var buildId = this.buildId;
                        YJSay.checkSecurityKey("0",buildId);
                        _html+='<li id='+buildId+' class="loupanItem" data-salename='+this.saleName+' data-saletel='+this.tel+'>'+
                            '<div class="box-big loupan '+(index?"top10":"")+'">'+
                            '<img src='+this.buildImage+' alt="楼盘封面" class="loupanCover">'+
                            '<div class="erweimaWrap" data-src="YJSay.type=build&'+YJSay.getSecurityKey()+'&'+buildId+'&'+buildName+'&'+_userInfo.name+'">'+
                            '<div class="erweima"></div>'+
                            '</div>'+
                            '<div class="loupanPrice colorfff">'+this.salePrice+'元/平方米</div>'+
                            '<div class="loupanInfo">'+
                            '<h4 class="no-margin">'+buildName+'<i></i></h4>'+
                            '<p class="top10 small-font colora3a">'+this.buildDes+'</p>'+
                            '<div class="xiaoShouWrap">'+
                            '<div class="xiaoShou">'+
                            '<img src='+this.saleImage+' alt="销售头像">'+
                            '<span>'+this.saleName+'</span>';
                            YJSay.getData({
                                url:"/yjsWebService/userInfo/checkUserOfFriendship",
                                data:{token:YJSay.getToken(),subscribeAccountId:this.saleUserAccountId},
                                async:false,
                                success: function (data) {
                                    if(!data.hasSubscribed){

                                        _html+='<ul class="entry entry-three" data-id='+sale.saleUserAccountId+'>'+
                                        '<li class="first" data-tel='+sale.tel+'><a><i class="fa fa-phone right5"></i>拨电话</a></li>'+
                                        '<li class="second" data-name='+sale.saleName+' data-img='+sale.saleImage+' data-tel='+sale.tel+'><a><i class="fa fa-commenting right5"></i>发信息</a></li>' +
                                        '<li class="last circleBottom"><a><i class="fa fa-user-plus right5"></i>加好友</a></li>';
                                    }else{
                                        _html+='<ul class="entry entry-two" data-id='+sale.saleUserAccountId+'>'+
                                            '<li class="first" data-tel='+sale.tel+'><a><i class="fa fa-phone right5"></i>拨电话</a></li>'+
                                            '<li class="second circleBottom" data-name='+sale.saleName+' data-img='+sale.saleImage+' data-tel='+sale.tel+'><a><i class="fa fa-commenting right5"></i>发信息</a></li>' +
                                            '<li class="last hidden"><a><i class="fa fa-user-plus right5"></i>加好友</a></li>';
                                    }
                                }
                            });
                            _html+='<li><div class="entry-trangle"></div></li>'+
                            '</ul>'+
                            '</div>'+
                            '</div>'+
                            '</div>'+
                            '</div>'+
                            '</li>';
                    });
                    $("#YJ_louPanList").html(_html);
                    _html?$("#YJ_hasNoBuild").addClass("hidden"):$("#YJ_hasNoBuild").removeClass("hidden");
                    $.each($(".loupanItem"), function () {
                        $(this).find(".erweima").qrcode({width:30,height:30,text: YJSay.utf16to8($(this).find(".erweimaWrap").attr("data-src"))});
                    });
                }
            }
        })
    }else if(id=="#YJ_louPanDetail"&&$("#YJ_louPanIntro").is(":visible")){
        if(!test){
            YJSay.hideBottom(true);
            //YJSay.hideTop(true);
			YJSay.setTitle("楼盘详情");
        }
        YJSay.getData({
            url:"/yjsWebService/build/getBuildInfoDetail",
            data:{token:YJSay.getToken(),buildId:getHomeBuildId()},
            success: function (data) {
                if(data.code==8003&&YJSay.is_weiXin()){
					localStorage.setItem("locationHref",location.hash);
                    location.href="login.html";
                    return;
                }
                var _saleInfo = data.saleInfo;
                if(_saleInfo&&!YJSay.isEmptyObject(_saleInfo)){
                    $("#louPanSaleName").text(_saleInfo.saleName);
                    $("#louPanSaleTel").text(_saleInfo.tel);
                    $("#callToSale").attr("data-tel",_saleInfo.tel);
                }
                console.log(data);
                var _loupan = data.buildInfo;
                if(_loupan&&!YJSay.isEmptyObject(_loupan)){
                    var buildName = _loupan.buildName;
                    var buildAddress = _loupan.addressDisplay;
                    buildAddress = buildAddress.split('');
                    for (var i = 14; i < buildAddress.length; i += 15){
                        buildAddress[i] += '\<br\/\>';
                    }
                    buildAddress.join('');
                    $("#cover").attr("src",_loupan.buildImage);
                    $("#salePrice").text(_loupan.salePrice);
                    $("#openTime").text(_loupan.openTtime);
                    $("#saleStatus").text(["预售","开售","销售结束"][_loupan.saleStatus-1]);
                    $("#addressDisplay").html(buildAddress);
                    $("#developerName").text(_loupan.developerName);
                    /*$("#buildType").text(loupan.buildType);*/
                    /*$("#total").text(loupan.total);*/
                    $("#tel").text(_loupan.tel);
                    /*$("#fax").text(loupan.fax);*/
                    $("#deliveryTime").text(_loupan.deliveryTime);
                    $("#intro").html("楼盘简介"+'<p class="box formal-font color3232 top10 intro">'+_loupan.des+'</p>');
                    //$("#saleTel").attr("href","tel:"+loupan.tel);
                    var huxing = data.buildTypeImgList;
                    var _html = "";
                    $.each(huxing, function () {
                        _html+='<div class="swiper-slide"><img src='+this.img+' style="width: 100%;height: 100%;"></div>';
                    });
                    $("#imgScroll").find(".swiper-wrapper").html(_html);
					if(!firstInlouPan){
						firstInlouPan=true;
						_height = $(".intro").height();
					}
                    console.log(_height);
                    $(".intro").css({height: "18px",overflow: "hidden"});
                    mySwiper1  = new Swiper(document.getElementById("imgScroll"), {
                        slidesPerView: 'auto',
                        centeredSlides: false,
                        spaceBetween: 20,
                        grabCursor: true
                    });
                    YJSay.getData({
                        url:"/yjsWebService/config/getBuildLocation",
                        data:{buildId:getHomeBuildId()},
                        success: function (data) {
                            YJSay.useNativeFunction("setLocation",data.lat+"&"+data.lng,buildName,_loupan.addressDisplay);
                        },error: function () {
                            alert("获取数据失败");
                        }
                    });
                }
            }
        });
    }else if(id=="#YJ_louPanDetail"&&$("#YJ_active").is(":visible")){
        console.log("活动");
        if(!test) {
            YJSay.hideBottom(true);
            //YJSay.hideTop(true);
            YJSay.setTitle("楼盘详情");
        }
        YJSay.getData({
            url:"/yjsWebService/build/hunhe/getHunheListByBuildId",
            data:{token:YJSay.getToken(),buildId:getHomeBuildId(),pageOffset:0,pageSize:99},
            success: function (data) {
				alert(JSON.stringify(data));
                console.log(data);
                var alarmList = YJSay.getAlarmList();
                var _html="";
                $.each(data.activeList, function (index,ele) {
                    var hasAlarm = alarmList.split(",").indexOf(this.id.toString())!=-1;
                    var _status = activeStatus(this.status,this.startTime,this.endTime);
                    _html+='<div class="imgBox '+(index?"top10":"")+'">'+
                        '<img class="listImg" src='+this.coverPicture+' id='+this.id+' data-type='+(this.hongbaoId?"hongbao":"baoming")+'>'+
                        '<div class="round-button round-button1"><div class="qrcode" data-src='+this.qrCode+'></div></div>'+
                        '<div class="round-button round-button2"><img src="dist/img/1jiabi_03.png"></div>'+
                        '<div class="box" style="display: table;word-spacing: -1em;">'+
                        '<div class="box7" style="vertical-align: middle;">'+
                        '<div class="boxPadding">'+
                        '<div class="box bt1height xiangdui">'+
                        '<span class="bt1 color3232">'+this.name+'</span>'+
                        '<span class="formal-font colore61f left10"></span>'+
                        /*'<span class="formal-font color3232 juedui">已点赞</span>'+*/
                        '</div>'+
                        '<div class="box bt1height xiangdui '+(this.hongbaoId?'':'hidden')+'" style="word-spacing: 0;">'+
                            '<span class="small-font color3232">'+this.startTime+'开抢红包，共'+YJSay.changeToMoney(this.point)+'</span>'+
                        '</div>'+
                        '<div class="box bt1height xiangdui '+(this.hongbaoId?'hidden':'')+'" style="word-spacing: 0;">'+
                        '<span class="small-font color3232">'+this.startTime+'-'+this.endTime+'</span>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
                        if(_status!="已过期"&&_status!="已下线"&&_status!="已开始"){
                            _html+=
                                '<div class="box3 xiangdui hasAlarm '+(hasAlarm?"":"hidden")+'" style="vertical-align: middle;height: 100%">'+
                                '<div class="boxPadding juedui text-center" style="width: 8rem;padding-top: 9px;">'+
                                '<div class="box bt1height ">'+
                                '<span class="small-font colore61f leftTime" data-time='+this.startTime+'></span>'+
                                '</div>'+
                                '<div class="box bt1height ">'+
                                '<span class="formal-font color000">已设置提醒</span>'+
                                '</div>'+
                                '</div>'+
                                '</div>'+
                                '<div class="box3 xiangdui alarm '+(hasAlarm?"hidden":"")+'" data-id='+this.id+' data-start='+this.startTime+' style="vertical-align: middle;height: 100%">'+
                                '<div class="boxPadding juedui text-center" style="background: #e61f42;width: 8rem;padding-top: 9px;">'+
                                '<div class="box bt1height ">'+
                                '<span class="small-font colorfff leftTime" data-time='+this.startTime+'></span>'+
                                '</div>'+
                                '<div class="box bt1height ">'+
                                '<span class="bt1 colorfff">提醒我</span>'+
                                '</div>'+
                                '</div>'+
                                '</div>';
                        }else{
                            _html+=
                                '<div class="box3 xiangdui" style="vertical-align: middle;height: 100%">'+
                                '<div class="boxPadding juedui text-center" style="width: 8rem;background: #e61f42;padding-top: 24px;padding-bottom: 25px;">'+
                                '<div class="box bt1height ">'+
                                '<span class="bt1 colorfff">'+_status+'</span>'+
                                '</div>'+
                                '</div>'+
                                '</div>';
                        }
                        _html+='</div>'+
                        '</div>';
                });
                $("#YJ_active").html(_html);
                $.each($("#YJ_active").find(".qrcode"), function () {
                    $(this).qrcode({width:30,height:30,text:$(this).attr("data-src")});
                });
                timeInterval();
            }
        });
    }else if(id=="#YJ_louPanDetail"&&$("#YJ_haiBao").is(":visible")){
        console.log("海报");
        if(!test) {
            YJSay.hideBottom(true);
            //YJSay.hideTop(true);
            YJSay.setTitle("楼盘详情");
        }
        YJSay.getData({
            url:"/yjsWebService/build/haibao/getHaibaoListByBuildId",
            data:{token:YJSay.getToken(),buildId:getHomeBuildId(),pageOffset:0,pageSize:99},
            success: function (data) {
				alert(JSON.stringify(data));
                console.log(data);
                var _html="";
                $.each(data.activeList, function (index,ele) {
                    _html+='<div class="imgBox '+(index?"top10":"")+'">'+
                        '<img class="listImg" src='+this.coverPicture+' id="'+this.id+'" data-type="haibao">'+
                        '<div class="round-button round-button1"><div class="qrcode" data-src='+this.qrCode+'></div></div>'+
                        '<div class="round-button round-button2"><img src="dist/img/1jiabi_03.png"></div>'+
                        '<div class="box-big">'+
                        '<div class="box xiangdui boxPadding">'+
                        '<span class="bt1 color3232">'+this.haibaoName+'</span>'+
                        '<div class="boxPadding juedui text-center" style="width: 8rem;background: #e61f42;padding-top: 7px;padding-bottom: 6px;">'+
                        '<div class="box bt1height ">'+
                        '<span class="bt1 colorfff">'+activeStatus(this.status,this.startTime,this.endTime)+'</span>'+
                        '</div>'+
                        '</div>'+
                        /*'</div>'+*/
                        /*'<span class="formal-font color3232 juedui">已参与</span>'+*/
                        '</div>'+
                        '</div>'+
                        '</div>';
                });
                $("#YJ_haiBao").html(_html);
                $.each($("#YJ_haiBao").find(".qrcode"), function () {
                    $(this).qrcode({width:30,height:30,text:$(this).attr("data-src")});
                });
            }
        });
    }else if(id=="#YJ_louPanDetail"&&$("#YJ_louShu").is(":visible")){
        console.log("楼书");
        if(!test) {
            YJSay.hideBottom(true);
            //YJSay.hideTop(true);
            YJSay.setTitle("楼盘详情");
        }
        YJSay.getData({
            url:"/yjsWebService/build/loushu/getLoushuListByBuildId",
            data:{token:YJSay.getToken(),buildId:getHomeBuildId(),pageOffset:0,pageSize:99},
            success: function (data) {
                alert(JSON.stringify(data));
                var _html="";
                $.each(data.activeList, function (index,ele) {
                    console.log(index);
                    _html+='<div class="imgBox '+(index?"top10":"")+'">'+
                        '<img class="listImg" src='+this.coverPicture+' id="'+this.id+'" data-path='+this.path+' data-type="loushu">'+
                        '<div class="round-button round-button1"><img src='+this.qrCode+'></div>'+
                        '<div class="round-button round-button2"><img src="dist/img/1jiabi_03.png"></div>'+
                        '<div class="box-big">'+
                        '<div class="box boxPadding xiangdui">'+
                        '<span class="bt1 color3232">'+this.loushuName+'</span>'+
                        /*'<span class="formal-font color3232 juedui">已参与</span>'+*/
                        '<div class="boxPadding juedui text-center" style="width: 8rem;background: #e61f42;padding-top: 7px;padding-bottom: 6px;">'+
                        '<div class="box bt1height ">'+
                        '<span class="bt1 colorfff">'+activeStatus(this.status,this.startTime,this.endTime)+'</span>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
                });
                $("#YJ_louShu").html(_html);
            }
        });
    }else if(id=="#YJ_louPanDetail"&&$("#YJ_yjBi").is(":visible")){
        console.log("一家币");
        if(!test) {
            YJSay.hideBottom(true);
            //YJSay.hideTop(true);
            YJSay.setTitle("楼盘详情");
        }
        YJSay.getData({
            url:"/yjsWebService/build/getBuildYijiabi",
            data:{token:YJSay.getToken(),buildId:getHomeBuildId()},
            success: function (data) {
                alert(JSON.stringify(data));
                console.log(data);
                if(data.info&&!YJSay.isEmptyObject(data.info)){
                    $("#leftYJBi").text(data.info.validVantages);
                    $("#totalYJBi").text(data.info.totalVantages);
                }else{
                    $("#leftYJBi").text("--");
                    $("#totalYJBi").text("--");
                }

            }
        });
    }else if(id=="#YJ_zhuanQianBang"){
        console.log("赚钱榜");
        if(!test) {
            YJSay.hideBottom(true);
            //YJSay.hideTop(true);
            YJSay.setTitle("赚钱榜");
        }
        YJSay.getData({
            url:"/yjsWebService/index/getTotalSort",
            data:{token:YJSay.getToken()},
            success: function (data) {
                console.log(data);
                $("#myIndex").text(data.myIndex);
                var _html = "";
                $.each(data.list, function () {
                    _html+="<tr><td>"+this.index+"</td><td>"+(this.name.length>6?this.name.substring(0,6)+"...":this.name)+"</td><td>"+this.accountId+"</td><td>"+this.socre+"</td></tr>";
                });
                $("#YJ_zhuanQianBang").find("tbody").html(_html);
            }
        });
    }else if(id=="#YJ_myWollet"){
        console.log("我的钱包");
        if(!test) {
            YJSay.hideBottom(true);
            YJSay.setTitle("我的钱包");
        }
        YJSay.getData({
            url:"/yjsWebService/index/getMyWallet",
            data:{token:YJSay.getToken(),pageOffset:0,pageSize:99},
            success: function (data) {
                alert(JSON.stringify(data));
                console.log(data);
                var _userInfo = data.userInfo;
                console.log(_userInfo);
                if(_userInfo&&!YJSay.isEmptyObject(_userInfo)){
                    $("#YJ_myWollet_USERNAME").text(_userInfo.name);//用户名
                    $("#YJ_myWollet_IMGURL").attr("src",_userInfo.imgUrl);//用户头像
                    $("#YJ_myWollet_VANTAGES").text(_userInfo.vantages);//总积分
                    $("#YJ_myWollet_VALID_VANTAGES").text(_userInfo.validVantages/100);//余额
                    $('#YJ_myWollet_DAILY_POINT').text(_userInfo.dailyPoint/100);//今日收入
                    $("#YJ_myWollet").find(".level").attr("src",_userInfo.rankImage);//等级
                    var _list = data.list;
                    var _html = "";
                    $.each(_list, function () {
                        _html+="<tr><td>"+this.eventName+"</td><td>"+YJSay.changeToMoney(this.point)+"</td><td>"+this.time+"</td></tr>";
                    });
                    $("#YJ_myWollet").find("tbody").html(_html);
                }
            }
        });
    }else if(id=="#YJ_activeContent"&&$("#YJ_activeContent").attr("data-from")=="home-active"){
        if(!test) {
            YJSay.hideBottom(true);
            YJSay.setTitle("活动内容");
        }
        console.log("首页活动内容");
		var height = $(window).height();
		var bottomHeight = $(".navbar-absolute-bottom").height();
		$("#YJ_ACTIVE_COVER").css({height:height-bottomHeight+"px"})
				.html('<iframe id="testIframe" data-token='+YJSay.getToken()+' src="'+YJSay.baseUrl+'/img/haibao/jsEditor/poster/diy/'+getHomeBuildId()+'/'+$("#YJ_activeContent").attr("data-activeId")+'/1.html" frameborder="0" style="width: 100%;height: 100%;"></iframe>');
    }else if(id=="#YJ_activeContent"&&$("#YJ_activeContent").attr("data-from")=="home-haibao"){
        if(!test) {
            YJSay.hideBottom(true);
            YJSay.setTitle("海报内容");
        }
        console.log("首页海报内容");
		var height = $(window).height();
		var bottomHeight = $(".navbar-absolute-bottom").height();
		$("#YJ_ACTIVE_COVER").css({height:height-bottomHeight+"px"})
				.html('<iframe id="testIframe" src="'+YJSay.baseUrl+'/img/haibao/jsEditor/poster/'+getHomeBuildId()+'/'+$("#YJ_activeContent").attr("data-activeId")+'/1.html" frameborder="0" style="width: 100%;height: 100%;"></iframe>');
    }else if(id=="#YJ_activeContent"&&$("#YJ_activeContent").attr("data-from")=="home-loushu"){
        if(!test) {
            YJSay.hideBottom(true);
            YJSay.setTitle("楼书内容");
        }
		var height = $(window).height();
		var bottomHeight = $(".navbar-absolute-bottom").height();
		$("#YJ_ACTIVE_COVER").css({height:height-bottomHeight+"px"})
				.html('<iframe id="testIframe" src='+path.replace("www","src")+' frameborder="0" style="width: 100%;height: 100%;"></iframe>');
        $('#testIframe').on('load', function(){
            console.log("加载了");
            var phoneScale = 1;
            //phoneWidth = parseInt(window.screen.width);
            phoneWidth = $(window).width();
            phoneScale = phoneWidth/640;

            var dom=$('body',parent.document).find('#testIframe').contents().find('#coolapp').find('.wrap');
            //var dom=$('body',parent.document).find('#testIframe');
            //var dom=$('body',parent.document).find('#testIframe').contents().find('body');
            dom.css({
                'transform': 'scale('+phoneScale+','+phoneScale+')',
                'transform-origin':'left top',
                'height': '300%',
                'width': '300%'
            });
            //dom.find('#coolapp').find('.wrap').width('300%');
        });
        console.log("首页楼书内容");
    }else if(id=="#YJ_activeContent"&&$("#YJ_activeContent").attr("data-from")=="tuiguang-active"){
        console.log("推广活动内容");
        if(!test) {
            YJSay.hideBottom(true);
            YJSay.setTitle("活动内容");
        }
		var height = $(window).height();
		var bottomHeight = $(".navbar-absolute-bottom").height();
		$("#YJ_ACTIVE_COVER").css({height:height-bottomHeight+"px"})
				.html('<iframe id="testIframe" src="'+YJSay.baseUrl+'/img/haibao/jsEditor/poster/diy/'+getTuiBuildId()+'/'+$("#YJ_activeContent").attr("data-activeId")+'/1.html" frameborder="0" style="width: 100%;height: 100%;"></iframe>');
    }else if(id=="#YJ_activeContent"&&$("#YJ_activeContent").attr("data-from")=="tuiguang-haibao"){
        if(!test) {
            YJSay.hideBottom(true);
            YJSay.setTitle("海报内容");
        }
        console.log("推广海报内容");
		var height = $(window).height();
		var bottomHeight = $(".navbar-absolute-bottom").height();
		$("#YJ_ACTIVE_COVER").css({height:height-bottomHeight+"px"})
				.html('<iframe id="testIframe" src="'+YJSay.baseUrl+'/img/haibao/jsEditor/poster/'+getTuiBuildId()+'/'+$("#YJ_activeContent").attr("data-activeId")+'/1.html" frameborder="0" style="width: 100%;height: 100%;"></iframe>');
    }else if(id=="#YJ_activeContent"&&$("#YJ_activeContent").attr("data-from")=="tuiguang-loushu"){
        if(!test) {
            YJSay.hideBottom(true);
            YJSay.setTitle("楼书内容");
        }
		var height = $(window).height();
		var bottomHeight = $(".navbar-absolute-bottom").height();
		$("#YJ_ACTIVE_COVER").css({height:height-bottomHeight+"px"})
				.html('<iframe id="testIframe" src='+path.replace("www","src")+' frameborder="0" style="width: 100%;height: 100%;"></iframe>');
		$('#testIframe').on('load', function(){
            console.log("加载了");
            var phoneScale = 1;
            //phoneWidth = parseInt(window.screen.width);
            phoneWidth = $(window).width();
            phoneScale = phoneWidth/640;

            var dom=$('body',parent.document).find('#testIframe').contents().find('#coolapp').find('.wrap');
            //var dom=$('body',parent.document).find('#testIframe');
            //var dom=$('body',parent.document).find('#testIframe').contents().find('body');
            dom.css({
                'transform': 'scale('+phoneScale+','+phoneScale+')',
                'transform-origin':'left top',
                'height': '300%',
                'width': '300%'
            });
            //dom.find('#coolapp').find('.wrap').width('300%');
        });
        console.log("推广楼书内容");
    }else if(id=="#YJ_baseInfo"&&$("#YJ_baseInfo").attr("data-from")=="home-active"){
        if(!test) {
            YJSay.setTitle("基本内容");
        }
        console.log("活动基本信息");
        YJSay.getData({
            url:"/yjsWebService/build/hunhe/getHunheDetailById",
            data:{token:YJSay.getToken(),activeId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _active = data.active;
                if(_active&&!YJSay.isEmptyObject(_active)){
                    $("#YJ_ACTIVE_NAME").text(_active.name);
                    $("#YJ_ACTIVE_STARTTIME").text(_active.startTime);
                    $("#YJ_ACTIVE_ENDTIME").text(_active.endTime);
                    $("#YJ_ACTIVE_STATUS").text(activeStatus(_active.status,_active.startTime,_active.endTime));
                }else{
                    $("#YJ_ACTIVE_NAME").text("--");
                    $("#YJ_ACTIVE_STARTTIME").text("--");
                    $("#YJ_ACTIVE_ENDTIME").text("--");
                    $("#YJ_ACTIVE_STATUS").text("--");
                }
            }
        });
        YJSay.getData({
            url:"/yjsWebService/build/hunhe/getHunheLocationByActiveId",
            data:{token:YJSay.getToken(),activeId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _location = data.locationInfo;
                var _html = "";
                $.each(_location, function () {
                    _html+='<tr><td>'+this.province+'</td><td>'+this.city+'</td><td>'+this.country+'</td></tr>';
                });
                $("#YJ_baseInfo").find("tbody").html(_html);
            }
        });
    }else if(id=="#YJ_tuiGuangJiangLi"&&$("#YJ_tuiGuangJiangLi").attr("data-from")=="home-active"){
        if(!test) {
            YJSay.setTitle("推广奖励");
        }
        console.log("活动推广奖励");
        YJSay.getData({
            url:"/yjsWebService/web/hunhe/getHunhePointByActiveId",
            data:{token:YJSay.getToken(),activeId:$("#YJ_tuiGuangJiangLi").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _point = data.pointInfo;
				$("#YJ_ZHUANFA_JIFEN").closest("li").show();
                $("#YJ_GUANZHU_JIFEN").closest("li").show();
                $("#YJ_DIANZHAN_JIFEN").closest("li").show();
                $("#YJ_LIULAN_JIFEN").closest("li").show();
                if(_point&&!YJSay.isEmptyObject(_point)){
                    $("#YJ_ZHUANFA_JIFEN").text(_point.zhuanfa+"分");
                    $("#YJ_GUANZHU_JIFEN").text(_point.guanzhu+"分");
                    $("#YJ_DIANZHAN_JIFEN").text(_point.dianzan+"分");
                    $("#YJ_LIULAN_JIFEN").text(_point.liulan+"分");
                }else{
                    $("#YJ_ZHUANFA_JIFEN").text("--分");
                    $("#YJ_GUANZHU_JIFEN").text("--分");
                    $("#YJ_DIANZHAN_JIFEN").text("--分");
                    $("#YJ_LIULAN_JIFEN").text("--分");
                }
            }
        });
    }else if(id=="#YJ_myParticipation"&&$("#YJ_activeContent").attr("data-type")=="hongbao"){
        if(!test) {
            YJSay.setTitle("我的参与");
        }
        console.log("活动-红包我的参与");
        console.log($("#YJ_activeContent").attr("data-type"));
        YJSay.getData({
            url:"/yjsWebService/web/hunhe/getMyHongbaoPartIn",
            data:{token:YJSay.getToken(),activeId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _point = data.pointInfo;
                $("#YJ_myParticipation").find(".listItem").show();
                $("#myShare").show();
                if(_point&&!YJSay.isEmptyObject(_point)){
                    $("#YJ_YUEDU_HUODE").text(_point.yuedu+"分("+YJSay.changeToMoney(_point.yuedu)+"1家币)");
                    $("#YJ_DIANZAN_HUODE").text(_point.dianzan+"分("+YJSay.changeToMoney(_point.dianzan)+"1家币)");
                    $("#YJ_ZHUANFA_HUODE").text(_point.zhuanfa+"分("+YJSay.changeToMoney(_point.zhuanfa)+"1家币)");
                    $("#YJ_GUANZHU_HUODE").text(_point.guanzhu+"分("+YJSay.changeToMoney(_point.guanzhu)+"1家币)");
                    $("#YJ_MY_HONGBAO").text(YJSay.changeToMoney(data.myHongbao)+"1家币");
                    $("#YJ_MY_SHARE").text(YJSay.changeToMoney(data.myFenxiang)+"1家币");
                }
            }
        });
    }else if(id=="#YJ_myShare"){
        if(!test) {
            YJSay.setTitle("我的分享");
        }
        console.log("活动-红包我的分享");
        YJSay.getData({
            url:"/yjsWebService/web/hunhe/getMyHongbaoPartIn",
            data:{token:YJSay.getToken(),activeId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _point = data.pointInfo;
                $("#YJ_myParticipation").find(".listItem").show();
                $("#myShare").show();
                if(_point&&!YJSay.isEmptyObject(_point)){
                    $("#YJ_YUEDU_HUODE").text(_point.yuedu+"分("+YJSay.changeToMoney(_point.yuedu)+"1家币)");
                    $("#YJ_DIANZAN_HUODE").text(_point.dianzan+"分("+YJSay.changeToMoney(_point.dianzan)+"1家币)");
                    $("#YJ_ZHUANFA_HUODE").text(_point.zhuanfa+"分("+YJSay.changeToMoney(_point.zhuanfa)+"1家币)");
                    $("#YJ_GUANZHU_HUODE").text(_point.guanzhu+"分("+YJSay.changeToMoney(_point.guanzhu)+"1家币)");
                }
            }
        });
    }else if(id=="#YJ_myParticipation"&&$("#YJ_activeContent").attr("data-type")=="baoming"){
        if(!test) {
            YJSay.setTitle("我的参与");
        }
        console.log("活动-报名我的参与");
        console.log($("#YJ_activeContent").attr("data-type"));
        YJSay.getData({
            url:"/yjsWebService/web/hunhe/getMyBaomingPartIn",
            data:{token:YJSay.getToken(),activeId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _point = data.pointInfo;
                $("#YJ_myParticipation").find(".listItem").show();
                $("#myShare").hide();
                console.log(_point.yuedu);
                if(_point&&!YJSay.isEmptyObject(_point)){
                    $("#YJ_YUEDU_HUODE").text(_point.yuedu+"分("+YJSay.changeToMoney(_point.yuedu)+"1家币)");
                    $("#YJ_DIANZAN_HUODE").text(_point.dianzan+"分("+YJSay.changeToMoney(_point.dianzan)+"1家币)");
                    $("#YJ_ZHUANFA_HUODE").text(_point.zhuanfa+"分("+YJSay.changeToMoney(_point.zhuanfa)+"1家币)");
                    $("#YJ_GUANZHU_HUODE").text(_point.guanzhu+"分("+YJSay.changeToMoney(_point.guanzhu)+"1家币)");
                }
            }
        });
    }else if(id=="#YJ_baseInfo"&&$("#YJ_baseInfo").attr("data-from")=="home-loushu"){
        if(!test) {
            YJSay.setTitle("基本信息");
        }
        console.log("楼书基本信息");
        YJSay.getData({
            url:"/yjsWebService/build/loushu/getLoushuDetailById",
            data:{token:YJSay.getToken(),loushuId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _active = data.loushu;
                if(_active&&!YJSay.isEmptyObject(_active)){
                    $("#YJ_ACTIVE_NAME").text(_active.appName);
                    $("#YJ_ACTIVE_STARTTIME").text(_active.startTime);
                    $("#YJ_ACTIVE_ENDTIME").text(_active.endTime);
                    $("#YJ_ACTIVE_STATUS").text(activeStatus(_active.status,_active.startTime,_active.endTime));
                }else{
                    $("#YJ_ACTIVE_NAME").text("--");
                    $("#YJ_ACTIVE_STARTTIME").text("--");
                    $("#YJ_ACTIVE_ENDTIME").text("--");
                    $("#YJ_ACTIVE_STATUS").text("--");
                }
            }
        });
        YJSay.getData({
            url:"/yjsWebService/build/loushu/getLoushuLocationByActiveId",
            data:{token:YJSay.getToken(),loushuId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _location = data.locationInfo;
                var _html = "";
                $.each(_location, function () {
                    _html+='<tr><td>'+this.province+'</td><td>'+this.city+'</td><td>'+this.country+'</td></tr>';
                });
                $("#YJ_baseInfo").find("tbody").html(_html);
            }
        });
    }else if(id=="#YJ_tuiGuangJiangLi"&&$("#YJ_tuiGuangJiangLi").attr("data-from")=="home-loushu"){
        if(!test) {
            YJSay.setTitle("推广奖励");
        }
        console.log("楼书推广奖励");
        YJSay.getData({
            url:"/yjsWebService/build/loushu/getLoushuPointByActiveId",
            data:{token:YJSay.getToken(),loushuId:$("#YJ_tuiGuangJiangLi").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _point = data.pointInfo;
				$("#YJ_ZHUANFA_JIFEN").closest("li").show();
                $("#YJ_GUANZHU_JIFEN").closest("li").show();
                $("#YJ_DIANZHAN_JIFEN").closest("li").show();
                $("#YJ_LIULAN_JIFEN").closest("li").show();
                if(_point&&!YJSay.isEmptyObject(_point)){
                    $("#YJ_ZHUANFA_JIFEN").text(_point.zhuanfa+"分");
                    $("#YJ_GUANZHU_JIFEN").text(_point.guanzhu+"分");
                    $("#YJ_DIANZHAN_JIFEN").text(_point.dianzan+"分");
                    $("#YJ_LIULAN_JIFEN").text(_point.liulan+"分");
                }else{
                    $("#YJ_ZHUANFA_JIFEN").text("--分");
                    $("#YJ_GUANZHU_JIFEN").text("--分");
                    $("#YJ_DIANZHAN_JIFEN").text("--分");
                    $("#YJ_LIULAN_JIFEN").text("--分");
                }
            }
        });
    }else if(id=="#YJ_myParticipation"&&$("#YJ_activeContent").attr("data-type")=="loushu"){
        if(!test) {
            YJSay.setTitle("我的参与");
        }
        console.log("楼书我的参与");
        console.log($("#YJ_activeContent").attr("data-type"));
        YJSay.getData({
            url:"/yjsWebService/web/loushu/getMyPartIn",
            data:{token:YJSay.getToken(),loushuId:$("#YJ_activeContent").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                alert(JSON.stringify(data));
                var _point = data.pointInfo;
                $("#YJ_myParticipation").find(".listItem").show();
                $("#myShare").hide();
                $("#YJ_MY_HONGBAO").closest("li").hide();
                if(_point&&!YJSay.isEmptyObject(_point)){
                    $("#YJ_YUEDU_HUODE").text(_point.yuedu+"分("+YJSay.changeToMoney(_point.yuedu)+"1家币)");
                    $("#YJ_DIANZAN_HUODE").text(_point.dianzan+"分("+YJSay.changeToMoney(_point.dianzan)+"1家币)");
                    $("#YJ_ZHUANFA_HUODE").text(_point.zhuanfa+"分("+YJSay.changeToMoney(_point.zhuanfa)+"1家币)");
                    $("#YJ_GUANZHU_HUODE").text(_point.guanzhu+"分("+YJSay.changeToMoney(_point.guanzhu)+"1家币)");
                }
            }
        });
    }else if(id=="#YJ_baseInfo"&&$("#YJ_baseInfo").attr("data-from")=="home-haibao"){
        if(!test) {
            YJSay.setTitle("基本信息");
        }
        console.log("海报基本信息");
        YJSay.getData({
            url:"/yjsWebService/build/haibao/getHaibaoDetailById",
            data:{token:YJSay.getToken(),haibaoId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _active = data.haibao;
                if(_active&&!YJSay.isEmptyObject(_active)){
                    $("#YJ_ACTIVE_NAME").text(_active.haibaoName);
                    $("#YJ_ACTIVE_STARTTIME").text(_active.startTime);
                    $("#YJ_ACTIVE_ENDTIME").text(_active.endTime);
                    $("#YJ_ACTIVE_STATUS").text(activeStatus(_active.status,_active.startTime,_active.endTime));
                }else{
                    $("#YJ_ACTIVE_NAME").text("--");
                    $("#YJ_ACTIVE_STARTTIME").text("--");
                    $("#YJ_ACTIVE_ENDTIME").text("--");
                    $("#YJ_ACTIVE_STATUS").text("--");
                }
            }
        });
        YJSay.getData({
            url:"/yjsWebService/build/haibao/getHaibaoLocationByActiveId",
            data:{token:YJSay.getToken(),haibaoId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _location = data.locationInfo;
                var _html = "";
                $.each(_location, function () {
                    _html+='<tr><td>'+this.province+'</td><td>'+this.city+'</td><td>'+this.country+'</td></tr>';
                });
                $("#YJ_baseInfo").find("tbody").html(_html);
            }
        });
    }else if(id=="#YJ_tuiGuangJiangLi"&&$("#YJ_tuiGuangJiangLi").attr("data-from")=="home-haibao"){
        if(!test) {
            YJSay.setTitle("推广奖励");
        }
        console.log("海报推广奖励");
        YJSay.getData({
            url:"/yjsWebService/build/haibao/getHaibaoPointByActiveId",
            data:{token:YJSay.getToken(),haibaoId:$("#YJ_tuiGuangJiangLi").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _point = data.pointInfo;
                $("#YJ_ZHUANFA_JIFEN").closest("li").show();
                $("#YJ_GUANZHU_JIFEN").closest("li").show();
                $("#YJ_DIANZHAN_JIFEN").closest("li").hide();
                $("#YJ_LIULAN_JIFEN").closest("li").hide();
                if(_point&&!YJSay.isEmptyObject(_point)){
                    $("#YJ_ZHUANFA_JIFEN").text(_point.zhuanfa+"分");
                    $("#YJ_GUANZHU_JIFEN").text(_point.guanzhu+"分");
                    $("#YJ_DIANZHAN_JIFEN").text(_point.dianzan+"分");
                    $("#YJ_LIULAN_JIFEN").text(_point.liulan+"分");
                }else{
                    $("#YJ_ZHUANFA_JIFEN").text("--分");
                    $("#YJ_GUANZHU_JIFEN").text("--分");
                    $("#YJ_DIANZHAN_JIFEN").text("--分");
                    $("#YJ_LIULAN_JIFEN").text("--分");
                }
            }
        });
    }else if(id=="#YJ_myParticipation"&&$("#YJ_activeContent").attr("data-type")=="haibao"){
		alert("进入了我的参与-海报");
        if(!test) {
            YJSay.setTitle("我的参与");
        }
        console.log("海报我的参与");
        console.log($("#YJ_activeContent").attr("data-type"));
        YJSay.getData({
            url:"/yjsWebService/web/haibao/getMyPartIn",
            data:{token:YJSay.getToken(),haibaoId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _point = data.pointInfo;
                $("#YJ_myParticipation").find(".listItem").show();
                $("#YJ_YUEDU_HUODE").closest(".listItem").hide();
                $("#YJ_DIANZAN_HUODE").closest(".listItem").hide();
                $("#myShare").hide();
                $("#YJ_YUEDU_HUODE").text("--分(--元1家币)");
                $("#YJ_DIANZAN_HUODE").text("--分(--元1家币)");
                if(_point&&!YJSay.isEmptyObject(_point)){
                    $("#YJ_ZHUANFA_HUODE").text(_point.zhuanfa+"分("+YJSay.changeToMoney(_point.zhuanfa)+"1家币)");
                    $("#YJ_GUANZHU_HUODE").text(_point.guanzhu+"分("+YJSay.changeToMoney(_point.guanzhu)+"1家币)");
                }

            }
        });
    }else if(id=="#YJ_myTuiGuang"&&$("#YJ_MYTUIGUANG_ACTIVE").is(":visible")){
        console.log("我的推广-活动");
        if(!test) {
            YJSay.hideBottom(true);
            YJSay.setTitle("我的推广");
        }
        YJSay.getData({
            url:"/yjsWebService/web/hunhe/getMyHunheList",
            data:{token:YJSay.getToken(),pageOffset:0,pageSize:99},
            success: function (data) {
                console.log(data);
                var _html="";
				var alarmList = YJSay.getAlarmList();
                $.each(data.list, function (index,ele) {
                    var hasAlarm = alarmList.split(",").indexOf(this.id.toString())!=-1;
                    var _status = activeStatus(this.status,this.startTime,this.endTime);
                    _html+='<div class="imgBox '+(index?"top10":"")+'" id='+this.buildId+'>'+
                                '<img class="listImg" src='+this.coverPicture+' id='+this.id+' data-type='+(this.hongbaoId?"hongbao":"baoming")+'>'+
                                '<div class="round-button round-button1"><div class="qrcode" data-src='+this.qrCode+'></div></div>'+
                                '<div class="round-button round-button2"><img src="dist/img/1jiabi_03.png"></div>'+
                                '<div class="box" style="display: table;word-spacing: -1em;">'+
                                    '<div class="box7" style="vertical-align: middle;">'+
                                        '<div class="boxPadding">'+
                                            '<div class="box bt1height xiangdui">'+
                                                '<span class="bt1 color3232">'+this.name+'</span>'+
                                                '<span class="formal-font colore61f left10"></span>'+
                                                /*'<span class="formal-font color3232 juedui">已点赞</span>'+*/
                                            '</div>'+
                                            '<div class="box bt1height xiangdui '+(this.hongbaoId?'':'hidden')+'" style="word-spacing: 0;">'+
                                                '<span class="small-font color3232">'+this.startTime+'开抢红包，共'+YJSay.changeToMoney(this.totalPoint)+'</span>'+
                                            '</div>'+
                                            '<div class="box bt1height xiangdui '+(this.hongbaoId?'hidden':'')+'" style="word-spacing: 0;">'+
                                            '<span class="small-font color3232">'+this.startTime+'-'+this.endTime+'</span>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>';
                                    if(_status!="已过期"&&_status!="已下线"&&_status!="已开始"){
                                        _html+=
                                            '<div class="box3 xiangdui hasAlarm '+(hasAlarm?"":"hidden")+'" style="vertical-align: middle;height: 100%">'+
                                            '<div class="boxPadding juedui text-center" style="width: 8rem;padding-top: 9px;">'+
                                            '<div class="box bt1height ">'+
                                            '<span class="formal-font colore61f leftTime" data-time='+this.startTime+'></span>'+
                                            '</div>'+
                                            '<div class="box bt1height ">'+
                                            '<span class="formal-font color000">已设置提醒</span>'+
                                            '</div>'+
                                            '</div>'+
                                            '</div>'+
                                            '<div class="box3 xiangdui alarm '+(hasAlarm?"hidden":"")+'" data-id='+this.id+' data-start='+this.startTime+' style="vertical-align: middle;height: 100%">'+
                                            '<div class="boxPadding juedui text-center" style="background: #e61f42;width: 8rem;padding-top: 9px;">'+
                                            '<div class="box bt1height ">'+
                                            '<span class="small-font colorfff leftTime" data-time='+this.startTime+'></span>'+
                                            '</div>'+
                                            '<div class="box bt1height ">'+
                                            '<span class="bt1 colorfff">提醒我</span>'+
                                            '</div>'+
                                            '</div>'+
                                            '</div>';
                                    }else{
                                        _html+=
                                            '<div class="box3 xiangdui" style="vertical-align: middle;height: 100%">'+
                                            '<div class="boxPadding juedui text-center" style="width: 8rem;background: #e61f42;padding-top: 24px;padding-bottom: 25px;">'+
                                            '<div class="box bt1height ">'+
                                            '<span class="bt1 colorfff">'+_status+'</span>'+
                                            '</div>'+
                                            '</div>'+
                                            '</div>';
                                    }
                                _html+='</div>'+
                                '</div>';
                });
                $("#YJ_MYTUIGUANG_ACTIVE").html(_html);
                $.each($("#YJ_MYTUIGUANG_ACTIVE").find(".qrcode"), function () {
                    $(this).qrcode({width:30,height:30,text:$(this).attr("data-src")});
                });
                timeInterval();
            }
        });
    }else if(id=="#YJ_baseInfo"&&$("#YJ_baseInfo").attr("data-from")=="tuiguang-active"){
        if(!test) {
            YJSay.setTitle("基本信息");
        }
        console.log("活动基本信息");
        YJSay.getData({
            url:"/yjsWebService/web/hunhe/getMyHunheDetail",
            data:{token:YJSay.getToken(),activeId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _active = data.active;
                if(_active&&!YJSay.isEmptyObject(_active)){
                    $("#YJ_ACTIVE_NAME").text(_active.name);
                    $("#YJ_ACTIVE_STARTTIME").text(_active.startTime);
                    $("#YJ_ACTIVE_ENDTIME").text(_active.endTime);
                    $("#YJ_ACTIVE_STATUS").text(activeStatus(_active.status,_active.startTime,_active.endTime));
                }else{
                    $("#YJ_ACTIVE_NAME").text("--");
                    $("#YJ_ACTIVE_STARTTIME").text("--");
                    $("#YJ_ACTIVE_ENDTIME").text("--");
                    $("#YJ_ACTIVE_STATUS").text("--");
                }
            }
        });
        YJSay.getData({
            url:"/yjsWebService/web/hunhe/getHunheLocationByActiveId",
            data:{token:YJSay.getToken(),activeId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _location = data.locationInfo;
                var _html = "";
                $.each(_location, function () {
                    _html+='<tr><td>'+this.province+'</td><td>'+this.city+'</td><td>'+this.country+'</td></tr>';
                });
                $("#YJ_baseInfo").find("tbody").html(_html);
            }
        });
    }else if(id=="#YJ_tuiGuangJiangLi"&&$("#YJ_tuiGuangJiangLi").attr("data-from")=="tuiguang-active"){
        if(!test) {
            YJSay.setTitle("推广奖励");
			YJSay.hideBottom(true);
        }
        console.log("活动推广奖励");
        YJSay.getData({
            url:"/yjsWebService/web/hunhe/getHunhePointByActiveId",
            data:{token:YJSay.getToken(),activeId:$("#YJ_tuiGuangJiangLi").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _point = data.pointInfo;
				$("#YJ_ZHUANFA_JIFEN").closest("li").show();
                $("#YJ_GUANZHU_JIFEN").closest("li").show();
                $("#YJ_DIANZHAN_JIFEN").closest("li").show();
                $("#YJ_LIULAN_JIFEN").closest("li").show();
                if(_point&&!YJSay.isEmptyObject(_point)){
                    $("#YJ_ZHUANFA_JIFEN").text(_point.zhuanfa+"分");
                    $("#YJ_GUANZHU_JIFEN").text(_point.guanzhu+"分");
                    $("#YJ_DIANZHAN_JIFEN").text(_point.dianzan+"分");
                    $("#YJ_LIULAN_JIFEN").text(_point.liulan+"分");
                }else{
                    $("#YJ_ZHUANFA_JIFEN").text("--分");
                    $("#YJ_GUANZHU_JIFEN").text("--分");
                    $("#YJ_DIANZHAN_JIFEN").text("--分");
                    $("#YJ_LIULAN_JIFEN").text("--分");
                }
            }
        });
    }else if(id=="#YJ_myTuiGuang"&&$("#YJ_MYTUIGUANG_HAIBAO").is(":visible")){
        if(!test) {
            YJSay.setTitle("我的推广");
        }
        console.log("我的推广-海报");
        YJSay.getData({
            url:"/yjsWebService/web/haibao/getMyHaibaoList",
            data:{token:YJSay.getToken(),pageOffset:0,pageSize:99},
            success: function (data) {
                console.log(data);
                var _html="";
                $.each(data.list, function (index,ele) {
                    _html+='<div class="imgBox '+(index?"top10":"")+'" id='+this.buildId+'>'+
                        '<img class="listImg" src='+this.coverPicture+' id="'+this.id+'" data-type="haibao" >'+
                        '<div class="round-button round-button1"><div class="qrcode" data-src='+this.qrCode+'></div></div>'+
                        '<div class="round-button round-button2"><img src="dist/img/1jiabi_03.png"></div>'+
                        '<div class="box-big">'+
                        '<div class="box boxPadding xiangdui">'+
                        '<span class="bt1 color3232">'+this.haibaoName+'</span>'+
                            /*'<span class="formal-font color3232 juedui">已参与</span>'+*/
                        '<div class="boxPadding juedui text-center" style="width: 8rem;background: #e61f42;padding-top: 7px;padding-bottom: 6px;">'+
                        '<div class="box bt1height ">'+
                        '<span class="bt1 colorfff">'+activeStatus(this.status,this.startTime,this.endTime)+'</span>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
                });
                $("#YJ_MYTUIGUANG_HAIBAO").html(_html);
                $.each($("#YJ_MYTUIGUANG_HAIBAO").find(".qrcode"), function () {
                    $(this).qrcode({width:30,height:30,text:$(this).attr("data-src")});
                });
            }
        });
    }else if(id=="#YJ_baseInfo"&&$("#YJ_baseInfo").attr("data-from")=="tuiguang-haibao"){
        if(!test) {
            YJSay.setTitle("基本信息");
        }
        console.log("海报基本信息");
        YJSay.getData({
            url:"/yjsWebService/web/haibao/getMyHaibaoDetail",
            data:{token:YJSay.getToken(),haibaoId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _active = data.haibao;
                if(_active&&!YJSay.isEmptyObject(_active)){
                    $("#YJ_ACTIVE_NAME").text(_active.haibaoName);
                    $("#YJ_ACTIVE_STARTTIME").text(_active.startTime);
                    $("#YJ_ACTIVE_ENDTIME").text(_active.endTime);
                    $("#YJ_ACTIVE_STATUS").text(activeStatus(_active.status,_active.startTime,_active.endTime));
                }else{
                    $("#YJ_ACTIVE_NAME").text("--");
                    $("#YJ_ACTIVE_STARTTIME").text("--");
                    $("#YJ_ACTIVE_ENDTIME").text("--");
                    $("#YJ_ACTIVE_STATUS").text("--");
                }
            }
        });
        YJSay.getData({
            url:"/yjsWebService/web/haibao/getHaibaoLocationByActiveId",
            data:{token:YJSay.getToken(),haibaoId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _location = data.locationInfo;
                var _html = "";
                $.each(_location, function () {
                    _html+='<tr><td>'+this.province+'</td><td>'+this.city+'</td><td>'+this.country+'</td></tr>';
                });
                $("#YJ_baseInfo").find("tbody").html(_html);
            }
        });
    }else if(id=="#YJ_tuiGuangJiangLi"&&$("#YJ_tuiGuangJiangLi").attr("data-from")=="tuiguang-haibao"){
        if(!test) {
            YJSay.setTitle("推广奖励");
			YJSay.hideBottom(true);
        }
        console.log("海报推广奖励");
        YJSay.getData({
            url:"/yjsWebService/build/haibao/getHaibaoPointByActiveId",
            data:{token:YJSay.getToken(),haibaoId:$("#YJ_tuiGuangJiangLi").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _point = data.pointInfo;
                $("#YJ_ZHUANFA_JIFEN").closest("li").show();
                $("#YJ_GUANZHU_JIFEN").closest("li").show();
                $("#YJ_DIANZHAN_JIFEN").closest("li").hide();
                $("#YJ_LIULAN_JIFEN").closest("li").hide();
                if(_point&&!YJSay.isEmptyObject(_point)){
                    $("#YJ_ZHUANFA_JIFEN").text(_point.zhuanfa+"分");
                    $("#YJ_GUANZHU_JIFEN").text(_point.guanzhu+"分");
                    $("#YJ_DIANZHAN_JIFEN").text(_point.dianzan+"分");
                    $("#YJ_LIULAN_JIFEN").text(_point.liulan+"分");
                }else{
                    $("#YJ_ZHUANFA_JIFEN").text("--分");
                    $("#YJ_GUANZHU_JIFEN").text("--分");
                    $("#YJ_DIANZHAN_JIFEN").text("--分");
                    $("#YJ_LIULAN_JIFEN").text("--分");
                }
            }
        });
    }else if(id=="#YJ_myTuiGuang"&&$("#YJ_MYTUIGUANG_LOUSHU").is(":visible")){
        if(!test) {
            YJSay.setTitle("我的推广");
        }
        console.log("我的推广-楼书");
        YJSay.getData({
            url:"/yjsWebService/web/loushu/getMyLoushuList",
            data:{token:YJSay.getToken(),pageOffset:0,pageSize:99},
            success: function (data) {
				alert(JSON.stringify(data));
                console.log(data);
                var _html="";
                $.each(data.list, function (index,ele) {
                    console.log(index);
                    _html+='<div class="imgBox '+(index?"top10":"")+'" id='+this.buildId+'>'+
                        '<img class="listImg" src='+this.coverPicture+' id="'+this.id+'" data-path="'+this.path+'"  data-type="loushu">'+
                        '<div class="round-button round-button1"><img src='+this.qrCode+'></div>'+
                        '<div class="round-button round-button2"><img src="dist/img/1jiabi_03.png"></div>'+
                        '<div class="box-big">'+
                        '<div class="box boxPadding xiangdui">'+
                        '<span class="bt1 color3232">'+this.appName+'</span>'+
                            /*'<span class="formal-font color3232 juedui">已参与</span>'+*/
                        '<div class="boxPadding juedui text-center" style="width: 8rem;background: #e61f42;padding-top: 7px;padding-bottom: 6px;">'+
                        '<div class="box bt1height ">'+
                        '<span class="bt1 colorfff">'+activeStatus(this.status,this.startTime,this.endTime)+'</span>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
                });
                $("#YJ_MYTUIGUANG_LOUSHU").html(_html);
            }
        });
    }else if(id=="#YJ_baseInfo"&&$("#YJ_baseInfo").attr("data-from")=="tuiguang-loushu"){
        if(!test) {
            YJSay.setTitle("基本信息");
        }
        console.log("楼书基本信息");
        YJSay.getData({
            url:"/yjsWebService/web/loushu/getMyLoushuDetail",
            data:{token:YJSay.getToken(),loushuId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _active = data.haibao;
				$("#YJ_ZHUANFA_JIFEN").closest("li").show();
                $("#YJ_GUANZHU_JIFEN").closest("li").show();
                $("#YJ_DIANZHAN_JIFEN").closest("li").show();
                $("#YJ_LIULAN_JIFEN").closest("li").show();
                if(_active&&!YJSay.isEmptyObject(_active)){
                    $("#YJ_ACTIVE_NAME").text(_active.appName);
                    $("#YJ_ACTIVE_STARTTIME").text(_active.startTime);
                    $("#YJ_ACTIVE_ENDTIME").text(_active.endTime);
                    $("#YJ_ACTIVE_STATUS").text(activeStatus(_active.status,_active.startTime,_active.endTime));
                }else{
                    $("#YJ_ACTIVE_NAME").text("--");
                    $("#YJ_ACTIVE_STARTTIME").text("--");
                    $("#YJ_ACTIVE_ENDTIME").text("--");
                    $("#YJ_ACTIVE_STATUS").text("--");
                }
            }
        });
        YJSay.getData({
            url:"/yjsWebService/web/loushu/getLoushuLocationByActiveId",
            data:{token:YJSay.getToken(),loushuId:$("#YJ_baseInfo").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _location = data.locationInfo;
                var _html = "";
                $.each(_location, function () {
                    _html+='<tr><td>'+this.province+'</td><td>'+this.city+'</td><td>'+this.country+'</td></tr>';
                });
                $("#YJ_baseInfo").find("tbody").html(_html);
            }
        });
    }else if(id=="#YJ_tuiGuangJiangLi"&&$("#YJ_tuiGuangJiangLi").attr("data-from")=="tuiguang-loushu"){
        if(!test) {
            YJSay.setTitle("推广奖励");
			YJSay.hideBottom(true);
        }
        console.log("楼书推广奖励");
        YJSay.getData({
            url:"/yjsWebService/web/loushu/getLoushuPointByActiveId",
            data:{token:YJSay.getToken(),loushuId:$("#YJ_tuiGuangJiangLi").attr("data-activeId")},
            success: function (data) {
                console.log(data);
                var _point = data.pointInfo;
                if(_point&&!YJSay.isEmptyObject(_point)){
                    $("#YJ_ZHUANFA_JIFEN").text(_point.zhuanfa+"分");
                    $("#YJ_GUANZHU_JIFEN").text(_point.guanzhu+"分");
                    $("#YJ_DIANZHAN_JIFEN").text(_point.dianzan+"分");
                    $("#YJ_LIULAN_JIFEN").text(_point.liulan+"分");
                }else{
                    $("#YJ_ZHUANFA_JIFEN").text("--分");
                    $("#YJ_GUANZHU_JIFEN").text("--分");
                    $("#YJ_DIANZHAN_JIFEN").text("--分");
                    $("#YJ_LIULAN_JIFEN").text("--分");
                }
            }
        });
    }else if(id=="#YJ_1jiFenXiaoLian"){
        console.log("1级分销链");
        if(!test) {
            YJSay.hideBottom(true);
            YJSay.setTitle("分销链");
        }
        YJSay.getData({
            url:"/yjsWebService/web/fenxiao/getMyFenxiaoList",
            data:{token:YJSay.getToken(),pageOffset:0,pageSize:99},
            success: function (data) {
                console.log(data);
                if(data.orderNum!=undefined){
                    $("#YJ_YIJI_ORDER_NUMBER").text(data.orderNum);
                }else{
                    $("#YJ_YIJI_ORDER_NUMBER").text("--");
                }
                if(data.point!=undefined){
                    $("#YJ_YIJI_ORDER_MONEY").text(YJSay.changeToMoney(data.point));
                }else{
                    $("#YJ_YIJI_ORDER_MONEY").text("--元");
                }
                var _list = data.list;
                var _html="";
                $.each(_list, function () {
                    _html+="<tr id="+this.accountId+" data-buildId="+this.buildId+" data-img="+this.imageUrlDisplay+"><td>"+this.accountId+"</td><td>"+this.name+"</td><td>"+this.endDate+"</td></tr>";
                });
                $("#yijiList").find("tbody").html(_html);
            }
        })
    }else if(id=="#YJ_chengJiao"&&$("#YJ_chengJiao").attr("data-level")==1){
        if(!test) {
            YJSay.setTitle("下线详情");
        }
        console.log("1级分销链用户详情");
        $("#YJ_nextJi").closest(".box-big").show();
        YJSay.getData({
            url:"/yjsWebService/web/fenxiao/getMyXiaxianDetail",
            data:{token:YJSay.getToken(),buildId:$("#YJ_chengJiao").attr("data-buildId"),accountId:$("#YJ_chengJiao").attr("data-userId")},
            success: function (data) {
                //"customerStarus":4,"accountId":1,"userName":"理论力学","buildName":"第一个楼盘",
                // "buildId":68,"time":"2016-04-26","endDate":"2016-04-26","activeName":"活动来了",
                // "orderNum":1,"orderMoney":1000
                console.log(data);
                var _info = data.info;
                if(!YJSay.isEmptyObject(_info)){
                    $("#YJ_USER_IMG").attr("src",$("#YJ_chengJiao").attr("data-userImg"));//用户头像
                    $("#YJ_USER_NAME").text(_info.userName);//用户名
                    $("#YJ_USER_ACCORD").text(_info.accountId);//用户帐号
                    $("#YJ_RELATE_LOUPAN_NAME").text(_info.buildName);//关联楼盘
                    $("#YJ_RELATE_ACTIVE_NAME").text(_info.activeName);//关联活动
                    $("#YJ_RELATE_TIME").text(_info.time);//关联时间
                    if(_info.orderNum){
                        $("#YJ_DEAL_NUMBER").closest(".box-big").show();
                        $("#YJ_DEAL_NUMBER").text(_info.orderNum+"套");
                        $("#YJ_REBATE_MONEY").text(YJSay.changeToMoney(_info.orderMoney));
                    }else{
                        $("#YJ_DEAL_NUMBER").closest(".box-big").hide();
                        $("#YJ_DEAL_NUMBER").text("--套");//成交套数
                        $("#YJ_REBATE_MONEY").text("--元");//返利金额
                    }
                }else{
                    $("#YJ_USER_IMG").attr("src","");//用户头像
                    $("#YJ_USER_NAME").text("--");//用户名
                    $("#YJ_USER_ACCORD").text("--");//用户帐号
                    $("#YJ_RELATE_LOUPAN_NAME").text("--");//关联楼盘
                    $("#YJ_RELATE_ACTIVE_NAME").text("--");//关联活动
                    $("#YJ_RELATE_TIME").text("--");//关联时间
                    $("#YJ_DEAL_NUMBER").closest(".box-big").hide();
                    $("#YJ_DEAL_NUMBER").text("--套");//成交套数
                    $("#YJ_REBATE_MONEY").text("--元");//返利金额
                }

            }
        })
    }else if(id=="#YJ_2jiFenXiaoLian"){
        if(!test) {
            YJSay.setTitle("分销链");
        }
        console.log("2级分销链");
        YJSay.getData({
            url:"/yjsWebService/web/fenxiao/getFenxiaoPreToNest",
            data:{token:YJSay.getToken(),pageOffset:0,pageSize:99,accountId:$("#YJ_USER_ACCORD").text(),buildId:$("#YJ_chengJiao").attr("data-buildid")},
            success: function (data) {
                console.log(data);
                if(data.orderNum!=undefined){
                    $("#YJ_ERJI_ORDER_NUMBER").text(data.orderNum);
                }else{
                    $("#YJ_ERJI_ORDER_NUMBER").text("--");
                }
                if(data.point!=undefined){
                    $("#YJ_ERJI_ORDER_MONEY").text(YJSay.changeToMoney(data.point));
                }else{
                    $("#YJ_ERJI_ORDER_MONEY").text("--元");
                }
                var _list = data.list;
                var _html="";
                $.each(_list, function () {
                    _html+="<tr id="+this.accountId+" data-buildId="+this.buildId+" data-img="+this.imageUrlDisplay+"><td>"+this.accountId+"</td><td>"+this.name+"</td><td>"+this.endDate+"</td></tr>";
                });
                $("#erjiList").find("tbody").html(_html);
            }
        })
    }else if(id=="#YJ_chengJiao"&&$("#YJ_chengJiao").attr("data-level")==2){
        if(!test) {
            YJSay.setTitle("下线详情");
        }
        console.log("2级分销链用户详情");
        $("#YJ_nextJi").closest(".box-big").show();
        YJSay.getData({
            url:"/yjsWebService/web/fenxiao/getMyXiaxianDetail",
            data:{token:YJSay.getToken(),buildId:$("#YJ_chengJiao").attr("data-buildId"),accountId:$("#YJ_chengJiao").attr("data-userId")},
            success: function (data) {
                //"customerStarus":4,"accountId":1,"userName":"理论力学","buildName":"第一个楼盘",
                // "buildId":68,"time":"2016-04-26","endDate":"2016-04-26","activeName":"活动来了",
                // "orderNum":1,"orderMoney":1000
                console.log(data);
                var _info = data.info;
                if(!YJSay.isEmptyObject(_info)){
                    $("#YJ_USER_IMG").attr("src",$("#YJ_chengJiao").attr("data-userImg"));//用户头像
                    $("#YJ_USER_NAME").text(_info.userName);//用户名
                    $("#YJ_USER_ACCORD").text(_info.accountId);//用户帐号
                    $("#YJ_RELATE_LOUPAN_NAME").text(_info.buildName);//关联楼盘
                    $("#YJ_RELATE_ACTIVE_NAME").text(_info.activeName);//关联活动
                    $("#YJ_RELATE_TIME").text(_info.time);//关联时间
                    if(_info.orderNum){
                        $("#YJ_DEAL_NUMBER").closest(".box-big").show();
                        $("#YJ_DEAL_NUMBER").text(_info.orderNum+"套");
                        $("#YJ_REBATE_MONEY").text(YJSay.changeToMoney(_info.orderMoney));
                    }else{
                        $("#YJ_DEAL_NUMBER").closest(".box-big").hide();
                        $("#YJ_DEAL_NUMBER").text("--套");//成交套数
                        $("#YJ_REBATE_MONEY").text("--元");//返利金额
                    }
                }else{
                    $("#YJ_USER_IMG").attr("src","");//用户头像
                    $("#YJ_USER_NAME").text("--");//用户名
                    $("#YJ_USER_ACCORD").text("--");//用户帐号
                    $("#YJ_RELATE_LOUPAN_NAME").text("--");//关联楼盘
                    $("#YJ_RELATE_ACTIVE_NAME").text("--");//关联活动
                    $("#YJ_RELATE_TIME").text("--");//关联时间
                    $("#YJ_DEAL_NUMBER").closest(".box-big").hide();
                    $("#YJ_DEAL_NUMBER").text("--套");//成交套数
                    $("#YJ_REBATE_MONEY").text("--元");//返利金额
                }

            }
        })
    }else if(id=="#YJ_3jiFenXiaoLian"){
        if(!test) {
            YJSay.setTitle("分销链");
        }
        console.log("3级分销链");
        YJSay.getData({
            url:"/yjsWebService/web/fenxiao/getFenxiaoPreToNest",
            data:{token:YJSay.getToken(),pageOffset:0,pageSize:99,accountId:$("#YJ_USER_ACCORD").text(),buildId:$("#YJ_chengJiao").attr("data-buildid")},
            success: function (data) {
                console.log(data);
                if(data.orderNum!=undefined){
                    $("#YJ_SANJI_ORDER_NUMBER").text(data.orderNum);
                }else{
                    $("#YJ_SANJI_ORDER_NUMBER").text("--");
                }
                if(data.point!=undefined){
                    $("#YJ_SANJI_ORDER_MONEY").text(YJSay.changeToMoney(data.point));
                }else{
                    $("#YJ_SANJI_ORDER_MONEY").text("--元");
                }
                var _list = data.list;
                var _html="";
                $.each(_list, function () {
                    _html+="<tr id="+this.accountId+" data-buildId="+this.buildId+" data-img="+this.imageUrlDisplay+"><td>"+this.accountId+"</td><td>"+this.name+"</td><td>"+this.endDate+"</td></tr>";
                });
                $("#sanjiList").find("tbody").html(_html);
            }
        })
    }else if(id=="#YJ_chengJiao"&&$("#YJ_chengJiao").attr("data-level")==3){
        if(!test) {
            YJSay.setTitle("下线详情");
        }
        console.log("3级分销链用户详情");
        YJSay.getData({
            url:"/yjsWebService/web/fenxiao/getMyXiaxianDetail",
            data:{token:YJSay.getToken(),buildId:$("#YJ_chengJiao").attr("data-buildId"),accountId:$("#YJ_chengJiao").attr("data-userId")},
            success: function (data) {
                //"customerStarus":4,"accountId":1,"userName":"理论力学","buildName":"第一个楼盘",
                // "buildId":68,"time":"2016-04-26","endDate":"2016-04-26","activeName":"活动来了",
                // "orderNum":1,"orderMoney":1000
                console.log(data);
                $("#YJ_nextJi").closest(".box-big").hide();
                var _info = data.info;
                if(!YJSay.isEmptyObject(_info)){
                    $("#YJ_USER_IMG").attr("src",$("#YJ_chengJiao").attr("data-userImg"));//用户头像
                    $("#YJ_USER_NAME").text(_info.userName);//用户名
                    $("#YJ_USER_ACCORD").text(_info.accountId);//用户帐号
                    $("#YJ_RELATE_LOUPAN_NAME").text(_info.buildName);//关联楼盘
                    $("#YJ_RELATE_ACTIVE_NAME").text(_info.activeName);//关联活动
                    $("#YJ_RELATE_TIME").text(_info.time);//关联时间
                    if(_info.orderNum){
                        $("#YJ_DEAL_NUMBER").closest(".box-big").show();
                        $("#YJ_DEAL_NUMBER").text(_info.orderNum+"套");
                        $("#YJ_REBATE_MONEY").text(YJSay.changeToMoney(_info.orderMoney));
                    }else{
                        $("#YJ_DEAL_NUMBER").closest(".box-big").hide();
                        $("#YJ_DEAL_NUMBER").text("--套");//成交套数
                        $("#YJ_REBATE_MONEY").text("--元");//返利金额
                    }
                }else{
                    $("#YJ_USER_IMG").attr("src","");//用户头像
                    $("#YJ_USER_NAME").text("--");//用户名
                    $("#YJ_USER_ACCORD").text("--");//用户帐号
                    $("#YJ_RELATE_LOUPAN_NAME").text("--");//关联楼盘
                    $("#YJ_RELATE_ACTIVE_NAME").text("--");//关联活动
                    $("#YJ_RELATE_TIME").text("--");//关联时间
                    $("#YJ_DEAL_NUMBER").closest(".box-big").hide();
                    $("#YJ_DEAL_NUMBER").text("--套");//成交套数
                    $("#YJ_REBATE_MONEY").text("--元");//返利金额
                }

            }
        })
    }else if(id=="#YJ_myYJ"){
        console.log("我的一家首页");
        if(!test) {
            YJSay.hideBottom(false);
            YJSay.setTitle("我的1家");
        }
        YJSay.getData({
            url:"/yjsWebService/index/getMyYijia",
            data:{token:YJSay.getToken(),pageOffset:0,pageSize:99},
            success: function (data) {
                alert(JSON.stringify(data));
                console.log(data);
                var _html="";
				var alarmList = YJSay.getAlarmList();
                $.each(data.list, function (index,ele) {
                    var hasAlarm = alarmList.split(",").indexOf(this.id.toString())!=-1;
                    var _status = activeStatus(this.status,this.startTime,this.endTime);
                    if(this.type==5){
                        _html+='<li class="'+(index?"top10":"")+'"><div class="imgBox" id='+this.buildId+'>'+
                            '<img class="listImg" src='+this.coverPictureDisplay+' id='+this.id+' data-type='+(this.hongbaoId?"hongbao":"baoming")+'>'+
                            '<div class="round-button round-button1"><div class="qrcode" data-src='+this.qrCode+'></div></div>'+
                            '<div class="round-button round-button2"><img src="dist/img/1jiabi_03.png"></div>'+
                            '<div class="box" style="display: table;word-spacing: -1em;">'+
                            '<div class="box7" style="vertical-align: middle;">'+
                            '<div class="boxPadding">'+
                            '<div class="box bt1height xiangdui">'+
                            '<span class="bt1 color3232">'+this.name+'</span>'+
                            '<span class="formal-font colore61f left10"></span>'+
                                /*'<span class="formal-font color3232 juedui">已点赞</span>'+*/
                            '</div>'+
                            '<div class="box bt1height xiangdui '+(this.hongbaoId?'':'hidden')+'" style="word-spacing: 0;">'+
                            '<span class="small-font color3232">'+this.startTime+'开抢红包，共'+YJSay.changeToMoney(this.totalPoint)+'</span>'+
                            '</div>'+
                            '<div class="box bt1height xiangdui '+(this.hongbaoId?'hidden':'')+'" style="word-spacing: 0;">'+
                            '<span class="small-font color3232">'+this.startTime+'-'+this.endTime+'</span>'+
                            '</div>'+
                            '</div>'+
                            '</div>';
                        if(_status!="已过期"&&_status!="已下线"&&_status!="已开始"){
                            _html+=
                                '<div class="box3 xiangdui hasAlarm '+(hasAlarm?"":"hidden")+'" style="vertical-align: middle;height: 100%">'+
                                '<div class="boxPadding juedui text-center" style="width: 8rem;padding-top: 9px;">'+
                                '<div class="box bt1height ">'+
                                '<span class="small-font colore61f leftTime" data-time='+this.startTime+'></span>'+
                                '</div>'+
                                '<div class="box bt1height ">'+
                                '<span class="formal-font color000">已设置提醒</span>'+
                                '</div>'+
                                '</div>'+
                                '</div>'+
                                '<div class="box3 xiangdui alarm '+(hasAlarm?"hidden":"")+'" data-id='+this.id+' data-start='+this.startTime+' style="vertical-align: middle;height: 100%">'+
                                '<div class="boxPadding juedui text-center" style="background: #e61f42;width: 8rem;padding-top: 9px;">'+
                                '<div class="box bt1height ">'+
                                '<span class="small-font colorfff leftTime" data-time='+this.startTime+'></span>'+
                                '</div>'+
                                '<div class="box bt1height ">'+
                                '<span class="bt1 colorfff">提醒我</span>'+
                                '</div>'+
                                '</div>'+
                                '</div>';
                        }else{
                            _html+=
                                '<div class="box3 xiangdui" style="vertical-align: middle;height: 100%">'+
                                '<div class="boxPadding juedui text-center" style="width: 8rem;background: #e61f42;padding-top: 24px;padding-bottom: 25px;">'+
                                '<div class="box bt1height ">'+
                                '<span class="bt1 colorfff">'+_status+'</span>'+
                                '</div>'+
                                '</div>'+
                                '</div>';
                        }
                         _html+='</div>'+
                            '</div></li>';
                    }else{
                        _html+='<li class="'+(index?"top10":"")+'"><div class="imgBox" id='+this.buildId+'>'+
                            '<img class="listImg" src='+this.coverPictureDisplay+' id="'+this.id+'" data-path="'+(this.type==1?this.path:"")+'" data-type='+(this.type==1?"loushu":"haibao")+'>'+
                            '<div class="round-button round-button1">'+(this.type==1?"<img src="+this.qrCode+">":"<div class='qrcode' data-src="+this.qrCode+"></div>")+'</div>'+
                            '<div class="round-button round-button2"><img src="dist/img/1jiabi_03.png"></div>'+
                            '<div class="box-big">'+
                            '<div class="box xiangdui boxPadding">'+
                            '<span class="bt1 color3232">'+this.name+'</span>'+
                            '<div class="boxPadding juedui text-center" style="width: 8rem;background: #e61f42;padding-top: 7px;padding-bottom: 6px;">'+
                            '<div class="box bt1height ">'+
                            '<span class="bt1 colorfff">'+activeStatus(this.status,this.startTime,this.endTime)+'</span>'+
                            '</div>'+
                            '</div>'+
                                /*'<span class="formal-font color3232 juedui">已参与</span>'+*/
                            '</div>'+
                            '</div>'+
                            '</div></li>';
                    }
                });
                $(".latestTuiGuang").find("ul").html(_html);
                $.each($(".latestTuiGuang").find(".qrcode"), function () {
                    $(this).qrcode({width:30,height:30,text:$(this).attr("data-src")});
                });
                timeInterval();
            }
        });
    }
}