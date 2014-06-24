define(function(require,exports,module){	
	var $ = require('jquery')	

	$('.prize-button').on('click',function(){
			$.ajax({
	            url: '/prize/ajax/prizeDraw',
	            data: {
	                groupId: 198
	            },
	            success: function (response) {
	            	var result = response ; 
	                if(!result.code in [ 406 , 200 , 501]){
						console.log(result)
		   				alert('系统错误 请重试')
		   				return 
		   			}
		   			if(result.code == 403){
		   				window.location = "http://www.dianping.com/login?redir=" + encodeURIComponent(window.location.href);
		   			}
		   			if(result.code == 406) {
		   				//关闭
		   				alert('活动已关闭')
		   			}
		   			if(result.code == 200) {
		   				
		   				var rank = result.msg.prize.rank ;
		   				var prizeName = result.msg.prize.rank ;
		   				window.recordId = result.msg.recordId ;
		   				$('.prize-name span').html(prizeName);
		   				$('.alert-box').show()
		   			}
		   			if(result.code == 501) {
		   				alert('没有抽奖次数')
		   				//没有次数
		   			}
	            }
	        });
	})

	$('.close-button').on('click',function(){
		$('.alert-box').hide()
	})

	$('.confirm-button').on('click',function(){
		$('.input-number').attr('disabled','disabled');
		$.ajax({
			url:'/prize/ajax/userInfo?recordId='+window.recordId+'&mobileNo='+$('.input-number').val() ,
			success:function(result){
				if(result.code == 200){
                    
                    alert('发送成功')
                    $('.alert-box').hide()
                } else {
                	$('input').removeAttr("disabled")
                    alert('发送失败，请重试')
                }
			}
		})
		
	})
	
})