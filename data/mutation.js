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
  addUser,
  getItem,
  getItems,
} from './database';

let SignupMutation = mutationWithClientMutationId({
  name: 'Signup',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
  },
  outputFields: {
    user: {
      type: GraphQLUser,
      resolve: (newUser) => newUser
    }
  },
  mutateAndGetPayload: (credentials, {
    rootValue
  }) => {
    var conn = rootValue;
    var newUser = addUser(credentials, rootValue);
    return newUser;
  }
});

var LoginMutation = mutationWithClientMutationId({
  name: 'Login',
  inputFields: {
    mail: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    user: {
      type: GraphQLUser,
      resolve: (newUser) => newUser
    }
  },
  mutateAndGetPayload: (credentials, {
    rootValue
  }) => co(function*() {
    console.log('schema:loginmutation', credentials);
    var newUser = yield getUserByCredentials(credentials, rootValue);
    return newUser;
  })
});

var PlaceBidMutation = mutationWithClientMutationId({
  name: 'PlaceBid',
  inputFields: {
    item: {
      type: GraphQLItem
    },
    userName: {
      type: GraphQLString
    }
  },
  outputFields: {
    item: {
      type: GraphQLItem,
      resolve: (item) => item
    },
  },
  mutateAndGetPayload: ({restaurant, userName}, {rootValue}) => {
    item.id = fromGlobalId(item.id).id;
    return putBidOnItem(item, rootValue);
  }
});

module.exports = {
    SignupMutation,
    LoginMutation,
    PlaceBidMutation,
};