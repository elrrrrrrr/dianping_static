;(function($){
	var prizeList = $('.turntable ul'),
		firstLi = prizeList.children(":first"),
		overlay = $('.overlay'),
		getPrize = $('.content-box'),
		rulesBox = $('.rules-box'),
		noprize = $('.noprize'),//抽过了
		weizhongjiang = $('.weizhongjiang'),//未中奖 需求又改(╯‵□′)╯︵┻━┻
		nologin = $('.nologin'),
		timer = null,
		info = {},
		response = {},
		i = 0;
	//移动列表&&插入  记录滚动次数

    //组件-提示div
    function OverlayPrize(){
        closeBox();
        overlay.show();
        getPrize.show().find('.prize-text').html(response.msg.prize.prizeName + '!');
        getMobileNum();
    }
	function OverlayRules(){
		closeBox();
        overlay.show();
        rulesBox.show();
    }
    function OverlayNoprize() {
		closeBox();
        overlay.show();
    	noprize.show();
    }
    function Overlayweizhongjiang () {
    	closeBox();
    	overlay.show();
    	weizhongjiang.show();
    }
    function OverlayNologin() {
		closeBox();
        overlay.show();
    	nologin.show();
    }
    function closeBox() {
    	$('.close-btn').on('click', function(){
    		overlay.hide();
    		getPrize.hide();
    		rulesBox.hide();
    		noprize.hide();
    		nologin.hide();
    	}).trigger('click');
    }
    function rules(){
    	$('.rules-btn').on('click', function(){
    		OverlayRules();
	        getPrize.hide();
    	});
    }

    //登陆验证&&短信组件
    function SendMessage(mobileNo, recordId){
	    $.ajax({
	        type: 'POST',
	        dataType: 'json',
	        url: '/prize/ajax/userInfo',
	        data: { recordId: response.msg.recordId, mobileNo: mobileNo}
	    })
	    .done(function(rsp){
	    	switch(rsp.code){
				case 200:
			        //发送成功提示
			        //$('.close-btn').trigger('click');
			        closeBox();
			        alert('发送成功！');
				break;
				default:
		        //发送失败提示
		        alert('对不起，发送失败！');
        		break;
			}
	    })
	    .fail(function(){
	        //发送失败提示
	        alert('对不起，发送失败！');
	    });
	}
	function getMobileNum () {
        $('#content-message-btn').unbind('click').on('click', function(e){
            e.stopPropagation();
            
            var mobileNo = $('#mobileText').val(),
                mobileNoReg = /\d+/;
            if(mobileNo.length === 11 && mobileNoReg.test(mobileNo) && mobileNo.charAt(0) === '1'){
                SendMessage( mobileNo, response.msg.recordId); //发短信
            }else{
                alert('输入有误，请重新输入。');
            }
        });
    }

    //登录
    function Login(logged){
        $.ajax({
            url: '/ajax/json/account/info',
            data: {r: Number(new Date())},
            cache: false,
            async: false,
            success:function(rsp){
                userMobile = rsp.msg.mobile
            }
        })
        .done(function(rsp){
            var code = rsp.code;
            switch(code){
                case 200:
                    var msg = rsp.msg;
                    info.uid = msg.id;
                    info.username = msg.name;
                    info.mobile = msg.mobile;
                    draw();
                break;
                case 403:
                    OverlayNologin();
                break;
                default:
                	OverlayNologin();
                break;
            }
        })
        .fail(function(rsp){
            // popup login redirect
            OverlayNologin();
        });
    }





	//抽奖滚动
	function rollstart(){
		clearInterval(timer);
		prizeList.animate({
			marginTop:'-160px'
		},1000,'easeInCubic',function(){
			$(this).css({marginTop:'0px'}).find('li:first').appendTo(this);
			$(this).find('li:first').appendTo(this);
			$(this).find('li:first').appendTo(this);
			$(this).find('li:first').appendTo(this);
			rolling();
		});
	}
	function rolling(){
		prizeScroll(100, 'linear');
	}
	function prizeScroll(duration, easing){
		prizeList.animate({
			marginTop:'-40px'
		},duration,easing,function(){
			if (i < 29 + response.msg.prize.rank) {
				$(this).css({marginTop:'0px'}).find('li:first').appendTo(this);
				i++;
				rolling();
			}else{
				rollEnd();
			};
		});
	}
	function rollEnd(){
		prizeList.animate({
			marginTop:'-160px'
		},1000,'easeOutCubic', function(){
			switch(response.msg.prize.rank){
					case 1:
					case 2:
					case 3:
					//中奖了
						OverlayPrize();
					break;
					case 4:
						//中奖了
						OverlayPrize();
						getPrize.show().find('.prize-text').html(response.msg.prize.prizeName + '!<br><span>扫描页面右侧二维码，注册旺池微官网，可升级为30元抵用券哦！</span>');
					break;
					default:
						Overlayweizhongjiang();
					break;
				}
		});
	}

	//移动列表&&插入  不记录滚动次数
	function prizsScrollB(duration, easing){
		prizeList.animate({
			marginTop:'-160px'
		},duration,easing,function(){
			$(this).css({marginTop:'0px'}).find('li:first').appendTo(this);
			$(this).find('li:first').appendTo(this);
			$(this).find('li:first').appendTo(this);
			$(this).find('li:first').appendTo(this);
		});
	}

	//默认滚动
	function normalSpeed(){
		prizsScrollB( 2000, 'linear');
		timer = setInterval(function(){prizsScrollB( 2000, 'linear')}, 2000);
	}

	//抽奖
	function draw(){
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/prize/ajax/prizeDraw",
			data: {groupId: 173},
			success: function(rsp){
				switch(rsp.code){
					case 200:
						//有抽奖机会,进行抽奖
						response = rsp;
						rollstart();
					break;
					default:
						OverlayNoprize();
					break;
				}
			},
			error: function(){
				//alert('error!');
				OverlayNoprize();
				return;
			}
		});
	}

    window.lucky = {
        draw: function () {
        	Login();
        }
    }

	$(document).ready(function(){
	    $('#winner-list').prizeRoller();
		rules();
	});
})(jQuery);
