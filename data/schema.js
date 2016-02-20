/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Item,
  getUser,
  getViewer,
  getItem,
  getItems,
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Item') {
      return getItem(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return GraphQLUser;
    } else if (obj instanceof Item)  {
      return GraphQLItem;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var GraphQLUser = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    items: {
      type: itemConnection,
      description: 'A person\'s collection of items',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getItems(), args),
    },
  }),
  interfaces: [nodeInterface],
});

var GraphQLItem = new GraphQLObjectType({
  name: 'Item',
  description: 'A shiny item',
  fields: () => ({
    id: globalIdField('Item'),
    name: {
      type: GraphQLString,
      description: 'The name of the item',
    },
    bidder: {
      type: GraphQLString,
      description: 'The name of the highest bidder',
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
var {connectionType: itemConnection} =
  connectionDefinitions({name: 'Item', nodeType: GraphQLItem});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var GraphQLRoot = new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: GraphQLUser,
      resolve: (root, id, {rootValue}) => getUser(rootValue),
    },
  }),
});

var queryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    viewer: {
      type: new GraphQLNonNull(GraphQLUser),
      args: {
        id: {
          type: GraphQLString,
          description: 'the session\'s userId'
        }
      },
      resolve: (rootValue, {id}) => getUser(rootValue, id)
    },
    root: {
      name:'name',
      type: GraphQLRoot,
      args: {
        id: {
          type: GraphQLString,
          description: 'most of the time, the item id'
        }
      },
      resolve: (rootValue, {id}) => {
        return id || {};
      }
    },
    node: nodeField
  })
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    Signup: SignupMutation,
    Login: LoginMutation,
    PlaceBid: PlaceBidMutation,
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
