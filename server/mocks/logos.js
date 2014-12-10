module.exports = function(app) {
  var express = require('express');
  var logosRouter = express.Router();

  logosRouter.get('/', function(req, res) {
    res.send({
      "logos": []
    });
  });

  logosRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  logosRouter.get('/:id', function(req, res) {
    res.send({
      "logos": {
        "id": req.params.id,
        "title": "school #" + req.params.id,
        "font": "font_id",
        "flowers": [1,2,3],
        "palette": "palette_id",
        "arrangement": "arrangement_string",
        "stringified": "stringified_from_fabricjs"
      }
    });
  });

  logosRouter.put('/:id', function(req, res) {
    res.send({
      "logos": {
        "id": req.params.id
      }
    });
  });

  logosRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/logos', logosRouter);
};
