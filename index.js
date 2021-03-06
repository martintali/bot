var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'chat-bot') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    getUserFullname(event).then((result) => {
      sender = event.sender.id
      if (event.message && event.message.text) {
        text = event.message.text;

        sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }
      if (event.postback) {
        if (event.postback.payload) {
          switch (event.postback.payload) {
            case 'USER_DEFINED_PAYLOAD': 'RESTART' : default:
              sendFirstButtons(sender);
              break;
          }
        }
        const text = JSON.stringify(event.postback);
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
      }
    });
  }
  res.sendStatus(200)
})

var token = "EAANEkVBK2c8BALFE8ey7AcDXZC2cVP2y1ZA2tpXHlJYwF7sbP2rg6iZBY7gPKgnQF4NZCkZCDIbvvMUWWRwTNOaH3i7bmy5uiqix5s0UNHwge1kC4N6PGUZA78ONRizsBtxOpzlvNhZAkwwCBljpZBNuP6exfowilw3Jx9CsJtDBIAZDZD";

function getUserFullname(event) {
  return new Promise((resolve, reject) => {
    if (event.message && !event.message.is_echo) {
      request({
        url: `https://graph.facebook.com/v2.6/${event.sender.id}`,
        qs: {
          access_token: token,
          fields: 'first_name,last_name'
        }
      }, function(error, response, body) {
        if (error) {
          return reject(error);
        }
        console.log(response.body);
        return resolve(response.body);
      });
    }
    return resolve({});
  });
}

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    }
  })
}

function sendFirstButtons(sender) {
  messageData = {
    text: "Que queres hacer?",
    quick_replies: [
      {
        content_type: "text",
        title: "Buscar vuelo",
        payload: "BUSCAR_VUELO",
      },
      {
        content_type: "text",
        title: "Obtener vuelos baratos",
        payload: "BUSCAR_VUELO_BARATO",
      },
    ],
  };

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    }
  })
}

function sendGenericMessage(sender) {
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "First card",
          "subtitle": "Element #1 of an hscroll",
          "image_url": "https://d1boyphjpqts2r.cloudfront.net/img/resourcestc/MAD.jpg",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.turismocity.com.ar/vuelos-baratos-a-MAD-Madrid?from=BUE",
            "title": "web url"
          }, {
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for first element in a generic bubble",
          }],
        }, {
          "title": "Second card",
          "subtitle": "Element #2 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
          "buttons": [{
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for second element in a generic bubble",
          }],
        }]
      }
    }
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    }
  })
}

let port = 8080;
if (process.env.HEROKU === 1) {
  port = app.get('port');
}
// Spin up the server
app.listen(port, function() {
  console.log('running on port', port)
})
