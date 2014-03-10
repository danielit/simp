#!/usr/bin/env python
""" Feed module """

import sys
import time
import logging
import logging.handlers
import json
import tornado

from datetime import *

from handler import APIHandler,APISecureHandler
from student import Student
from student_config import firstDayOfTerm as firstDayTerm

from tornado.escape import json_encode
# constant definitions

def getDateOfNWeek(nWeek):
    global firstDayTerm
    nWeek = int(nWeek)
    firstDay=lastDay=datetime.today()
    if nWeek <= 0:
        today = datetime.today()
        firstDay = today - timedelta(today.weekday())
        lastDay = firstDay + timedelta(6)
    else:
        firstDayOfTerm = datetime.strptime(firstDayTerm,'%Y/%m/%d')
        firstDay = firstDayOfTerm + timedelta((int(nWeek) - 1) * 7)
        lastDay = firstDay + timedelta(6)

    return (firstDay,lastDay)

def getQuanInfoBetween(begin,end):
    stu = Student.instance()
    ret = []
    qinfos = stu.getAllQuanInfos()
    idc=0
    for qi in qinfos:
        date = datetime.strptime(str(qi['quan_date']),'%Y/%m/%d')
        if begin<= date and end>= date:
            stu.logger.info(qi)
            try:
                qi['student'] = stu.getStuNameOnId(qi['student'])
                qi['quan_type'] = stu.getQuanNameOnId(qi['quan_type'])
                qi['class'] = stu.getClassNameOnId(qi['class'])
            except Exception,e:
                stu.logger.error(e)
                continue

            idc = idc + 1
            qi['idc'] = idc
            ret.append(qi)
    return ret

class GetAllStuInfo(APIHandler):
    def get(self):

        classid = self.get_argument('cid','')

        try:
            stu = Student.instance()
            ret = stu.getAllStuInfo()
        except Exception,e:
            print e
            raise tornado.web.HTTPError(404)
        else:
            cid2cname = {}
            stuinfo=[]
            idc = 0
            for r in ret:
                cid = r['class']
                if classid != '' and classid != cid:
                    continue
                idc = idc + 1
                r['idc'] = idc
                if not cid2cname.has_key(cid):
                    try:
                        cid2cname[cid] = stu.getClassNameOnId(cid)
                    except Exception,e:
                        stu.logger.error(e)
                        continue

                r['class'] = cid2cname[cid]
                stuinfo.append(r)

            self.finish("data",stuinfo)
            return

        self.finish(success=False)


    def post(self):
        try:
            stuid = self.get_argument('stuid')
        except Exception,e:
            raise tornado.web.HTTPError(404)

        try:
            stu = Student.instance()
            ret = stu.getAllStuInfo()
        except Exception,e:
            raise tornado.webHTTPError(404)
        else:
            self.finish("users",ret)

class GetAllClassIDs(APIHandler):
    def get(self):
        try:
            stu = Student.instance()
            stu.logger.info("in getAllClassIDs")
            ret = stu.getAllClassIDs()
            self.finish("classids",ret)
        except Exception ,e :
            raise tornado.web.HTTPError(404)

class GetQuanTypesHandler(APIHandler):
    def get(self):
        try:
            stu = Student.instance()
            stu.logger.info('in GetQuanTypesHandler')
            types = stu.getQuanTypes()
            self.finish("quantypes",types)
        except Exception ,e :
            raise tornado.web.HTTPError(404)


#get stu name and id of some class
class GetStuNameIDsOnClassID(APIHandler):
    def get(self):
        stu = None
        try:
            stu = Student.instance()
            classid = self.get_argument('classid')

            stuids = stu.getStuIdsofClass(classid)

            stu.logger.info(stuids)
            stuInfo = []
            for stuid in stuids:
                si = stu.getStuInfo(stuid)
                if si == None:
                    continue
                name = si['name']
                if name == "":
                    stu.logger.info(stuid+" is not fond in db")
                else:
                    stuInfo.append({"name":name,"id":stuid})

            self.finish("stunameids",stuInfo)
        except Exception ,e :
            stu.logger.warning(e)
            raise tornado.web.HTTPError(404)

class GetQuanInfosHandler(APIHandler):
    def get(self):
        stu = Student.instance()
        begin = self.get_argument('begin','0')
        stu.logger.info(begin)
        end = self.get_argument('end','0')
        stu.logger.info(end)
        if begin=='0' and end=='0':
            stu.logger.info('begin =0 and end =0,so return the lastest 7 days quaninfo')
            #get the last week quan info
            end = datetime.today()
            begin = end - timedelta(6)
        else:
            begin = datetime.strptime(begin,'%Y/%m/%d')
            end = datetime.strptime(end,'%Y/%m/%d')

        ret = getQuanInfoBetween(begin,end)
        self.finish('quan',ret)
'''
        ret = []
        qinfos = stu.getAllQuanInfos()
        idc=0
        for qi in qinfos:
            date = datetime.strptime(str(qi['quan_date']),'%Y/%m/%d')
            if begin<= date and end>= date:
                stu.logger.info(qi)
                try:
                    qi['student'] = stu.getStuNameOnId(qi['student'])
                    qi['quan_type'] = stu.getQuanNameOnId(qi['quan_type'])
                    qi['class'] = stu.getClassNameOnId(qi['class'])
                except Exception,e:
                    stu.logger.error(e)
                    continue

                idc = idc + 1
                qi['idc'] = idc
                ret.append(qi)
            #cmp the time between begin and end
        self.finish('quan',ret)
'''

#set quan infos
class AddQuanInfosHandler(APIHandler):
    def get(self):
        pass
    def post(self):
        try:
            stu = Student.instance()
            #infos = self.get_argument('quaninfos')
            #for k,v in self.request.arguments:
            quaninfos = json.loads(self.request.body)
            qis = quaninfos['quaninfos']
            if type(qis)==type({}):
                qis = [qis]
            for qi in qis:
                cn = qi['class']
                cid = stu.getClassIDbyName(cn)
                stu.logger.info(cid)
                stu.logger.info(cn)
                if cid == 0:
                    stu.logger.error('cant find class in db' + cn)
                    self.finish(success=False)
                    continue
                sn = qi['student']
                sid = stu.getStuIdOnName(sn)
                stu.logger.info(sn)
                stu.logger.info(sid)
                if sid == 0:
                    stu.logger.error('cant find student in db'+sn)
                    self.finish(success=False)
                    continue
                qn = qi['quan_type']
                qid = stu.getQuanIdOnName(qn)
                if qid == 0:
                    stu.logger.error('cant find quan type in db'+qn)
                    self.finish(success=False)
                    continue

                qi['class'] = int(cid)
                qi['student'] = int(sid)
                qi['quan_type'] = int(qid)

                stu.setQuanInfo(cid,qi)
            stu.logger.info(stu.getQuanInfo(cid))
        except Exception,e:
            stu.logger.error(e)

class LoginHandler(APIHandler):
    def post(self):
        #get argument
        rdb = Student.instance()
        rdb.logger.info("login handler")
        user = self.get_argument('user',None)
        pwd = self.get_argument('pwd',None)
        remb = self.get_argument('remb','0')
        #audit the user
        if user==None or pwd==None :
            self.finish(success=False)
            return

        else:#audit from db
            rdb.logger.info('go on check user in db')
            userInfo = rdb.getUserInfo(user)
            rdb.logger.info("user:"+user)
            if userInfo:
                userInfo = json.loads(userInfo)
                rdb.logger.info("userinfo from db")
                rdb.logger.info(userInfo)
                if userInfo['pwd'] and userInfo['pwd'] == pwd:
                    rdb.logger.info("login success")
                    self.set_secure_cookie('remb',remb)
                    self.set_secure_cookie('user',user)
                    self.set_secure_cookie('role',userInfo['role'])
                    self.set_cookie('uid',user)
                    self.set_cookie('type',userInfo['role'])
                    self.finish()
                    return
        # audit login from db failed
        rdb.logger.info("check failed in db")
        self.finish(success=False)
        return

    def get(self):

        stu = Student.instance()
        stu.logger.info("in login handler get ,render to login")
        self.render('../login.html')
        return

class GetQuanSummaryOfWeekHandler(APIHandler):
#computer rank base on key
    def compRank(self,data,key,value):
        stu = Student.instance()

        tmp=[]
        for d in data.values():
            tmp.append(float(d[key]))
        tmp = list(set(tmp))
        tmp.sort(reverse=True)
        for d in data.values():
            d[value] = tmp.index(float(d[key])) + 1



    def get(self):
        nWeek = self.get_argument('week',0)
        if nWeek=='':
            nWeek = 0
        begin,end = getDateOfNWeek(nWeek)
        qinfos = getQuanInfoBetween(begin,end)

        stu = Student.instance()
        #statics
        #init the static table
        sTable={}
        cnames = stu.getAllClassNames()
        for cname in cnames:
            sTable[cname] = {'class':'','disp_score':0,'disp_quan':30,'disp_rank':0,\
                    'heal_score':0,'heal_quan':20,'heal_rank':0,\
                    'domi_score':0,'domi_quan':40,'domi_rank':0,\
                    'acti_score':0,'acti_quan':10,'acti_rank':0,\
                    'total':100,'rank:':0}

            sTable[cname]['class'] = cname


        for qi in qinfos:
            cname = qi['class']
            if not sTable.has_key(cname):
                stu.logger.error('There is no class has a name :' + str(cname))
                self.finish(success=False)
                return
            qtype = stu.getQuanIdOnName(qi['quan_type'])
            if qtype==1001: # discipline
                sTable[cname]['disp_score'] += qi['quan_score']
                sTable[cname]['disp_quan'] += qi['quan_score'] *0.3
                pass
            elif qtype==1002: #health
                sTable[cname]['heal_score'] += qi['quan_score']
                sTable[cname]['heal_quan'] += qi['quan_score'] *0.2
                pass
            elif qtype==1003: # domi
                sTable[cname]['domi_score'] += qi['quan_score']
                sTable[cname]['domi_quan'] += qi['quan_score'] *0.4
                pass
            elif qtype==1004: #activity
                sTable[cname]['acti_score'] += qi['quan_score']
                sTable[cname]['acti_quan'] += qi['quan_score'] *0.1
            else:
                stu.logger.error(qtype)

        for c in sTable.values() :
            c['total'] = float(c['disp_quan']) + float(c['heal_quan']) + float(c['domi_quan']) + float(c['acti_quan'])

        self.compRank(sTable,'disp_quan','disp_rank')
        self.compRank(sTable,'heal_quan','heal_rank')
        self.compRank(sTable,'domi_quan','domi_rank')
        self.compRank(sTable,'acti_quan','acti_rank')
        self.compRank(sTable,'total','rank')

        qWeekInfos = []
        idc=0
        for line in sTable.values():
            idc = idc + 1
            line['idc'] = idc
            qWeekInfos.append(line)

        self.finish('classquanweek',qWeekInfos)

def main():
    stu = Student.instance()
    stu.logger.info("hello from feed module")
    ret = getDayOfNWeek(2)
    print ret

if __name__ == "__main__":
    instance = feed()
    instance.logger.info("hello from feed module " )
    sys.exit(0)

