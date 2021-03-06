var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const moment = require('moment');
const jwt = require('jwt-simple');

const Usuario = require('../../models/usuario');

// const middlewares = require('../middlewares');




router.post('/', async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const result = await Usuario.insert(req.body);
    res.json(result)

    // if (result['affectedRows'] === 1) {
    //     const usuario = await Usuario.getById(result['insertId']);
    //     res.json(usuario)
    // } else {
    //     res.json({ error: 'Error en la insercion del Usuario' })
    // };
});

router.post('/post', async (req, res) => {
    const result = await Usuario.insertPost(req.body);
    const posts = await Usuario.getAllPost();
    res.json(posts)

})

router.get('/post', async (req, res) => {
    const result = await Usuario.getAllPost();
    res.json(result)
})


router.post('/login', (req, res) => {

    Usuario.getByEmail(req.body.email)
        .then(rows => {
            if (rows.length !== 1) {
                res.json({ error: 'Error email y/o password' });
            } else {
                const iguales = bcrypt.compareSync(req.body.password, rows[0].password);
                if (!iguales) {
                    res.json({ error: 'Error email y/o password' });
                } else {
                    res.json({ exito: createToken(rows[0]), nombre: rows[0].nombre, apellidos: rows[0].apellidos });



                }
            }
        }).catch(err => {
            res.json({ error: err.message });
        });

});



//METODO PARA CREAR UN TOKEN

const createToken = (user) => {
    let payload = {
        userId: user.id,
        createdAt: moment().unix(),

    }
    return jwt.encode(payload, process.env.TOKEN_KEY);
}


module.exports = router;