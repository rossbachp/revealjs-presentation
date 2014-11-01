#!/bin/bash
COPYRIGHT='&lt;peter.rossbach@bee42.com&gt;, @PRossbach'
./phantomjs slidefire.js http://127.0.0.1:8000/?print-pdf $1 "$COPYRIGHT"
