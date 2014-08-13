# Docker und reveal.js

Ein `reveal.js` Docker Image mit einem `ONBUILD` Hook für die Folien nutzen.

---

## Erzeuge Deine Folien

---

## Erzeuge einen ersten `Dockerfile` und die erste Folie

```bash
$ docker pull rossbachp/presentation
$ mkdir presentation
$ cd presentation
$ echo "FROM rossbachp/presentation" >Dockerfile
$ echo "# Präsentation gestartet!" >slides.md
$ mkdir -p images
```

---

## Bauen des Foliensatz

```bash
$ docker build --rm -t myslides .
```

---

## Ausführen und betrachten

```bash
$ docker run -it --rm -p 8000:8000 myslides
$ open http://localhost:8000/
```

Evtl. muss auf dem eigenen Mac noch einmalig der Port 8000 freigeschaltet werden! Damit der Befehl `boot2docker-fwd.sh` klappt, muss noch der [Patch boot2docker-fwd](https://gist.github.com/deinspanjer/9215467) im Kommentar angewendet werden.

```bash
$ boot2docker-fwd.sh -n presentation -h 8000 8000
```

---

## Links

  - [Idee zu dieser Präsentationstechnik](http://mindtrove.info/a-reveal.js-docker-base-image-with-onbuild)
  - [Jeff Turnball Variante](http://kartar.net/2014/05/presenting-with-docker/)
  - [boot2docker-fwd](https://gist.github.com/deinspanjer/9215467)
  - [boot2docker Post Peter Rossbach](http://www.infrabricks.de/blog/2014/06/30/docker-mit-boot2docker-starten/)

---

## Nun können schnell Präsentation entstehen und ausführbar weitergegeben werden.

### Viel Spaß damit [Peter Rossbach](mailto:peter.rossbach@bee42.com)

  <img src="images/Octocat.png" alt="Octocat" border="-1" height="42" width="42"> [Source on github](https://github.com/rossbachp/revealjs-presentation)
