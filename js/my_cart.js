/**
 * Created by Administrator on 2016/3/3 0003.
 */

$(function(){
	
	$('input[name="checkCart"]').click(function(){
		refreshPriceTotal();
		var checked = false;
		$('input[name="checkCart"]').each(function(){
			if($(this).prop('checked')){
				checked = true;
				return false;
			}
		})
		
		if(checked == false){
			$('#sub_check').prop('checked', false);
			$('#submit_btn').removeAttr('onclick').css('background', '#999');
		}else{
			$('#sub_check').prop('checked', true);
			$('#submit_btn').attr('onclick', 'createOrder()').css('background', '#e63955');
		}
	})
	
	$('#sub_check').click(function(){
		var check = false;
		if($(this).prop('checked')){
			check = true;
		}
		
		$('input[name="checkCart"]').each(function(){
			$(this).prop('checked', check);
		})
		
		if(check == false){
			$('#sub_check').prop('checked', false);
			$('#submit_btn').removeAttr('onclick').css('background', '#999');
		}else{
			$('#sub_check').prop('checked', true);
			$('#submit_btn').attr('onclick', 'createOrder()').css('background', '#e63955');
		}
		
		refreshPriceTotal();
	})
	
	$('#deleteAll').click(function(){
		var _token = $("input[name='_token']").val();
		var g_ids = [];
		$('#listTable').find("input:checkbox:checked").each(function(){
			g_ids.push($(this).val());
		});
		
		$.ajax({
			url: '/deleteCart_m',
			type: 'post',
			dataType: 'json',
			data: {g_ids:g_ids,_token:_token},
			success: function(res){
				if(res.status == 0){
					var count = $('#listTable').find('tr').length;
					//删除成功，刷新购物车信息
					if(count == g_ids.length){
						var html = '<tr><td colspan="5" style="height:80px"><p style="color:#808080">您的清单里还没有任何商品，<a href="/" style="text-decoration:underline;color:#39f">马上去逛逛~</a></p></td></tr>';
						$('#listTable').find('tbody').html(html);
					}else{
						$('#listTable').find("input:checkbox:checked").each(function(){
							$(this).parents('tr').remove();
						});
					}

					$('#cartI').text(res.data.total.total_count);
					$('#priceTotal').text(res.data.total.total_amount);
					refreshPayAmount();
				}else if(res.status == ''){
					//未登录跳转
					window.location.href = '/login';
				}else{
					//删除失败
					myalert(res.message);
				}
			}
		})
	})
	
	//减少1
	$('.c-minus').click(function () {
		var nextval = parseInt($(this).siblings(".c-numinput").val()) - 1;
		if(nextval <= 0){
			$(this).attr("disabled","");
		}else{
			$(this).siblings("button").removeAttr("disabled");
			$(this).siblings(".c-numinput").val(nextval);
			amountChange($(this).parent().find(".buytimes"), 2);
		}

	});

	//增加 +1
	$(".c-plus").click(function () {
		var nextval = parseInt($(this).siblings(".c-numinput").val()) + 1;
		var last_person = parseInt($(this).parents('.c-prot-other').find(".last_person").text());
		if(nextval >= last_person){
			$(this).siblings(".c-numinput").val(last_person);
			$(this).attr("disabled","");
		}else{
			$(this).siblings("button").removeAttr("disabled");
			$(this).siblings(".c-numinput").val(nextval);
		}
		amountChange($(this).parent().find(".buytimes"), 1);
	});

	$(".c-numinput").blur(function(){
		var inpval = parseInt($(this).val());
		if(inpval == 0 || inpval == "" || inpval == null || isNaN(inpval)){
			$(this).val(1);
		}
	})
})

function actionSettlement() {
	$(".c_recharge_remind").show();
}

function onlyNum()
{
 if(!(event.keyCode==46)&&!(event.keyCode==8)&&!(event.keyCode==37)&&!(event.keyCode==39))
  if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)))
    event.returnValue=false;
}

function amountChange(obj, type){
	obj = $(obj);

	var buytimes = parseInt(obj.val());
	
	if (buytimes && /^[1-9]*[1-9][0-9]*$/.test(buytimes)) {
    } else {
    	obj.val();
    	buytimes = 1;
    }
	
	var tr_obj = obj.parents('.c-prot-other');
	var last_person = parseInt(tr_obj.find(".last_person").text());
	
	if(buytimes > last_person){
		buytimes = last_person;
		obj.val(last_person);
	}else{
		obj.val(buytimes);
	}

    var g_id = obj.attr('g_id');
    var _token = $("input[name='_token']").val();
    $.ajax({
        url: '/updateCart_m',
        type: 'post',
        dataType: 'json',
        data: {g_id:g_id,bid_cnt:buytimes,_token:_token,type:type},
        success: function(res){
            if(res.status == 0){

            }else{
                layer.alert(res.message, {title:false,btn:false});
            }
        }
    })
	refreshPriceTotal();
}

function refreshPriceTotal(){
	var priceTotal = 0;
	var count = 0;
	$("input[name='checkCart']:checked").each(function(){
		var obj = $(this).parents('.cart-probox').find('.buytimes');
		var buytimes = parseInt(obj.val());
		var minimum = parseInt(obj.attr('data-minimum'));
		
		priceTotal += buytimes * minimum;
		count++;
	})
	
	$('#sub_count').html(count);
	$('#priceTotal').html(priceTotal);
}

function addCart(g_id, bid_cnt,mission){
	var _token = $("input[name='_token']").val();
    if(!mission || mission == 'undefined'){
        mission = 0;
    }

	$.ajax({
		url: '/addCart_m',
		type: 'post',
		dataType: 'json',
		data: {g_id:g_id,bid_cnt:bid_cnt,_token:_token,mission:mission},
		success: function(res){
			if(res.status == 0){
				addCartAlert('已添加到购物车');
				//添加成功，刷新购物车信息
				$('#cartI').text(res.data.count);
                $('#cartI').removeClass('hide');
			}else if(res.status == -1){
				//未登录
				addCartAlert('未登录');
			}else{
				//添加失败
				addCartAlert(res.message);
			}
		}
	})
}

//添加到购物车 不显示信息
function toCart(g_id, bid_cnt, mission){
	var _token = $("input[name='_token']").val();
    if(!mission || mission == 'undefined'){
        mission = 0;
    }

	$.ajax({
		url: '/addCart_m',
		type: 'post',
		dataType: 'json',
		data: {g_id:g_id,bid_cnt:bid_cnt,_token:_token, mission:mission},
		success: function(res){
			if(res.status == 0){
				location.href='/mycart_m';
				//添加成功，刷新购物车信息
				$('#cartI').text(res.data.count);
			}else if(res.status == -1){
				//未登录
				location.href='/login_m';
			}else{
				//添加失败
				myalert(res.message);
			}
		}
	})
}

function deleteCart(e){
	var _token = $("input[name='_token']").val();
	var del = $(e);
	var g_id = del.attr('g_id');
	$.ajax({
		url: '/deleteCart_m',
		type: 'POST',
		dataType: 'json',
		data: {g_id:g_id, _token:_token},
		success: function(res){
			if(res.status == 0){
				var count = del.parents('.mui-content').find('.cart-probox').length;
				//删除成功，刷新购物车信息
				if(count == 1){
					window.location.href = '/mycart_m_empty';
				}else{
					//del.parents('.cart-probox').remove();
                    window.location.reload();
				}

				//refreshPriceTotal();
			}else if(res.status == ''){
				//未登录跳转
				window.location.href = '/login';
			}else{
				//删除失败
				myalert(res.message);
			}
		}
	})
}

function createOrder(){
	var _token = $("input[name='_token']").val();
	var g_ids = {}, mission_flag = [];
	$("input[name='checkCart']:checked").each(function(){
        var buytimes = parseInt($(this).parents('.cart-probox').find('.buytimes').val());
		g_ids[$(this).val()] = {'bid_cnt':buytimes, 'minimum':parseInt($(this).parents('.cart-probox').find('.buytimes').attr('data-minimum'))};
        var mission = parseInt($(this).parents('.cart-probox').find('.buytimes').attr('data-mission'));
        var total = parseInt($(this).parents('.cart-probox').find('.total_person').text());
        if(mission > 0 && buytimes < Math.ceil(total/2)){
            if(typeof(mission_flag[mission]) == 'undefined'){
                mission_flag[mission] = 1;
            }
        }else{
            mission_flag[mission] = 0;
        }
    });

    if(mission_flag.indexOf(1) != -1){
        var result = confirm('您购买的活动商品数量未达到活动要求，是否提交？');
        if(result != true){
            return false;
        }
    }

    $.ajax({
        url: '/createOrder_m',
        type: 'post',
        dataType: 'json',
        data: {g_ids:g_ids,_token:_token},
        success: function(res){
            if(res.status == 0){
                $('body').append(res.data);
                $('#subform').submit();
            }else if(res.status == -3){
                var c_res = confirm(res.message);
                if(c_res == true){
                    ajaxCreateOrder(g_ids,_token);
                }
            }else{
                myalert('服务器异常');
            }
        }
    })
}

function ajaxCreateOrder(g_ids, _token){
    $.ajax({
        url: '/createOrder_m',
        type: 'post',
        dataType: 'json',
        data: {g_ids:g_ids,_token:_token,not_announce_flag:1},
        success: function(res){
            if(res.status == 0){
                $('body').append(res.data);
                $('#subform').submit();
            }else{
                myalert('服务器异常');
            }
        }
    })
}

function wrap_tail(e){
	var that = $(e);
	var last = parseInt(that.parents('.cart-probox').find('.last_person').text());
	that.parents('.cart-probox').find('.buytimes').val(last);
	
	amountChange(that.parents('.cart-probox').find('.buytimes'), 0);
}

function wrap_half(e){
    var that = $(e);
    var total = parseInt(that.parents('.cart-probox').find('.total_person').text());
    var last = parseInt(that.parents('.cart-probox').find('.last_person').text());
    var half = Math.ceil(total/2);
    var num = half > last ? last : half;
    that.parents('.cart-probox').find('.buytimes').val(num);

    amountChange(that.parents('.cart-probox').find('.buytimes'), 0);
}
