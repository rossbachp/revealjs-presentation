#!/bin/bash
if [ "$1z" == $"z" ]; then
  echo "usage: $0 <pdf output filename> <slidedeck title>"
fi
DATE=`date +'%Y'`
if [ "${TITLE}z" == "z" ]; then
  if [ "$2z" == $"z" ]; then
    TITLE="slidefire"
  else
    TITLE="$2"
  fi
fi
exiftool -Title="${TITLE}" -Author="Peter Rossbach" -copyright="${DATE} bee42 solutions gmbh" -Creator="<peter.rossbach@bee42.com>, @PRossbach" $1
