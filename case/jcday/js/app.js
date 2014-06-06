jQuery(function($) {
	var $win = $(window), $doc = $(document), $wrap = $('.slides-wrap'), $slides = $('.slides'), SLIDES_MAX = $slides.size(), current = 0;

	var $rolldown = $('<a class="fix-roll-down" href="javascript:void(0);"></a>').on('click', function() {
		wheelpage(current + 1);
	});
	function check(id) {
		$('.nav-button').removeClass('current');
		$('#nav' + id).addClass('current');
		current = id;
		//滚动按钮显示
		if (current >= SLIDES_MAX - 1) {
			$rolldown.hide();
		} else {
			$rolldown.show();
		}
	}


	$slides.each(function() {
		var $this = $(this);
		$this.scrollspy({
			min : $this.offset().top,
			container : document,
			onEnter : function() {
				//var id = parseInt($this.attr('id').split('slide')[1], 10) - 1;
				//check(id);
			},
			onLeave : function() {
				//var id = parseInt($this.attr('id').split('slide')[1], 10) - 2;
				//check(id);
			}
		});
	});

	function wheelpage(index) {
		var $slide;
		if ($.isNumeric(index)) {
			$slide = $slides.eq(index);
		}
		if ($slide && $slide.length) {
			//滚动按钮显示
			current = $slides.index($slide);

			if (current >= SLIDES_MAX - 1) {
				$rolldown.hide();
			} else {
				$rolldown.show();
			}
			check(current);

			$.scrollTo('#slide' + (index + 1), 1000, {
				easing : 'swing'
			});

			return true;
		}
		return false;
	}

	//防止hash造成的页面混乱
	$.scrollTo(0, 0);
	//禁用鼠标中键
	//    $doc.on('mousedown', function (e) {
	//        if (e.button == 1) {
	//            e.preventDefault();
	//        }
	//    });
	//插入向下滚动按钮
	$rolldown.appendTo('body');

	//绑定窗口缩放和按键
	$win.on({
		resize : $.throttle(function() {
			var height = Math.max(640, $win.height());
			$('.nav-bar-repeat').height(height - 640);
			$('.nav-trims').height(height);
		}),
		keydown : function(e) {
			switch (e.keyCode || e.which || e.charCode) {
				case 38:
					e.preventDefault();
					wheelpage(Math.max(0, current - 1));
					break;
				case 40:
					e.preventDefault();
					wheelpage(Math.min(SLIDES_MAX - 1, current + 1));
					break;
			}
		}
	}).trigger('resize');

	//绑定滚动特效
	var dummy = true;

	$doc.on({
		mousewheel : function(e) {
			e.preventDefault();
			if (dummy) {
				dummy = false;
				setTimeout(function() {
					dummy = true;
				}, 1000);
				if (e.deltaY > 0) {//向上滚动
					wheelpage(Math.max(0, current - 1));
				} else {//向下滚动
					wheelpage(Math.min(SLIDES_MAX - 1, current + 1));
				}
			}
		}
	});

	//导航栏滚动
	$('.fix-logo').on('click', function(e) {
		e.preventDefault();
		wheelpage(0);
	});

	$('.nav-buttons').on('click', 'a', function(e) {
		var $this = $(this), id = $this.attr('href'), index = $slides.index($(id));
		e.preventDefault();

		$this.addClass('current').siblings().removeClass('current');
		wheelpage(index);
	});
});

//分享攻略
jQuery(function($) {
	$('.share').on('click', 'a.share-sina', function() {
		var $this = $(this), id = parseInt($this.parent().attr('id').split('-')[1], 10);

		var url = encodeURIComponent(window.location.href), prefix = 'http://service.weibo.com/share/share.php?appkey=1392673069&searchPic=false&url=', title, pic, address;
		switch (id) {
			case 1:
				title = encodeURIComponent('#真情相约，逢9必聚# 打破聚会话题僵局的三个必杀TOPIC——想成为聚会僵局的救世主，快学起来！活跃现场的重任就交给你了。');
				pic = encodeURIComponent('http://event.dianping.com/jcday/data/guide/3-1.jpg');
				address = prefix + url + '&title=' + title + '&pic=' + pic;
				window.open(address, '_blank');
				break;
			case 2:
				title = encodeURIComponent('#真情相约，逢9必聚# 炒热聚会气氛的必备游戏——不必担心没有道具，或者规则麻烦。这里介绍炒热聚会气氛的几个必备游戏，瞬间拉进朋友间距离，让温吞水般的聚会气氛迅速升温！');
				pic = encodeURIComponent('http://event.dianping.com/jcday/data/guide/2-1.jpg');
				address = prefix + url + '&title=' + title + '&pic=' + pic;
				window.open(address, '_blank');
				break;
			case 3:
				title = encodeURIComponent('#真情相约，逢9必聚# 中餐聚会饮葡萄酒注意二三事——饮酒不仅仅是在品酒，更是在品味文化。朋友聚会，葡萄酒不仅可以增加优雅属性，更有打开话题的功效。');
				pic = encodeURIComponent('http://event.dianping.com/jcday/data/guide/1-1.jpg');
				address = prefix + url + '&title=' + title + '&pic=' + pic;
				window.open(address, '_blank');
				break;
		}
	});
});

//载入列表
//聚处推荐
jQuery(function($) {
	var $element = $("#carousel-restaurant"), $list = $element.find('.item-list'), $template = $element.find('.item-template');

	$.ajax({
		url : 'data/shop.js',
		dataType : 'json',
		success : function(items) {
			var li, itemgroup = [];
			while (items.length) {
				itemgroup.push($template.tmpl(items.shift()));
				if (itemgroup.length == 4) {
					li = $('<li></li>');
					$.each(itemgroup, function() {
						this.appendTo(li);
						$list.append(li);
					});
					itemgroup = [];
				}
			}
			li = $('<li></li>');
			$.each(itemgroup, function() {
				this.appendTo(li);
				$list.append(li);
			});

			$element.carousel();
		}
	})
});

//餐酒搭配
jQuery(function($) {
	var $element = $("#carousel-cuisine"), $list = $element.find('.item-list'), $template = $element.find('.item-template');

	var cuisinePopup = $.Popup.init('popup-cuisine', {
		className : 'popup-cuisine'
	});

	$.ajax({
		//Workaround: 服务器不支持直接访问JSON文件
		url : 'data/cuisine.js',
		dataType : 'json',
		success : function(items) {
			var li, itemgroup = [];
			while (items.length) {
				var item = items.shift(), $obj = $template.tmpl(item).data('item', item);

				(function(i) {
					$obj.on('click', function(e) {
						e.preventDefault();
						cuisinePopup.setWindow({
							content : $('#popup-cuisine').tmpl(i)
						});
						cuisinePopup.open();
					});
				})(item);

				itemgroup.push($obj);

				if (itemgroup.length == 4) {
					li = $('<li></li>');
					$.each(itemgroup, function() {
						this.appendTo(li);
						$list.append(li);
					});
					itemgroup = [];
				}
			}
			li = $('<li></li>');
			$.each(itemgroup, function() {
				this.appendTo(li);
				$list.append(li);
			});

			$element.carousel();
		}
	})
});

//聚会攻略
jQuery(function($) {
	var $element = $("#carousel-guide");
	$element.carousel();

	var cuisinePopup = $.Popup.init('popup-share-weixin', {
		className : 'popup-share-weixin',
		content : '' + '<div class="popup-inner">' + '<h2>分享到朋友圈</h2>' + '<div class="qr-code"></div>' + '</div>'
	});

	$('.share-weixin').on('click', function() {
		cuisinePopup.open();
	});
});

//距离欢乐日的倒计时
jQuery(function($) {
	var offset = 8, Timer = new $.Time(+new Date(), offset), year = Timer.getYear(), month = Timer.getMonth(), date = Timer.getDate(), nextYear = year, nextMonth = month, nextDate;

	//寻找最近的下一个9日
	if (date < 9) {
		nextDate = 9;
	} else if (date < 19) {
		nextDate = 19;
	} else if (date < 29) {
		if (month == 2) {
			//检查是否是闰年
			if ((!(year % 4) && (year % 100)) || !(year % 400)) {
				nextDate = 29;
			} else {
				nextDate = 9;
				nextMonth = 3;
			}
		} else {
			nextDate = 29;
		}
	} else {
		nextDate = 9;
		nextMonth += 1;
		if (nextMonth > 12) {
			nextMonth = 1;
			nextYear += 1;
		}
	}

	var nextTime = new Date(Date.UTC(nextYear, nextMonth - 1, nextDate) - (3600000 * offset));

	//求日期差
	var remainDays = Math.floor((+nextTime - (+Timer.date)) / 86400000) + 1;

	var $countdown = $('.countdown-digital');
	$('<div class="digital"></div>').addClass('num' + Math.floor(remainDays / 10)).appendTo($countdown);
	$('<div class="digital"></div>').addClass('num' + Math.floor(remainDays % 10)).appendTo($countdown);
});

//中奖名单
jQuery(function($) {

	var listPop;

	$.ajax({
		//Workaround: 服务器不支持直接访问JSON文件
		url : 'data/prize.js',
		dataType : 'json',
		success : function(res) {

			var $container = $('<div class="popup-inner">' + '<h2></h2>' + '</div>'), $dates = $('<div class="dates"></div>').appendTo($container), $listWrap = $('<div class="list-container"></div>').appendTo($container), $lists = $('<div class="list-inner"></div>').appendTo($listWrap);

			$.each(res, function(key, list) {
				var $date = $('<a class="highlight" href="#list-' + key + '">' + list.date + '</a>').appendTo($dates).on('click', function(e) {
					var $this = $(this), id = $this.attr('href');

					$this.addClass('highlight').siblings().removeClass('highlight');
					$(id).removeClass('tabs-hide').siblings().addClass('tabs-hide');
					e.preventDefault();
				});
				var $list = $('<ul id="list-' + key + '"></ul>').appendTo($lists);

				//初始化第一列
				key && $date.removeClass('highlight');
				key && $list.addClass('tabs-hide');

				$('<li><div class="phone">手机号</div><div class="prize">奖品</div></li>').appendTo($list);
				$.each(list.list, function(key, pairs) {
					$('<li><div class="phone">' + pairs.tel + '</div>' + '<div class="prize">' + pairs.prize + '</div></li>').appendTo($list);
				});
			});

			listPop = $.Popup.init('popup-list', {
				className : 'popup-list',
				content : $container
			});

			$container.find('.list-inner').jScrollPane({
				verticalDragMaxHeight : 22,
				verticalDragMinHeight : 22,
				hideFocus : true,
				autoReinitialise : true
			});

			$('.button-list').on('click', function(e) {
				e.preventDefault();
				listPop.open();
			})
		}
	})

});

//活动规则
jQuery(function($) {
	var rulePop = $.Popup.init('popup-rule', {
		className : 'popup-rule',
		content : $('#popup-rule').html()
	});

	$('.button-rule').on('click', function(e) {
		e.preventDefault();
		rulePop.open();
	});

	$('.rule-text-inner').jScrollPane({
		mouseWheelSpeed : 30,
		verticalDragMaxHeight : 22,
		verticalDragMinHeight : 22,
		hideFocus : true
	});
});

//发邀约赢好礼
jQuery(function($) {
	var invitePopup = $.Popup.init('popup-invite', {
		className : 'popup-invite',
		content : $('#popup-invite').html()
	});

	$('.button-invite').on('click', function(e) {
		e.preventDefault();
		invitePopup.open();
	})
});

//品牌故事
var Ppgs = function() {
	return Ppgs['init'].apply(Ppgs, arguments);
};

(function(exp) {

	var left = 0;
	window.AutoPlay = 0;

	exp.init = function() {

		// clearInterval(window.AutoPlay);

		// window.AutoPlay = setInterval(function() {

		// 	left -= 20;

		// 	$('#ppgs_img').animate({
		// 		backgroundPosition : left + 'px'
		// 	});

		// }, 1);

	};

})(Ppgs);

Ppgs();
