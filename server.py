#!/usr/bin/python
import json
import os
import sys
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.escape
from tornado.options import define, options

from student.student import Student
from student.student_handler import *


class MainHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        rem = self.get_secure_cookie('remb')
        user = self.get_secure_cookie('user')
        if rem == '0' or rem== None:
            return None
        elif rem=='1':
            return user

    def get(self):
        simp = Student.instance()
        simp.logger.info("main handler enter get")
        user = self.get_secure_cookie('user')
        if not self.current_user:
            simp.logger.info('render to login.html')
            #self.redirect('/login')
            self.render('login.html')
            return
        else:
            simp.logger.info('has cooki redirect')
            role = self.get_secure_cookie('role')
            self.set_cookie('uid',user)
            self.set_cookie('type',role)
            if role=="80000":#studnet
                slef.redirect('student?student='+self.current_user)
            elif role=="80011": #teacher
                self.redirect('manage?teacher='+self.current_user)
            elif role=="80088": #administrator ,for now it is the same to 'teacher'
                self.redirect('manage?teacher='+self.current_user)

class NullHandler(tornado.web.RequestHandler):
    def get(self):
        pass

    def post(self):
        pass

class ManageHandler(tornado.web.RequestHandler):
    def get(self):
        stu = Student.instance()
        self.render("main.html") ;

class GridHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("grid.html") ;

class QuanHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("qu.html") ;

class FormHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("form.html") ;






class StuHandler(tornado.web.RequestHandler):

    def post(self):
        pass

    def get(self):
        params={}
        params['pwd'] = self.get_argument('password')
        #params['pwd'] = self.get_argument('pwd')
        self.write("get")
        self.write(json.dumps(params))
        print "get"
        print params

if __name__ == "__main__":
    reload(sys)
    sys.setdefaultencoding('utf-8')
    settings = {
        "static_path": os.path.join(os.path.dirname(__file__), "static"),
        "cookie_secret":"74deccaf0bfc574e7487f931b9c07d16=+-_"
        }

    application = tornado.web.Application([
        (r"/",MainHandler,),
        (r"/null",NullHandler),
        (r"/login",LoginHandler),
        (r"/manage",ManageHandler),
        (r"/grid",GridHandler),
        (r"/getallstuinfo",GetAllStuInfoHandler),
        (r"/setstuinfo",SetStuInfoHandler),
        (r"/getclassids",GetAllClassIDs),
        (r"/getquantypes",GetQuanTypesHandler),
        (r"/getstunameidsonclassid",GetStuNameIDsOnClassID),
        (r"/quan",QuanHandler),
        (r"/addquaninfos",AddQuanInfosHandler),
        (r"/getclassquanofweek",GetQuanSummaryOfWeekHandler),
        (r"/getquaninfos",GetQuanInfosHandler),
        (r"/getattendinfo",GetAttendInfoHandler),
        (r"/setattendinfo",SetAttendInfoHandler),
        (r"/getheadteachers",GetHeadTeachersHandler),
        (r"/getnewslist",GetNewsListHandler),
        (r"/getnewscontent",GetNewsContentHandler),
        (r"/getallnews",GetAllNewsHandler),
        (r"/setnews",SetNewsHandler),
        (r"/form",FormHandler)
        ],
        **settings
        )
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
