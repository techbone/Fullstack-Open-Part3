const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://Fullstack-Open:${password}@cluster0.ipk8l.mongodb.net/note-app?retryWrites=true&w=majority
`;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("server connected"))
  .catch((err) => console.log(err));

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", phonebookSchema);

if (process.argv.length < 4) {
  Person.find()
    .then((persons) => {
      console.log("Phonebook:");
      persons.forEach((person) =>
        console.log(`${person.name} ${person.number}`)
      );
    })
    .catch((err) => console.log(err))
    .finally(() => {
      mongoose.connection.close();
      process.exit(1);
    });

  return;
}

const name = process.argv[3];

if (process.argv.length < 5) {
  console.log(
    "Please provide the number as an argument: node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}
const number = process.argv[4];

const person = new Person({
  name,
  number,
});

person
  .save()
  .then((result) => {
    console.log(`added ${name} number: ${number} to phonebook`);
    mongoose.connection.close();
  })
  .catch((err) => console.log(err));

if (process.argv.length > 5) {
  console.log("Alaye wahalah re ti poju");
  process.exit(1);
}
