/*
jquery.imagezoom.js v0.3
Last updated: 10 Sep 2010

Created by Paulo Cheque
Contact: paulocheque@gmail.com
Blog: http://pythonsmalltalk.blogspot.com

Licensed under a Creative Commons Attribution-Non-Commercial 3.0 Unported License
http://creativecommons.org/licenses/by-nc/3.0

http://www.tripwiremagazine.com/2010/02/15-jquery-plugins-to-create-stunning-image-zoom-effects.html
http://css-tricks.com/examples/AnythingZoomer/use.php
http://www.tidbits.com.br/imagem-com-zoom-em-javascript-e-jquery-imagezoom
http://www.sohtanaka.com/web-design/fancy-thumbnail-hover-effect-w-jquery/
http://www.visual-blast.com/javascript/jqzoom-22-jquery-image-zoom-tool/

== Example of Usage:
http://plugins.jquery.com/project/SimpleImageZoom
http://pythonsmalltalk.blogspot.com/

== Sites using this plugin:
http://baladasusp.com
http://megaloteria.net


///////////////////////////////////////////////////////////
ImageZoom
///////////////////////////////////////////////////////////

// Default values: { zoom: 10, speed_hover: 100, speed_unhover: 100, direction: 'outside' }
$('#original').ImageZoom();

// Custom values
$('img').ImageZoom({ 
					zoom: 15, // in %
					speed_hover: 100, // jquery animation speed 
					speed_unhover: 200, // jquery animation speed
					direction: 'outside' // outside, topleft, topright, bottomleft, bottomright 
					);

///////////////////////////////////////////////////////////
ImageExternalZoom
///////////////////////////////////////////////////////////

// Default values: { zoom: 10, speed_hover: 100, speed_unhover: 100, direction: 'outside' }		
$('#your imgage id').ImageExternalZoom();
$('.your images class').ImageExternalZoom();

// Custom values:
$('#myimg').ImageZoom({ 
					original_image_width: 100, // 'px': ideally proportional to the MY_FIGURE's width and height
					original_image_height: 100, // 'px': ideally proportional to the MY_FIGURE's width and height
					component_zoom_width: 50, // 'px'
					component_zoom_height: 50, // 'px'
					);

// HTML:
// It is important to set width and height values explicitily, otherwise the plugin will find 0px.
<img src="MY_FIGURE" style="width: 400px; height: 300px;"/>

// The plugin will create the following tree of elements:
<div class="container_image_zoom">
	<img src="MY_FIGURE" class="original_image"/>
	<div class="component_zoom">
		<img src="MY_FIGURE" class="image_zoom"/>
	</div>
</div>

// You can customize the layout with the following CSS labels:
.container_image_zoom {}
.component_zoom {}
.image_zoom {}
.original_image_zoom { margin-right: 10px; }

*/

(function($) {

	$.fn.ImageExternalZoom = function(options) {
		var properties = $.extend({}, $.fn.ImageExternalZoom.defaults, options);
		
		function handle_mouse_event(event) {
			//event.pageX
			//event.pageY
			
			//properties.width_proportion
			//properties.height_proportion
			
			top = 20;
			left = 15;
			
			image_zoom.css('left', left + 'px');
			image_zoom.css('top', top + 'px');
		}
		
		function config_attributes(image_zoom, original_image, component_zoom) {
			image_zoom.css('visibility', 'hidden');
			image_zoom.css('position', 'relative');
			image_zoom.addClass('image_zoom');
			original_image.attr('src', image_zoom.attr('src'));
			original_image.css('width', properties.original_image_width);
			original_image.css('height', properties.original_image_height);
			original_image.css('clear', 'both');
			original_image.css('float', 'left');
			component_zoom.css('float', 'left');
			component_zoom.css('overflow', 'hidden');
			component_zoom.css('width', properties.component_zoom_width);
			component_zoom.css('height', properties.component_zoom_height);
		}
		
		function create_tree(image_zoom, original_image, component_zoom, container) {
			component_zoom = image_zoom.wrap(component_zoom).parent();
			container = component_zoom.wrap(container).parent();
			container.prepend(original_image);
		}

        return this.each(function(index) {
			image_zoom = $(this);
			original_image = $('<img class="original_image_zoom"/>');
			component_zoom = $('<div class="component_zoom"></div>');
			container = $('<div class="container_image_zoom"></div>');
			
			config_attributes(image_zoom, original_image, component_zoom);
			create_tree(image_zoom, original_image, component_zoom, container);

			zero_x = original_image.offset().left;
			zero_y = original_image.offset().top;

			//alert(original_image.offset().left); // 247
			//alert(original_image.offset().top); // 505
			//alert(image_zoom.width()); // 0
			//alert(image_zoom.height()); // 0
			
			properties.width_proportion = image_zoom.width() / properties.original_image_width;
			properties.height_proportion = image_zoom.height() / properties.original_image_height;
			
			// TODO initial position			
			image_zoom.css('visibility', 'visible');
			
			original_image.mousemove(handle_mouse_event);
        });

    }; 
    
	$.fn.ImageExternalZoom.defaults = {
		original_image_width: 100,
		original_image_height: 100,
		component_zoom_width: 50,
		component_zoom_height: 50,
	};
    
})(jQuery);


(function($) {

	$.fn.ImageZoom = function(options) {
		var properties = $.extend({}, $.fn.ImageZoom.defaults, options);

		function img_hover(x) {
			$(this).css({'z-index' : '9999'});
			$(this).addClass("imagezoom_hover").stop().animate(properties.class_style_hover, properties.speed_hover);
		}
	
		function img_unhover() {
			$(this).attr('style', $(this).attr('original_style'));
			$(this).css({'z-index' : '0'});
			$(this).removeClass("imagezoom_hover").stop().animate(properties.class_style_unhover, properties.speed_unhover);
		}
		
        return this.each(function(index) {
        	image = $(this);
        	width = parseInt(image.attr('width'));
        	height = parseInt(image.attr('height'));
        	width_with_zoom = (100 + parseInt(properties.zoom)) * width / 100;
        	height_with_zoom = (100 + parseInt(properties.zoom)) * height / 100;
        	//image.wrap("<div class='imagezoom-div'></div>"));
        	image.css({'position' : 'relative'});
        	image.attr('original_width', width);
        	image.attr('original_height', height);
        	image.attr('original_style', $(this).attr('style'));

			properties.class_style_hover = {
					width: width_with_zoom + properties.unit,
					height: height_with_zoom + properties.unit
			};
			properties.class_style_unhover = {
					width: width + properties.unit,
					height: height + properties.unit,
					display: 'inline'
			};
			
        	if(properties.direction == 'topleft') {
				properties.class_style_hover.bottom = '0px';
				properties.class_style_hover.right = '0px';
        		properties.class_style_hover.top = (- parseInt(properties.zoom)) + properties.unit;
        		properties.class_style_hover.left = (- parseInt(properties.zoom)) + properties.unit;
        		properties.class_style_unhover.top = '0px';
        		properties.class_style_unhover.left = '0px';
        	}
			else if(properties.direction == 'topright') {
				properties.class_style_hover.bottom = '0px';
				properties.class_style_hover.left = '0px';
        		properties.class_style_hover.top = (- parseInt(properties.zoom)) + properties.unit;
        		properties.class_style_hover.right = (parseInt(properties.zoom)) + properties.unit;
        		properties.class_style_unhover.top = '0px';
        		properties.class_style_unhover.right = '0px';
        	}
			else if(properties.direction == 'bottomleft') {
				properties.class_style_hover.top = '0px';
				properties.class_style_hover.right = '0px';
        		properties.class_style_hover.bottom = (parseInt(properties.zoom)) + properties.unit;
        		properties.class_style_hover.left = (- parseInt(properties.zoom)) + properties.unit;
        		properties.class_style_unhover.bottom = '0px';
        		properties.class_style_unhover.left = '0px';
        	}
			else if(properties.direction == 'bottomright') {
				properties.class_style_hover.top = '0px';
				properties.class_style_hover.left = '0px';
        		properties.class_style_hover.bottom = (- parseInt(properties.zoom)) + properties.unit;
        		properties.class_style_hover.right = (- parseInt(properties.zoom)) + properties.unit;
        		properties.class_style_unhover.bottom = '0px';
        		properties.class_style_unhover.right = '0px';
        	} else { // outside
        		properties.class_style_hover.top = (- parseInt(properties.zoom) / 2) + properties.unit;
        		properties.class_style_hover.left = (- parseInt(properties.zoom) / 2) + properties.unit;
        		properties.class_style_unhover.top = '0px';
        		properties.class_style_unhover.left = '0px';
        	}
        	
        	image.hover(img_hover, img_unhover);
        });

    }; 
    
	$.fn.ImageZoom.defaults = {
		zoom: 5,
		speed_hover: 100,
		speed_unhover: 100,
		direction: 'outside',
		unit: 'px',
	};
    
})(jQuery);