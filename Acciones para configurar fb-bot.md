## Configura menu fijo
```
curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type" : "call_to_actions",
  "thread_state" : "existing_thread",
  "call_to_actions":[
    {
      "type":"web_url",
      "title":"Visitar el sitio",
      "url":"http://www.turismocity.com.ar",
    },
    {
      "type":"postback",
      "title":"HELP",
      "payload":"HELP"
    },
    {
      "type":"postback",
      "title":"Restart",
      "payload":"RESTART"
    }
  ]
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAANEkVBK2c8BALFE8ey7AcDXZC2cVP2y1ZA2tpXHlJYwF7sbP2rg6iZBY7gPKgnQF4NZCkZCDIbvvMUWWRwTNOaH3i7bmy5uiqix5s0UNHwge1kC4N6PGUZA78ONRizsBtxOpzlvNhZAkwwCBljpZBNuP6exfowilw3Jx9CsJtDBIAZDZD"
```

## Boton empezar
```
curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type":"call_to_actions",
  "thread_state":"new_thread",
  "call_to_actions":[
    {
      "payload":"USER_DEFINED_PAYLOAD"
    }
  ]
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=PAGE_ACCESS_TOKEN"      
```
