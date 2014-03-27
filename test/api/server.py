#!/usr/bin/python
import json

import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.escape
from tornado.options import define, options

import os

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

class DownloadHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header('Content-Type','application/vnd.ms-excel')
        self.set_header('Content-Disposition','attachment;filename="abc.xls"')
        len =str(os.path.getsize('abc.xls'))
        self.set_header('Content-Length',len)
        with open('abc.xls','rb') as f:
            self.write(f.read())
        pass

class UploadHandler(tornado.web.RequestHandler):
    def get(self):
        pass
    def post(self):
        pass
application = tornado.web.Application([
    (r"/",MainHandler),
    (r"/student",StuHandler),
    (r"/download",DownloadHandler)
    ])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
