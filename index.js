const express = require("express");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
require("dotenv").config();

app.use(express.json());
app.use(express.static("build"));
const cors = require("cors");
app.use(cors());
morgan.token("body", (req, res) => JSON.stringify(req.body));

const Person = require("./models/person");

const url = process.env.MONGODB_URI;
console.log("connecting to:", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to MongoDB"))
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/", (request, response) => {
  response.send("<h1>We have the list of persons here:</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    console.log(person);
    response.json(person);
  });
});

app.get("/api/info", (request, response) => {
  let length = persons.length;
  response.send(`<p>Phonebook has info of ${length} people</p><br/>
  ${new Date()}`);
});

app.get("/api/persons/:id", (request, response) => {
  persons.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = person.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name && !body.number) {
    return response.status(204).json({
      error: "content missing",
    });
  } else if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
