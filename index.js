const express = require('express');
const expressFileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: 'El peso de la imagen sobrepasa el límite de 5MG.',
  })
);

app.get('/collage', (req, res) => {
  res.sendFile(`${__dirname}/public/collage.html`);
});

app.post('/imagen', (req, res) => {
  if (!req.files || req.body.posicion === '') {
    return res.send('Debes seleccionar una imagen y una posición.');
  }
  const { mimetype, mv } = req.files.target_file;
  const { posicion } = req.body;
  const allowedMimetypes = ['image/jpeg'];
  if (!allowedMimetypes.includes(mimetype)) {
    return res.send('Solo se pueden cargar imagenes jpg o jpeg.');
  }
  const ruta = `${__dirname}/public/imgs/imagen-${posicion}.jpg`;
  mv(ruta, (err) => {
    if (err) {
      return res.send('Ocurrió un error al cargar la imagen.');
    }
    res.redirect('/collage');
  });
});

app.get('/deleteImg/:nombre', (req, res) => {
  const { nombre } = req.params;
  fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
    if (err) {
      res.send('Fallo la eliminación de archivo.');
    }
    res.redirect('/collage');
  });
});

app.listen(3000, () => console.log('ServerON'));
