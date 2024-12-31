const { projects, clients } = require("./sampleData");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");
//client schema
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});
// project schema
const ProjectType = new GraphQLObjectType({
  name: "project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    clientId: { type: GraphQLID },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    //adding relationships
    client: {
      type: ClientType,
      resolve(parent, args) {
        return clients.find((client) => client.id === parent.clientId);
      },
    },
  }),
});
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    //fetch all clients
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return clients;
      },
    },
    //fetch clients base on id
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return clients.find((client) => client.id.toString() === args.id);
      },
    },
    //get all projects
    projects: {
      type: GraphQLList(ProjectType),
      resolve(parent, args) {
        return projects;
      },
    },
    //get single project
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return projects.find((project) => project.id.toString() === args.id);
      },
    },
  },
});
//mutation

module.exports = new GraphQLSchema({
  query: RootQuery,
});
