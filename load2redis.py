#!/usr/bin/python
# -*- coding:utf-8 -*-
import redis
import json

def load2Redis(fileName):
    r = redis.Redis(host="127.0.0.1",port=6379,db=0)
    stuinfo={}
    num = 201305300100
    with open(fileName,'r') as f:
        for line in f:
            stuinfo={}
            info = line.split()
            if len(info)==12:
                num = num+1
                key = "student:" + str(num)
                stuinfo['stuid'] = str(num)
                stuinfo['examid'] = info[1]
                stuinfo['name'] = info[2]
                stuinfo['gender'] = info[3]
                stuinfo['identify'] = info[4]
                stuinfo['birthday'] = info[5]
                stuinfo['type'] = info[6]
                stuinfo['address'] = info[7]
                stuinfo['homephone'] = info[8]
                stuinfo['field'] = info[9]
                stuinfo['class'] = info[10]
                stuinfo['headteac'] = info[11]

                stuinfo = json.dumps(stuinfo)
                r.set(key,stuinfo)


    #print stuinfo['name'],stuinfo['address']


def main():
    fileName="students"
    load2Redis(fileName)

if __name__=="__main__":
    main()
