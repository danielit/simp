#!/usr/bin/env python
""" Feed module """

import sys
import time
import logging
import logging.handlers
import json

from handler import APIHandler,APISecureHandler
from student import Student

from tornado.escape import json_encode
# constant definitions

class GetAllStuInfo(APIHandler):
    def get(self):
        try:
            #stuid = self.get_argument('stuid')
            pass
        except Exception,e:
            raise tornado.web.HTTPError(404)

        try:
            stu = student.instance()
            ret = stu.getAllStuInfo()
        except Exception,e:
            print e
            raise tornado.web.HTTPError(404)
        else:
            results = {'results':len(ret)}
            ret = {"users":ret}
            ret.update(results)
            self.finish("users",ret)


    def post(self):
        try:
            stuid = self.get_argument('stuid')
        except Exception,e:
            raise tornado.web.HTTPError(404)

        try:
            stu = student.instance()
            ret = stu.getAllStuInfo()
        except Exception,e:
            raise tornado.webHTTPError(404)
        else:
            self.finish("users",ret)

class GetAllClassIDs(APIHandler):
    def get(self):
        try:
            stu = student.instance()
            ret = stu.getAllClassIDs()
            self.finish("classids",ret)
        except Exception ,e :
            raise tornado.web.HTTPError(404)

class GetQuanTypes(APIHandler):
    def get(self):
        try:
            stu = student.instance()
            types = stu.getQuanTypes()
            ret = []
            for key in types:
                ret.append({"id":key,"name":types[key]})
            self.finish("quantypes",ret)
        except Exception ,e :
            raise tornado.web.HTTPError(404)


#get stu name and id of some class
class GetStuNameIDsOnClassID(APIHandler):
    def get(self):
        stu = None
        try:
            stu = student.instance()
            classid = self.get_argument('classid')

            stuids = stu.getStuIdsofClass(classid)

            stu.logger.info(stuids)
            stuInfo = []
            for stuid in stuids:
                name = stu.getStuNameOnId(stuid)
                if name == "":
                    stu.logger.info(stuid+" is not fond in db")
                else:
                    stuInfo.append({"name":name,"id":stuid})

            self.finish("stunameids",stuInfo)
        except Exception ,e :
            stu.logger.warning(e)
            raise tornado.web.HTTPError(404)
#set quan infos
class SetQuanInfos(APIHandler):
    def get(self):
        pass
    def post(self):
        try:
            stu = student.instance()
            #infos = self.get_argument('quaninfos')
            #for k,v in self.request.arguments:
            quaninfos = json.loads(self.request.body)
            stu.logger.info(quaninfos)
            stu.logger.info(quaninfos['quaninfos'][0]['quan_reason'])
        except Exception,e:
            stu.logger.error(e)

class LoginHandler(APIHandler):
    def post(self):
        #get argument
        rdb = Student.instance()
        rdb.logger.info("login handler")
        user = self.get_argument('user',None)
        pwd = self.get_argument('pwd',None)
        remb = self.get_argument('remb','0')
        rdb.logger.info("in login handler user:"+user)
        rdb.logger.info("in login handler pwd:"+pwd)
        rdb.logger.info("in login handler rem:"+remb)
        #audit the user
        if user==None or pwd==None :
            self.finish(success=False)
            return

        else:#audit from db
            rdb.logger.info('go on check user in db')
            userInfo = rdb.getUserInfo(user)
            rdb.logger.info("user"+user)
            if userInfo:
                userInfo = json.loads(userInfo)
                rdb.logger.info("userinfo from db")
                rdb.logger.info(userInfo)
                if userInfo['pwd'] and userInfo['pwd'] == pwd:
                    rdb.logger.info("login success")
                    self.set_secure_cookie('remb',remb)
                    self.set_secure_cookie('user',user)
                    self.set_secure_cookie('role',userInfo['role'])
                    self.set_cookie('stuid',user)
                    self.set_cookie('type',userInfo['role'])
                    self.finish()
                    return

            else:
                rdb.logger.info("check failed in db")
                self.finish(success=False)
                return


    def get(self):

        stu = Student.instance()
        stu.logger.info("in login handler get ,render to login")
        self.render('../login.html')
        return

def main():
    stu = student.instance()
    stu.logger.info("hello from feed module")

if __name__ == "__main__":
    instance = feed()
    instance.logger.info("hello from feed module " )
    sys.exit(0)

