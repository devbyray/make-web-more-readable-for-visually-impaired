$(document).ready( function() {
    $('#textsize').hide();
    var screenWidth = $(window).outerWidth();
    if(screenWidth > 640) {
    	resizeText();
    }
    contractController();
});
$(window).resize( function() {
    $('#textsize').hide();
    var screenWidth = $(window).outerWidth();
    if(screenWidth > 640) {
    	resizeText();
    }
})

function resizeText() {
	$('#textsize').show();
	$('#textsize_switch').val('normal');
	$('html').removeClass('normal large xlarge xxlarge');
    $('#textsize_switch').change( function() {
    	$('html').removeClass('normal large xlarge xxlarge');
    	var selectedVal = $('#textsize_switch option:selected').val();
		$('html').addClass(selectedVal);
    });
}

function contractController() {
	var i = 0;
	$('#contrast button').click( function() {
		$('html').removeClass('normal_contrast high_contrast');
		if($(this).hasClass('better_contrast')){
			$('html').addClass('high_contrast');
		}
		if($(this).hasClass('normal_contrast')){
			$('html').addClass('normal_contrast');
		}
	});
}

function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;
	console.log('hex: ' + hex);
	console.log('lum: ' + lum);

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	console.log('rgb: ' + rgb);
	return String(rgb);
}