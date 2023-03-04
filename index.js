import express from "express";
import multer from "multer"
import mysql2 from "mysql2";
import cors from "cors";

const app = express();
// const multer  = require('multer');
const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "Maris_sql",
  database: "test",
});

const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  res.json("hello this me");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM test.books";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "SELECT * FROM books WHERE id = ?"
    db.query(q, [bookId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
});

app.post("/books", upload.single('cover'), (req, res) => {
    const q = "INSERT INTO books (`title`, `desc`, `cover`, `price`) VALUES (?)";
    const values = [req.body.title, req.body.desc, req.file.path, req.body.price];
    db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json("Book has been created");
    });
  });

app.put("/books/:id", upload.single('cover'), (req, res) => {
    const bookId = req.params.id;
    const q = "UPDATE books SET `title` = ?, `desc` = ?,`cover` = ?, `price` = ? WHERE id = ?";
    const values = [req.body.title, req.body.desc, req.body.cover, req.body.price];
    db.query(q, [...values, bookId], (err, data) => {
      if (err) return res.json(err);
      return res.json("Book has been Updated Successfully");
    });
});

app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE id = ?"
    db.query(q, [bookId], (err, data) => {
      if (err) return res.json(err);
      return res.json("Book has been deleted");
    });
});

app.listen(8800, () => {
  console.log("Connected to backend");
});
