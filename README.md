# Fashionapp-HdM-MWA-backend
Backend / Server

## Testing

For testing we use mocha.

Install with
```
$ npm install -g mocha
```

Run from the root directory with
```
$ mocha
```
For local testing change ```dbURI``` at ```lapica/models/db.js``` to
```
mongodb://192.168.99.100:27017/mongo
```