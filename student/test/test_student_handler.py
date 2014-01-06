#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys

sys.path.append('..')
sys.path.append('../..')

from student import *
from student_handler import *

classids = [ \
        {'name':'2012级计算机应用技术一班','id':'2012000001'}, \
        {'name':'2012级计算机应用技术二班','id':'2012000002'}, \
        {'name':'2012级电子信息工程技术班','id':'2012000101'}, \
        {'name':'2012级艺术设计班','id':'2012000201'}, \
        {'name':'2012级物流管理班','id':'2012000301'}, \
        {'name':'2012级图形图像设计班','id':'2012000401'}, \
        {'name':'2013级计算机应用技术一班','id':'2013000001'}, \
        {'name':'2013级计算机应用技术二班','id':'2013000002'}, \
        {'name':'2013级电子信息工程技术班','id':'2013000101'}, \
        {'name':'2013级物流管理班','id':'2013000301'}, \
        {'name':'2013级图像-艺术设计班','id':'2013000501'}]
stunameids = {
        '1000':'AAAA',
        '1001':'BBBB',
        '1002':'CCCC',
        '1003':'DDDD',
        '1004':'EEEE',
        '1005':'FFFF',
        '1006':'GGGG',
        '1007':'HHHH',
        '1008':'IIII',
        '1009':'JJJJ'
        }
quantypes={
        '1001':'纪检',
        '1003':'宿舍',
        '1005':'卫生',
        '1007':'活动',
        '9001':'其他'
        }
def addClassIDs():
    stu = student.instance()

    for classid in classids:
        stu.setClassID(classid)

def addStu2Class(classid):
    stu = student.instance()
    for i in range(1000,1010):
        ret = stu.setStuIDofClass(i,classid)
        if not ret:
            print "Error"
            return ret

def getStuofClass(classid):
    stu = student.instance()
    return stu.getStuIdsofClass(classid)


if __name__ == "__main__":

    stu = student.instance()
    for key in quantypes.keys():
        stu.setQuanType(key,quantypes[key])
    print stu.getQuanTypes()
