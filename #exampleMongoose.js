var express = require('express')
const  { ApolloServer,gql } = require('apollo-server-express');
var mongoose = require('mongoose');

const typeDefs = gql`
type Query {
 greet: String,
 users :[User],
 musers:[User]
}

type User {
    id:String,
    email:String,
    password:String,
    companyId:String
}`

const resolvers = {
  Query: {
    greet: () => {
      return "Hello from GraphQl side"
    },
    users:()=>{
        return fetchData()
    },
    musers:()=>{
        return MUsers.find()
    }
  },
}


const app = express();

var dbUrl = 'mongodb://localhost:27017/kdqldb'
mongoose.connect(dbUrl);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, "DB connection error"))

const SERVER = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    playground: {
      endpoint: `http://localhost:3600/graphql`,
      settings: {
        'editor.theme': 'light'
      }
    }
  });

  SERVER.applyMiddleware({
    app: app
  });

app.listen(3600 , ()=> {console.log("App started")})

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
      }, 
       email: {
        type: String,
        required: true,
        unique: true,
      },
    password: {
        type: String,
        required: true,
    },
    companyId: {
        type: String,
        required: true,
    }
});


userSchema.set('toObject', { virtuals: true });

var MUsers =  mongoose.model('User', userSchema);


var  fetchData = ()=>{

    var fakeUsers =  [
        {
          "id": "BJrp-DudG",
          "email": "alice@facegle.io",
          "password": "alice123",
          "companyId": "HJRa-DOuG"
        },
        {
          "id": "ry9pbwdOz",
          "email": "bob@goobook.co",
          "password": "bob123",
          "companyId": "SJV0-wdOM"
        }
      ]
    return fakeUsers;
   
    }