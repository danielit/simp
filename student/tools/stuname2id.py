#!/usr/bin/python
# -*- encoding: utf-8 -*-
import redis
import json
import sys
sys.path.append("../")
from student import Student

def setStuIDOnName():
    stu = Student.instance()
    r = stu.getDB()
    sks = r.keys('student:20*')
    for sk in sks:
        sid = sk[8:]
        si = stu.getStuInfo(sid)
        sn = si['name']
        stu.setStuIdOnName(sn,sid)
        print sid,sn

setStuIDOnName()
