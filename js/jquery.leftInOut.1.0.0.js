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
	var auto_play = function(){
		if(!opts.AutoPlay)
		{
			return false;
		}


		var obj,opts,nextto = obj.find('.slide-ex li.active').index() + 1;
			thislen = obj.find('.slide-ex li').length - 1;

		if(nextto < 0)
		{
			nextto = thislen;
		}

		if(nextto > thislen)
		{
			nextto = 0;
		}


		//背景切换
		$.fn.leftinout.background_prev_next(obj,true,opts.SwitchTime,nextto);

		//内容切换
		$.fn.leftinout.switch_prev_next(obj,true,opts.SwitchTime,nextto);

		//setTimeout('auto_play()',opts.AutoTime);
	};

	//添加圆点按钮
	$.fn.leftinout.dot_add = function(obj,opts){

		if(!opts.Dot)
		{
			return false;
		}

		var str = '<dl class="slide-dot">',
			mlen = obj.find('.slide-ex li img').length + 1;

		for(var i = 1 ; i < mlen ; i++)
		{
			str = str + '<dd>' + i + '</dd>';
		}

		str = str + '</dl>';

		obj.append(str);

		obj.find('.slide-dot dd').eq(opts.StartInex).addClass('active');

		//添加点击事件
		obj.on('click','.slide-dot dd',function(){
			if(obj.find('.slide-ex li img').is(":animated") || $(this).hasClass('active'))
			{
				return false;
			}

			var thisindex = $(this).index();

			//背景切换
			$.fn.leftinout.background_prev_next(obj,false,opts.SwitchTime,thisindex);

			//内容切换
			$.fn.leftinout.switch_prev_next(obj,false,opts.SwitchTime,thisindex);
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
		obj.on('click',pobj,function(){
			if(obj.find('.slide-ex li img').is(":animated"))
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
			$.fn.leftinout.background_prev_next(obj,click_next,opts.SwitchTime);

			//内容切换
			$.fn.leftinout.switch_prev_next(obj,click_next,opts.SwitchTime);
		});

	};

	//背景左右切换
	$.fn.leftinout.background_prev_next = function(obj,r,bgtime,ifdot){
		var $bimg = obj.find('.slide-bg img'),
			thisnum = $bimg.parent().find('.active').index(),
			thislen = $bimg.length - 1,
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

		$bimg.eq(thisnum).fadeOut(bgtime).removeClass('active');
		$bimg.eq(nextindex).fadeIn(bgtime).addClass('active');

	};

	//内容左进左出左右切换
	$.fn.leftinout.switch_prev_next = function(obj,r,bgtime,ifdot){
		var $objli = obj.find('.slide-ex li'),
			thisnum = $objli.parent().find('.active').index(),
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

		obj.find('.slide-dot dd').removeClass('active').eq(nextindex).addClass('active');

		var imgW = $objli.eq(nextindex).find('img').width(),
			swidth = obj.width()*0.5;
			imgW = swidth - imgW*1.05;

		$objli.eq(thisnum).find('img').animate({
			left:'-100%'
		},bgtime,function(){
			$(this).parent().removeClass('active');

			$objli.eq(nextindex).addClass('active').find('img').animate({
				left:imgW
			});
		});

		$objli.eq(thisnum).find('.txt').animate({
			left:'-100%'
		},bgtime,function(){
			$(this).parent().removeClass('active');

			$objli.eq(nextindex).addClass('active').find('.txt').animate({
				left:swidth
			});
		});

	};


	//元素初始化
	$.fn.leftinout.slide_load = function(obj,opts){
		slide_ex_img(obj,opts);
		obj.find('.slide-bg img').eq(opts.StartInex).addClass('active').show();

		//自动播放
		auto_play();
	};

	//小图的位置
	function slide_ex_img(obj,opts){
		var swidth = obj.width()*0.5,
			sheight = obj.height()*0.5,
			$objli = obj.find('.slide-ex li'),
			imgW = $objli.eq(opts.StartInex).find('img').width();

		$objli.eq(opts.StartInex).addClass('active');

		imgW = swidth - imgW*1.05;
		//alert(obj.find('.slide-ex li.active').index());

		$objli.eq(opts.StartInex).find('img').css({
			'left' : imgW
		}).parent().find('.txt').css({
			'left' : swidth
		});


	};

	//默认值
	$.fn.leftinout.defaults = {
		Prev : 'prev',
		Next : 'next',
		StartInex: 0,
		SwitchTime : 800,
		Dot : true,
		AutoPlay : true,
		AutoTime : 1000
	};

})(jQuery);












