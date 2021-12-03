module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      surname: {
        type: Sequelize.STRING
      },
      quarter: {
        type: Sequelize.STRING
      },
       dateOfBirdth: {
        type: Sequelize.STRING
      },
      telephone: {
        type: Sequelize.STRING
      },
    });
  
    return User;
  };