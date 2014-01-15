PROJECT=vote

PATH_EXTERNALS=externals/

INI_DEV  = development.ini
INI_TEST = test.ini
INI_PROD = production.ini


help:
	# Usage: make <target>, where target is
	# setup         -- setup python egg & install dependencys/env if needed
	# test          -- run all nosetests
	# run           -- run the site in development mode
	# run_production -- run in production mode
	# clean         -- reset the folder to clean git checkout (removes virtual python env)

env:
	if dpkg -s python-virtualenv ; then \
		echo virtualenv already installed; \
	else \
		echo installing virtualenv; \
		sudo apt-get install python-virtualenv; \
	fi
	if dpkg -s python3-setuptools ; then \
		echo python 3 already installed; \
	else \
		echo installing python 3; \
		sudo apt-get install python3-setuptools python-setuptools; \
	fi
	virtualenv --no-site-packages -p python3 env
	cd env;	bin/easy_install pyramid

setup: env
	env/bin/python setup.py develop

dependency_downloader.py:
	curl https://raw.github.com/calaldees/KaraKara/master/website/karakara/scripts/dependency_downloader.py --compressed -O

externals:
	env/bin/python dependency_downloader.py --destination $(PATH_EXTERNALS)

install: env setup dependency_downloader.py externals test

run:
	env/bin/pserve --reload $(INI_DEV)

run_production: ini_production
	env/bin/pserve $(INI_PROD)

shell:
	env/bin/pshell $(INI_DEV)

ini_test:
	env/bin/python3 $(PATH_EXTERNALS)lib/make_ini.py test
ini_production:
	env/bin/python3 $(PATH_EXTERNALS)lib/make_ini.py production

clean:
	rm -rf env
	rm -rf *.egg-info
	rm -rf $(INI_TEST)
	rm -rf $(INI_PROD)
	rm -rf $(PATH_EXTERNALS)
	rm -rf dependency_downloader.py
	rm -rf dependencys_installed.json

test: ini_test
	env/bin/py.test $(PROJECT) -q --pdb

start_webapp_daemon: ini_production
	start-stop-daemon --start --pidfile webapp.pid --name $(PROJECT) --make-pidfile --background --exec /bin/bash -- -c "$(CURDIR)/env/bin/pserve $(CURDIR)/$(INI_PROD)"
stop_webapp_daemon:
	start-stop-daemon --stop  --pidfile webapp.pid && rm webapp.pid
