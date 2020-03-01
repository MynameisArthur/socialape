exports.isEmpty = (string)=>{ 
    if(string.trim() === '')
    {
        return true;
    }else{
        return false;
    }
};
exports.isEmail = email=>{ 
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regex))
    {
        return true;
    }
    return false;
};
exports.FBAuth = (req,res,next)=>{
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer '))
    {
        idToken = req.headers.authorization.split('Bearer ')[1];
    }else{
        console.log('No token found');        
        return res.status(403).json({error: 'Unauthorized'});
    }
    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
        req.user = decodedToken;
        console.log(decodedToken);        
        return db.collection('users').where('userId','==',req.user.uid).limit(1).get();
    })
    .then(data =>{
        req.user.handle = data.docs[0].data().handle;
        return next();
    })
    .catch(err=>{
        console.log('Error while veryfying token ',err);
        return res.status(403).json(err);
    });
};
