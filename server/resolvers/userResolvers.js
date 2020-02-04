//TODO: EXTRACT ALL DATABASE LOGIC TO APOLLO DATASOURCE: https://www.apollographql.com/docs/tutorial/data-source/
const { User } = require("../models");
const { UserInputError } = require("apollo-server");
import uuid from "uuid/v4";
const bcrypt = require("bcrypt");

//TODO: Authentication
const userResolvers = {
  Query: {
    users: (root, arg, context, info) => {
      return User.find({});
      // return fetchData()
    },
    user: (root, arg, context, info) => {
      return fetchOneData();
    },
    currentUser: (parent, args, context) => {
      // console.log("here:" + context.getUser());
      context.getUser();
    }
  },
  Mutation: {
    addUser: (root, args, context, info) => {
      // console.log(args.password);
      return User.create(args);
      // console.log("created user " + args)
    },
    // logout: (parent, args, context) => context.logout(),
    // login: async (parent, { email, password }, context) => {
    //   const { user } = await context.authenticate("graphql-local", {
    //     email,
    //     password
    //   });
    //   console.log("user... : " + user);

    //   await context.login(user);
    //   return { user };
    // },
    signup: async (parent, args, context) => {
      let newUser = null;
      const { username, email, password, mascot } = args;
      try {
        const userWithEmail = await User.findOne({ email: args.email });

        if (userWithEmail) {
          //TODO: ERROR HANDLING
          throw new UserInputError("User with email already exists", {
            invalidArgs: Object.keys(args)
          });
        }

        newUser = new User({
          username,
          email,
          password,
          mascot
        });

        //Hash Password - TODO: change
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then
              //redirect
              //COULD ALSO USE FLASH MESSAGE HERE (connect-flash)
              ()
              .catch(err => console.log(err));
          })
        );
      } catch (e) {
        console.error(e.message);
      } finally {
        console.log("We do cleanup here");
      }

      // userWithEmail
      //   .then(async resp => {
      //     //TODO: REFACTOR WITH ES6
      //     if (resp.length > 0) {
      //       //TODO: ERROR HANDLING
      //       throw new UserInputError("User with email already exists", {
      //         invalidArgs: Object.keys({ username, email, password, mascot })
      //       });
      //     }
      //     newUser = {
      //       id: uuid(),
      //       username,
      //       email,
      //       password,
      //       mascot
      //     };
      //     console.log(newUser);
      //     //TODO BCRYPT
      //     User.create({ username, email, password, mascot });
      //     context.User.addUser(newUser);
      //     // console.log(context);
      //     await context.login(newUser);
      //   })
      //   .catch(e => {
      //     console.log(e.message);
      //   });

      return { user: newUser };
    }
  }
};

module.exports = {
  userResolvers
};
