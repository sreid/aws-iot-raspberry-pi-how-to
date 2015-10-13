var awsIot = require('aws-iot-device-sdk');

var myThingName = 'pi_2';

var thingShadows = awsIot.thingShadow({
   keyPath: './certs/<your_cert>-private.pem.key',
  certPath: './certs/<your_cert>-certificate.pem.crt',
    caPath: './certs/rootCA.pem',
  clientId: myThingName,
    region: 'us-east-1'
});

mythingstate = {
  "state": {
    "reported": {
      "ip": "unknown"
    }
  }
}

// Record our IP address
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  mythingstate["state"]["reported"]["ip"] = add;
})

thingShadows.on('connect', function() {
  console.log("Connected...");
  console.log("Registering...");
  thingShadows.register( myThingName );

  // An update right away causes a timeout error, so we wait about 2 seconds
  setTimeout( function() {
    console.log("Updating my IP address...");
    clientTokenIP = thingShadows.update(myThingName, mythingstate);
    console.log("Update:" + clientTokenIP);
  }, 2500 );


  // Code below just logs messages for info/debugging
  thingShadows.on('status',
    function(thingName, stat, clientToken, stateObject) {
       console.log('received '+stat+' on '+thingName+': '+
                   JSON.stringify(stateObject));
    });

  thingShadows.on('update',
      function(thingName, stateObject) {
         console.log('received update '+' on '+thingName+': '+
                     JSON.stringify(stateObject));
      });

  thingShadows.on('delta',
      function(thingName, stateObject) {
         console.log('received delta '+' on '+thingName+': '+
                     JSON.stringify(stateObject));
      });

  thingShadows.on('timeout',
      function(thingName, clientToken) {
         console.log('received timeout for '+ clientToken)
      });

  thingShadows
    .on('close', function() {
      console.log('close');
    });
  thingShadows
    .on('reconnect', function() {
      console.log('reconnect');
    });
  thingShadows
    .on('offline', function() {
      console.log('offline');
    });
  thingShadows
    .on('error', function(error) {
      console.log('error', error);
    });

});
