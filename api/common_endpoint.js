module.exports = function(app, __dirname) {
    app.get('/', function (req, res) {
        if (req.cookies['jwt-token'] !== undefined) {
            res.redirect('/home');
        } else {
            res.redirect('/login');
        }
    });

    app.get('/home', function (req, res) {
        if (req.cookies['jwt-token'] !== undefined) {
            res.sendFile(__dirname + '/template/html/index.html');
        } else {
            res.redirect('/login');
        }
    });

    app.get('/login', function (req, res) {
        res.sendFile(__dirname + '/template/html/login.html');
    });
}