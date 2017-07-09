/*
 * jQuery jSlots Plugin
 * http://matthewlein.com/jslot/
 * Copyright (c) 2011 Matthew Lein
 * Version: 1.0.2 (7/26/2012)
 * Dual licensed under the MIT and GPL licenses
 * Requires: jQuery v1.4.1 or later
 */

(function($){

    $.jSlots = function(el, options){

        var base = this;

        base.$el = $(el);
        base.el = el;

        base.$el.data("jSlots", base);

        base.init = function() {
            base.options = $.extend({},$.jSlots.defaultOptions, options);
            base.setup();
            base.bindEvents();
        };


        // --------------------------------------------------------------------- //
        // DEFAULT OPTIONS
        // --------------------------------------------------------------------- //

        $.jSlots.defaultOptions = {
            number : 3,          // Number: number of slots
            winnerNumber : 1,    // Number or Array: list item number(s) upon which to trigger a win, 1-based index, NOT ZERO-BASED
            spinner : '',        // CSS Selector: element to bind the start event to
            spinEvent : 'click', // String: event to start slots on this event
            onStart : $.noop,    // Function: runs on spin start,
            onEnd : $.noop,      // Function: run on spin end. It is passed (finalNumbers:Array). finalNumbers gives the index of the li each slot stopped on in order.
            onWin : $.noop,      // Function: run on winning number. It is passed (winCount:Number, winners:Array)
            easing : 'swing',    // String: easing type for final spin
            time : 7000,         // Number: total time of spin animation
            loops : 6            // Number: times it will spin during the animation
        };

        // --------------------------------------------------------------------- //
        // HELPERS
        // --------------------------------------------------------------------- //

        base.randomRange = function(low, high) {
            return Math.floor( Math.random() * (1 + high - low) ) + low;
        };

        // --------------------------------------------------------------------- //
        // VARS
        // --------------------------------------------------------------------- //

        base.isSpinning = false;
        base.spinSpeed = 0;
        base.winCount = 0;
        base.doneCount = 0;

        base.$liHeight = 0;
        base.$liWidth = 0;

        base.winners = [];
        base.allSlots = [];

        // --------------------------------------------------------------------- //
        // FUNCTIONS
        // --------------------------------------------------------------------- //

		length_fun=function(){
							 var request = new XMLHttpRequest();
					request.open("POST", "search.php");
					request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					request.send();
					request.onreadystatechange = function() {
						// 伺服器請求完成
						if (request.readyState === 4) {
							// 伺服器回應成功
							if (request.status === 200) {
							check_clearMap = 1;
								var type = request.getResponseHeader("Content-Type");   // 取得回應類型
								

								if (type.indexOf("application/json") === 0) { 
								//document.write(request.responseText);//查responsetext
								//var qwe=request.responseText;
								//document.write('"'+qwe+'"');
									 data = JSON.parse(request.responseText);
									var value=data.name;
									var htm='';
									var i=0;
									var typ=null;
									var radios = document.getElementsByName('bld');
									console.log("radios"+radios.length);
									for (var i = 0, length = radios.length; i < length; i++) {
										if (radios[i].checked) {
											// do whatever you want with the checked radio
											var typ=radios[i].value;
											// only one radio can be logically checked, don't check the rest
											break;
										}
									}
									 tem_r=[];
									 tem_n=[];
									if(typ!=null)
									{
										for (i=0;i<value.length;i++)
										{
											if(data.bld[i].match(typ) != null)
											{
												tem_r.push(value[i]);
												tem_n.push(data.r_id[i]);
											}
										}
										
									}
									else
									{
										tem_r=value;
										tem_n=data.r_id;
									}
									lengt=tem_r.length;
									console.log("Hello "+lengt);
									for (i=0;i<tem_r.length;i++)
									{
										htm=htm+"<li><span>"+tem_r[i]+"</span></li>";
									}
									document.getElementById("food").innerHTML=htm;
									}

								}
								} 
						}
			
		}
		
        base.setup = function(){
			
				 var request = new XMLHttpRequest();
					request.open("POST", "search.php");
					request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					request.send();
					request.onreadystatechange = function() {
						// 伺服器請求完成
						if (request.readyState === 4) {
							// 伺服器回應成功
							if (request.status === 200) {

								var type = request.getResponseHeader("Content-Type");   // 取得回應類型
								

								if (type.indexOf("application/json") === 0) { 
								//document.write(request.responseText);//查responsetext
								//var qwe=request.responseText;
								//document.write('"'+qwe+'"');
									 data = JSON.parse(request.responseText);
									var value=data.name;
									var htm='';
									var i=0;
									
										tem_r=value;
										tem_n=data.r_id;
									
									length=tem_r.length;
									console.log("Hello "+length);
									for (i=0;i<tem_r.length;i++)
									{
										htm=htm+"<li><span>"+tem_r[i]+"</span></li>";
									}
									document.getElementById("food").innerHTML=htm;
									}

								}
								} 
						}
			
			
			

            // set sizes

            var $list = base.$el;
            var $li = $list.find('li').first();

            base.$liHeight = $li.outerHeight();
            base.$liWidth = $li.outerWidth();
			//length =length;
			//console.log("length;"+length);
            length = 20;
			lengt = 85;
			
			console.log("aeiou"+length);
			
            base.listHeight = base.$liHeight * length;

            base.increment = (base.options.time / base.options.loops) / base.options.loops;

            $list.css('position', 'relative');

            $li.clone().appendTo($list);

            base.$wrapper = $list.wrap('<div class="jSlots-wrapper"></div>').parent();

            // remove original, so it can be recreated as a Slot
            base.$el.remove();

            // clone lists
            for (var i = base.options.number - 1; i >= 0; i--){
                base.allSlots.push( new base.Slot() );
            }

        };

        base.bindEvents = function() {
            $(base.options.spinner).bind(base.options.spinEvent, function(event) {
                if (!base.isSpinning) {
                    base.playSlots();
                }
            });
        };

        // Slot contstructor
        base.Slot = function() {

            this.spinSpeed = 0;
            this.el = base.$el.clone().appendTo(base.$wrapper)[0];
            this.$el = $(this.el);
            this.loopCount = 0;
            this.number = 0;

        };


        base.Slot.prototype = {

            // do one rotation
            spinEm : function() {

                var that = this;

                that.$el
                    .css( 'top', -base.listHeight )
                    .animate( { 'top' : '0px' }, that.spinSpeed, 'linear', function() {
                        that.lowerSpeed();
                    });

            },

            lowerSpeed : function() {

                this.spinSpeed += base.increment;
                this.loopCount++;

                if ( this.loopCount < base.options.loops ) {

                    this.spinEm();

                } else {

                    this.finish();

                }
            },

            // final rotation
            finish : function() {

                var that = this;
			length_fun();
                var endNum = base.randomRange( 1, lengt );
				console.log("final"+endNum);
				if(lengt > 84)
				{
					endtem = endNum-2;
					if(endNum<=26)
					{
						endtem = endNum-1;
					}
				}
				else
				{
					endtem = endNum-1;
				}
				end_num=tem_n[endtem];
				console.log(data.URL[end_num]);
				document.getElementById('webpage').innerHTML="<iframe src="+data.URL[end_num-1]+" width='500' height='500' frameborder='1' scrolling='yes'></iframe>";
		var request = new XMLHttpRequest();
		request.open("POST", "coment.php");
		var dat="r_id="+end_num;
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		request.send(dat);
		
			request.onreadystatechange = function() {
        // 伺服器請求完成
        if (request.readyState === 4) {
            // 伺服器回應成功
            if (request.status === 200) {
			check_clearMap = 1;
                var type = request.getResponseHeader("Content-Type");   // 取得回應類型
				

                if (type.indexOf("application/json") === 0) { 
				//document.write(request.responseText);//查responsetext
				//var qwe=request.responseText;
				//document.write('"'+qwe+'"');
                     var data = JSON.parse(request.responseText);

					var htm='';
					htm=htm+"<form class='form-inline'>";
					htm=htm+"<input type='text' class='form-control input-sm' name='nam' id='nam' placeholder='NAME'>";
					htm=htm+"<input type='text' class='form-control input-sm' name='comment' id='comment' placeholder='Write something'>";
					htm=htm+"<input type='button' class='btn btn-success' onclick='insert()' name='submit' id='c_sub' value='Submit'><br>";
					htm=htm+"<input type='hidden' id='end_num' name='postid' value="+end_num+" >";
					htm=htm+"</form>";
					htm=htm+"<div class='panel panel-primary'>";
					htm=htm+"<div class='panel-heading'>Comment</div>";
					for (i=0;i<data.comment.length;i++)
					{
						htm=htm+"<div class='alert alert-info'><span style='color:red;'>"+data.username[i]+":"+data.comment[i]+"</span></div>";
					}
					htm=htm+"</div>";
					document.getElementById("coment").innerHTML=htm;

					}

                }
				} 
        }

				var endtem =0;
				if(lengt > 84)
				{
					endtem = endNum-2;
					if(endNum<=26)
					{
						endtem = endNum-1;
					}
				}
				else
				{
					endtem = endNum-1;
				}
				console.log(tem_r[endtem]+"orz"+endtem);
				var str="http://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=嘉義"+tem_r[endtem]+"&z=16&output=embed&t=";
				console.log(str);
				document.getElementById("loc").src=str;
				console.log(endNum);
				console.log("end"+lengt);

                var finalPos = - ( (base.$liHeight * endNum) - base.$liHeight );
                var finalSpeed = ( (this.spinSpeed * 0.5) * (length) ) / endNum;

                that.$el
                    .css( 'top', -base.listHeight )
                    .animate( {'top': finalPos}, finalSpeed, base.options.easing, function() {
                        base.checkWinner(endNum, that);
                    });
					
			
			 //base.init();//test
			 //base.setup();
			 
            }

        };

        base.checkWinner = function(endNum, slot) {

            base.doneCount++;
            // set the slot number to whatever it ended on
            slot.number = endNum;

            // if its in the winners array
            if (
                ( $.isArray( base.options.winnerNumber ) && base.options.winnerNumber.indexOf(endNum) > -1 ) ||
                endNum === base.options.winnerNumber
                ) {

                // its a winner!
                base.winCount++;
                base.winners.push(slot.$el);

            }

            if (base.doneCount === base.options.number) {

                var finalNumbers = [];

                $.each(base.allSlots, function(index, val) {
                    finalNumbers[index] = val.number;
                });

                if ( $.isFunction( base.options.onEnd ) ) {
                    base.options.onEnd(finalNumbers);
                }

                if ( base.winCount && $.isFunction(base.options.onWin) ) {
                    base.options.onWin(base.winCount, base.winners, finalNumbers);
                }
                base.isSpinning = false;
            }
        };


        base.playSlots = function() {

            base.isSpinning = true;
            base.winCount = 0;
            base.doneCount = 0;
            base.winners = [];

            if ( $.isFunction(base.options.onStart) ) {
                base.options.onStart();
            }

            $.each(base.allSlots, function(index, val) {
                this.spinSpeed = 0;
                this.loopCount = 0;
                this.spinEm();
            });

        };


        base.onWin = function() {
            if ( $.isFunction(base.options.onWin) ) {
                base.options.onWin();
            }
        };


        // Run initializer
		console.log("init");
        base.init();
    };


    // --------------------------------------------------------------------- //
    // JQUERY FN
    // --------------------------------------------------------------------- //

    $.fn.jSlots = function(options){
        if (this.length) {
            return this.each(function(){
                (new $.jSlots(this, options));
            });
        }
    };

})(jQuery);
