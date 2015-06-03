.PHONY: distro

name=terminal

init:
	bower install
	npm install

clean:
	grunt clean

build:
	grunt build

stage:
	-rm -rf app/bower_components
	ln -s $(PWD)/bower_components app/bower_components

distro-clean:
	rm -rf distro

distro: distro-clean
	# Make sure the package is built
	ls dist
	# Ensure the distro dir exist
	-mkdir distro
	# Change the name of the folder to root to match required package structure
	-mv dist root
	# zip the dist dir and and place the zip in the distro folder
	-zip -r ./distro/terminal.zip ./root > /dev/null
	# Change the name back to dist
	-mv root dist

deploy: distro
	# Ensure the distro exist
	ls distro/terminal.zip
	# Copy the distro to production
	scp distro/terminal.zip root@digitalocean-prod-0:/var/lib/skyraid/packages/terminal.zip

devdeploy: build distro
	-rm /var/lib/skyraid/packages/$(name).zip
	-mkdir /var/lib/skyraid/packages
	cp distro/$(name).zip /var/lib/skyraid/packages/$(name).zip