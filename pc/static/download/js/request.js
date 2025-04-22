!(function() {
    function getResponseCode(response) {
        return response.data.code;
    }

    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
        // Do something before request is sent
        // //在发送请求之前做某事
        let time = new Date().getTime();
        let sign = md5.md5(time + '##Lottery2017$$');

        // 参数加密
        if (!config.unenc) {
            const RndNum = function (n) {
                let rnd = '';
                let x = '0123456789qwertyuioplkjhgfdsazxcvbnm';
                for (let i = 0; i < n; i++) {
                    let num = Math.round(Math.random() * 36);
                    if (num === 36) num--;
                    rnd += x.substring(num, num + 1)
                }
                return rnd
            };
            let key = RndNum(16);

            config.headers.key = RSA(key);
            config.key = key;
            config.data = {
                body: AESEnc(key, JSON.stringify(config.data))
            }
        }

        config.headers.sign = sign;
        config.headers.timestamp = `${time}`;
        config.headers.userId = '';
        config.headers.deviceId = 'WEB';

        if (config.contentType) {
            config.headers['Content-Type'] = config.contentType
        }

        return config
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        if(typeof response.data.data === 'string') {
            response.data = JSON.parse(response.data.data);
        }
        const code = getResponseCode(response);

        //对响应数据做些事
        if (!code) {
            // 解密
            if (!response.config.unenc) {
                response.data = JSON.parse(
                    AESDec(response.config.key, response.data.body)
                )
            }
        }
        return response;
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    });
})();
