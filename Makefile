all : deploy

build : 
	npm run build-prod 

deploy: build
	rsync -azv www/ /var/www/html/moose/ 
	chown -R httpd:root /var/www/html/moose/
