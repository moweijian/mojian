var interval = 10;  //倒计时延迟时间
var hmainter = 80;    //毫秒a延迟时间
var hmbinter = 10;    //毫秒b延迟时间
var objtime = $(".cut-time");


function ShowCountDown(y) {                    //倒计时延迟时间，不包括毫秒
	//var now = new Date(y.attr('data-systime'));
	var _d = y.attr("data-time");            // 获取截止时间
	var endDate = new Date(_d);                       // 把截止时间准换成毫秒数
	var sysInterval=endDate.getTime()-new Date($('#sys_cur_time').val()).getTime();     // 时间差毫秒数是
	var endTime = sysInterval + new Date().getTime();
	var cur_oid = $('#cur_oid').val();
	
    var timer = setInterval(function() {
    	var leftTime = endTime - new Date().getTime();     // 时间差毫秒数是
    	
        if(leftTime <= 0){
            y.text("正在计算...");
            //updatedoc(y);
            clearInterval(timer);	
    		function endAjax(){
                var url="/product/checkstatus/"+cur_oid;
                $.ajax({
                    type:'GET',
                    url:url,
                    success:function(data){
                         var data = eval('('+data+')');
                         data =data.data;
                         if(data.status==2){
                        	 clearInterval(checkstatus);
                             window.location.reload();
                         }
                    }
              });
            }
    		var checkstatus = setInterval(endAjax,2000);
            return;
        }
        else{
            var leftsecond = parseInt(leftTime/1000);
            var day1=Math.floor(leftsecond/(60*60*24));
            var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
            var minute=Math.floor((leftsecond-day1*24*60*60-hour)/60);
            var second=Math.floor(leftsecond-day1*24*60*60-hour-minute*60);

            if(minute<10){minute = "0" + minute}    //倒计时为1位数，前面增加0
            if(second<10){second = "0" + second}    //倒计时为1位数，前面增加0

            //y.find(".day").text(day1);
            //y.find(".hour").text(hour);
            y.find(".mini").text(minute);
            y.find(".sec").text(second);
            	
            if(hour == 0 && minute == 0 && second == 0){
                //updatedoc(y);
            }

        }
    },interval)
}

$(document).ready(function(){
	$.ajax({
		type: 'get',
		dataType: 'json',
		url: '/getsystime?'+new Date().getTime(),
		success: function(res){
			if(res.time){
				$("#sys_cur_time").val(res.time);
				for (var i = 0; i < objtime.length; i++) {  //获取obj对象
				    ShowCountDown(objtime.eq(i));
				}
				
				for (var i = 0; i < indtime.length; i++) {  //获取obj对象
				    indcutdown(indtime.eq(i));
				}
				window.setInterval(zidong, 3000);
			}else{
				window.location.reload();
			}
		}
	})
})

function hma(timehm,hmainter){
    var s = 9 ;
    var d= setInterval(function(){
        if(s <= 0){s = 9;}
        else{$( timehm).html(s);  s--;}

    }, hmainter);
    return d;
}





//首页2个商品倒计时js
var indtime = $(".ind-cuttime");
function indcutdown(y) {
    var hmad1;
    var hmad2;
    //获取服务器时间
    $.ajax({
		type: 'get',
		dataType: 'json',
		url: '/getsystime?'+new Date().getTime(),
		success: function(res){
			if(res.time){
				$("#sys_cur_time").val(res.time);
				
				//倒计时延迟时间，不包括毫秒
				//var now = new Date(y.attr('data-systime'));
			    var _d = y.attr("data-time");            // 获取截止时间
			    var endDate = new Date(_d);                       // 把截止时间准换成毫秒数
			    var sysInterval=endDate.getTime()-new Date(res.time).getTime();     // 时间差毫秒数是
				var endTime = sysInterval + new Date().getTime();
			    
			   var d= setInterval(function() {
				   var leftTime = endTime - new Date().getTime();     // 时间差毫秒数是
			        if (leftTime > 0) {
			            var leftsecond = parseInt(leftTime / 1000);
			            var day1 = Math.floor(leftsecond / (60 * 60 * 24));
			            var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
			            var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour) / 60);
			            var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour - minute * 60);

			            if (minute < 10) {minute = "0" + minute}    //倒计时为1位数，前面增加0
			            if (second < 10) {second = "0" + second}    //倒计时为1位数，前面增加0

			            //y.find(".day").text(day1);
			            //y.find(".hour").text(hour);

			            mina = String(minute).substr(0, 1);
			            minb = String(minute).substr(1, 1);

			            seca = String(second).substr(0, 1);
			            secb = String(second).substr(1, 1);


			            y.find(".pcutime-min i").eq(0).text(mina);
			            y.find(".pcutime-min i").eq(1).text(minb);
			            y.find(".pcutime-sec i").eq(0).text(seca);
			            y.find(".pcutime-sec i").eq(1).text(secb);
			            
			            if (hour == 0 && minute == 0 && second == 0) {
			                //updatedoc(y);
			            }

			        } else {
			            y.css({color:'#d80200'}).text("正在计算...");

			            clearInterval(hmad1);
			            clearInterval(hmad2);
			            clearInterval(d);
			            return;
			        }
			    },interval)
			    setTimeout(function(){
			        hmad1 = hma(y.find(".hma"), 80);
			        hmad2 = hma(y.find(".hmb"), 20);
			    },interval);
			}
		}
	})
}

function getlast(id, o_id)
{  
	        var url = "/index/getlatest_m";
	        $.ajax({
                   type: 'GET',
                   url: url,
                   dataType: 'json',
                   data:{o_id:o_id},
                   success: function (data) {
                       //var data = eval('(' + data + ')');
                       //var allcount = data.data.latest_count;
                       //$("#em_lotcount").html(allcount);
                       if(data.status == 0){
                           data = data.data;
                           var strbody = '';
                           //for (var i = 0; i < data.length; i++) {
                               //$(".ind-cuttime").each(function(){
                               //    //console.log($(this).attr('id'));
                               //    if($(this).attr('data-id') == data[i]['id']){
                               //         appends=false;
                               //    }
                               //});

                               //if(data[i]['is_lottery'] == 1){
                               //    strbody += '<a href="'+data[i]['path']+'">'+
                               //        '<div class="ann-pimg"><img src="/H5/images/lazyload130.jpg" onerror="javascript:this.src='+'"/H5/images/lazyload130.jpg;"'+'" data-echo=" '+data[i]['thumb']+' " /></div>'+
                               //        '<span class="ann-ptit">' + data[i]['title'] + '</span>'+
                               //        '<div id="gettime'+id+'" class="ann-ptime ind-cuttime" data-time=" '+data[i]['ltime']+' " data-systime=" '+data[i]['curtime']+' ">'+
                               //        '<b class="pcutime pcutime-min"><i>-</i><i>-</i></b>'+
                               //        '<span class="pcut-hao">:</span>'+
                               //        '<b class="pcutime pcutime-sec"><i>-</i><i>-</i></b>'+
                               //        '<span class="pcut-hao">:</span>'+
                               //        '<b class="pcutime pcutime-ss"><i class="hma">-</i><i  class="hmb">-</i></b>'+
                               //        '</div>'+
                               //        '</a>';
                               //}else{ 
                                   strbody += '<a href="'+data.path+'">'+
                                       '<div class="ann-pimg"><img src="/H5/images/lazyload130.jpg" onerror="javascript:this.src='+'"/H5/images/lazyload130.jpg"'+';" data-echo="'+data.thumb+'" /></div>'+
                                       '<span class="ann-ptit">'+data.title+'</span>'+
                                       '<div class="ann-ptime mhdz" id="gettime'+id+'" data-id="'+o_id+'" data-time="-1">'+
                                       '恭喜<a href="/him_m/getHisBuy/'+data.usr_id+'" class="mhdza" >'+data.nickname+'</a>获得'+
                                       '</div></a>';
                               //}

                           //}
                       }

                       if(!strbody){
                           //resert();
                           return;
                       }



                       appentoshop(id,strbody);
                       //indcutdown($("#gettime"+id));
                   }
               });

}

function checklast(id){
    var url = "/index/checklatest_m";
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function (data) {
            if(data.status == 0){
                data = data.data;
                for (var i = 0; i < data.length; i++) {
                    var is_show = 0;
                    $(".ind-cuttime").each(function () {
                        //console.log($(this).attr('id'));
                        if ($(this).attr('data-id') == data[i]['id']) {
                            is_show = 1;
                        }
                    });
                    if(is_show == 1) continue;

                    var strbody = '';
                    strbody += '<a href="'+data[i]['path']+'">'+
                            '<div class="ann-pimg"><img src="/H5/images/lazyload130.jpg" onerror="javascript:this.src='+'"/H5/images/lazyload130.jpg;"'+'" data-echo=" '+data[i]['thumb']+' " /></div>'+
                            '<span class="ann-ptit">' + data[i]['title'] + '</span>'+
                            '<div id="gettime'+id+'" class="ann-ptime ind-cuttime" data-id="'+data[i]['id']+'" data-time=" '+data[i]['ltime']+' " data-systime=" '+data[i]['curtime']+' ">'+
                            '<b class="pcutime pcutime-min"><i>-</i><i>-</i></b>'+
                            '<span class="pcut-hao">:</span>'+
                            '<b class="pcutime pcutime-sec"><i>-</i><i>-</i></b>'+
                            '<span class="pcut-hao">:</span>'+
                            '<b class="pcutime pcutime-ss"><i class="hma">-</i><i  class="hmb">-</i></b>'+
                            '</div>'+
                            '</a>';

                    appentoshop(id,strbody);
                    indcutdown($("#gettime"+id));
                    break;
                }
            }
        }
    })
}

function appentoshop(id,strbody)
{
	 if(id==1)
	 {
	 	//$("#apento1").children().remove();
     	$("#apento1").html(strbody);
	 }
	 else
	 {
	 	//$("#apento2").children().remove();
     	$("#apento2").html(strbody);
	 }
	
}

function zidong()
{
	var now = new Date();
    var _d = $('#gettime1').attr("data-time");            // 获取截止时间
    var gettime1_id = $('#gettime1').attr("data-id");
    if(_d != -1){
        var endDate = new Date(_d);                       // 把截止时间准换成毫秒数
        var leftTime=endDate.getTime()-now.getTime();     // 时间差毫秒数是

        if(leftTime <= 0){
            getlast(1, gettime1_id);
        }
    }else{
        checklast(1);
    }
    
    var _se = $('#gettime2').attr("data-time");            // 获取截止时间
    var gettime2_id = $('#gettime2').attr("data-id");
    if(_se != -1){
        var endDate2 = new Date(_se);                       // 把截止时间准换成毫秒数
        var leftTime2=endDate2.getTime()-now.getTime();
        if(leftTime2 <= 0){
            getlast(2, gettime2_id);
        }
    }else{
        if(_d != -1){
            checklast(2);
        }
    }

}

$("#clickfunction").click(function(){
	
    var now = new Date();
    var _d = $('#gettime1').attr("data-time");            // 获取截止时间
    var endDate = new Date(_d);                       // 把截止时间准换成毫秒数
    var leftTime=endDate.getTime()-now.getTime();     // 时间差毫秒数是
    
    if(leftTime <= 0){
        getlast(1);
    }
    
    var _se = $('#gettime2').attr("data-time");            // 获取截止时间
    var endDate2 = new Date(_se);                       // 把截止时间准换成毫秒数
    var leftTime2=endDate2.getTime()-now.getTime();
	 if(leftTime2 <= 0){
        getlast(2);
    }
	//getlast();
})
