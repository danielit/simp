#!/usr/bin/python
# -*- encoding: utf-8 -*-
import redis
import json
import sys
sys.path.append("../")
from student import Student


def setQuanIdOnName():
    stu = Student.instance()
    r  = stu.getDB()
    types = stu.getQuanTypes()
    for t in types:
        stu.setQuanIdOnName(t['name'],t['id'])

setQuanIdOnName()
