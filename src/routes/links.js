const express = require('express');
const router = express.Router();

const pool = require('../database'); //Hace referencia  a la conección a la base de datos
const { isLoggedIn } = require('../lib/auth.js');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add.hbs');
});

router.post('/add', isLoggedIn, async (req, res) => { //Recibe los datos en la ruta
     const {title, url, description} = req.body; //Destructurin
     const newLinks = { //Creacion de un objeto
         title,
         url,
         description,
         user_id: req.user.id
     };
     await pool.query('INSERT INTO links set ?', [newLinks]); //Ingresa los datos a mysql
     req.flash('success', 'Link saved succesfully'); //Mensaje
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => { //Cosulta a la base de datos
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list.hbs', {links});
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Links Removed successfully');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit.hbs', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    console.log(newLink);
    await pool.query('UPDATE links SET ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Links Updated successfully');
    res.redirect('/links');
});


module.exports = router;