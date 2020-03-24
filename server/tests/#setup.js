this.global.server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => ({ req, res })
});

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("connected to db"))
  .catch(e => {
    console.error(e.message);
    //TODO CHANGE TO TEST
    throw new Error("db not connected");
  });
