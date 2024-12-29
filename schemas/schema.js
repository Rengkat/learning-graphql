const { projects, clients } = require("./sampleData");
const { GraphQLInputObjectType, GraphQLID, GraphQLString, GraphQLSchema } = require("graphql");

//client type
const ClientType = new GraphQLInputObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});
const RootQueryType = new GraphQLInputObjectType({
  name: "RootQueryType",
  fields: {
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return clients.find((client) => client.id === args.id);
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQueryType,
});
