import { ApolloServer, gql } from "apollo-server";

let users = [
  {
    id: "1",
    firstName: "na",
    lastName: "sungmin",
  },
  {
    id: "2",
    firstName: "an",
    lastName: "nimgnus",
  },
];

let tweets = [
  {
    id: "1",
    text: "first",
    userId: "2",
  },
  {
    id: "2",
    text: "second",
    userId: "1",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    """
    Post Tweet
    """
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Delete a Tweet if found, else returns false
    """
    deleteTweet(id: ID!): Boolean!
  }
`;
// GET /api/v1/tweets
// GET /api/v1/tweet/:id

const resolvers = {
  Query: {
    allUsers() {
      return users;
    },
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find(tweet => tweet.id === id);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      if (!users.find(user => user.id === userId))
        throw new Error(`userId(${userId}) is not find`);
      const newTweet = {
        id: String(tweets.length + 1),
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      console.log(tweets);
      const tweet = tweets.find(tweet => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter(tweet => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return firstName + " " + lastName;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find(user => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
