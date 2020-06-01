all : run

build : 
	npm run build-prod 

deploy: build
	rsync -azv www/ /var/www/html/moose/ 
	chown -R apache:root /var/www/html/moose/

run:
	npm start
