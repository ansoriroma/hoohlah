chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'sendRequest') {
      // Return true to keep the message port open for async response
      let isResponseSent = false;
  
      chrome.cookies.getAll({ url: 'https://www.midjourney.com' }, (cookies) => {
        const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
  
        const headers = {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9,id;q=0.8',
          'cookie': cookieString,
          'priority': 'u=1, i',
          'referer': 'https://www.midjourney.com/imagine',
          'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
          'x-csrf-protection': '1'
        };
  
        fetch('https://www.midjourney.com/api/app/users/queue?userId=d543a39c-f7e4-4971-bf10-500be8866a2c', {
          method: 'GET',
          headers: headers
        })
        .then(response => response.json())
        .then(data => {
          if (!isResponseSent) {
            // Count items in 'running' and 'waiting' arrays
            const runningCount = data.running ? data.running.length : 0;
            const waitingCount = data.waiting ? data.waiting.length : 0;
  
            // Format the result
            const result = `Count waiting: {\n  "running": ${runningCount},\n  "waiting": ${waitingCount}\n}`;
  
            // Send the formatted result
            sendResponse({ data: result });
            isResponseSent = true;
          }
        })
        .catch(error => {
          if (!isResponseSent) {
            sendResponse({ error: error.message });
            isResponseSent = true;
          }
        });
      });
  
      return true; // Indicates async response will be sent
    }
  });
  
