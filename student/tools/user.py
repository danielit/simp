#!/usr/bin/python
# -*- coding:utf-8 -*-
import redis
import json
import sys
sys.path.append("../")
from student import Student

def addUser():
    stu = Student.instance()
    r = stu.getDB()
    stuKeys = r.keys("student:*")
    for key in stuKeys:
        value={}
        stuInfo = r.get(key)
        #stuid = key.replace('student:','')
        if stuInfo!= None:
            stuInfo = json.loads(stuInfo)
            if stuInfo['stuid']=='0':
                continue
            else:
                value['user'] = stuInfo['stuid']
                value['role'] = '80000' #student
                value['pwd'] = stuInfo['identify'][-8:]
                stu.setUserInfo(stuInfo['stuid'],value)
                print stuInfo['stuid'],value

addUser()
