var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('client-sessions'),
    multer  = require('multer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cookieParser());

//app.use(session({secret: 'kjhkjsdhjdljaslkjwi___4587'}));

app.use( session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));

//DEBUG
app.use(express.static(__dirname));
//app.use(express.static(path.join(__dirname, 'public')));

app.contFile = 0;
app.fileNames = [];

app.isUploadDone = function()
{
    return app.fileNames.length == app.contFile;
};

app.resetVariableUpload = function()
{
    app.contFile = 0;
    app.fileNames = [];
};

app.use( multer({ dest: './uploads/',

    rename: function (fieldname, filename)
    {
        try {
            console.log('CALL: app.rename');
            app.contFile++;

            return Date.now() + "-" + filename;

        } catch (e)
        {
            console.error(e);
        }
    },
    onFileUploadStart: function (file) {
        try {
            console.log('CALL: app.onFileUploadStart (' + file.originalname + ')');
        } catch (e) {
            console.error(e);
        }
    },
    onFileUploadComplete: function (file) {

        try {
            console.log('CALL: app.onFileUploadComplete (' + file.path + ')');
            app.fileNames.push(file.path);
        } catch (e) {
            console.error(e);
        }
    }

}));

/*******************************
 ******   ROUTER
 *******************************/

var router_vocabulary = express.Router();

app.use('/vocabulary', router_vocabulary);

require('./routes/router')(app);                //chiamo il router generico
require('./routes/project_router')(app);        //chiamo il router per i progetti
require('./routes/database_router')(app);       //chiamo il router per i progetti
require('./routes/statistics_router')(app);     //chiamo il router per i progetti
require("./routes/vocabulary")(router_vocabulary);


/********************************
 *** END ROUTER
 ********************************/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found: ' + req.method + ":" + req.originalUrl );
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error.ejs', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use( function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('pages/error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;