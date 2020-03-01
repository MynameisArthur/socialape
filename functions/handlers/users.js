const {db,admin} = require('../util/admin');
const firebase = require('firebase');
const config = require('../util/config');
firebase.initializeApp(config);

const {validateSignupData,validateLoginData} = require('../util/validators');

exports.signup = (req,res)=>{    
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };  
    // validation 
    const {valid,errors} = validateSignupData(newUser);
    if(!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png';

    let token, userId;
    db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc=>{
        if(doc.exists)
        {
            return res.status(400).json({handle: 'this handle is already taken'});
        }else{
            return firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password);
        }
    })
    .then(data =>{
        userId = data.user.uid;
        return data.user.getIdToken()
    })
    .then(idToken=>{
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId,
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(()=>{
        return res.status(201).json({token});
    })
    .catch(err=>{
        console.error(err);
        if(err.code === 'auth/email-already-in-use')
        {
            return res.status(400).json({email: 'Email is already in use'});
        }
        return res.status(500).json({error: err.code});
    });
};

exports.login = (req,res)=>{
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    // validation
    const {valid,errors} = validateLoginData(user);
    if(!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then(data=>{
        return data.user.getIdToken();
    })
    .then(token=>{
        return res.json({token});
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'){
            return res.status(403).json({general: 'Wrong credentials, please try again.'});
        }
        return res.status(500).json({error: err.code});
    });
}
let imageFileName;
let imageToBeUploaded = {};

exports.uploadImage = (req,res)=>{
   const BusBoy = require('busboy');
   const path = require('path');
   const os = require('os');
   const fs = require('fs');
   const busboy = new BusBoy({headers: req.headers});
   busboy.on('file',(fieldName,file,fileName,encoding,mimeType)=>{

       console.log('fieldName',fieldName);       
       console.log('fileName',fileName);       
       console.log('mimeType',mimeType);

       const imageExtension = fileName.split('.')[fileName.split('.').length - 1];
       imageFileName = `${Math.round(Math.random()*100000000)}.${imageExtension}`;
       const filePath = path.join(os.tmpdir(),imageFileName);
       imageToBeUploaded = {filePath, mimeType};
       file.pipe(fs.createWriteStream(filePath));
   });
   busboy.on('finish',()=>{
    admin.storage().bucket(config.storageBucket).upload(imageToBeUploaded.filePath,{
        resumable: false,
        metadata:{
            metadata: {
                contentType: imageToBeUploaded.mimeType
            }            
        }
    })
    .then(()=>{
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({imageUrl});
    })
    .then(()=>{
        return res.json({message: 'Image uploaded successfully'});
    })
    .catch(err=>{
        console.error(err);
        return res.status(500).json({error: err.code});
    });
   });
   busboy.end(req.rawBody);
};