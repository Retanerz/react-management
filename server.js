const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config();

const pageRouter = require('./routes/page');

const app = express();

app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/image', express.static('./upload'));
app.use('/', pageRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  logger.info('hello');
  logger.error(err.message);
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}`);
});