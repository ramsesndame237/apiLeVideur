/**
 * this middleware function help us to verify signup action if is duplicate phone number or email
 */

const db = require('../models');
const ROLES = db.role;
const USER = db.user;


checkDuplicateEmailOrPhoneNumber = (req, res, next) => {
    // phone number
    
    
    /**
     * nous cherchons un utilisateur dans la base de données avec ce numéro de téléphone si l'on trouve alors 
     * il ne peut pas utiliser ce numéro pour s'enregistrer
     */

    USER.findOne({
        where:{
            phoneNumber: req.body.phoneNumber
        }
    }).then((user)=>{


        if(user){
            res.status(400).send({
                message:"Failed, this phone number is already in use!"
            })

        }
        return;
    })
}
