import superagent from 'superagent';
import enableProxy from 'superagent-proxy';
import https from 'https';
import { promises as fs } from "fs"
import { options } from "../options.js";

enableProxy(superagent);

export class RequestsController {


    async requestProxies(url, timeout) {

        try {

            const response = await superagent.get(url)
                .set('User-Agent', "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36")
                .timeout(timeout);

            return response.text;

        } catch (err) {
            this.error_request_proxy_url(url);
            return null;
        }

    }

    async writeFile(name, content) {

        try {

            content = content.join('\r\n');
            await fs.writeFile(options.path_default + '/' + name, content);
            return true;

        } catch (err) {
            console.log(err);
            return false;
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
            let write = await this.writeFile(output, proxies);

            if (write) {
                console.log(`${proxies.length} Proxies were found and saved in the folder: ${options.path_default}/${output}`);
            } else {
                throw new Error("An error occurred while writing the file with all proxies.");
            }

        } catch (err) {
            console.log(err);
        }

    }

    error_request_proxy_url(url) {
        console.log(`Error when fetching proxies from url: ${url}. Url did not respond to request.`);
    }




}