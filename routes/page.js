const express = require('express');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const router = express.Router();

const cloudFrontURL = 'https://d18z993sv84s2h.cloudfront.net/thumb/';

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
  limits: { fileSize: 5 * 1024 * 1024 },
});

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
});
connection.connect();

router.get('/api/customers', (req, res) => {
  connection.query(
    'SELECT * FROM CUSTOMER WHERE isDeleted = 0',
    (err, rows, fields) => {
      if (err) {
        console.error(err);
      }
      res.send(rows);
    }
  );
});

router.get('/api/customer/:id', (req, res) => {
  const sql = 'SELECT * FROM CUSTOMER WHERE id = ?';
  const params = [req.params.id];
  connection.query(sql, params,
    (err, rows, fields) => {
      if (err) {
        console.error(err);
      }
      res.send(rows);
    }
  );
});

router.post('/api/customers', upload.single('image'), async (req, res, next) => {
  try {
    const sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)';
    const original = req.file.location;
    const image = cloudFrontURL + original.split('/')[original.split('/').length - 1];
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
  } catch (error) {
      console.error(error);
      next(error);
  }
});
  
router.post('/api/customers/:id', upload.single('image'), async (req, res, next) => {
  try {
    const sql = 'UPDATE CUSTOMER SET image = ?, name = ?, birthday = ?, gender = ?, job = ? WHERE id = ?';
    const name = req.body.name;
    const birthday = req.body.birthday;
    const gender = req.body.gender;
    const job = req.body.job;
    let original = ''; 
    let image = '';
    if (req.body.fileChanged === 'true') {
      original = req.file.location;
      image = cloudFrontURL + original.split('/')[original.split('/').length - 1];
    } else {
      image = req.body.image;
    }
    const params = [image, name, birthday, gender, job, req.params.id];
  
    connection.query(sql, params,
      (err, rows, fields) => {
        res.send(rows);
      }
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/api/customers/:id', async (req, res, next) => {
  try {
    const sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?';
    const params = [req.params.id];
    connection.query(sql, params,
      (err, rows, fields) => {
        res.send(rows);
      }
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;