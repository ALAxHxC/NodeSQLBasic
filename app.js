//https://expressjs.com/es/guide/using-middleware.html
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var client = mysql.createConnection({
  host: "localhost",
  user: "estandar",
  password: "patty",
  database: 'davivienda'
});

client.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post('/example', function (req, res) {

  console.log('EL CUERPO ES', req.body.client);
  res.json({ ok: 1 })
})

app.post('/reserves', function (request, response) {
  //POST : http://0.0.0.0:3000/reserves
  //este crea las reservas de las entidades ver archivo examplejsonreserves.json
  let query = `INSERT INTO  reserva 
  VALUES (' ${request.body.turnos_id}',' ${request.body.fecha}', ' ${request.body.hora}', ' ${request.body.cancha}', ' ${request.body.modalidad}', '${request.body.torneo}',  '${request.body.mantenimiento}', ' ${request.body.clase}', ' ${request.body.escuela}', ' ${request.body.tipo1}', ' ${request.body.tipo2}', ' ${request.body.tipo3}', ' ${request.body.tipo4}',' ${request.body.cedula1}',' ${request.body.cedula2}',' ${request.body.cedula3}',' ${request.body.cedula4}')`;

  console.log('query', query)
  client.query(
    query,
    function select(err, results, fields) {

      if (err) {
        console.log("Error: " + err.message);
        response.status(400).json({ error: err.message, stack: err.stack }).json(results);
        //throw err;
      }
      console.log(results);
      response.status(200).json(results)
      //client.end();
    });
});

app.post('/search_reserves', function (request, response) {
  //POST http://0.0.0.0:3000/search_reserve
  /// ver archivo search_reserves.json
  let query = `
    SELECT * FROM reserva WHERE fecha = ${request.body.fecha}
  `;

  console.log('query', query)
  client.query(
    query,
    function select(err, results, fields) {

      if (err) {
        console.log("Error: " + err.message);
        response.status(400).json({ error: err.message, stack: err.stack }).json(results);
        //throw err;
      }
      console.log(results);
      response.status(200).json(results)
      //client.end();
    });
});
app.get('/item', function (request, response) {
  client.query(
    'SELECT * FROM items lIMIT 10',
    function select(err, results, fields) {

      if (err) {
        console.log("Error: " + err.message);
        response.json(400).json(results);
        throw err;
      }

      console.log("Number of rows: " + results.length);
      console.log(results);
      response.status(200).json(results)
      //client.end();
    });
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
