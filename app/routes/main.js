var httpProxy = require('http-proxy')
var url = require('url')

module.exports = function(app){

    app.get('/', function(req, res){
        res.render('index.html');
    });

    
    app.all('/rocketbank_api/*', function (req, res) {
        let new_path = req.path.split('/')
        new_path.shift()
        new_path.shift()
        new_path = new_path.join('/')

        let url_parts = url.parse(req.url, true)

        console.log(url_parts.search)
        console.log ('[' + req.method + '] ' + req.path)



        var proxy = httpProxy.createProxyServer({
            secure: false,
            ignorePath: true,
            changeOrigin: true
        })



        proxy.web(req, res, {
            target: 'https://rocketbank.ru/api/v5/' + new_path  + url_parts.search
        }, function (e) {
            console.log(e);
        })
        /*
        res.send({
            method: req.method,
            body: req.body,
            params: req.params
        })
        */

    })
};
