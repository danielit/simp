#!/usr/bin/python
import json

import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.escape
from tornado.options import define, options

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("{'hello':'world'}")

class StuHandler(tornado.web.RequestHandler):
    def get(self):
        params={}
        params['user'] = self.get_argument('user')
        params['pwd'] = self.get_argument('pwd')
        #self.write("get")
        self.write(json.dumps(params))
    def post(self):
        params={}
        params['user'] = self.get_argument('user')
        params['pwd'] = self.get_argument('pwd')
        self.write("post")
        self.write(params)


application = tornado.web.Application([
    (r"/",MainHandler),
    (r"/student",StuHandler),
    ])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
