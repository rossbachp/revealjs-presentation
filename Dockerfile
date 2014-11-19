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

RUN mkdir -p /opt/presentation/lib/md
RUN mkdir -p /opt/presentation/images

WORKDIR /opt/presentation

RUN npm install -g grunt-cli
RUN npm install
RUN sed -i Gruntfile.js -e 's/port: port,/port: port, hostname: "",/'

RUN apt-get install -y apt-utils
RUN apt-get install -y libfreetype6-dev fontconfig
RUN cd /usr/local/share  && \
wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.7-linux-x86_64.tar.bz2 && \
tar xjf phantomjs-1.9.7-linux-x86_64.tar.bz2 && \
ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/local/share/phantomjs && \
ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs && \
ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/bin/phantomjs

ADD index.html /opt/presentation/
ADD logo.png /opt/presentation/lib/logo.png
ADD custom.css /opt/presentation/css/
ADD title.js /opt/presentation/plugin/

# Add new print support - andreas.knuth
ADD print /opt/presentation/print
RUN apt-get update --fix-missing
RUN apt-get install -y libxslt1.1 libicu52
RUN chmod +x /opt/presentation/print/*.sh /opt/presentation/print/phantomjs

# Handling PDF Metadata and Passwords
RUN apt-get -y -q install exiftool pdftk

ONBUILD ADD slides.md /opt/presentation/lib/md/
ONBUILD ADD images /opt/presentation/images/

EXPOSE 8000
CMD ["grunt", "serve"]

ADD LICENSE /etc/LICENSE

RUN echo "rossbachp presentation" >/etc/provisioned && date >>/etc/provisioned && echo >>/etc/provisioned && echo " Copyright by <peter.rossbach@bee42.com> bee42 solutions gmbh" >>/etc/provisioned
