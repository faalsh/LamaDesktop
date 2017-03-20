var express = require('express');
var fallback = require('express-history-api-fallback');

var app = express();

app.set('port', (process.env.PORT || 5000));
var root = `${__dirname}`;

app.use(express.static(root));
app.use(fallback('index.html',  {root} ));




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});