#!/usr/bin/env python
#-*- coding=utf-8 -*-

import redis
import zlib
import sys
import json
import datetime
import logging

from student_config import redisMasterHosts as redisHost
from student_config import LogConfiguration

USER_PREFIX="user:"
STU_PREFIX="student:"
STUS_PREFIX="students:"
TEAC_PREFIX="teacher:"
CLASS_PREFIX="class:"
ATTEND_PREFIX="attend:"

VACATION_PREFIX="vacation:"

QUAN_PREFIX="quan:"  #量化
QUAN_CLASS_PREFIX=QUAN_PREFIX+"class:"
QUAN_STU_PREFIX=QUAN_PREFIX+"student:"

NOTICES="notices"
NOTICE_PREFIX="notice:"
BULLENTINS="bulletins"


TABLE_STUNAME2ID = "stuname2id"
TABLE_STUID2NAME = "stuid2name"
TABLE_TEACNAME2ID = "teacname2id"
TABLE_TEACID2NAME = "teacid2name"

TABLE_QUANNAME2ID= "quanname2id"
TABLE_QUANID2NAME= "quanid2name"

TABLE_CLASSNAME2ID = "classname2id"
TABLE_CLASSID2NAME = "classid2name"

class Student(object):
    #global instance of DBop

    @staticmethod
    #def instance(self,redisHost={'host':'127.0.0.1','port':6379,'db':0}):
    def instance():
        """Returns a global `feed` instance."""

        if not hasattr(Student, "_instance"):
            Student._instance = Student()

        return Student._instance

    def __init__(self):

        logger = logging.getLogger("student")
        formatter = logging.Formatter('%(levelname)s %(filename)s  %(funcName)s %(lineno)s  %(message)s')
            #'%a, %d %b %Y %H:%M:%S',)
        file_handler = logging.FileHandler('./simp.log')
        file_handler.setFormatter(formatter)
        logger.setLevel(logging.INFO)
        logger.addHandler(file_handler)

        self.logger = logger

        #build a redis instance use connection pool
        self.logger.info("connect to redis host %s" % str(redisHost) )
        connPool = redis.ConnectionPool(host=redisHost['host'],
                port=redisHost['port'],db=redisHost['db'])
        self.redis = redis.Redis(connection_pool=connPool)
        self.logger.info("student module init done.")



    def dict2str(self,value):
        if type(value)== type(dict()):
            value = json.dumps(value)
        return value

    def str2dict(self,value):
        if type(value)==type(str()):
            value = json.loads(value)
        return value

    def today(self):
        #print datetime.date.today()
        return str(datetime.date.today())
    def getDB(self):
        return self.redis

    ### --section 1 : system user information --###
    # key=>value : user:[id]=>{"user":stuid,pwd":"","role":""}
    # type : string

    # return None if key not exist
    def getUserInfo(self,userid):# 获取某个用户的信息
        key = USER_PREFIX+unicode(userid)
        return self.redis.get(key)

    #return True if set done
    def setUserInfo(self,userid,value):
        key = USER_PREFIX+unicode(userid)
        value = self.dict2str(value)
        return self.redis.set(key,value)

    ### --section 2 : student information --###
    # key=>value: student:[id] => {'id':123,'name':zhang,'age':20,'sex':0,...,'other':''}
    # The info of stu can be grouped by type ,such as ,make name,id as normal group
    #return None if key not exist
    def getStuInfo(self,stuid) : #   获取某个学生的个人信息
        key = STU_PREFIX+unicode(stuid)
        return self.str2dict(self.redis.get(key))

    #return True if done
    def getStuNum(self):
        key = STU_PREFIX+u"20*"
        return len(self.redis.keys(key))

    def setStuInfo(self,value):
        #this  student is not in the db ,it is a new one
        stuid = unicode(value['stuid'])
        num = self.getStuNum()
        if not value.has_key('idc') or not value['idc'].startswith('stu'):
            num = str(num + 1)
            value['idc'] = u'stu' + num

        #self.setStuIdOnName(value['name'],value['stuid'])

        key = STU_PREFIX+stuid
        value = self.dict2str(value)
        return self.redis.set(key,value)

    def getAllStuInfo(self) :
        rets = []
        keys = self.redis.keys(STU_PREFIX+"20*")
        for key in keys:
            ret = self.redis.get(key)
            if ret != None:
                rets.append(json.loads(ret))
        return rets

    ### --section 3 : class information --###
    def getAllClassIDs(self):
        key= CLASS_PREFIX + "ids"
        return self.str2dict(self.redis.get(key))

    def setClassID(self,newClass):
        key= CLASS_PREFIX + "ids"
        classes = self.getAllClassIDs()
        if type(classes) == type([]) :
            classes.append(newClass)
        else:
            classes = []
            classes.append(newClass)
        classes = json.dumps(classes)
        self.redis.set(key,classes)
        return True

    def getAllClassNames(self):
        ids = self.getAllClassIDs()
        names=[]
        for i in ids:
            names.append(i['name'])
        return names

    # key=>value: class:[id] => {'id':1001,'quan':100,'num':45,'headTeacher':1022,'monitor':12345,'field':1001,'other':''}
# for now key=>value class:id=>{id,teacher,name,stuids=[]}
    #return None if key not exist
    def getClassInfo(self,classid): # 获取某个班级的信息
        key = CLASS_PREFIX+unicode(classid)
        return self.str2dict(self.redis.get(key))
    def setClassInfo(self,classid,value):
        key = CLASS_PREFIX+unicode(classid)
        value = self.dict2str(value)
        return self.redis.set(key,value)

    def getClassNameOnId(self,cid):
        cid = unicode(cid)
        ret = self.getClassInfo(cid)
        if ret != None:
            return ret['name']
        else:
            self.logger.warning('not find the cid : %s of class name' % cid)
            return ''

    # if in db ,return a int or 0
    def getClassIDbyName(self,name):
        name = unicode(name)
        ids = self.getAllClassIDs()
        for cid in ids:
            if name==cid['name']:
                return cid['id']
        self.logger.warning('not find class id of %s' % name)
        return 0

    def getClassStudentIDs(self,classid) :
        pass
    ### --section 4: student information --###
    # key=>vlaue ,teacher:[id] => {'name':"zhangsan",'id':10021213,'type':0~9,'phone':13021590177,'tel':'','office':402,'other':''}
    def getTeacInfo(self,teacid): # 获取某个老师的信息
        key = TEAC_PREFIX+unicode(teacid)
        return self.redis.get(key)

    def setTeacInfo(self,teacid,value):
        key = TEAC_PREFIX+unicode(teacid)
        value = self.dict2str(value)
        return self.redis.set(key,value)

    ### --section 5, vacation information --###
    # key=>value , vacation:students:[data] => {id1,id2,id3}
    #type set

    #return : if key not exist or a empty set , return a set whose len is 0
    # get student list who on vacation
    def getVacationStudentIds(self, date=None):
        if date == None:
            date = self.today()
        key = VACATION_PREFIX+date
        return self.redis.smembers(key)

    #date's format is such as 2013-10-21
    #return 0 if id is already in the set ,1 if id is a new one for the set
    def addVacationStudentId(self,stuid,date=None):
        if date == None:
            date = self.today()

        key = VACATION_PREFIX+date
        stuid = str(stuid).strip()
        return self.redis.sadd(key,stuid)

    #return False if id not in set
    def delVacationStudentId(self,stuid,date=None):
        if date == None:
            date = self.today()

        key = VACATION_PREFIX + date
        stuid = str(stuid).strip()
        return self.redis.srem(key,stuid)
    #key=>value : vacation:[date]:[stuid] => {'begin':'','end':'',reason':'','date':'time.time()','token':'','other':'','agreeby':{'p1~4':'','t1~4':''}}
    def getVacationInfo(self,stuid,date=None) :# 获取某个学生请假的详细信息

        if date == None:
            date = self.today()

        stuid = str(stuid).strip()
        key = VACATION_PREFIX+date+":"+id
        return self.redis.get(key)

    def setVacationInfo(self,stuid,info,date=None):
        if date == None:
            date = self.today()

        stuid = str(stuid).strip()
        key = VACATION_PREFIX+date+":"+stuid
        if not info:
            return False
        return self.redis.set(key,info)

    ### -- section 6, student quan -- ##
    def getStuQuanInfo(self,stuid):     #获取某个学生的量化信息
        pass
    ### -- section 7, class quan --###
    #key=>value ,quan:class:[id]=>{'discipline':40,'health':20,'activity':20,'dormitory',‘rank’：1}
    def getClassCurrentQuanInfo(self,classid): #获取某个班级的量化信息
        classid = unicode(classid)
        key = QUAN_CLASS_PREFIX+classid
        return self.redis.get(key)

    def setClassCurrentQuanInfo(self,classid,info):
        info = self.dict2str(info)
        classid = unicode(classid)
        key = QUAN_CLASS_PREFIX + classid
        return self.redis.set(key,info)
    #key=>value
    #quan:class:[classid]:[week]=> {'discipline':-10,'health':20,'activity':20,'dormitory':-2,'opDisc':-2,'opHeal':2,'opActi':5,'opDorm':1,'rank':8}
    def getClassWeekQuanInfo(self,classid,week):
        if week<1 or week> 50 :
            return None
        classid = unicode(classid)
        key = QUAN_CLASS_PREFIX + classid + ":"+unicode(week)
        return self.redis.get(key)

    def setClassWeekQuanInfo(self,classid,week,info) :
        if week<1 or week> 53 :
            return None
        classid = unicode(classid)
        key = QUAN_CLASS_PREFIX + classid + ":"+unicode(week)

        info = self.dict2str(info)
        return self.redis.set(key,info)

    def setQuanType(self,quanid,qname):
        key = QUAN_PREFIX + 'type:' + str(quanid)
        value={'id':quanid,'name':qname}
        value = json.dumps(value)
        return self.redis.set(key,value)

    def getQuanTypes(self):
        key = QUAN_PREFIX + 'type:*'
        keys = self.redis.keys(key)
        ret=[]
        for k in keys :
            v = self.redis.get(k)
            v = self.str2dict(v)
            ret.append(v)
        return ret
        #return self.redis.hgetall(key)
    def getQuanNameOnId(self,qid):
        rets = self.getQuanTypes()
        qid = unicode(qid)
        for r in rets:
            if r['id'] == qid:
                return r['name']
        return ''

    #return a list, get quan info of classid
    def getQuanInfo(self,classid):
        key = QUAN_PREFIX+CLASS_PREFIX+unicode(classid)
        ret = self.redis.lrange(key,0,-1)
        tmp=[]
        for r in ret:
            r = json.loads(r)
            tmp.append(r)
        return tmp


    def setQuanInfo(self,classid,qinfo):
        key = QUAN_PREFIX+CLASS_PREFIX+unicode(classid)
        qinfo = self.dict2str(qinfo)
        return self.redis.lpush(key,qinfo)

    #get all classes of quaninfos
    def getAllQuanInfos(self):
        key = QUAN_PREFIX+CLASS_PREFIX+'20*'
        ks = self.redis.keys(key)
        qinfos=[]
        for k in ks:
            v = self.redis.lrange(k,0,-1)
            tmp = []
            for e in v:
                e = json.loads(e)
                tmp.append(e)
            qinfos += tmp
        return qinfos

    def getQuanIdOnName(self,qname):
        qname = unicode(qname)
        if self.redis.hexists(TABLE_QUANNAME2ID,qname):
            return int(self.redis.hget(TABLE_QUANNAME2ID,qname))
        return 0

    def setQuanIdOnName(self,qname,qid):
        return self.redis.hset(TABLE_QUANNAME2ID,unicode(qname),unicode(qid))

    def getClassIdOnName(self,cname):
        cname = unicode(cname)
        if self.redis.hexists(TABLE_CLASSNAME2ID,cname):
            return self.redis.hget(TABLE_CLASSNAME2ID,cname)
        return 0

    def setClassIdOnName(self,cname,cid):
        return self.redis.hset(TABLE_QUANNAME2ID,unicode(cname),unicode(cid))


    #return set of stu ids
    def getStuIdsofClass(self,classid) : #获取某个班级的所有学生的学号
        classid = unicode(classid)
        key = STUS_PREFIX + CLASS_PREFIX + classid
        stus = self.redis.smembers(key)
        return list(stus)


    def setStuIDofClass(self,stuid,classid):
        classid = unicode(classid)
        key = STUS_PREFIX + CLASS_PREFIX + classid
        stuid = unicode(stuid)
        return self.redis.sadd(key,stuid)

    # type:hash
    #table name is stu_name2id
    def getStuIdOnName(self,name): #获取某个学生的学号
        name = unicode(name)
        if self.redis.hexists(TABLE_STUNAME2ID,name):
            return self.redis.hget(TABLE_STUNAME2ID,name)
        return ""

    def setStuIdOnName(self,name,stuid):
        return self.redis.hset(TABLE_STUNAME2ID,unicode(name),unicode(stuid))

    def getStuNameOnId(self,stuid):
        stuid = unicode(stuid)
        ret = self.getStuInfo(stuid)
        if ret!=None:
            name = ret['name']
            return name
        else:
            self.logger.warning('not find stu name of stuid :%s' % stuid)
            return ''


    #type :hash
    #table name is teac_name2id
    def getTeacIdOnName(self,tname): #获取某个老师的工号
        return self.redis.hget(TABLE_TEAC_NAME2ID,unicode(tname))
    def setTeacIDOnName(self,tname,tid):
        self.redis.hset(TABLE_TEAC_NAME2ID,unicode(tname),unicode(tid))

    #type: order set, score= time
    #key=>value
    ##notices=[{"time":''，“content”：“”，“Title”：“”,'other':''}{}{}{}{}]
    #this function may have a bug , end = 2**31 means ,the last year of earth is 2038
    '''
    def getNotices(self,begin=0,end=2**31,start=None,num=None,order=0): #获取某个时间段的通知
        key = NOTICES
        if order == 0:
            return self.redis.zrevrangebyscore(key,begin,end,start,num)
        else:
            return self.redis.zrangebyscore(key,begin,end,start,num)
        pass
    '''
    def getBullentins(self,begin=0,end=2**31,start=None,num=None,order=0): #获取某个时间段的公告
        key = BULLENTINS
        if order == 0:
            return self.redis.zrevrangebyscore(key,begin,end,start,num)
        else:
            return self.redis.zrangebyscore(key,begin,end,start,num)

    def setNotice(self,info):
        key = NOTICES
        value = self.dict2str(info)
        return self.redis.lpush(key,value)

    def getNotices(self,fr=0,to=-1):
        key = NOTICES
        value = self.str2dict(self.redis.lrange(key,0,-1))
        return value

    def getNoticeCount(self):
        key = NOTICES
        count = self.redis.llen(key)
        return count

    def setAttendInfo(self,day,info):
        key = ATTEND_PREFIX + str(day)
        value = self.dict2str(info)
        return self.redis.lpush(key,value)

    def getAttendInfo(self,day):
        key = ATTEND_PREFIX + str(day)
        self.logger.info(key)
        value = self.str2dict(self.redis.lrange(key,0,-1))
        return value



def main():
    #dbOp = DBOperation()
    rdb = Student.instance()
    print rdb.today()
    stuid="201305300102"
    ret = rdb.getAllStuInfo()
    print ret

if __name__=="__main__" :
    main()
