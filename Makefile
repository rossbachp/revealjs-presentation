.PHONY: build slides shell

build:
	@docker build --rm -t rossbachp/presentation .

slides:
	@cd test; docker build --rm -t rossbachp/slides:test .
	@docker run -it --rm -p 8000:8000 rossbachp/slides:test

shell:
	@docker run -it --rm -p 8000:8000 rossbachp/presentation /bin/bash