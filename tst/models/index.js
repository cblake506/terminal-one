const sequelize = require('../../config/connections');

sequelize.sync({ force: false })
.then(() => {
    console.log('db synced');
})
.catch(err => console.log(err));