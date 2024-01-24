There is a MySQL Database containing a table that has the following columns:

1. UID (String)
2. Name (String)
3. Score (Integer)
4. Country (ISO 2 letter country code)
5. TimeStamp (timestamp)

The task was to create 3 APIs as mentioned:

1. Display current week leaderboard (Top 200)
2. Display last week leaderboard given a country by the user (Top 200)
3. Fetch user rank, given the userId.

**Steps to Achieve the Goal-**
1. For making the Database, I used an online data generator (filldb.info) and downloaded the data in a csv format. Then I imported the CSV into MySQL workbench and stored the data in a table named 'statistics'.
2. For making APIs, I used Node.js and connected the application to the database using MySQL Connector.
3. I hosted the APIs on a platform named 'Render' which helps to host a web application and for hosting the MySQL database I leveraged MyPHPAdmin which allows us to host the MySQL database for free.

**URL for using the APIs**
1. To see the current week's leaderboard [click here](https://blacklight-leaderboard.onrender.com/leaderboard/current)
2. To see the last week's leaderboard of a specific country [click here](https://blacklight-leaderboard.onrender.com/leaderboard/last-week/ES) (you can change the country code in the URL)
3. To fetch a user's rank [click here](https://blacklight-leaderboard.onrender.com/user-rank/aaal) (you can change the userID in the URL)

