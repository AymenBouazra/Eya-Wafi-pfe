const User = require('../models/user');

User.countDocuments().then(async (usersCount) => {
 if (usersCount === 0) {
    const usersToInsert = [
        {
            profile:{
                firstName: 'Eya',
                lastName: 'Wafi',
            },
            email: 'eya.wafi@sesame.com.tn',
            password: '$2a$10$MDIRedaQqMwEzx78OdnOR.8ve5/W42.qDXm/GgQYkTsYfeioKmBkG',
            role: 'manager',
        }  
    ]
    await User.create(usersToInsert);
 }
});

console.log(`=> All collections has been seeded successfully!`);