var express = require('express');
var app = express();

// const http = require('http');
// const fs = require('fs');
// const path = require('path');

app.use(require('body-parser').urlencoded({
    extended: false
}));
app.use(require('cookie-parser')());
