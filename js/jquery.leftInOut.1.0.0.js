// made in fred,2014.04.24,shenzhen
// my website http://3.fredweb.duapp.com/
// this plug in git https://github.com/fredwei/lilo
// you can contact me email 250095176@163.com or QQ 250095176 , Best can speak Chinese

;(function($){
	$.fn.leftinout = function(options){

		var opts = $.extend({},$.fn.leftinout.defaults,options);

		//执行代码
		return this.each(function(){
			var $this = $(this);

			//元素初始化
			$.fn.leftinout.slide_load($this,opts);

			//添加左右按钮
			$.fn.leftinout.prev_next_add($this,opts);
			//添加圆点按钮
			$.fn.leftinout.dot_add($this,opts);

		});

	};

	//自动播放
	var timer = null;
	$.fn.leftinout.auto_play = function(obj,opts){

	   var depaytime = opts.AutoDelay + opts.SwitchTime + opts.AutoTime;

	   clearTimeout(timer);

		timer = setTimeout(function(){

			//背景切换
			$.fn.leftinout.background_prev_next(obj,true,opts);
			//内容切换
			$.fn.leftinout.switch_prev_next(obj,true,opts);

			$.fn.leftinout.auto_play(obj,opts);

		},depaytime);
	};

	//添加圆点按钮
	$.fn.leftinout.dot_add = function(obj,opts){

		if(!opts.Dot)
		{
			return false;
		}

		var $objli = obj.find('li'),
			str = '<dl class="slide-dot">',
			mlen = $objli.length + 1;

		for(var i = 1 ; i < mlen ; i++)
		{
			str = str + '<dd>' + i + '</dd>';
		}

		str = str + '</dl>';

		obj.append(str);

		obj.find('.slide-dot dd').eq(opts.StartInex).addClass('active');

		//添加点击事件
		obj.on('click mouseenter mouseleave','.slide-dot dd',function(){

			//判断是否停止播放
			pauseorplay(obj,opts,event.type);

			if($objli.find('img').is(":animated") || $(this).hasClass('active') || event.type != 'click')
			{
				return false;
			}

			var thisindex = $(this).index();

			//背景切换
			$.fn.leftinout.background_prev_next(obj,false,opts,thisindex);

			//内容切换
			$.fn.leftinout.switch_prev_next(obj,false,opts,thisindex);
		});
	};

	//添加左右按钮
	$.fn.leftinout.prev_next_add = function(obj,opts){
		var str = [],
			pobj = '.' + opts.Prev + ',.' + opts.Next,
			click_next = false;

		str[0] = '<a href="javascript:;" id="' + opts.Prev + '" class="' + opts.Prev + '">' + opts.Prev + '</a>',
		str[1] = '<a href="javascript:;" id="' + opts.Next + '" class="' + opts.Next + '">' + opts.Next + '</a>',

		obj.append(str.join(''));

		//添加点击事件
		obj.on('click mouseenter mouseleave',pobj,function(event){

			//判断是否停止播放
			pauseorplay(obj,opts,event.type);

			if(obj.find('li img').is(":animated") || event.type != 'click')
			{
				return false;
			}

			if($(this).hasClass(opts.Next))
			{
				click_next = true;
			}
			else{
				click_next = false;
			}

			//背景切换
			$.fn.leftinout.background_prev_next(obj,click_next,opts);

			//内容切换
			$.fn.leftinout.switch_prev_next(obj,click_next,opts);
		});

	};

	//背景左右切换
	$.fn.leftinout.background_prev_next = function(obj,r,opts,ifdot){
		var $bli = obj.find('li'),
			thisnum = $bli.parent().find('li.active').index(),
			nextindex = thisnum - 1;

		//判断prev、next、dot
		nextindex = ifpnd(obj,r,ifdot,thisnum);

		$bli.eq(thisnum).find('.slide-bg img').fadeOut(opts.SwitchTime).removeClass('active');
		$bli.eq(nextindex).find('.slide-bg img').fadeIn(opts.SwitchTime).addClass('active');

	};

	//内容左进左出左右切换
	$.fn.leftinout.switch_prev_next = function(obj,r,opts,ifdot){
		var $objli = obj.find('li'),
			thisnum = $objli.parent().find('li.active').index(),
			nextindex = 0;

		//判断prev、next、dot
		nextindex = ifpnd(obj,r,ifdot,thisnum);

		obj.find('.slide-dot dd').removeClass('active').eq(nextindex).addClass('active');

		var imgW = $objli.eq(nextindex).find('.slide-img').width(),
			swidth = obj.width()*0.5;
			imgW = swidth - imgW*1.05;

		$objli.eq(thisnum).find('.slide-img,.slide-txt').animate({
			left:'-100%'
		},opts.SwitchTime,function(){

			$objli.removeClass('active').eq(nextindex).addClass('active').find('.slide-img').animate({
				left:imgW
			},opts.SwitchTime,opts.Aneasing);

			$objli.eq(nextindex).find('.slide-txt').animate({
				left:swidth + 50
			},opts.SwitchTime,opts.Aneasing);

		});

	};

	//元素初始化
	$.fn.leftinout.slide_load = function(obj,opts){

		slide_ex_img(obj,opts);
		obj.find('.slide-bg img').eq(opts.StartInex).addClass('active').show();


		if(opts.AutoPlay)
		{
			//自动播放
			$.fn.leftinout.auto_play(obj,opts);
		}

		obj.on('click mouseenter mouseleave','li .slide-txt',function(event){
			//判断是否停止播放
			pauseorplay(obj,opts,event.type);
		});

	};

	//小图的位置
	function slide_ex_img(obj,opts){
		var swidth = obj.width()*0.5,
			sheight = obj.height()*0.5,
			$objli = obj.find('li'),
			imgW = $objli.eq(opts.StartInex).find('.slide-img img').width();

		$objli.eq(opts.StartInex).addClass('active');

		imgW = swidth - imgW*1.05;

		$objli.eq(opts.StartInex).find('.slide-img').css({
			'left' : imgW
		}).parent().find('.slide-txt').css({
			'left' : swidth + 50
		});

	};


	//判断prev或next或dot
	function ifpnd(obj,r,ifdot,thisnum){
		var $objli = obj.find('li'),
			thislen = $objli.length - 1,
			nextindex = thisnum - 1;

		if(r)
		{
			nextindex = thisnum + 1;
		}

		if(nextindex < 0)
		{
			nextindex = thislen;
		}

		if(nextindex > thislen)
		{
			nextindex = 0;
		}

		//如果是圆点
		if(ifdot != null)
		{
			nextindex = ifdot;
		}

		return nextindex;
	};

	//判断是否停止自动播放
	function pauseorplay(obj,opts,s){

		if(s == 'click' || s == 'mouseenter' || !opts.AutoPlay)
		{
			clearTimeout(timer);
		}
		else
		{
			//自动播放
			$.fn.leftinout.auto_play(obj,opts);
		}
	};


	//默认值
	$.fn.leftinout.defaults = {
		Prev : 'prev',
		Next : 'next',
		StartInex: 0,
		SwitchTime : 800,
		Dot : true,
		AutoPlay : true,
		AutoTime : 1000,
		AutoDelay : 2000,
		Aneasing : 'easeOutQuart'
	};

})(jQuery);


jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	}
});











