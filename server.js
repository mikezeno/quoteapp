// imports
var express = require('express');
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');

// database 
var db = new sqlite3.Database('quotes.db');

// middleware
app.use(bodyParser.urlencoded({extended: true}));

// routes 
app.listen(port, function() {
    console.log('Express app listening on port ' + port);
});

app.get('/', function(req, resp) {
    resp.send("Get request received at '/'");
});

app.get('/quotes', (req, resp) => {
    if(req.query.year) {
        db.all('SELECT * FROM quotes WHERE year = ?', [req.query.year], (err, rows) => {
            if (err) {
                resp.send(err.message);
            }
            else {
                console.log("Return a list of quotes from the year: " + req.query.year);
                resp.json(rows);
            }
        });
    }
    else {
        db.all('SELECT * FROM quotes', (err, rows) => {
            if (err) {
                resp.send(err.message);
            }
            else {
                for (var i = 0; i < rows.length; i++) {
                    console.log(rows[i].quote);
                }
                resp.json(rows)
            }
        });
    }
});

app.get('/quotes/:id', (req, resp) => {
    console.log("Return quote with the ID: " + req.params.id);
    db.get('SELECT * FROM quotes WHERE rowid = ?', [req.params.id], (err, rows)=> {
        if (err) {
            console.log(err.message);
        }
        else {
            resp.json(rows)
        }
    });
});


app.post('/quotes', (req, resp) => {
    console.log("Insert a new quote: " + req.body.quote);
    db.run('INSERT INTO Quotes VALUES (?, ?, ?)', [req.body.quote, req.body.author, req.body.year], (err) => {
        if (err) {
            console.log(err.message);
        }
        else {
            resp.send('Inserted quote with id: ' + this.lastID);
        }
    });
});