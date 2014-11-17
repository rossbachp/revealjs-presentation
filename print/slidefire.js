var page = require('webpage').create(),
    system = require('system'),
    address, output, size;
    
if (system.args.length != 4) {
    console.log('Usage: rasterize.js URL filename copyright');
    phantom.exit(1);
} else {
    address = system.args[1];
    output = system.args[2];
    copyright = system.args[3];
    page.viewportSize = { width: 3300, height: 3300 };
    //page.viewportSize = { width: 789, height: 539 };
    page.paperSize = {
        format: 'A4',
        orientation: 'landscape',
        margin: '0cm',
        footer: {
            height: "0.5cm",
            contents: phantom.callback(function(pageNum, numPages) {
                return "<div style='background-color:#f29400;color: #ffffff;font-size: 8pt;width:29.7cm;height:0.55cm !important;margin-top: -10px !important ;margin-left:-10px !important;border: 0;padding: 4 5 0 3;'> <span style='padding:5px'>&#169; " + copyright + "</span><span style='float:right'><img src='Infrabriks_line_V2_RZ_Small.png'/></span><span style='float:right'>" + pageNum + " / " + numPages + "</span></div>";
            })
        }
    };
    
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit();
        } else {
            var suc = page.injectJs('jquery.min.js');
            console.log('jquery injected '+suc);

            page.evaluate(function() {
                jQuery('.slide-background').remove();jQuery('section.stack > section').unwrap();
                
            });
            
            page.evaluate(function() {
                
                function injectStyles(rule) {
                  var div = $("<div />", {
                    html: '&shy;<style>' + rule + '</style>'
                  }).appendTo("body");    
                }                
                
                jQuery('section').each(function( index ) {
                    jQuery(this).css('display','block');
                    var h = jQuery( this ).height();
                    //var w = jQuery( this ).width();
                    console.log( index + " : " + h );
		    //var id = "biene"+index;
	            //jQuery( this ).append('<div id="'+id+'" style="background-image: url(logo.png);position: absolute;top: 50px;left: 50px;width: 210px;height: 164px;background-repeat:no-repeat;">');        
		    //console.log('id:'+id);
		    if (h!=0){
                        console.log( index + " : " + h );
                        var zh = 539/h;
                        console.log('--> '+zh);
                        if (zh<1){
                            jQuery( this ).css('zoom',zh);
			    //jQuery('#'+id).css('zoom',1/zh/10);
                            try { 
                              //jQuery( this ).find('h3,h2,h1,h4,h5').css('zoom',(1)); 
                            } catch (e){
                              console.log(e);
                            }
                        } else {
			   //jQuery('#'+id).css('zoom',1/10);
			}
                    }
                });
                

                jQuery('section').each(function( index ) {
                    var h = jQuery( this ).height();
                    console.log('||> '+h);
                    if (h<539){
                      //var top = (539-h)/2/539*21;
                      var top = (539-h)/2;
                      var str = top+'px';
                      //jQuery( this ).css('top',str);
                      console.log('||--> '+str);  
                    }
                });
                
                //jQuery('.reveal pre code').css('font-size','12pt');
                //jQuery('.reveal .slides section').css('padding','1cm 0.5cm 0 0.5cm !important');
                //jQuery('.reveal .slides').css('text-align','center');
		//jQuery('section').append('<div style="background-image: url(logo.png);position: absolute;top: -10px;right: -5px;width: 210px;height: 164px;background-repeat:no-repeat;">');
		jQuery('#myLogo').remove();        
		jQuery('section').each(function( index ) {
			var id = "biene"+index;
			console.log('id:'+id);
			jQuery( this ).append('<div id="'+id+'" style="background-image: url(logo.png);position: absolute;top: 50px;left: 50px;width: 210px;height: 164px;background-repeat:no-repeat;">');
			jQuery('#'+id).css('zoom',0.3);
		});                
		injectStyles('.reveal .slides section{ min-height:100% !important }');
                injectStyles('.reveal .slides section{ height:100% !important }');
                injectStyles('.reveal .slides section{ padding: 1cm 0.5cm 0 0.5cm !important }');
            });
            
                    
            page.render(output);
            phantom.exit();
        }
    });
}

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('### ' + msg );
};

page.onError = function (msg) {
	console.log('~~~ '+msg);
}
