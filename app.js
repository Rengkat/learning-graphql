require("dotenv").config();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schemas/schema");
const connect = require("./db/connectDB");
const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connect(process.env.MONGODB_URI);
    app.listen(port, () => console.log(`Server running on port ${port}...`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
