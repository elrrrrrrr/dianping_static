;(function($){
    $('.btn-rules').on('click',function(){
        $('.rules-box').toggle();
    });
    $('.rules-box .rules-box-close').on('click',function(){
        $(this).parents('.rules-box').hide();
    });

})(jQuery);


//滚动播放
;(function($){
    $("#recordList").each(function(){
        var $this = $(this),
            width = $this.width(),
            $scroll = $("<div>").attr("id","recordList-scroll")
                .css({
                    position: "relative",
                    left: width
                });
            

        function scrollList(){
            var scrollWidth = $scroll.width(),
                left = parseInt($scroll.css("left"), 10);

            if(scrollWidth){
                if(left < -scrollWidth){
                    $scroll.css({left: '385px'});
                }
                else{
                    $scroll.css({left: left - 1});
                }

                setTimeout(arguments.callee, 20);
            }
        }

        $.ajax({
            url:"/prize/ajax/recordList",
            data:{
                groupId: 146,
                max: 10
            },
            success: function(data){
                var recordList = data.msg.recordList,
                    template = "",
                    tempString,
                    max = recordList.length,
                    i;
                for(i = 0; i < max; i++){
                    tempString = '<p><span class="username">' +
                        recordList[i].userNickName +
                        '</span></p>';
                    template += tempString;
                }
                if(!template){
                    template = "现在还没有人中奖哦~";
                }
                $scroll.html(template).appendTo($this);
                scrollList();
            }
        });
    });
})(jQuery);


//答题 抽奖 登陆验证 短信
;(function($){
    var info = {};//存储用户信息
 
    //题库
    function Question(){
        var QuestionArr = [
            {
                "ques" : "此次展览共展出几幅莫奈真迹？",
                "ans" : "B",
                "A" : "55",
                "B" : "40",
                "C" : "43",
                "D" : "62"
            },{
                "ques" : "此次展览所有展品来自哪家美术馆？",
                "ans" : "C",
                "A" : "奥赛博物馆",
                "B" : "橘园博物馆",
                "C" : "马摩丹莫奈美术馆",
                "D" : "中世纪博物馆"
            },{
                "ques" : "莫奈是哪个画派的创始人？",
                "ans" : "D",
                "A" : "巴洛克",
                "B" : "洛可可",
                "C" : "新古典主义",
                "D" : "印象派"
            },{
                "ques" : "此次展览地点在哪里？",
                "ans" : "B",
                "A" : "上海博物馆",
                "B" : "K11",
                "C" : "当代美术馆",
                "D" : "上海当代艺术馆"
            },{
                "ques" : "莫奈擅长画那种画？",
                "ans" : "A",
                "A" : "油画",
                "B" : "版画",
                "C" : "水墨画",
                "D" : "彩画"
            },{
                "ques" : "此次莫奈展的主办方天协文化曾举办过哪个展览？",
                "ans" : "B",
                "A" : "罗丹展",
                "B" : "毕加索展",
                "C" : "达利展",
                "D" : "凡高展"
            },{
                "ques" : "莫奈的导师是？",
                "ans" : "A",
                "A" : "欧仁•布丹",
                "B" : "雷诺阿",
                "C" : "塞尚",
                "D" : "伦勃朗"
            },{
                "ques" : "此次展览的展品来自莫奈哪位亲友捐赠？",
                "ans" : "B",
                "A" : "莫奈的妻子",
                "B" : "莫奈的儿子",
                "C" : "莫奈的朋友",
                "D" : "莫奈的邻居"
            },{
                "ques" : "莫奈出生在哪个国家？",
                "ans" : "A",
                "A" : "法国",
                "B" : "荷兰",
                "C" : "西班牙",
                "D" : "意大利"
            },{
                "ques" : "莫奈的晚年在哪里度过？",
                "ans" : "B",
                "A" : "勒阿弗尔",
                "B" : "吉维尼",
                "C" : "普瓦西",
                "D" : "巴黎"
            }
        ],
        selectedNum = Math.round(Math.random()*10),
        selectedQuestion = QuestionArr[selectedNum];// 取出随机出的数据
            
        return selectedQuestion;
    }

    //答题
    function doQuestion(){
        var getQuestion = Question(),
            questionTitle = getQuestion.ques,
            questionA = getQuestion.A,
            questionB = getQuestion.B,
            questionC = getQuestion.C,
            questionD = getQuestion.D,
            questionAnswer = getQuestion.ans;

            // 将ques a b c d 四个选项放到页面中
            $("#ques").html(questionTitle);
            $("#ansA").html(questionA);
            $("#ansB").html(questionB);
            $("#ansC").html(questionC);
            $("#ansD").html(questionD);

        var drawBack =  function(){
            var rad = $("input[name='choice']:checked").val();

            if (rad!=null) {
                if (rad == questionAnswer) {
                    Overlay();
                    answersY();
                    $('#doDraw').on('click', function(){
                        waiting();
                        setTimeout(function () { 
                            doDraw();
                        }, 3500);                        
                    });
                    //doDraw();//执行抽奖

                } else {
                    Overlay();
                    answersN();
                    $('.answers input').removeAttr('checked');
                    doQuestion();
                }   
            } else {
                alert("请先选择答案");
            }           
        };
        $("#questionBtn").unbind("click").click(function(){
            Login(drawBack);
        });
    }

    //弹框定位
    function Overlay(){
        var boxBg = $('.content-box-bg'),
            overlay = $('.overlay');
        boxBg.show().css({//初始弹框居中
            'left':($(window).width()-boxBg.width())/2 + 'px',
            'top':($(window).height()-boxBg.height())/2 + 'px'
        });
        overlay.show().css({//初始背景层居中
            'width': $(window).width(),
            'height': $(window).height()
        });
        $(window).on('resize', function(){
            boxBg.css({//改变窗口大小时弹框居中
                'left':($(window).width()-boxBg.width())/2 + 'px',
                'top':($(window).height()-boxBg.height())/2 + 'px'
            });
            overlay.css({//改变窗口大小时背景层居中
                'width': $(window).width(),
                'height': $(window).height()
            });
        });

        //ie6兼容
        var isIE7 = $.browser.msie && (Number($.browser.version) <= 7);
        if(isIE7){//ie7及以下的浏览器
            boxBg.css('top', ($(window).height()-boxBg.height())/2 + $(window).scrollTop() + 'px');
            overlay.css('top', $(window).scrollTop() + 'px');
            $(window).scroll(function(){
                boxBg.css('top', ($(window).height()-boxBg.height())/2 + $(window).scrollTop() + 'px');
                overlay.css('top', $(window).scrollTop() + 'px');
            });
        };
    }

    //弹框样式
    ////抽奖弹框样式
    function contentDraw(rsp){
        switch(rsp.msg.prize.rank){
            case 0:
                $('.content-box-memo')
                .empty()
                .attr('class','content-box-memo content-box-tips2')
                .append(
                    '<p class="p1">据说长得美 不容易中奖！</p>' +
                    '<p class="p2">明天再来试试看</p>' +
                    '<p class="p3">&nbsp;</p>' +
                    '<a class="content-box-btn share-button" href="javascript:;" target="_blank">分享到微博</a>'
                );
                $('.content-box-bg').find('.close').show();
            break;
            default:
                if (info.mobile) {
                    $('.content-box-memo')
                    .empty()
                    .attr('class','content-box-memo content-box-tips2')
                    .append(
                        '<p class="p1">运气赞赞赞 恭喜中奖！</p>' +
                        '<p class="p2">您获得了' + rsp.msg.prize.prizeName + '！</p>' +
                        '<p class="p3">(奖品信息会以短信形式发送到会员手机上)</p>' +
                        '<a class="content-box-btn share-button" href="javascript:;" target="_blank">分享到微博</a>'
                    );
                    $('.content-box-bg').find('.close').show();
                    info.recordId = rsp.msg.recordId;
                    SendMessage();
                }else{
                    $('.content-box-memo')
                    .empty()
                    .attr('class','content-box-memo content-box-tips2')
                    .append(
                        '<p class="p1">运气赞赞赞 恭喜中奖！</p>' +
                        '<p class="p2">您获得了' + rsp.msg.prize.prizeName + '！</p>' +
                        '<p class="p3">(系统未能查询到您绑定的手机号,请手动输入)</p>' +
                        '<input id="mobileText" type="text" class="mobile-input" maxlength="11">'+
                        '<input id="content-message-btn" class="confirm btn" type="button" value="发送"/>'+
                        '<br>'+
                        '<a class="content-box-btn share-button" href="javascript:;" target="_blank">分享到微博</a>'
                    );
                    $('.content-box-memo .p3').css('padding-bottom','10px');
                    $('#content-message-btn').on('click', function(e){        
                        info.recordId = rsp.msg.recordId;
                        info.mobile = $('#mobileText').val();
                        if(/^1\d{10}$/.test(info.mobile)){
                            SendMessage(); //发短信
                        }else{
                            alert('输入有误，请重新输入。');
                        }
                    });

               };
                
            break;
            }; 
    }
    ////答题弹框样式
    //////答对弹框样式
    function answersY(){
        $('.content-box-memo')
        .empty()
        .attr('class','content-box-memo content-box-tips2')
        .append(
            '<p class="p1">答对了！</p>' +
            '<p class="p2">马上去抽奖吧！</p>' +
            '<p class="p3">&nbsp;</p>' +
            '<a id="doDraw" class="content-box-btn" href="javascript:;">抽奖</a>'
        );
    }
    //////答错弹框样式
    function answersN(){
        $('.content-box-memo')
        .empty()
        .attr('class','content-box-memo content-box-tips2')
        .append(
            '<p class="p1">答错了！</p>' +
            '<p class="p2">良辰吉时再来一次！</p>' +
            '<p class="p3">（答案都在页面里哦）</p>' +
            '<a class="content-box-btn" href="javascript:;">再试一次</a>'
        );
        $('.content-box-btn').on('click', function(){
            close();
        });
    }
    ////等待弹窗
    function waiting(){
        $('.content-box-memo')
        .empty()
        .attr('class','content-box-memo content-box-waite')
        .append(
            '<p class="p1">正在抽奖中...</p>' +
            '<p class="p2">边欣赏美画边等待吧~</p>' +
            '<div class="lilies" alt="《睡莲》"></div>' +
            '<p class="p3">《睡莲》</p>'
        );
    }
    ////一行文字通用弹框
    function oneline(rsp){
        
        switch(rsp.code){
            case 501:
                $('.content-box-memo')
                .empty()
                .attr('class','content-box-memo content-box-tips2')
                .append(
                    '<p class="p1">' + rsp.msg.message + '</p>' +
                    '<p class="p2">明天再来试试看</p>' +
                    '<p class="p3">&nbsp;</p>' +
                    '<a class="content-box-btn share-button" href="javascript:;" target="_blank">分享到微博</a>'
                );
                $('.content-box-bg').find('.close').show();
            break;
            default:
                $('.content-box-memo')
                .empty()
                .attr('class','content-box-memo content-box-tips1')
                .append(
                    '<p class="p1">' + rsp.msg.message + '</p>' +
                    '<a class="content-box-btn" href="javascript:;">知道了</a>'
                );
                $('.content-box-btn').on('click', function(){
                    close();
                });
            break;
        };
    }
    //登陆按钮弹框
    function toLogin(){
        $('.content-box-memo')
        .empty()
        .attr('class','content-box-memo content-box-tips1')
        .append(
            '<p class="p1">您还没有登陆,请先登陆</p>' +
            '<a class="content-box-btn" href="http://www.dianping.com/login">登陆</a>'
        );
        $('.content-box-btn').on('click', function(){
            close();
        });
    }
    //请输入手机号码
    function inputMobile(){
        $('.content-box-memo')
        .empty()
        .attr('class','content-box-memo content-box-tips2')
        .append(
            '<p class="p1">运气赞赞赞 恭喜中奖！</p>' +
            '<p class="p2">您获得了' + rsp.msg.prize.prizeName + '！</p>' +
            '<p class="p3">(奖品信息会以短信形式发送到会员手机上)</p>' +
            '<a class="content-box-btn share-button" href="javascript:;" target="_blank">分享到微博</a>'
        );
        $('.content-box-bg').find('.close').show();
        info.recordId = rsp.msg.recordId;
    }


    //关闭按钮
    function close(){
        $('.content-box-bg').hide();
        $('.overlay').hide();
        $('.close').hide();
    }
    $('.close').click(function(){
        close();
    });
    
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
                    logged();
                break;
                case 403:
                    toLogin();
                    Overlay();
                break;
                default:
                break;
            }
        })
        .fail(function(rsp){

            // popup login redirect
            toLogin();
            Overlay();
        });
    }

    //发送短信
    function SendMessage(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/prize/ajax/userInfo',
            data: { recordId: info.recordId, mobileNo: info.mobile},
            success: function(rsp){
                switch (rsp.code){
                    case 200:
                        //发送成功提示
                        alert('短信发送成功!');
                    break;
                    default:
                        alert(rsp.msg.message);
                    break;
                };
            },
            error: function(){
                //发送失败提示
                alert('对不起，短信发送失败！');
            }
        });
    }

    //抽奖
    function doDraw (){
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/prize/ajax/prizeDraw",
            data: {groupId: 146},
            success: function(rsp){
                switch(rsp.code){
                    case 200:
                        //有抽奖机会,进行抽奖
                        var prize = rsp.msg.prize,
                            recordId = rsp.msg.recordId,
                            prizeWin = prize.rank,
                            prizeName = prize.prizeName,
                            prizeId = prize.prizeId;
                            contentDraw(rsp);
                        return;
                    break;
                    default:
                        Overlay(); //弹出层
                        oneline(rsp);
                    break;
                }
            },
            error: function(){
                alert('error!');
                // $('#content_box').removeClass('Hide');
                // $('#content_error').removeClass('Hide');
                return;
            }
        });
    }

    //主业务
    window.onload= function(){
        doQuestion();
        $(document).on('click','a.share-button', function(){
            var url = encodeURIComponent(location.href),
            pic = encodeURIComponent('http://event.dianping.com/market/exhibition/images/deal-img.jpg'),
            title = encodeURIComponent('#大众点评#莫奈来啦！法国绝世国宝现身上海K11！52幅大师真迹！保额6亿欧元！错过就是一辈子！戳这儿还能抽免费展票→'),
            address = 'http://service.weibo.com/share/share.php?appkey=1392673069&url=' + url + '&title=' + title;
            window.open(address, '_blank');
        });
    }


})(jQuery);

jQuery.noConflict();
