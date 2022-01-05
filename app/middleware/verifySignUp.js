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
            return; 
        }

         // email 

        USER.findOne({
            where:{
                email:req.body.email
            }
        }).then((user)=>{
            if (user) {
                res.status(400).send({
                    message:"Failed, this email is already in use!"
                })
                return
            }
            next();
        });
    })
}

/**
 * verfication de l'existance du role
 */
checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(400).send({
            message: "Failed! Role does not exist = " + req.body.roles[i]
          });
          return;
        }
      }
    }
    
    next();
  };

  const verifySignUp = {
    checkDuplicateEmailOrPhoneNumber: checkDuplicateEmailOrPhoneNumber,
    checkRolesExisted: checkRolesExisted
  };
  
  module.exports = verifySignUp;