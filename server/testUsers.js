const users = [
  {
    id: "1",
    username: "Maurice",
    email: "maurice@moss.com",
    password: "abcdefg"
  },
  {
    id: "2",
    username: "Roy",
    email: "roy@trenneman.com",
    password: "imroy"
  }
];

// export default {
//   getUsers: () => users,
//   addUser: user => users.push(user)
// };

export function getUsers() {
  return users;
}

export function addUser(user) {
  return users.push(user);
}
