var eejs = require('ep_etherpad-lite/node/eejs')
  , padManager = require('ep_etherpad-lite/node/db/PadManager')
  , api = require('ep_etherpad-lite/node/db/API')
  , express = require('ep_etherpad-lite/node_modules/express');

exports.expressCreateServer = function (hook_name, args, cb) {
  args.app.get('/list', function(req, res) {
    var render_args = {
      pads: []
    };
    padManager.listAllPads(function(null_value, pads){
      pads.padIDs = pads.padIDs.filter(function(padid) {
        grouppads = /^g.\w{16}\$.*$/
        return !padid.match(grouppads)
      })
      render_args.pads = pads.padIDs;
      res.send( eejs.require('ep_padlist/templates/pads.html', render_args) );
      cb();
    });
  });

  args.app.use('/list/static', express.static(__dirname + '/static'))
}

exports.indexWrapper = function (hook_name, args, cb) {
  args.content = '<div style="text-align:center;"><img src="list/static/img/logo_horiz_w700.png" /></div><br>'
    + args.content
    + '<br>'
    + '<div style="text-align:center;">'
    +   '<a href="list" style="color:#000;">Pad Liste</a>'
    +   ' | '
    +   '<a href="http://gpad.c3s.cc/" style="color:#000;">Gruppenpads</a>'
    + '</div>';
  return cb();
}

