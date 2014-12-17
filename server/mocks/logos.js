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
        "name": "school #" + req.params.id,
        "font": 2,
        "flowerIds": [1,2,3],
        "palette": { id: 3, colors: [
            "#e5b113"
            , "#e57613"
        ]},
        "arrangement": { id: 2, className: 'bottom' }
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
