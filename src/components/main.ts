import $ from 'jquery'


var fullHeight = function() {
	$('.js-fullheight').css('height', $(window).height()); // replace with 100vh
	$(window).resize(function(){
		$('.js-fullheight').css('height', $(window).height());
	});

};


// loader
var loader = function() {
	setTimeout(function() { 
		if($('#ftco-loader').length > 0) {
			$('#ftco-loader').removeClass('show');
		}
	}, 1);
};


	// Burger Menu
var burgerMenu = function() {
	$('body').on('click', '.js-fh5co-nav-toggle', function(event){

		event.preventDefault();

		if ( $('#ftco-nav').is(':visible') ) {
			$(this).removeClass('active');
		} else {
			$(this).addClass('active');	
		}			
	});
};


var onePageClick = function() {
	$(document).on('click', '#ftco-nav a[href^="#"]', function (event) {
		event.preventDefault();

			// var href = $.attr(this, 'href');

		$('html, body').animate({
				scrollTop: $($.attr(this, 'href')).offset().top - 70
		}, 500, function() {
			// window.location.hash = href;
		});
	});
};


// scroll
var scrollWindow = function() {
	$(window).scroll(function(){
		var $w = $(this),
				st = $w.scrollTop(),
				navbar = $('.ftco_navbar'),
				hamburger = $('#hamburger'),
				sd = $('.js-scroll-wrap');

		if (st > 150) {
			if ( !navbar.hasClass('scrolled') ) {
				navbar.addClass('scrolled');
				hamburger.attr('scrolled', true);	
			}
		} 
		if (st < 150) {
			if ( navbar.hasClass('scrolled') ) {
				navbar.removeClass('scrolled sleep');
				hamburger.attr('scrolled', false);
			}
		} 
		if ( st > 350 ) {
			if ( !navbar.hasClass('awake') ) {
				navbar.addClass('awake');	
			}
			
			if(sd.length > 0) {
				sd.addClass('sleep');
			}
		}
		if ( st < 350 ) {
			if ( navbar.hasClass('awake') ) {
				navbar.removeClass('awake');
				navbar.addClass('sleep');
			}
			if(sd.length > 0) {
				sd.removeClass('sleep');
			}
		}
	});
};

/*
var counter = function() {		
	$('#section-counter, .hero-wrap, .ftco-counter, .ftco-about').waypoint( function( direction ) {

		if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {

			var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
			$('.number').each(function(){
				var $this = $(this),
				num = $this.data('number');
				$this.animateNumber(
					{
						number: num,
						numberStep: comma_separator_number_step
					}, 7000
				);
			});
		}
	} , { offset: '95%' } );
}


 function contentWayPoint(effect) {


			setTimeout(function(){
				$('.ftco-animate').each(function(k){
					var el = $(this);
					setTimeout( function () {
						var effect = el.data('animate-effect');
						if ( effect === 'fadeIn') {
							el.addClass('fadeIn ftco-animated');
						} else if ( effect === 'fadeInLeft') {
							el.addClass('fadeInLeft ftco-animated');
						} else if ( effect === 'fadeInRight') {
							el.addClass('fadeInRight ftco-animated');
						} else {
							el.addClass('fadeInUp ftco-animated');
						}
						el.removeClass('item-animate');
					},  k * 50, 'easeInOutExpo' );
				});
			}, 100);
		}
	} , { offset: '95%' } );
}; */

/*
$('.ftco-animate').waypoint( function( direction ) {
		if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {
			// i++;

			$(this.element).addClass('item-animate');
			setTimeout(function(){
				$('body .ftco-animate.item-animate').each(function(k){
					var el = $(this);
					setTimeout( function () {
						var effect = el.data('animate-effect');
						if ( effect === 'fadeIn') {
							el.addClass('fadeIn ftco-animated');
						} else if ( effect === 'fadeInLeft') {
							el.addClass('fadeInLeft ftco-animated');
						} else if ( effect === 'fadeInRight') {
							el.addClass('fadeInRight ftco-animated');
						} else {
							el.addClass('fadeInUp ftco-animated');
						}
						el.removeClass('item-animate');
					},  k * 50, 'easeInOutExpo' );
				});
			}, 100);
		}
	} , { offset: '95%' } );
	*/

// Scrolls to the resume section
var goHere = function() {

	$('.mouse-icon').on('click', function(event){
		
		event.preventDefault();

		$('html,body').animate({
			scrollTop: $('.goto-here').offset().top
		}, 500, 'easeInOutExpo');
		
		return false;
	});
};


// $("#myScrollspy").scrollspy({ offset: -75 });

var TxtRotate = function(el, toRotate, period) {
	this.toRotate = toRotate;
	this.el = el;
	this.loopNum = 0;
	this.period = parseInt(period, 10) || 2000;
	this.txt = '';
	this.tick();
	this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
	var i = this.loopNum % this.toRotate.length;
	var fullTxt = this.toRotate[i];

	if (this.isDeleting) {
		this.txt = fullTxt.substring(0, this.txt.length - 1);
	} else {
		this.txt = fullTxt.substring(0, this.txt.length + 1);
	}

	this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

	var delta = this.period - Math.random() * 100;

	if (this.isDeleting) { delta /= 2; }

	if (!this.isDeleting && this.txt === fullTxt) {
		delta = this.period;
		this.isDeleting = true;
	} else if (this.isDeleting && this.txt === '') {
		this.isDeleting = false;
		this.loopNum++;
		delta = this.period;
	}

	var that = this;
	setTimeout(function() {
		that.tick();
	}, delta);
};

function cycleWords() {
	var elements = document.getElementsByClassName('txt-rotate');
	for (var i=0; i<elements.length; i++) {
		console.log("i: ", i, "attrs: ", elements[i].attributes);
		var toRotate = elements[i].getAttribute('data-rotate');
		var period = elements[i].getAttribute('data-period');
		if (toRotate) {
			new TxtRotate(elements[i], JSON.parse(toRotate), period);
		}
	}

	// INJECT CSS
	var css = document.createElement("style");
	css.type = "text/css";
	css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
	document.body.appendChild(css);
};

export function initPage() {
	fullHeight();
	loader();
	burgerMenu();
	onePageClick();
	scrollWindow();
	// Counter has an animated display of numberic data
	//counter();
	// Waypoints for lazy loading and fading in
	//contentWayPoint();
	goHere();
	cycleWords();
 };
