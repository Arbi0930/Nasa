import express from 'express';
import cors from 'cors';
import mysql from "mysql";

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lab12",
});

app.get("/", (req, res) => {
    const sql = "Select * from employee";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});

app.post('/create', (req, res) => {
    const sql = 'insert into employee(`first_name`,`last_name`) values(?)';
    const values = [
        req.body.firstName,
        req.body.lastName
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.json('error');
        return res.json(data);
    });
});

app.put('/update/:id', (req,res)=>{
    const sql = "update employee set `first_name` = ?, `last_name` = ? where ID = ?"
    const values = [
        req.body.firstName,
        req.body.lastName,
    ]
    const id = req.params.id;

    db.query(sql, [...values,id], (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/search', (req, res) => {
    const searchTerm = req.query.term;

    // Assuming your 'employee' table has 'firstName' and 'lastName' columns
    const sql = `SELECT * FROM employee WHERE firstName LIKE '%${searchTerm}%' OR lastName LIKE '%${searchTerm}%'`;

    db.query(sql, (err, data) => {
      if (err) {
        console.error('Error searching employees:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      return res.json(data);
    });
  });

app.listen(8000, () => {
    console.log("listen");
});
