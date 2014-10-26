# Build your own slide software with slidefire

**My Goals**


  * Use, build, make and bundle with the beautifull slide framework reveal.js
  * develop your slide with markdown
  * add picture to your slides
  * package and distribute your slides as a simple docker container
  * run your slide
  * print your slide and promote it to slidefire

## create your slide deck

```bash
$ mkdir slidefire
$ cd slidefire
$ echo "# Title" >slides.md
$ mkdir -p images
$ docker run -ti -d --name slidefire -v `pwd`/images:/opt/presentation/images -v  `pwd`:/opt/presentation/lib/md -v `pwd`/build:/build -p 8000:8000 rossbachp/presentation
$ open http://localhost:8000
```

***
  * edit your `slides.md` at refresh your browser and the changes!
  * inside container `grunt package` produce `reveal-js-presentation.zip` copy to folder `/build` and extract to your favourite web server!

## Trick add mac to save development time

With boot2docker 1.3 your must only mount the `/Users` folder.

With boot2docker 1.2 your must install special edition at your Mac:

```bash
$ boot2docker down
$ curl http://static.dockerfiles.io/boot2docker-v1.2.0-virtualbox-guest-additions-v4.3.14.iso > ~/.boot2docker/boot2docker.iso
$ VBoxManage sharedfolder add boot2docker-vm -name home -hostpath /Users
$ VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port8000,tcp,,8000,,8000"
$ boot2docker up
```
[Missing Guide boot2docker](http://viget.com/extend/how-to-use-docker-on-os-x-the-missing-guide)

Then you can start writing your sildes at your mac!

## Package your slides

You can easly build an Docker image with the complete slide dev tools inside.
But, it is more then 500mb big. See slides and download overhead is not fun.
Simpler and lighter is better. reveal.js is a slide show presenter the not need a backend, it based on JavaScript, HTML, CSS. How we can build a simple web server that can deliver your slide deck?

  * use `lightttp` with a small os (busybox)
  * package your slides from your dev-container
    - make sure that docker-enter/nsenter is installed
    - or restart container with package build

### Package your slides with grunt

  * stop your slide presentation container
  * run to package

```bash
$ mkdir build
$ docker run -ti -d --name slidefire -v `pwd`/images:/opt/presentation/images -v  `pwd`:/opt/presentation/lib/md -v `pwd`/build:/build -p 8000:8000 rossbachp/presentation /bin/bash -c "grunt package && mv reveal-js-presentation.zip /build"
$ cd build
$ mkdir slidefire
$ cd slidefire
# you must have zip installed - apt-get install -y zip
$ unzip ../reveal-js-presentation.zip
$ cd ..
$ tar czf slidefire.tar.gz slidefire
```

### Package your slides with nsenter and docker snapshot

```bash
# add your slide container
$ mkdir build
# check that container has a build volume - if not configure and restart sildeshow
$ ssh <to your docker host>
# grep your slide container id
$ ID=$(docker ps | grep XXXXX | awk '/^[0-9a-f]/{print $1}')
$ sudo docker-enter $ID /bin/bash
$ cd /opt/presentation
$ grunt package
$ mv reveal-js-presentation.zip /build
$ exit
$ cd build
$ mkdir slidefire
$ cd slildefire
# you must have zip installed - apt-get install -y zip
$ unzip ../reveal-js-presentation.zip
$ cd ..
$ tar czf slidefire.tar.gz slidefire
```


### Make your slides runable with simple lighttpd

  * use a small docker container like [progrium/busybox](https://github.com/progrium/busybox)

```bash
$ vi Dockerfile
$ docker build -t="rossbachp/slidefire" .
```

Dockerfile
```
FROM progrium/busybox
MAINTAINER Peter Rossbach <peter.rossbach@bee42.com>

RUN opkg-install base-files bash lighttpd
ONBUILD slidefire.tar.gz /www
EXPOSE 80

CMD ["lighttpd", "-D","-f", "/etc/lighttpd/lighttpd.conf"]
```

```bash
#!/bin/bash
DECK=slidefire
if [ ! "x" == "x`docker ps -a | grep $DECK`" ]; then
  docker rm $DECK
fi

mkdir -p build
PWD=`pwd`
mkdir -p build/md
cp slides.md build/md
docker run -ti -d --name $DECK -v $PWD/images:/opt/presentation/images -v  $PWD/build/md:/opt/presentation/lib/md -v $PWD/build:/build -p 8000:8000 rossbachp/presentation /bin/bash -c "grunt package && mv reveal-js-presentation.zip /build/$DECK.zip"
cd build
mkdir -p $DECK
cd $DECK
#you must have zip installed - apt-get install -y zip
unzip ../$DECK.zip
cd ..
tar czf slidefire.tar.gz $DECK
cat <<EOT >> Dockerfile
FROM rossbachp/slidefire
MAINTAINER Peter Rossbach <peter.rossbach@bee42.com>
EOT
docker build -t=rossbachp/$DECK .

docker stop $DECK
docker rm $DECK
rm -rf build/$DECK
rm -rf build/md

```

Access the slide show

```bash
$ docker run -ti -d  -p 8001:80 rossbachp/slidefire
$ open http://localhost:8001/slidefire
```

### Package a data volume slide container

```bash
$ vi Dockerfile
$ docker build -t="rossbachp/slidefire-volume" .
$ docker run --name slidefire2 rossbachp/slidefire-volume
$ docker run ti -d -p 8002:80 -volume-from slidefire2 rossbachp/lighttpd
```
  * With -volume-from you can add muliple slideshows to your web server

Dockerfile slidefire
```
FROM tianon/true
MAINTAINER Peter Rossbach <peter.rossbach@bee42.com>

ADD slidefire.tar.gz /www
VOLUMNE /www/slidefire
```

Dockerfile lighttpd
```
FROM progrium/busybox
MAINTAINER Peter Rossbach <peter.rossbach@bee42.com>

RUN opkg-install base-files bash lighttpd
ADD index.html /www
EXPOSE 80

CMD ["lighttpd", "-D","-f", "/etc/lighttpd/lighttpd.conf"]
```

index.html
```html
<html>
<body>
<h1 slidefire</h1>
<a href="slidefire/index.html">slidefire<a>
</body>
</html>
```

[tianon/true](https://github.com/tianon/dockerfiles/tree/master/true)

## Generate your PDF slide deck

  * ARRG!
  * No real good print.css available
  * I need help!

## build the slide developer kid

  - Install boot2docker or your on docker host/vm
  - make presentation images
    `make build`
  - test slides
    `make slides`
  - run shell inside revealjs presentation image
    `make shell`
  - pull ready my slide developmer kid
    `docker pull rossbachp/presentation`

## markdown usage

[Fragments and formating elements](https://github.com/hakimel/reveal.js#element-attributes)

```javascript
<!-- .element: class="fragment" -->.
```

```html
<section data-markdown>
    <script type="text/template">
        - Item 1 <!-- .element: class="fragment" data-fragment-index="1" -->
        - Item 2 <!-- .element: class="fragment" data-fragment-index="2" -->
    </script>
</section>
```

```html
<section>
    <p class="fragment grow">grow</p>
    <p class="fragment shrink">shrink</p>
    <p class="fragment roll-in">roll-in</p>
    <p class="fragment fade-out">fade-out</p>
    <p class="fragment highlight-red">highlight-red</p>
    <p class="fragment highlight-green">highlight-green</p>
    <p class="fragment highlight-blue">highlight-blue</p>
</section>
```

support of fragments enabled
```javascript
{ src: 'plugin/markdown/markdown.js',
  condition: function() { return !!document.querySelector( '[data-markdown]' ); },
  callback: function() {
    Array.prototype.forEach.call(document.querySelectorAll('section > p'), function(ele){ ele.className = 'fragment'; });
  }
},
```

Formating content
```bash
<section data-markdown>
    <script type="text/template">
    <!-- .slide: data-background="#ff0000" -->
        Markdown content
    </script>
</section>
```

## Support presenter

What you want is that it would navigate to "next" instead of "right", which is the default binding for right arrow key. You can achieve this by overriding the default key bindings. There is some documentation here:

[keyboard-bindings](https://github.com/hakimel/reveal.js/#keyboard-bindings)

In your case you would like the right arrow key (keycode 39) to bind to "next" and probably also override left arrow key (keycode 37) to bind to "prev". Here is the sample code (add this to the Reveal.initialize configuration add the end of the file):

```
keyboard: {
    39: 'next',
    37: 'prev'
}
```

## SVG at reveal.js

[SVG and revealjs](http://bl.ocks.org/bollwyvl/fe1d2806449487cdf88a)


## Some usefull links
  - [reveal.js](https://github.com/hakimel/reveal.js/)
  - [reveal.js Container](http://mindtrove.info/a-reveal.js-docker-base-image-with-onbuild/)
  - [Jeff Turnball html slide generator](http://kartar.net/2014/05/presenting-with-docker/)
  - [Docker](http://www.docker.com)
  - [boot2docker](http://www.boot2docker.io)
