
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../model');

exports.registerUser = async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }

    try {
        await users.create({
            username,
            email,
            password: bcrypt.hashSync(password, 10)
        });

        res.status(200).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  console.log(email, password)
    try {
        const foundUsers = await users.findAll({ where: { email } });

        if (foundUsers.length === 0) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const user = foundUsers[0];
        const isPasswordMatched = bcrypt.compareSync(password, user.password);

        if (!isPasswordMatched) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, "thisismysecretKey", { expiresIn: 86400 });
        res.cookie('jwttoken',token)
        res.status(200).json({ message: 'Login successful', jwttoken: token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};
