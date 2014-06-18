(function ($) {
    $.ajaxPrize = function(url,callback){
           var xmlhttp;
		    if (window.XMLHttpRequest) {
		        // code for IE7+, Firefox, Chrome, Opera, Safari
		        xmlhttp = new XMLHttpRequest();
		    } else {
		        // code for IE6, IE5
		        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		    }
		    xmlhttp.onreadystatechange = function() {
		        if (xmlhttp.readyState == 4 ) {
		           if(xmlhttp.status == 200){
		           		var result = JSON.parse(xmlhttp.responseText) ; 


		           		
		               callback && callback(result);
		           }
		           else if(xmlhttp.status == 400) {
		              alert('There was an error 400')
		           }
		           else {
		               alert('something else other than 200 was returned')
		           }
		        }
		    }
		    xmlhttp.open("GET", url, true);
		    xmlhttp.send();
    }

    $.test = function(){
		this.ajaxPrize('/prize/ajax/prizeDraw',function(result){
		
			if(!result.code in [ 406 , 200 , 501]){
				console.log(result)
   				alert('系统错误 请重试')
   				return 
   			}
   			if(result.code == 406) {
   				//关闭
   				alert('活动已关闭')
   			}
   			if(result.code == 200) {
   				var rank = result.msg.prize.rank ;
   				var prizeName = result.msg.prize.rank ;
   				var recordId = result.msg.recordId ;
   				alert('中啦')
   			}
   			if(result.code == 501) {
   				alert('没有抽奖次数')
   				//没有次数
   			}
		})
    }




    
})($);
 
