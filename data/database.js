import {hash} from "string-hash";

const logID = 'qldfjbe2434RZRFeerg';
const sessionDuration = 3600*1000;

// Model types
class User {}
class Item {}

// Mock data
var usersByPasswordHash = {};
var sessionHolder = {
  sessions: {},
  putUser: user => {
    let lastRequestTime = +new Date();
    var token = (Math.pow(2,32)*Math.random()).toString(32) + lastRequestTime.toString(32);
    this.sessions[token] = {user, lastRequestTime};
    return token;
  },
  getSessionByToken: token => {
    let session = this.sessions[token];
    if (session) {
      if (new Date() - session.lastRequestTime < sessionDuration) {
      session = null;
      } else {
        session.lastRequestTime = +new Date();
      }
    }
    return session;
  }
};

var inems = ['Picture', 'Cup', 'Sword'].map((name, i) => {
  var inem = new Item();
  inem.name = name;
  inem.id = `${i}`;
  return inem;
});

module.exports = {
  // Export methods that your schema can use to interact with your database
  addUser: (credentials, rootValue) => {
      console.log('addUser: ' + [].slice.call(arguments).map(x => Object.keys(x || {}).join(' ')));
        var passwordHash = hash(credentials.password);
        var user = {
          name: credentials.name,
        sessionID: token,
          id: logID,
        };
        usersByPasswordHash[passwordHash] = user;
        var token = sessionHolder.putUser(user);
        user.sessionID = token;
        rootValue.cookies.set('sessionID', token);
        return user;
  },
  getUser: (rootValue) => {
    debugger;
      console.log('getUser: ' + [].slice.call(arguments).map(x => Object.keys(x || {}).join(' ')));

    var token = rootValue.cookies.get('sessionID');
    var session = sessionHolder.getSessionByToken[token];
    if (session) {
      return session.user;
    } else return {
    name: '',
        sessionID: '',
    id: logID
  };
},
  getUserByCredentials: (credentials, rootValue) => {
      console.log('getUserByCredentials: ' + [].slice.call(arguments));

    if (credentials.name === '') {
      rootValue.cookies.set('sessionID', '');
      return ({
        name: '',
        sessionID: '',

        id: logID
      });
    }
    var result = usersByPasswordHash[hash(credentials.password)];
    if (result) {
      var user = {
        name: result.name || '',
        sessionID: token,
        id: logID,
      };
          var token = sessionHolder.putUser(user);
    rootValue.cookies.set('sessionID', token);
    return user;
    }
  },
  putBidOnItem: ({item, userName}, rootValue) => {
    var dbItem = items.find(x => x.id === item.id);
    if (!dbItem.bidder) {
      item.bidder = dbItem.bidder = userName;
    }
    return item;
  },
  //getUser: (id) => id === viewer.id ? viewer : null,
  getWidget: (id) => widgets.find(w => w.id === id),
  getWidgets: () => widgets,
  User,
  Item,
};
