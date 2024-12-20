# HTML Sanitizer Testing Pipeline (HTML-ST)

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/) [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Sanitizer-Testing-Pipeline&url=https://github.com/SoheilKhodayari/html-sanitizer-testing-pipeline)

A collection of scripts to test and run popular HTML sanitizers of five different programming languages. 

Please note that at its current state, the code is a PoC and not a production-ready API.


## Prerequisites

- Python3, and pip
- PHP, and composer
- C#, .NET, and nuget
- Node.js and npm
- Java and Maven

## Setup

Install the necessary dependencies:

```bash
$ (cd clientside && pip3 install -r requirements.txt)
$ (cd php && composer update)
$ (cd node-js && npm install)
$ (cd python && pip3 install -r requirements.txt)
$ (cd chsarp && nuget restore)
$ (cd csharp/Sanitizer && nuget install packages.config)
$ (cd java && mvn install)
$ (cd java && mvn install:install-file -Dfile=./libs/htmlcleaner-2.24.jar -DgroupId=org.htmlcleaner -DartifactId=htmlcleaner -Dversion=2.24 -Dpackaging=jar -DgeneratePom=true)
```

or simply:

```bash
$ ./install.sh
```

## Running

You can run sanitizers of each programming language under its own setup, as detailed below. All outputs will be available in the `outputs` directory of the respective language. 


### Python

```bash
$ cd python

$ python3 main.py --input=/path/to/input/markups/file --output=/path/to/output/file
$ python3 main.py -h

usage: main.py [-h] [--input FILE] [--output FILE]

This script tests the python sanitizers with the given markups.

options:
  -h, --help              show this help message and exit
  --input FILE, -I FILE   path to input file. (default: ./../markups.txt)
  --output FILE, -O FILE  path to output file. (default: ./outputs/results.json)
````


### PHP

```bash
$ cd php
# CLI args
$ php main.php /path/to/input/markups/file /path/to/output/file
# defaults: input: ./../markups.txt, output: ./outputs/results.json
$ php main.php 
````


### Node.js

```bash
$ cd node-js
# CLI args
$ node main.js --input=/path/to/input/markups/file --output=/path/to/output/file
# defaults: input: ./../markups.txt, output: ./outputs/results.json
$ node main.js
```


### Java 

Run the main class: `src.java.com.sanitizer.Main.java`.

For example, you can use Maven:

```bash
$ mvn exec:java
```

### C#

Run the `Sanitizer.sln` solution file in Visual Studio.

Alternatively, compile the `Sanitizer/Program.cs` with `csc` and run it with [`mono`](https://www.mono-project.com/docs/getting-started/mono-basics/). 

```bash
$ mono Program.exe
```


### Client-side JS

First, run the backend webserver hosting the webpage with sanitizer tests:
```
$ cd clientside
$ python3 manage.py runserver 8000
```

Then, simply visit `http://127.0.0.1:8000` in your web browser. 

Within a few moments, you can see the results in the `clientside/outputs` folder. 


**Note.** Change the default input/output parameters in `clientside/tests/sanitize.html`.


## API
```
> curl -X POST -H "Content-Type: application/json" --data '{"markups":["<a>aaa</h1>"]}' -vvv "http://127.0.0.1:3000/sanitize"
```


## Features and Support

You can test the following sanitizers using HTML-ST:

| **Language**    | **Sanitizer**           | **Link**                                                                                            | **API** | **Version** |
|---------------- |------------------------ |---------------------------------------------------------------------------------------------------- |---------|-------------|
| Client-side JS  | DOMPurify               | https://github.com/cure53/DOMPurify                                                                 | [X]     | 3.1.7       |
| Docker X        | Google Closure Library  | https://github.com/google/closure-library/blob/master/closure/goog/html/sanitizer/htmlsanitizer.js  | [ ]     | .           |
| Port 3003       | JS-XSS                  | https://github.com/leizongmin/js-xss                                                                | [X]     | 1.0.15      |
|                 | Sanitize-HTML           | https://github.com/apostrophecms/sanitize-html                                                      | [X]     |
|                 | Google Caja             | https://code.google.com/archive/p/google-caja/wikis/JsHtmlSanitizer.wiki                            | [X]     |
|                 | Angular-sanitize        | https://docs.angularjs.org/api/ngSanitize/service/$sanitize                                         | [X]     |
| Node.js         | Insane                  | https://github.com/bevacqua/insane                                                                  | [X]     | 2.6.2
| Docker X        | Bleach                  | https://www.npmjs.com/package/bleach                                                                | [X]     | 0.3.0
| Port 3000       | Angular-sanitize        | https://www.npmjs.com/package/angular-sanitize                                                      | [?]     | 1.8.3
|                 | Yahoo Html-purify       | https://www.npmjs.com/package/html-purify                                                           | [X]     | 1.1.0
|                 | Arcgis                  | https://www.npmjs.com/package/@esri/arcgis-html-sanitizer                                           | [X]     | 4.0.3
|                 | DOMPurify               | https://www.npmjs.com/package/dompurify                                                             | [X]     | 3.1.7
| Python          | Mozilla Bleach          | https://pypi.org/project/bleach/                                                                    | [X]     | 6.1.0
| Docker X        | LXML                    | https://pypi.org/project/lxml/                                                                      | [ ]     |
| Port 3001       | HTML Sanitizer          | https://pypi.org/project/html-sanitizer/                                                            | [X]     | 2.4.4
|                 | HTMLLaundry             | https://pypi.org/project/htmllaundry/                                                               | [ ]     |
|                 | Django-html-sanitizer   | https://pypi.org/project/django-html_sanitizer/                                                     | [X]     | 0.1.5
| PHP             | Htmlpurifier            | https://packagist.org/packages/ezyang/htmlpurifier                                                  | [X]     | 4.17
| Docker X        | HTML-sanitizer          | https://packagist.org/packages/tgalopin/html-sanitizer                                              | [X]     | 1.5
| Port 3002       | Symfony Sanitizer       | https://packagist.org/packages/symfony/html-sanitizer                                               | [X]     | 7.1.5
|                 | HTMLawed                | https://packagist.org/packages/htmlawed/htmlawed                                                    | [X]     |
|                 | Typo3 Sanitizer         | https://packagist.org/packages/typo3/html-sanitizer                                                 | [X]     | 2.1.4
| C#              | AntiXssEncoder          | https://learn.microsoft.com/en-us/dotnet/api/system.web.security.antixss                            | [ ]     |
|                 | HTMLSanitizer           | https://www.nuget.org/packages/HtmlSanitizer                                                        | [ ]     |
|                 | AjaxToolKit             | https://www.nuget.org/packages/AjaxControlToolkit.HtmlEditor.Sanitizer/                             | [ ]     |
|                 | NSoup                   | https://www.nuget.org/packages/NSoup/                                                               | [ ]     |
|                 | HTMLRuleSanitizer       | https://www.nuget.org/packages/Vereyon.Web.HtmlSanitizer                                            | [ ]     |
| Java            | JSoup                   | https://github.com/jhy/jsoup                                                                        | [ ]     |
|                 | OWASP HTML Sanitizer    | https://github.com/OWASP/java-html-sanitizer                                                        | [ ]     |
|                 | Antisamy                | https://github.com/nahsra/antisamy                                                                  | [ ]     |
|                 | HTMLCleaner             | http://htmlcleaner.sourceforge.net/index.php                                                        | [ ]     |



## License

This project is available as open source under the terms of the `GNU AFFERO GENERAL PUBLIC LICENSE V3.0`. 

You may not use this program except in compliance with the license. This program is distributed on an "AS IS" BASIS in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

See [LICENSE](LICENSE) for more information.



## Academic Publication

The contents of this repository has been developed as a part of a IEEE SP'23 work. If you use it for academic research, we encourage you to cite our [paper](https://publications.cispa.saarland/3756/). For more information, visit [https://domclob.xyz](https://domclob.xyz).

```
@inproceedings {SKhodayariSP23TheThing,
  author = {Soheil Khodayari and Giancarlo Pellegrino},
  title = {It's (DOM) Clobbering Time: Attack Techniques, Prevalence, and Defenses,
  booktitle = {To Appear at proceedings of the 44rd IEEE Symposium on Security and Privacy},
  year = {2023},
}
```