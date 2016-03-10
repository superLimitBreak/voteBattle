import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'README.md')) as f:
    README = f.read()
#with open(os.path.join(here, 'CHANGES.txt')) as f:
#    CHANGES = f.read()

requires = [
    'pyramid',
    'pyramid_debugtoolbar',
    'waitress',
    'pyramid_mako',
    'decorator',
    'python-dateutil',
    'dogpile.cache',
]
test_requires = [
    'pytest',
    'webtest',
    'beautifulsoup4',
]

setup(
    name='VoteBattle',
    version='0.0',
    description='vote',
    long_description=README,  # + '\n\n' + CHANGES,
    classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
    ],
    author='calaldees',
    author_email='calaldees@gmail.com',
    url='http://www.github.com/calaldees/VoteBattle',
    keywords='web pyramid pylons',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires+test_requires,
    tests_require=test_requires,
    test_suite="py.test",
    entry_points="""\
    [paste.app_factory]
    main = vote:main
    """,
)
