#!/usr/bin/python
import json
import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.escape
from tornado.options import define, options

ROOT=os.path.dirname(__file__)
EXT_PATH=ROOT+"/extjs"

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

class NullHandler(tornado.web.RequestHandler):
    def get(self):
        params={}
        params['user'] = self.get_argument('userLoginForm.userName')
        self.write("get")
        self.write(params)

    def post(self):
        params={}
        params['user'] = self.get_argument('userLoginForm.userName')
        self.write("post")
        self.write(params)

class ManageHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("main.html") ;



class StuHandler(tornado.web.RequestHandler):

    def post(self):
        params={}
        params['user'] = self.get_argument('userLoginForm.userName')
        #params['passwd'] = self.get_argument('password')
        #params['user'] = self.get_argument('user')
        #params['pwd'] = self.get_argument('pwd')
        params['success']='true'
        self.write(params)
        print "post"
        print params

   # def set_default_headers(self):
   #     self.set_header("Access-Control-Allow-Headers", "accept, cache-control, origin, x-requested-with, x-file-name, content-type")
   #     self.set_header("Access-Control-Allow-Origin", "*")


    def get(self):
        params={}
        #params['user'] = self.get_argument('userLoginForm.userName')
        params['pwd'] = self.get_argument('password')
        #params['pwd'] = self.get_argument('pwd')
        self.write("get")
        self.write(json.dumps(params))
        print "get"
        print params

if __name__ == "__main__":
    settings = {
        "static_path": os.path.join(os.path.dirname(__file__), "static")
        }

    application = tornado.web.Application([
        (r"/",MainHandler,),
        (r"/null",NullHandler),
        (r"/login",StuHandler),
        (r"/manage",ManageHandler),
        ],
        **settings
        )
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()