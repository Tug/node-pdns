var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app,
    cliff = require('cliff');

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.cli, {
  source: path.join(__dirname, 'lib', 'commands'),
  usage: ["domains [list|add|remove]",
          "records [list|add|remove]"]
});

app.start(function(err, result) {
  if(result) {
    printResults(result);
  }
});

function printResults(objs) {
  cliff.putObjectRows('data', objs, ['id', 'name', 'type']);
}

