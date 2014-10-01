FROM ubuntu:14.04

MAINTAINER Peter Rossbach <peter.rossbach@bee42.com>

RUN apt-get update --fix-missing
RUN apt-get install --only-upgrade bash
RUN apt-get -y -q install wget
RUN apt-get -y -q install nodejs npm
RUN apt-get -y -q install nodejs-legacy

RUN wget https://github.com/hakimel/reveal.js/archive/2.6.2.tar.gz
RUN tar xzf 2.6.2.tar.gz
RUN mkdir -p /opt
RUN mv /reveal.js-2.6.2 /opt/presentation

RUN mkdir -p /opt/presentation/md
RUN mkdir -p /opt/presentation/images

WORKDIR /opt/presentation

RUN npm install -g grunt-cli
RUN npm install
RUN sed -i Gruntfile.js -e 's/port: port,/port: port, hostname: "",/'

ADD index.html /opt/presentation/
ADD logo.png /opt/presentation/
ADD custom.css /opt/presentation/css/
ADD title.js /opt/presentation/plugin/

ONBUILD ADD slides.md /opt/presentation/md/
ONBUILD ADD images /opt/presentation/images/

EXPOSE 8000
VOLUME ["/opt/presentation/md/"]
CMD ["grunt", "serve"]
