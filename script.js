function fetchKeys() {
    // Base URL and API key
    const apiBaseUrl = "https://stickx.top/api-fluxus/?hwid=";
    const apiKey = "&api_key=E99l9NOctud3vmu6bPne";

    // Get URL input value
    const urlInput = document.getElementById("urlInput");
    const url = urlInput.value.trim();

    // Extract HWID from URL
    const hwidStartIndex = url.indexOf("HWID=") + 5;
    const hwid = url.substring(hwidStartIndex);

    // Modify the current URL to include ?url=
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('url', url);

    // Make the API request to the original base URL
    fetch(apiBaseUrl + hwid + apiKey)
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = `<strong>{"Key:"</strong>${data.key}"}`;
        })
        .catch(error => {
            console.error('Error fetching key:', error);
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = `<strong>{"Error:"</strong>Failed to fetch key. Please check the URL and try again."}`;
        });

    // Update the URL in the address bar
    window.history.replaceState({}, document.title, currentUrl);
