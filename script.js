function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function bypassHWID(hwid) {
    if (!hwid) {
        document.getElementById('status').innerHTML = JSON.stringify({
            status: "error", 
            key: "Invalid HWID"
        });
        return;
    }

    try {
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*"
        };

        const startResponse = await fetch(`https://flux.li/android/external/start.php?HWID=${hwid}`, { headers });
        if (!startResponse.ok) {
            throw new Error(`Start failed with status ${startResponse.status}`);
        }
        await delay(1000);

        const link1Response = await fetch('https://linkvertise.com/580726/fluxus1', { method: 'GET', headers, redirect: 'manual' });
        if (!link1Response.ok) {
            throw new Error(`Linkvertise 1 failed with status ${link1Response.status}`);
        }
        await delay(1000);

        const checkResponse = await fetch(`https://flux.li/android/external/check1.php?hash=`, { headers });
        if (!checkResponse.ok) {
            throw new Error(`Check1 failed with status ${checkResponse.status}`);
        }
        await delay(1000);

        const link2Response = await fetch('https://linkvertise.com/580726/fluxus', { method: 'GET', headers, redirect: 'manual' });
        if (!link2Response.ok) {
            throw new Error(`Linkvertise 2 failed with status ${link2Response.status}`);
        }
        await delay(1000);

        const finalResponse = await fetch(`https://flux.li/android/external/main.php?hash=`, { headers });
        const finalText = await finalResponse.text();

        const keyMatch = finalText.match(/[a-zA-Z0-9]{32}/);
        if (keyMatch) {
            document.getElementById('status').innerHTML = JSON.stringify({
                status: "success", 
                key: `${keyMatch[0]}`
            });
        } else {
            document.getElementById('status').innerHTML = JSON.stringify({
                status: "error", 
                key: "Not allowed bypass"
            });
        }
    } catch (error) {
        console.error('Error during bypass:', error.message);
        document.getElementById('status').innerHTML = JSON.stringify({
            status: "error", 
            key: error.message
        });
    }
}

const hwid = getQueryParam('hwid');
if (hwid) {
    bypassHWID(hwid);
} else {
    document.getElementById('status').innerHTML = JSON.stringify({
        status: "error", 
        key: "Invalid HWID"
    });
}
