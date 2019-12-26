import $ from 'jquery'

// ------- scrollspy section -----------

let hash = function(h){
  if (history.pushState){
    history.pushState(null, null, h);
  }else{
    location.hash = h;
  }
}

function scrollSpyjQuery() {
	//variable that will hold the href attr of the links in the menu
	var sections = [];
	//variable that stores the id of the section
	var id = false;
	//variable for the selection of the anchors in the navbar
	var $navbara = $('#navi a');

	$navbara.click(function(e){
    //prevent the page from refreshing
    e.preventDefault();
    //set the top offset animation and speed
    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top - 180
},500);
    hash($(this).attr('href'));
	});
	
	//select all the anchors in the navbar one after another
  $navbara.each(function(){
		// and adds them in the sections variable
		 sections.push($($(this).attr('href')));
		 
	 });

	 $(window).scroll(function(e){
		 // scrollTop retains the value of the scroll top with the reference at the middle of the page
		 var scrollTop = $(this).scrollTop() + ($(window).height()/2);
		 //cycle through the values in sections array
		 for (var i in sections) {
			 var section = sections[i];
			 //if scrollTop variable is bigger than the top offset of a section in the sections array then 
			 if (scrollTop > section.offset().top){
				 var scrolled_id = section.attr('id');
			 }
		 }
		 if (scrolled_id !== id) {
			 id = scrolled_id;
			 $($navbara).removeClass('current');
			 $('#navi a[href="#' + id + '"]').addClass('current'); 
		 }
	 });

	 // Experience Progress Circle
	$(function() {

		$(".progress").each(function() {

			var value = $(this).attr('data-value');
			var left = $(this).find('.progress-left .progress-bar');
			var right = $(this).find('.progress-right .progress-bar');

			if (value > 0) {
				if (value <= 50) {
					right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
				} else {
					right.css('transform', 'rotate(180deg)')
					left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
				}
			}

		})

		function percentageToDegrees(percentage) {
			return percentage / 100 * 360;
		}
	});
}