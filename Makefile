.PHONY: distro

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

deploy:
	# Ensure the distro exist
	ls distro/terminal.zip
	# Copy the distro to production
	scp distro/terminal.zip root@digitalocean-prod-0:/var/lib/skyraid/packages/terminal.zip