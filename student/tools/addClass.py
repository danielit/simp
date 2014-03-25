#!/usr/bin/python
# -*- encoding: utf-8 -*-
import redis
import json
import sys
sys.path.append("../")
from student import Student


def initClass():

    stu = Student.instance()

    cls = stu.getAllClassIDs()
    for c in cls:
        ci={}
        ci['id'] = c['id']
        ci['name'] = c['name']
        ci['teacher']=''
        ci['stuids']=[]
        stu.setClassInfo(c['id'],ci)

def setStuInfo2Class():

    stu = Student.instance()
    redis = stu.getDB()
    sks = redis.keys('student:20*')
    for sk in sks :
        stuid = sk[8:]
        try:
            si = stu.getStuInfo(stuid)
        except Exception,e:
            continue
        if si==None:
            print "student None:",stuid
            continue
        cid = si['class']
        ct = si['teacher']
        try:
            ci = stu.getClassInfo(cid)
        except Exception,e:
            print e
            continue
        if ci==None:
            print cid
            continue
        ci['teacher'] = ct
        ci['stuids'].append(stuid)
        #stu.setClassInfo(cid,ci)
        stu.setStuIDofClass(stuid,cid)

initClass()
setStuInfo2Class()


