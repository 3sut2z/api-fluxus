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
        const startResponse = await fetch(`https://flux.li/android/external/start.php?HWID=${hwid}`);
        if (!startResponse.ok) {
            throw new Error("Failed to start bypass");
        }
        await delay(1000);

        const link1Response = await fetch('https://linkvertise.com/580726/fluxus1', { method: 'GET', redirect: 'manual' });
        if (!link1Response.ok) {
            throw new Error("Failed to handle Linkvertise link 1");
        }
        await delay(1000);

        const checkResponse = await fetch(`https://flux.li/android/external/check1.php?hash=`);
        if (!checkResponse.ok) {
            throw new Error("Failed to check bypass status");
        }
        await delay(1000);

        const link2Response = await fetch('https://linkvertise.com/580726/fluxus', { method: 'GET', redirect: 'manual' });
        if (!link2Response.ok) {
            throw new Error("Failed to handle Linkvertise link 2");
        }
        await delay(1000);

        const finalResponse = await fetch(`https://flux.li/android/external/main.php?hash=`);
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
