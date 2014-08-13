# Docker und reveal.js

Ein `reveal.js` Docker Image mit einem `ONBUILD` Hook für die Folien nutzen.

---

## Erzeuge Deine Folien

---

## Erzeuge einen ersten `Dockerfile` und die erste Folie

```bash
$ mkdir presentation
$ cd presentation
$ echo "FROM bee42/presentation" >Dockerfile
$ echo "# Präsentation gestartet!" >slides.md
```

---

## Bauen des Foliensatz

```bash
$ docker build -t myslides .
```

---

## Ausführen und betrachten

```bash
$ docker run -d -P myslides
$ open http://localhost:8000/
```

Evtl. muss auf dem eigenen Mac noch einmalig der Port 8000 freigeschaltet werden!

```bash
$ boot2docker-fwd.sh -n presentation -h 8000 8000
```

---

## Links

  - [Idee zu dieser Präsentation Technik](http://mindtrove.info/a-reveal.js-docker-base-image-with-onbuild)
  - [Jeff Turnball Variante](http://kartar.net/2014/05/presenting-with-docker/)
  - [boot2docker-fwd](https://gist.github.com/deinspanjer/9215467)
  - [boot2docker Post Peter Rossbach](http://www.infrabricks.de/blog/2014/06/30/docker-mit-boot2docker-starten/)

  