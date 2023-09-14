# Proxy scraper (Node JS)

Personal project to look for and test proxies on the web!

Installation:
 - Node version >= 18.17
 - npm install

Scrape proxies:
 - node scrapper.js getProxies

Scraping parameters:
 - -o or --output "output.txt" (Output file, where all results will be written, by default is set to "proxies.txt")
 - -t or --timeout 10000 (Time in milliseconds for timeout, ny default it is 5000)
 - Example: node scrapper.js getProxies -o output.txt --timeout 10000

Proxy Tester:
 - node scrapper.js checkProxies

Parameters for proxy tester:
 - -l or --list "proxies.txt" (List to be loaded from proxies, by default it is set to results/proxies.txt)
 - -s or --site youtube.com (Site to be tested, by default it is set to google.com)
 - -p or --p https (Proxy type, by default it is http)
 - -a or --agent (Use to generate random user agents in each request, this parameter does not receive any value.)
 - -o or --output "output.txt" (Output file, where all results will be written, by default is set to "proxies.txt")
 - -t or --timeout 10000 (Time in milliseconds for timeout, ny default it is 15000)
 - Example: node scrapper.js checkProxies -l proxies.txt -s facebook.com -p https -a -o results.txt -t 15000

*This project was started for study purposes, don't expect something professional, enjoy!
