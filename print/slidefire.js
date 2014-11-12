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
                return "<div style='background-color:#20252e;color: #ffffff;font-size: 8pt;width:29.7cm;height:0.4cm;padding:10px;margin-top: -10px !important ;margin-left:-10px !important;border: 0;padding: 0;'> <span style='padding:5px'>&#169; " + copyright + "</span><span style='float:right'>" + pageNum + " / " + numPages + "</span></div>";
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
                jQuery('section.stack > section').unwrap();
                jQuery('.slide-background').remove();
            });
            
            page.evaluate(function() {
                jQuery('section').each(function( index ) {
                    jQuery(this).css('display','block');
                    var h = jQuery( this ).height();
                    //var w = jQuery( this ).width();
                    console.log( index + " : " + h );
                    if (h!=0){
                        console.log( index + " : " + h );
                        var zh = 539/h;
                        console.log('--> '+zh);
                        if (zh<1){
                            //jQuery( this ).css('zoom',Math.min(zh, zw));
                            jQuery( this ).css('zoom',zh);
                        }
                        if (zh<1){
                          try { 
                            jQuery( this ).find('h3,h2,h1,h4,h5').css('zoom',(1/zh)); 
                          } catch (e){
                              console.log(e);
                          }
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
                      jQuery( this ).css('top',str);
                      console.log('||--> '+str);  
                    }
                });

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
	console.log(msg);
}

