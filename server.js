const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});
const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'react-management-system', // bucket-name
    key(req, file, cbf) { // The name of the file
      cbf(null, `original/${+new Date()}${path.basename(file.originalname)}`);
    },
  }),
  limits: {fileSize: 5 * 1024 * 1024},
});

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});
connection.connect();

app.use('/image', express.static('./upload'));

app.get('/api/customers', (req, res) => {
  connection.query(
    'SELECT * FROM CUSTOMER WHERE isDeleted = 0',
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get('/api/customer/:id', (req, res) => {
  const sql = 'SELECT * FROM CUSTOMER WHERE id = ?';
  const params = [req.params.id];
  connection.query(sql, params,
    (err, rows, fields) => {
      res.send(rows);
    }
  );

});

app.post('/api/customers', upload.single('image'), (req, res) => {
  const sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)';
  const originalImage = req.file.location;
  const image = originalImage.replace(/\/original\//, '/thumb/');
  const name = req.body.name;
  const birthday = req.body.birthday;
  const gender = req.body.gender;
  const job = req.body.job;
  const params = [image, name, birthday, gender, job];

  connection.query(sql, params,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.delete('/api/customers/:id', (req, res) => {
  const sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?';
  const params = [req.params.id];
  connection.query(sql, params,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.post('/api/customers/:id', upload.single('image'), (req, res) => {
  const sql = 'UPDATE CUSTOMER SET image = ?, name = ?, birthday = ?, gender = ?, job = ? WHERE id = ?';
  const name = req.body.name;
  const birthday = req.body.birthday;
  const gender = req.body.gender;
  const job = req.body.job;
  const originalImage = req.file.location;
  let image = null;
  if (req.body.fileChanged === 'true') {
    image = originalImage.replace(/\/original\//, '/thumb/');
  } else {
    image = req.body.image;
  }
  const params = [image, name, birthday, gender, job, req.params.id];

  connection.query(sql, params,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.listen(port, () => console.log(`listening on port ${5000}`));