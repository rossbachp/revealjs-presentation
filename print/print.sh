#!/bin/bash
if [ "$1z" == $"z" ]; then
  echo "usage: $0 <pdf output filename> <conference title>"
fi
DATE=`date +'%Y'`
if [ "${COPYRIGHT}z" == "z" ]; then
  COPYRIGHT="${DATE} &lt;peter.rossbach@bee42.com&gt;, @PRossbach"
  if [ ! "$2z" == $"z" ]; then
    COPYRIGHT="${COPYRIGHT}, $2"
  fi
fi
./phantomjs slidefire.js http://127.0.0.1:8000/?print-pdf $1 "$COPYRIGHT"
