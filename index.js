"use strict"

const Api = require('./express/routes/Api');
class Server {
  constructor() {
    this.express = require('express');
    this.app = this.express();
    this.path = require('path');
    this.apiRouters = this.express.Router();
    this.api = {};
    this.port = 0;
    this.bodyParser = require('body-parser');
  }
  /**
   * startExpressConfig - start Express Config
   */
  startExpressConfig() {
    this.app.use(this.bodyParser.urlencoded({
      extended: false,
      limit: '50mb'
    }));
    this.app.use(this.bodyParser.json({
      limit: '50mb'
    }));
    process.env.PORT ? this.port = process.env.PORT : this.port = 8000 //! process.env.PORT - production
  }
  /**
   * errorMiddleware - print error (in server and client regarding he api)
   */
  errorMiddleware() {
    this.app.use(function (err, req, res, next) {
      if (err.message === "Cannot read property 'catch' of undefined") { //! if user didn't found
        let errorMessage = `Got wrong with the request, please check the req.body`
        console.error(`client send incurrent request at : `, req.body)
        res.status(422).send({
          errorMessage
        })
      } else {
        console.error(`${err.message}`)
        res.status(422).send({
          error: err.message
        })
      }
    })
  }
  /**
   * activeApi - Open api routes
   */
  activeApi() {
    this.api = new Api(this.apiRouters,  this.path);
    this.app.use('/', this.apiRouters);
    // error middleware
    this.errorMiddleware()
    this.api.uploadImage();
    this.api.getImage();
  }
  /**
   * addAppLister - Active server port
   */
  addAppLister() {
    this.app.listen(this.port, () => {
      console.log(`Running on port ${this.port}`)
    })
  }
  /**
   * activateServer - Active all index methods
   */
  activateServer() {
    this.startExpressConfig();
    this.activeApi();
    this.addAppLister();
  }
}
const server = new Server();
server.activateServer();