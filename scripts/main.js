$(function() {
	init();
});

init = function(){

  scrollAnimation();

	//Init Smooth Scrolling
	smoothScroll.init({
		speed: 750,
		easing: 'easeInOutCubic',
		offset: 50
	});

	//Check if we're mobile or not, and only apply animations on desktop
	if(!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)){
	  	isMobile = false;
	  	$('body').addClass('not-mobile');
	    s = skrollr.init({
	        forceHeight: false,
          smoothScrolling: true
	    });

	} else{
		isMobile = true;
		$('body').addClass('mobile');
	}


  // Hide Header on on scroll down
  var didScroll;
  var lastScrollTop = 0;

  $(window).scroll(function(event){
      didScroll = true;
  });

  setInterval(function() {
      if (didScroll) {
          hasScrolled();
          didScroll = false;
      }
  }, 250);

  function hasScrolled() {
    var st = $(this).scrollTop();
    if (st > lastScrollTop){
      //Downscroll
      $('header').addClass('hidden');
    } else {
      //Upscroll
       $('header').removeClass('hidden');
    }
    lastScrollTop = st;
  }


	$(window).on('scroll', function(){
		if($(window).scrollTop() > 0){
			$('body').addClass('scrolled');
		}else{
			$('body').removeClass('scrolled');
		}
	});

  $(window).scroll(function() {
    var distanceFromTop = $(this).scrollTop();
    if (distanceFromTop >= $('.home-hero, .story-hero').height() - 68) {
        $('header').addClass('in-open');
    } else {
        $('header').removeClass('in-open');
    }
  });




	// Fix Height of Hero on Resize and Initial Page Load
  var resizeTimer;

  function heroHeight() {
		var storyHeroContent = $('.story-hero-content').height();
		$('.story-hero-container').height(storyHeroContent);
  };

  $(window).resize(function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(heroHeight, 250);
  });

  heroHeight();




  // Image Hover Carousel
  $("ul.article-title-container li:first a, .article-container.mobile ul.article-title-container li:first a").addClass('active');
  $(".article-images-container .single-article-image:first").addClass('active');

  $(".article-title-container li a").on({
    mouseenter: function () {

      // Remove active class from active article title
      $(".article-title-container li a.active").removeClass('active');
      // Remove active class from active image
      $(".single-article-image" + ".active").removeClass('active');

      // Get data-title from hovered article
      var hoverTitle = $(this).data('title');

      // Add active class to hovered image
      $(".single-article-image" + "." + hoverTitle).addClass('active');

      // Add active class to hovered article title
      $(this).addClass('active');

    }
  });


} //End Init



//Setup scroll animation
scrollAnimation = function() {

  $('.animation-set').viewportChecker({
    classToAdd: 'show',
    offset: 40,
    callbackFunction:function(e, a){
      if(a === 'add'){
        $(e).find('.animated').each(function(i, e1){

          var delay = i*50;
          if($(e1).data('delay')){
            delay = delay+$(e1).data('delay');
          }

          window.setTimeout(function(e1){
            $(e1).addClass('show');
          }, delay, e1);
        });
      }
    }
  });
};
