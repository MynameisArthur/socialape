let db = {
    screams: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2020-02-27T10:42:55.191Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    users: [
        {
            userId: 'XPwfARsIDfhdxJst767cR0fmrcq2',
            email: 'john@example.com',
            handle: 'john',
            createdAt: '2020-02-27T12:32:55.517Z',
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/socialape-73f48.appspot.com/o/77355570.jpg?alt=media',
            bio: 'hello my name is john and nice to meet you',
            website: 'https://john_matrix.com',
            location: 'Dallas, US'
        }
    ]
};

const userDetails = {
    // Redux data
    credentials: {
      userId: 'N43KJ5H43KJHREW4J5H3JWMERHB',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2019-03-15T10:59:52.798Z',
      imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
      bio: 'Hello, my name is user, nice to meet you',
      website: 'https://user.com',
      location: 'Lonodn, UK'
    },
    likes: [
      {
        userHandle: 'user',
        screamId: 'hh7O5oWfWucVzGbHH2pa'
      },
      {
        userHandle: 'user',
        screamId: '3IOnFoQexRcofs5OhBXO'
      }
    ]
  };