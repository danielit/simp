#!/usr/bin/env python
""" Feed module """

import sys
import time
import logging
import logging.handlers
import json

from handler import APIHandler
from student import student

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

def main():
    stu = student.instance()
    stu.logger.info("hello from feed module")

if __name__ == "__main__":
    instance = feed()
    instance.logger.info("hello from feed module " )
    sys.exit(0)

