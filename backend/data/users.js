import bcrypt from 'bcryptjs'

const users = [
    {   
        name: 'iser Admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123', 10),
        isAdmin: true
    },
    {   
        name: 'simo',
        email: 'simo@gmail.com',
        password: bcrypt.hashSync('123', 10),
        isAdmin: false
    },
    {   
        name: 'hanae',
        email: 'hanae@gmail.com',
        password: bcrypt.hashSync('123', 10),
        isAdmin: false
    },
    {   
        name: 'saad',
        email: 'saad@gmail.com',
        password: bcrypt.hashSync('123', 10),
        isAdmin: false
    },
]

export default users