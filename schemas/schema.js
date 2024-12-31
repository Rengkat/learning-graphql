const Client = require("../models/clientModel");
const Project = require("../models/projectModel");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

// Client Schema
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// Project Schema
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    clientId: { type: GraphQLID },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    // Adding relationships
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId); //clientId is a property of project schema which is the parent now
      },
    },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // Fetch all clients
    clients: {
      type: new GraphQLList(ClientType),
      resolve() {
        return Client.find();
      },
    },
    // Fetch single client by ID
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
    // Fetch all projects
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        return Project.find();
      },
    },
    // Fetch single project by ID
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
  },
});
//Mutation
const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    // the method now
    addClient: {
      type: ClientType,
      //args, the properties of client to be added to the db
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = Client.create({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client;
      },
    },
    //delete client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const client = Client.findOneAndDelete(args.id);
        return client;
      },
    },
    //add project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        clientId: { type: GraphQLNonNull(GraphQLID) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              pending: { value: "pending" },
              progress: { value: "in progress" },
              completed: { value: "completed" },
            },
          }),
          defaultValue: "pending",
        },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          clientId: args.clientId,
          status: args.status,
        });
        project.save();
        return project;
      },
    },
    //delete project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = Project.findByIdAndDelete(args.id);

        return project;
      },
    },
  },
});
// Exporting Schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
