.PHONY: build slides shell

build:
	@docker build --rm -t bee42/presentation .

slides:
	@cd test; docker build --rm -t bee42/presentation:test .
	@docker run -it --rm -p 8000:8000 bee42/presentation:test

shell:
	@docker run -it --rm -p 8000:8000 bee42/presentation /bin/bash