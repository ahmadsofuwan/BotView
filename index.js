const puppeteer = require('puppeteer');
const axios = require('axios');
async function checkProxy(proxy) {
    try {
        const response = await axios.get('https://www.google.com', {
            proxy: {
                host: proxy.split(':')[0],
                port: parseInt(proxy.split(':')[1], 10)
            }
        });
        return true;
    } catch (error) {
        return false;
    }
}

async function main() {
    const proxyData = require('./proxy.json');
    const proxyArr = proxyData.proxies;
    const randomIndex = Math.floor(Math.random() * proxyArr.length);
    const randomProxy = proxyArr[randomIndex];

    const browser = await puppeteer.launch({
        headless: false, // Set true jika tidak ingin membuka browser secara visual
        args: [
            `--proxy-server=${randomProxy.ip}:${randomProxy.port}`,
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    const page = (await browser.pages())[0];
    await page.setUserAgent('Mozilla/10.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36');
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
    });
    await page.goto('https://www.youtube.com/watch?v=wwzOWOGednA', {timeout: 60000*5});
    await page.click('#movie_player > div.html5-video-container > video');
    await page.keyboard.press(' ');
    console.log(`Membuka YouTube dengan proxy: vpn.onemonbot.com:55533`);
    await new Promise(resolve => setTimeout(resolve, 300000)); // Tunda selama 5 menit
    await browser.close();
    main(); // Panggil kembali fungsi main
    
 
}

async function proxy() {
    const proxyData = require('./proxy.json');
    const proxyArr = proxyData.proxies;
    console.log(`chek proxy: ${proxyArr.length}`);
    let successfulProxies = [];
    for (let i = 0; i < proxyArr.length; i++) {
        const proxy = `${proxyArr[i].ip}:${proxyArr[i].port}`;
        if (await checkProxy(proxy)) {
            console.log(`✅ Proxy ${proxy}`);
            successfulProxies.push(proxy);
            console.clear();
        } else {
            console.log(`❌ Proxy ${proxy}`);
        }
    
    }
    console.log(`Jumlah proxy yang berhasil digunakan: ${successfulProxies.length}`);
    const fs = require('fs');
    fs.writeFileSync('clear.json', JSON.stringify(successfulProxies));

   
}
const functionName = process.argv[2]; // Ambil nama fungsi dari argumen kedua

if (functionName === 'main') {
    main();
} else if (functionName === 'proxy') {
    proxy();
} else {
    console.log('Fungsi tidak ditemukan. Gunakan "main" atau "proxy".');
}

module.exports = { main, proxy }; // Ekspor fungsi yang ingin Anda jalankan

