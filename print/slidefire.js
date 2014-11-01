var page = require('webpage').create(),
    system = require('system'),
    address, output, size, copyright;

if (system.args.length != 4) {
    console.log('Usage: slidefire.js URL filename copyright');
    phantom.exit(1);
} else {
    address = system.args[1];
    output = system.args[2];
    copyright = system.args[3];
//    page.viewportSize = { width: 1920, height: 1200 };
//    page.viewportSize = { width: 539, height: 789 };
//    page.paperSize = { format: 'A4', orientation: 'landscape', margin: '0cm' };
    page.paperSize = {
        format: 'A4',
        orientation: 'portrait',
        margin: '0cm',
        footer: {
            height: "0.5cm",
            contents: phantom.callback(function(pageNum, numPages) {
                return "<div style='background-color:#20252e;color: #ffffff;font-size: 11pt;width:21cm;height:1cm;padding:10px;margin-top: -8px !important ;margin-left:-10px !important;border: 0;padding: 0;'> <span style='padding:5px'>&#169; " + copyright + "</span><span style='float:right'>" + pageNum + " / " + numPages + "</span></div>";
            })
        }
    };
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit();
        } else {
            page.render(output);
            phantom.exit();
        }
    });
}

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('### ' + msg );
};

page.onError = function (msg, trace) {
	console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.sourceURL, ':', item.line);
    })
}
