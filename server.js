const express = require('express');
const mysql = require('mysql2');
const moment = require('moment');
const path = require('path');

const app = express();
const port = 3000;

const fs = require('fs');

// Read the config.json file
const configFile = fs.readFileSync('config.json');
const configData = JSON.parse(configFile);

// Access MySQL configuration details
const mysqlConfig = configData.mysql || {};
const mysqlHost = mysqlConfig.host || '';
const mysqlUser = mysqlConfig.user || '';
const mysqlPassword = mysqlConfig.password || '';
const mysqlDatabase = mysqlConfig.database || '';

// Create a MySQL pool
const db = mysql.createPool({
  connectionLimit: 10,
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPassword,
  database: mysqlDatabase,
  port: 3306,
});

  // db.connect((err) => {
  //   if (err) {
  //     console.error('Error connecting to MySQL:', err);
  //   } else {
  //     console.log('Connected to MySQL database');
  //   }
  // });
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool: ', err);
      // Handle the error appropriately
    } else {
      // Check if the connection is still alive
      if (connection._closed) {
        connection.connect((connectErr) => {
          if (connectErr) {
            console.error('Error reopening connection: ', connectErr);
            // Handle the error appropriately
          } else {
            console.log('Connection reopened');
          }
        });
      }
      connection.query('SELECT * FROM statistics', (queryErr, results) => {
        // Handle query results or errors
        connection.release(); // Release the connection back to the pool
      });
    }
  });
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
    
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Display current week leaderboard (Top 200)
app.get('/leaderboard/current', (req, res) => {
    const firstDay = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
    const lastDay = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');
    const query = `SELECT * FROM statistics WHERE timestamp BETWEEN ? AND ? ORDER BY score DESC LIMIT 200`;
  
    db.query(query, [firstDay, lastDay], (err, results) => {
      if(err){
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
      } 
      else{
        res.render('currentLeaderboard', { users: results });
      }
    });
  });
  
// Display last week leaderboard given a country by the user (Top 200)
app.get('/leaderboard/last-week/:country', (req, res) => {
const country = req.params.country;
const firstDayLW = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD HH:mm:ss');
const lastDayLW = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD HH:mm:ss');
const query = `SELECT * FROM statistics WHERE country = ? AND timestamp BETWEEN ? AND ? ORDER BY score DESC LIMIT 200`;

db.query(query, [country, firstDayLW, lastDayLW], (err, results) => {
    if (err){
    console.error('Error querying the database:', err);
    res.status(500).send('Internal Server Error');
    } 
    else {
      res.render('countryLeaderboard', { users: results });
    }
});
});

// Fetch user rank, given the userId
app.get('/user-rank/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `SELECT UID, Name, Score, (
      SELECT COUNT(DISTINCT Score) + 1
      FROM statistics AS t2
      WHERE t2.Score > t1.Score
    ) AS player_rank
    FROM statistics AS t1
    WHERE UID = ?
    ORDER BY Score DESC`;

    db.query(query, [userId], (err, results) => {
      if(err){
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
      } 
      else if(results.length == 0){
        res.status(404).send('User ID not found');
      } 
      else{
        res.render('userRank', { users: results });
      }
    });
  });

// http://localhost:3000/leaderboard/current
// http://localhost:3000/leaderboard/last-week/ES
// http://localhost:3000/user-rank/aaal

// https://blacklight-leaderboard.onrender.com/leaderboard/current
// https://blacklight-leaderboard.onrender.com/leaderboard/last-week/ES
// https://blacklight-leaderboard.onrender.com/user-rank/aaal