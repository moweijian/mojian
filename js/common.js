
var myalert=function(content){
	layer.open({
		content: content,
		style: 'padding:0 0.2rem;color:#e63955;border:none;font-weight:600;font-size:0.12rem;border-radius:10px',
		time:2 //2秒后自动关闭
	});
}

var addCartAlert=function(content){
	layer.open({
		content: content,
		style: 'padding:0 0.2rem;color:#e63955;border:none;font-weight:600;font-size:0.12rem;border-radius:10px',
		time:0.8 //0.8秒后自动关闭
	});
}

var mytips=function(content){
	layer.open({
		content:content,
		style:'color:#333;font-weight:600;border-radius:6px;width:90%;',
		btn: ['关闭', '现在邀请'],
		shadeClose: false,
		yes: function(){
			layer.closeAll();
		}, no: function(){
			window.location='/makemoney_m_new';
		}
	});
}

$(function() {
	//js 自定义跳转data-url
	$('[data-url]').on('tap',function(){
		var self = $(this);
		if(self.attr('data-url') != ''){
			window.location.href = self.data('url');
		}
	});

	//选项卡切换js
	$(".tab-tit .tabm-t").click(function(){
		var j = $(this).attr("data-tab");
		$(".tab-mtxt .tab-box").eq(j).show().siblings(".tab-box").hide();
		$(this).addClass("tabm-t-on").siblings(".tabm-t").removeClass("tabm-t-on");
	})

	//首页news滚动
	var index=0;
	var tmp=setInterval(function(){
		$(".h-noticetxt>ul li").eq(index).slideUp("2000");
		index++;
		if(index==$(".h-noticetxt>ul li").length){
			setTimeout(function(){
				$(".h-noticetxt>ul li").show();
				index=0;
			},1001);
		}
	},5000);

	//首页键入输入框
	$(".serachclick").click(function(){
		var keyw=$(".head-input").val();
        if(keyw == ''){
            return false;
        }
		window.location='/search_m_result?key='+keyw;
		
	})
//	$(".head-input").changed(function(){
//		window.location='/search_cookie';
//	})

	/*购物车鼠标事件*/
	//减少 -1
//	$('.c-minus').click(function () {
//		var nextval = parseInt($(this).siblings(".c-numinput").val()) - 1;
//		if(nextval <= 0){$(this).attr("disabled","");}
//		else {
//			$(this).siblings("button").removeAttr("disabled");
//			$(this).siblings(".c-numinput").val(nextval);
//		}
//
//	});
//	//增加 +1
//	$(".c-plus").click(function () {
//		var nextval = parseInt($(this).siblings(".c-numinput").val()) + 1;
//		if(nextval <= 0){$(this).attr("disabled","");}
//		else {
//			$(this).siblings("button").removeAttr("disabled");
//			$(this).siblings(".c-numinput").val(nextval);
//		}
//	});
//	//输入框不能为0
//	$(".c-numinput").blur(function(){
//		var inpval = parseInt($(this).val());
//		if(inpval == 0 || inpval == "" || inpval == null || isNaN(inpval)){
//			$(this).val(1);
//		}
//	})

});
