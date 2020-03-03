const functions = require('firebase-functions');
const app= require('express')();
const {getAllScreams,postOneScream,getScream,commentOnScream,likeScream,unlikeScream,deleteScream} = require('./handlers/screams');
const {signup,login,uploadImage,addUserDetails,getAuthenticatedUser,getUserDetails,markNotificationsRead} = require('./handlers/users');
const {FBAuth} = require('./util/fbAuth');
const {db} = require('./util/admin');

// Scream routes
app.get('/screams',getAllScreams);
app.post('/scream',FBAuth,postOneScream);
app.get('/scream/:screamId',getScream);
app.post('/scream/:screamId/comment',FBAuth,commentOnScream);
app.get('/scream/:screamId/like',FBAuth,likeScream);
app.get('/scream/:screamId/unlike',FBAuth,unlikeScream);
app.delete('/scream/:screamId',FBAuth,deleteScream);
// User routes
app.post('/signup',signup);
app.post('/login',login);
app.post('/user/image',FBAuth,uploadImage);
app.post('/user',FBAuth,addUserDetails);
app.get('/user',FBAuth,getAuthenticatedUser);
app.get('/user/:handle',getUserDetails);
app.post('/notifications',FBAuth,markNotificationsRead);


exports.api = functions.region('europe-west1').https.onRequest(app);

//Create Notification On Like
exports.createNotificationOnLike = functions.region('europe-west1').firestore.document('likes/{id}').onCreate((snapshot)=>{
    db.doc(`/screams/${snapshot.data().screamId}`).get().then(doc => {
        if(doc.exists)
        {
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt: new Date().toISOString(),
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: 'like',
                read: false,
                screamId: doc.id
            });
        }
    })
    .then(()=>{
        return;
    })
    .catch(err=>{
        console.error(err);
        return;
    });
});
//Delete Notification On Unlike
exports.deleteNotificationOnUnlike = functions.region('europe-west1').firestore.document('likes/{id}')
.onDelete(snapshot => {
    db.doc(`/notifications/${snapshot.id}`).delete().then(()=>{
        return;
    })
    .catch(err=>{
        console.error(err);
        return;
    });
});



// Create Notification On Comment
exports.createNotificationOnComment = functions.region('europe-west1').firestore.document('comments/{id}')
.onCreate(snapshot => {
    db.doc(`/screams/${snapshot.data().screamId}`).get().then(doc => {
        if(doc.exists)
        {
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt: new Date().toISOString(),
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: 'comment',
                read: false,
                screamId: doc.id
            });
        }
    })
    .then(()=>{
        return;
    })
    .catch(err=>{
        console.error(err);
        return;
    });
});

