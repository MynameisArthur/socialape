const {db} = require('../util/admin');

exports.getAllScreams = (request,response)=>{
    db.collection('screams')
    .orderBy('createdAt','desc')
    .get()
    .then(data =>{
        let screams = [];
        data.forEach(doc =>{
            screams.push({
                screamId: doc.id,
                ...doc.data()
            });
        });
        return response.json(screams);
    })
    .catch(err=>{
        console.error(err);        
    });
};

exports.postOneScream = (req,res)=>{  
    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    };
    db.collection('screams')
    .add(newScream)
    .then(doc=>{
        res.json({message: `document ${doc.id} created successfuly`});
    })
    .catch(err=>{
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
    });
};