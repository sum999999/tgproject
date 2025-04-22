!function (e) {
    if ("object" == typeof exports && "undefined" != typeof module) {
        module.exports = e();
    } else if ("function" == typeof define && define.amd) {
        define([], e);
    } else {
        var f;
        "undefined" != typeof window ? f = window :
            "undefined" != typeof global ? f = global :
                "undefined" != typeof self && (f = self), f.Application = e()
    }
}(function () {
   return {
       Config: {
           baseUrl: '',

       },
       Constant: {

       },
       Api: {
           querySystemConfig: function() {
               return axios({
                   url: "/api/v2/sysDict/querySystemConfig",
                   method: "POST",
                   unenc: false
               });
           },
           getDownloadVersion: function() {
               return axios({
                   url: "/api/v2/app/getDownloadVersion",
                   method: "POST",
                   unenc: true
               });
           },
           qiniuUpload: function(data) {
               return axios({
                   url: "/api/v2/cms/qiniuUpload",
                   method: "POST",
                   data: data,
                   unenc: true,
                   contentType: 'multipart/form-data'
               });
           },
       }
   };
});


