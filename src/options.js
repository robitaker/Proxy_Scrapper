
export const options = {
    urls: [
        "https://ghostealth.com/api/v1.0/dev/tools/proxy-scraper/proxies/limited",
        "https://sslproxies.org/",
        "https://free-proxy-list.net/",
        "https://us-proxy.org/",
        "https://socks-proxy.net/",
        "https://api.proxyscrape.com/proxytable.php?nf=true&country=all",
        "https://www.proxy-list.download/api/v1/get?type=https",
    ],
    path_default: "results", // "src" is the root path, you can set the path from that.
    output_default: "proxies.txt",
    timeout: 5000,
    site_default: "google.com",
    useragent_default: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
}