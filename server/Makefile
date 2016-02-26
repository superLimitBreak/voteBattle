PROJECT=vote

ENV = _env
PYTHON = $(ENV)/bin/python3
PIP = $(ENV)/bin/pip3
PSERVE = $(ENV)/bin/pserve

INI_DEV  = development.ini
INI_TEST = test.ini
INI_PROD = production.ini

#OS = $(shell uname -s)


help:
	# Usage: make <target>, where target is
	# install         -- setup python egg & install dependencys/env if needed
	# test          -- run all nosetests
	# run           -- run the site in development mode
	# run_production -- run in production mode
	# clean         -- reset the folder to clean git checkout (removes virtual python env)


# Install ----------------------------------------------------------------------

# DEPRICATED - System level packages should not be in makefile
#	if [$OS -eq "Linux"]; then \
#		if dpkg -s python-virtualenv ; then \
#			echo virtualenv already installed; \
#		else \
#			echo installing virtualenv; \
#			sudo apt-get install python-virtualenv; \
#		fi ;\
#		if dpkg -s python3-setuptools ; then \
#			echo python 3 already installed; \
#		else \
#			echo installing python 3; \
#			sudo apt-get install python3-setuptools python-setuptools; \
#		fi ;\
#	fi
#	# TODO - check brew installed + maybe install it
#	if [$OS -eq "Darwin"]; then \
#		brew install python3 ;\
#	fi

#.PHONY: has-python
#has-python:
#	which python
#	which python3
#	which virtualenv

$(ENV):
	virtualenv --no-site-packages -p python3 $(ENV)
	$(ENV)/bin/easy_install pyramid

VoteBattle.egg-info: $(ENV)
	$(PYTHON) setup.py develop

dependencys_installed.json: libs
	$(PYTHON) libs/dependency_downloader.py --destination externals

libs:
	mkdir libs
	touch libs/__init__.py
	cd libs && \
	if [ -d ../../../libs/ ] ; then \
		ln -s ../../../libs/python3/lib/dependency_downloader.py           dependency_downloader.py ;\
		ln -s ../../../libs/python3/lib/misc.py                            misc.py                  ;\
		ln -s ../../../libs/python3/lib/make_ini.py                        make_ini.py              ;\
		ln -s ../../../libs/python3/lib/xml.py                             xml.py                   ;\
		mkdir multisocket ;\
		cd multisocket && \
		touch __init__.py ;\
		ln -s ../../../../libs/python3/lib/multisocket/multisocket_server.py  multisocket_server.py    ;\
		ln -s ../../../../libs/python3/lib/multisocket/subscription_server.py subscription_server.py   ;\
		ln -s ../../../../libs/python3/lib/multisocket/auth_echo_server.py    auth_echo_server.py      ;\
		cd .. ;\
		mkdir pyramid_helpers ;\
		cd pyramid_helpers && \
		ln -s ../../../../libs/python3/lib/pyramid_helpers/__init__.py         __init__.py         ;\
		ln -s ../../../../libs/python3/lib/pyramid_helpers/auto_format.py      auto_format.py      ;\
		ln -s ../../../../libs/python3/lib/pyramid_helpers/events.py           events.py           ;\
		ln -s ../../../../libs/python3/lib/pyramid_helpers/etag.py             etag.py             ;\
		ln -s ../../../../libs/python3/lib/pyramid_helpers/session_identity.py session_identity.py ;\
	else \
		wget -cq https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/dependency_downloader.py ;\
		wget -cq https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/misc.py                  ;\
		wget -cq https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/make_ini.py              ;\
		wget -cq https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/xml.py                   ;\
		mkdir multisocket ;\
		cd multisocket && \
		touch __init__.py ;\
		wget -cq https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/multisocket/multisocket_server.py  ;\
		wget -cq https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/multisocket/subscription_server.py ;\
		wget -cq https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/multisocket/auth_echo_server.py    ;\
		cd .. ;\
		mkdir pyramid_helpers ;\
		cd pyramid_helpers && \
		wget -cq https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/pyramid_helpers/__init__.py         ;\
		wget -cq https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/pyramid_helpers/auto_format.py      ;\
		wget -cq https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/pyramid_helpers/events.py           ;\
		wget -cq https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/pyramid_helpers/etag.py             ;\
		wget -cq https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/pyramid_helpers/session_identity.py ;\
	fi


.PHONY: install
install: VoteBattle.egg-info dependencys_installed.json


# Run --------------------------------------------------------------------------

.PHONY: run
run: install
	$(PSERVE) --reload $(INI_DEV)

.PHONY: run_production
run_production: ini_production
	$(PSERVE) $(INI_PROD)

.PHONY: shell
shell:
	$(ENV)/bin/pshell $(INI_DEV)

ini_production:
	$(PYTHON) libs/make_ini.py production

start_webapp_daemon: ini_production
	start-stop-daemon --start --pidfile webapp.pid --name $(PROJECT) --make-pidfile --background --exec /bin/bash -- -c "$(CURDIR)/env/bin/pserve $(CURDIR)/$(INI_PROD)"
stop_webapp_daemon:
	start-stop-daemon --stop  --pidfile webapp.pid && rm webapp.pid


# Test -------------------------------------------------------------------------

ini_test:
	$(PYTHON) libs/make_ini.py test

test: ini_test
	# Think this is broken?!
	$(ENV)/bin/py.test $(PROJECT) -q --pdb


# Clean ------------------------------------------------------------------------

clean:
	rm -rf $(ENV) externals libs dependencys_installed.json
	rm -rf *.egg-info
	rm -rf $(INI_TEST)
	rm -rf $(INI_PROD)
