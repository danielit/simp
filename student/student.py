#!/usr/bin/env python
#-*- coding=utf-8 -*-

import redis
import zlib
import sys
import json
import datetime
import logging
import uuid

from student_config import redisMasterHosts as redisHost
from student_config import LogConfiguration

USER_PREFIX="user:"
STU_PREFIX="student:"
STUS_PREFIX="students:"
TEAC_PREFIX="teacher:"
CLASS_PREFIX="class:"
ATTEND_PREFIX="attend:"
REWARD_PREFIX="reward:"

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
        formatter = logging.Formatter('%(name)s %(asctime)s %(levelname)s %(filename)s %(funcName)s %(lineno)s   %(message)s')
            #'%a, %d %b %Y %H:%M:%S',)
        file_handler = logging.FileHandler('/opt/simp/log/simp.log')
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

    def strInArray2dict(self,values):
        ret = []
        if type(values)==type([]):
            for v in values:
                ret.append(self.str2dict(v))
        return ret


    def today(self):
        #print datetime.date.today()
        return str(datetime.date.today())
    def getDB(self):
        return self.redis

    def getuuid(self):
        return str(uuid.uuid4())

    ### --section 1 : system user information --###
    # key=>value : user:[id]=>{"user":stuid,pwd":"","role":""}
    # type : string

    # return None if key not exist

    def getUserInfo(self,userid):# 获取某个用户的信息
        key = USER_PREFIX+unicode(userid)
        return self.redis.get(key)

    def getAllUserInfo(self):
        key = USER_PREFIX + '*'
        keys = self.redis.keys(key)
        ret = []
        for k in keys:
            ui = self.redis.get(k)
            ui = json.loads(ui)
            ret.append(ui)
        return ret

    #return True if set done
#check if user is exist in db,if is ,rewrite it
    def setUserInfo(self,value):
        key = USER_PREFIX+unicode(value['user'])
        value = self.dict2str(value)
        return self.redis.set(key,value)

    def deleteUserInfo(self,user):
        key = USER_PREFIX+unicode(user)
        return self.redis.delete(key)

    def getUserCount(self):
        key = USER_PREFIX + '*'
        count = len(self.redis.keys(key))
        return count


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
        cls   = unicode(value['class'])
        key = STU_PREFIX+stuid
        value = self.dict2str(value)
        #try:
        self.setStuIDofClass(stuid,cls)
        #except Exception, e:
        #    print e
        return self.redis.set(key,value)

    def deleteStuInfo(self,stuid):
        key = STU_PREFIX+stuid
        return self.redis.delete(key)

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
        classid = unicode(classid)
        self.setClassIdOnName(value['name'],classid)

        key = CLASS_PREFIX+classid
        value = self.dict2str(value)
        self.redis.set(key,value)

    def getClassNameOnId(self,cid):
        cid = unicode(cid)
        if self.redis.hexists(TABLE_CLASSID2NAME,cid):
            cn = self.redis.hget(TABLE_CLASSID2NAME,cid)
            return unicode(cn)
        return unicode(0)

    '''
    def getClassNameOnId(self,cid):
        cid = unicode(cid)
        ret = self.getClassInfo(cid)
        if ret != None:
            return ret['name']
        else:
            self.logger.warning('not find the cid : %s of class name' % cid)
            return ''
    '''
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
        return ret
        '''
        tmp=[]
        for r in ret:
            r = json.loads(r)
            tmp.append(r)
        return tmp
        '''


    def setQuanInfo(self,classid,qinfo):
        key = QUAN_PREFIX+CLASS_PREFIX+unicode(classid)
        qinfo = self.dict2str(qinfo)
        return self.redis.lpush(key,qinfo)

    def deleteQuanInfo(self,cid,qi):
        key = QUAN_PREFIX+CLASS_PREFIX+unicode(cid)
        return self.redis.lrem(key,qi)

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

    def setQuanNameOnId(self,qname,qid):
        return self.redis.hset(TABLE_QUANID2NAME,unicode(qname),unicode(qid))

    def getQuanNameOnId(self,qid):
        qid = unicode(qid)
        if self.redis.hexists(TABLE_QUANID2NAME,qid):
            return self.redis.hget(TABLE_QUANID2NAME,qid)
        return ''

    def getClassIdOnName(self,cname):
        cname = unicode(cname)
        if self.redis.hexists(TABLE_CLASSNAME2ID,cname):
            cid = self.redis.hget(TABLE_CLASSNAME2ID,cname)
            return unicode(cid)
        return unicode(0)

    def setClassIdOnName(self,cname,cid):
        self.redis.hset(TABLE_CLASSNAME2ID,unicode(cname),unicode(cid))
        self.redis.hset(TABLE_CLASSID2NAME,unicode(cid),unicode(cname))
        return True

    def setClassNameOnId(self,cname,cid):
        self.redis.hset(TABLE_CLASSNAME2ID,unicode(cname),unicode(cid))
        self.redis.hset(TABLE_CLASSID2NAME,unicode(cid),unicode(cname))
        return True



    #return set of stu ids
    def getStuIdsofClass(self,classid) : #获取某个班级的所有学生的学号
        classid = unicode(classid)
        key = STUS_PREFIX + CLASS_PREFIX + classid
        stus = self.redis.smembers(key)
        return list(stus)


    def setStuIDofClass(self,stuid,classid):
        ret = None
        classid = unicode(classid)
        stuid = unicode(stuid)
        key = STUS_PREFIX + CLASS_PREFIX + classid
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
        #print ret
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

    def deleteNotice(self,value):
        key = NOTICES
        return self.redis.lrem(key,value)

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
        value = self.str2dict(self.redis.lrange(key,0,-1))
        return value
    def deleteAttendInfo(self,day,ai):
        key = ATTEND_PREFIX + str(day)
        return self.redis.lrem(key,ai)

    def setRewardInfo(self,sid,info):
        key = REWARD_PREFIX+str(sid)
        value = self.dict2str(info)
        return self.redis.lpush(key,value)

    def getRewardInfo(self,sid):
        key = REWARD_PREFIX + str(sid)
        values = self.redis.lrange(key,0,-1)
        return values
        '''
        ret = []
        for v in values:
            ret.append(self.str2dict(v))
        return ret

        '''
    def getRewardInfo2(self,sid):
        key = REWARD_PREFIX + str(sid)
        values = self.redis.lrange(key,0,-1)
        ret = []
        for v in values:
            ret.append(self.str2dict(v))
        return ret



    def deleteRewardInfo(self,sid,info):
        key = REWARD_PREFIX + str(sid)
        return self.redis.lrem(key,info)

    def getAllRewardInfo(self):
        keyP = REWARD_PREFIX + '*'
        keys = self.redis.keys(keyP)
        ret = []
        for key in keys:
            values = self.redis.lrange(key,0,-1)
            for v in values:
                ret.append(v)
        return ret


    def getAllRewardInfo2(self):
        keyP = REWARD_PREFIX + '*'
        keys = self.redis.keys(keyP)
        '''
        ret = {}
        for key in keys:
            values = self.lrange(key,0,-1)
            ret[key[7:]] = self.strInArray2dict(values)
        '''
        ret = []
        for key in keys:
            values = self.redis.lrange(key,0,-1)
            for v in values:
                ret.append(self.str2dict(v))
        return ret

def main():
    #dbOp = DBOperation()
    rdb = Student.instance()
    print rdb.today()
    stuid="201305300102"
    ret = rdb.getAllStuInfo()
    print ret

if __name__=="__main__" :
    main()
