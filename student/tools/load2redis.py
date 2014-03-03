#!/usr/bin/python
# -*- coding:utf-8 -*-
import redis
import json
import sys
sys.path.append("../")
import student

def load2Redis(fileName):
    rdb = student.Student.instance()
    stuinfo={}
    with open(fileName,'r') as f:
        for line in f:
            stuinfo={}
            info = line.split()
            if len(info)==13:
                if info[0] == '0':
                    print info
                    continue
                stuinfo['stuid'] = info[0]
                stuinfo['examid'] = info[1]
                stuinfo['name'] = info[2]
                stuinfo['gender'] = info[3]
                stuinfo['identify'] = info[4]
                stuinfo['birthday'] = info[5]
                stuinfo['type'] = info[6]
                stuinfo['address'] = info[7]
                stuinfo['homephone'] = info[8]
                stuinfo['other'] = info[9]
                stuinfo['class'] = "2013级"+info[10]
                stuinfo['teacher'] = info[11]
                stuinfo['field'] = info[12]
            else:
                continue


            rdb.setStuInfo(stuinfo['stuid'],stuinfo)
            rdb.logger.info(stuinfo)




def main():
    fileName="students-13.txt"
    load2Redis(fileName)

if __name__=="__main__":
    main()
