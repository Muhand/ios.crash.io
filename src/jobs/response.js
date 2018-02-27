function response(res, status_code, payload) {
  // res.status = status_code;
  // res.writeHead(res.status, {'Content-Type':'application/json'});
  res.status(status_code).send(payload);
  // res.end(JSON.stringify(payload));
}

module.exports = response;
