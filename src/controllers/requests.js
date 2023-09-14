import superagent from 'superagent';
import enableProxy from 'superagent-proxy';
import { promises as fs } from "fs"
import { options } from "../options.js";

enableProxy(superagent);

export class RequestsController {


    async requestProxies(url, timeout) {

        try {

            const response = await superagent.get(url)
                .set('User-Agent', options.useragent_default)
                .timeout(timeout);

            return response.text;

        } catch (err) {
            this.error_request_proxy_url(url);
            return null;
        }

    }

    async testProxy(params) {
        try {

            const response = await superagent.get(params.url)
                .proxy(params.proxy)
                .set('User-Agent', params.useragent)
                .timeout(params.timeout)

            return {
                status: true,
                ip: params.proxy
            }


        } catch (err) {
            return {
                status: false
            }
        }
    }

    async write(name, content) {

        try {

            content = content.join('\r\n');
            await fs.writeFile(options.path_default + '/' + name, content);
            return true;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async read(list) {
        try {
            return await fs.readFile(list, 'utf8');
        } catch (err) {
            console.log(err);
            throw new Error(`Error reading file: ${list}`);
        }
    }

    async getUseragents() {
        try {
            let data = await this.read("useragents.txt");
            let agents = data.split('\r\n');
            if (agents.length > 1) {
                const randomIndex = Math.floor(Math.random() * agents.length);
                return agents[randomIndex];
            } return options.useragent_default;
        } catch (err) {
            console.log(err);
        }
    }

    filterProxies(data) {
        try {
            const regexProxy = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+\b/g;
            return data.match(regexProxy);
        } catch (err) {
            return [];
        }
    }

    clearProxy(proxy) {
        proxy = proxy.replace('https://', '');
        proxy = proxy.replace('http://', '');
        return proxy;
    }

    validProxies(proxies) {

        let new_proxies = [];
        const regexProxy = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+\b/g;

        for (let i = 0; i <= proxies.length - 1; i++) {
            let proxie = proxies[i];
            if (regexProxy.test(proxie)) {
                new_proxies.push(proxie);
            }
        }

        return new_proxies;

    }

    elimineDuplicate(proxies) {
        const proxiesFix = proxies.filter((proxy, index, self) => {
            return self.indexOf(proxy) === index;
        });

        return proxiesFix;
    }

    async getProxies(output, timeout) {

        try {

            const urls = options.urls;
            let proxies = [];

            console.log("Looking for proxies please wait...");

            for (let k in urls) {

                let url = urls[k];

                let data = await this.requestProxies(url, timeout);
                let resultProxies = this.filterProxies(data);

                if (resultProxies != null) {

                    proxies = [...proxies, ...resultProxies];

                } else continue;

            }

            proxies = this.elimineDuplicate(proxies);
            let write = await this.write(output, proxies);

            if (write) {
                console.log(`${proxies.length} Proxies were found and saved in the folder: ${options.path_default}/${output}`);
            } else {
                throw new Error("An error occurred while writing the file with all proxies.");
            }

        } catch (err) {
            console.log(err);
        }

    }




    async checkProxies(params) {

        try {
            this.log_config(params);
            let data = await this.read(params.list);
            let proxies = data.split('\r\n');

            if (proxies.length > 1) {

                proxies = this.validProxies(proxies);
                let reqs = [];
                let approveds = [];

                for (let i = 0; i <= proxies.length - 1; i++) {
                    let proxy = proxies[i];
                    let useragent = params.agent ? await this.getUseragents() : options.useragent_default;
                    reqs.push({
                        url: params.site,
                        proxy: params.proxy + "://" + proxy,
                        useragent: useragent,
                        timeout: params.timeout
                    });
                }

                try {

                    const responses = await Promise.all(reqs.map(this.testProxy));

                    responses.forEach((res) => {
                        if (res.status) {
                            approveds.push(this.clearProxy(res.ip));
                        }
                    });

                } catch (err) {
                    console.log(err);
                }

                await this.write(params.output, approveds);
                console.log(`${approveds.length} valid proxies`);

            } else {
                throw new Error("No proxy found.");
            }


        } catch (err) {
            console.log(err);
        }

    }

    log_config(params) {
        console.log(`
        Set configuration:
        _________________

        List: ${params.list}
        Site: ${params.site}
        Proxy: ${params.proxy}
        Timeout: ${params.timeout}
        User Agent: ${params.agent ? "Random user agent" : "Default user agent"}
        Output: ${options.path_default}/${params.output}

        Testing...
        `);
    }

    error_request_proxy_url(url) {
        console.log(`Error when fetching proxies from url: ${url}. Url did not respond to request.`);
    }




}