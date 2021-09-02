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

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
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

const unknownEndpoint = (response) => {
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

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(Number(request.params.id))
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
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

  person
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);

app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
