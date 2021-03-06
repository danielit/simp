#!/usr/bin/env python
#-*- coding=utf-8 -*-
""" Feed module """

import sys
import time
import logging
import logging.handlers
import json
import tornado
import xlwt

from datetime import *

from handler import APIHandler,APISecureHandler
from student import Student
from student_config import firstDayOfTerm as firstDayTerm
from student_config import studentStatics
from student_config import init_statics
from student_config import comp_statics
from student_config import cstuinfo,cattendinfo,cquaninfo,cquanweekinfo
from student_config import adminStuTreeList, teacStuTreeList, stuStuTreeList



from news_template import NEWS_TEMPLATE

from uploadfiles import *

from tornado.escape import json_encode
# constant definitions
def genxls(filename,cols,data):
    wb = xlwt.Workbook() # a new workbook
    s1 = wb.add_sheet('sheet1',cell_overwrite_ok=True) # a new sheet which named 'sheet1'

    if data!=None and len(data)==0:
        wb.save(filename)
        return True

    if data!=None and len(cols)<=len(data[0]) :
        try:
            if os.path.exists(filename):
                os.remove(filename)
                print 'remove %s success' % filename
            #wb = xlwt.Workbook() # a new workbook
            #s1 = wb.add_sheet('sheet1',cell_overwrite_ok=True) # a new sheet which named 'sheet1'
            cns = []
            for c in cols:
                if data[0].has_key(c):
                    cns.append(c)
            for i in range(0,len(cns)):
                s1.write(0,i,cns[i]) # write the title at the first line

            rnum = len(data)
            cnum = len(cns)
            for i in range(0,rnum):
                for j in range(0,cnum):
                    s1.write(i+1,j,data[i][cns[j]])

            wb.save(filename)
        except Exception,e:
            print e
            return False
        return True
    else:
        return False

def doPage(obj,ret) :
    page = int(obj.get_argument('page',0))
    start = int(obj.get_argument('start',0))
    limit = int(obj.get_argument('limit',0))
    if page == 0:
        start = 0
        end = len(ret)
    else:
        end = start + limit
    return ret[start:end]

def isStudent(obj):
    role = unicode(obj.get_secure_cookie('role'))
    return role==unicode('学生')

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
    stu.logger.info("begin:"+str(begin)+" end:"+str(end))
    ret = []
    qinfos = stu.getAllQuanInfos()
    for qi in qinfos:
        date = datetime.strptime(str(qi['quan_date']),'%Y/%m/%d')
        if begin<= date and end>= date:
            stu.logger.info('quaninfo:'+str(qi))
            try:
                qi['student'] = stu.getStuNameOnId(qi['student'])
                qi['quan_type']= stu.getQuanNameOnId(qi['quan_type']).decode('utf-8')
                qi['class'] = stu.getClassNameOnId(qi['class'])
                stu.logger.info('qinfo : %s' % str(qi))
            except Exception,e:
                stu.logger.error(e)
                continue

            ret.append(qi)
    return ret

class SetStuInfoHandler(APIHandler):
    def get(self):
        pass
    @tornado.web.authenticated
    def post(self):
        try:
            if isStudent(self):
                self.finish(success=False,notification='权限不足,无法修改数据')
                return
            stu = Student.instance()
            stuinfo = json.loads(self.request.body)
            if type(stuinfo)==type({}) and stuinfo.has_key('data') :
                sis = stuinfo['data']
                if type(sis)==type({}):
                    sis = [sis]
                for si in sis:
                    ret = stu.getStuInfo(si['stuid'])
                    if si.has_key('idc') and not si['idc'].startswith('stu_'):
                        si['idc'] = u'stu_' +stu.getuuid()
                    if not si.has_key('idc'):
                        si['idc'] = u'stu_' +stu.getuuid()

                    if si.has_key('class') and not si['class'].isdigit() :
                        si['class'] = stu.getClassIdOnName(si['class'])
                    stu.setStuIdOnName(si['name'],si['stuid'])
                    stu.logger.info('set stu id(%s) on name(%s) ' % (si['stuid'],si['name']))
                    stu.setStuIDofClass(si['stuid'],si['class'])
                    stu.logger.info('set stu id(%s) on class id (%s) ' % (si['stuid'],si['class']))

                    stu.logger.info('set stu info %s' % str(si))
                    stu.setStuInfo(si)
        except Exception,e:
            stu.logger.error(e)
            self.finish(success=False)
            return

        self.finish(success=True)

class DeleteStuHandler(APIHandler):

    @tornado.web.authenticated
    def get(self):
        if isStudent(self):
            self.finish(success=False,notification='权限不足,无法修改数据')
            return

        stuid = self.get_argument('stuid','')
        stuidc = self.get_argument('stuidc','')
        stu = Student.instance()

        if stuid == '':
            stu.logger.warning('request param stuid is empty')
            self.finish(success=False)
            return
        ret = stu.deleteStuInfo(stuid)
        if ret == 0:
            stu.logger.error('delete stu info failed ,stuid :%s is not in the db' % stuid)
            self.finish(success=False)
            return
        stu.logger.info('delete stu info done ,stuid: %s' % stuid)
        self.finish(success=True)
        return

class GetAllStuInfoHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):

        try:
            stu = Student.instance()
            classid = self.get_argument('cid',u'0')
            name = self.get_argument('name','')
            stu.logger.info('get all stuinfo handler cid: %s' % classid)
            ret = stu.getAllStuInfo()

            cid2cname = {}
            stuinfo=[]
            for r in ret:
                cid = unicode(r['class'])
                if classid != '0' and classid != cid :
                    continue
                if not cid2cname.has_key(cid):

                    try:
                        if cid.isdigit() :
                            cid2cname[cid] = stu.getClassNameOnId(cid)
                            stu.logger.info('get class name on id: %s, and name is %s' % (cid,cid2cname[cid]))
                        else:
                            stu.logger.info('class id  and name is the same %s' % cid)
                            cid2cname[cid] = cid
                    except Exception,e:
                        stu.logger.error('cid is not correct ,cid:'+cid)
                        stu.logger.error(e)
                        continue
                    #else:
                r['class'] = cid2cname[cid]
                stuinfo.append(r)


            ret = genxls(r'/opt/simp/static/downloads/stuinfo.xls',cstuinfo,stuinfo)
            if ret:
                stu.logger.info('generate xls file success')
            else:
                stu.logger.error('generate xls file failed')
            total = len(stuinfo)
            stuinfo = doPage(self,stuinfo)
            if name != '' :
                stuinfo = filter(lambda info: info.has_key('name') and info['name']==name ,stuinfo)

            stu.logger.info(stuinfo)
            stu.logger.info(name)
            self.finish("data",stuinfo,total=total)
            return

        except Exception,e:
            stu.logger.error(e)
            self.finish(success=False)


    @tornado.web.authenticated
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
    @tornado.web.authenticated
    def get(self):
        try:
            stu = Student.instance()
            stu.logger.info("in getAllClassIDs")
            ret = stu.getAllClassIDs()
            ret = ret + [{'id':'0','name':'所有班级'}]
            self.finish("classids",ret)
        except Exception ,e :
            raise tornado.web.HTTPError(404)

class GetQuanTypesHandler(APIHandler):
    @tornado.web.authenticated
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
    @tornado.web.authenticated
    def get(self):
        stu = None
        try:
            stu = Student.instance()
            classid = self.get_argument('classid','')
            stu.logger.info("classid="+classid)
            if classid == '':
                stu.logger.warning('the request param classid is empty')
                self.finish(success=False)
                return
            if not classid.isdigit() :
                classid = stu.getClassIdOnName(classid)
            stu.logger.info('the request class id is %s' % classid)
            #classid = stu.getClassIdOnName(classid)
            #stu.logger.info("############classname="+str(classid))
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
            stuInfo = stuInfo + [{'id':'0','name':'所有学生'}]
            self.finish("stunameids",stuInfo)
        except Exception ,e :
            stu.logger.warning(e)
            raise tornado.web.HTTPError(404)

class GetQuanInfosHandler(APIHandler):
    '''
    def filterStuName(infos,name):
        ret = []
        for info in infos:
            if info.has_key('student') and info['student']==name:
                ret.append(info)
        return ret
    '''


    @tornado.web.authenticated
    def get(self):
        stu = Student.instance()
        begin = self.get_argument('begin','0')
        stu.logger.info(begin)
        end = self.get_argument('end','0')
        stu.logger.info(end)
        name = self.get_argument('name','').strip()
        if begin=='0' and end=='0':
            stu.logger.info('begin =0 and end =0,so return the lastest 7 days quaninfo')
            #get the last week quan info
            end = datetime.today()
            begin = end - timedelta(6)
        else:
            begin = datetime.strptime(begin,'%Y/%m/%d')
            end = datetime.strptime(end,'%Y/%m/%d')

        ret = getQuanInfoBetween(begin,end)

        #generate xls
        r = genxls(r'/opt/simp/static/downloads/quaninfo.xls',cquaninfo,ret)
        if r:
            stu.logger.info('generate xls file success')
        else:
            stu.logger.error('generate xls file failed')


        total = len(ret)
        ret = doPage(self,ret)
        #stu.logger.info(ret)
        #stu.logger.info(name)
        #ret = self.filterStuName()
        if name != '' :
            ret = filter(lambda info: info.has_key('student') and info['student']==name ,ret)

        self.finish('quan',ret,total=total)
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
    def searchAndDelQI(self,cid,idc):
        try:

            stu = Student.instance()
            qs = stu.getQuanInfo(cid)
            for q in qs:
                tmp = stu.str2dict(q)
                if tmp.has_key('idc') and tmp['idc'] == idc :
                    stu.deleteQuanInfo(cid,q)
                    return 0

            return 1

        except Exception,e:
            stu.logger.error(e)
            return -1

    def get(self):
        pass
    @tornado.web.authenticated
    def post(self):
        try:
            if isStudent(self):
                self.finish(success=False,notification='权限不足,无法修改数据')
                return

            stu = Student.instance()
            #infos = self.get_argument('quaninfos')
            #for k,v in self.request.arguments:
            quaninfos = json.loads(self.request.body)
            qis = quaninfos['quaninfos']
            if type(qis)==type({}):
                qis = [qis]
            for qi in qis:
                cn = unicode(qi['class'])
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
                stu.logger.info('###########test ponit 1')
                if qi.has_key('idc') and qi['idc'].startswith('quan_'):
                    stu.logger.info('modify,delete first')
                    self.searchAndDelQI(cid,qi['idc'])
                else:
                    stu.logger.info('new one ,set idc')
                    qi['idc'] = 'quan_'+stu.getuuid()
                stu.logger.info(qi)
                stu.setQuanInfo(cid,qi)
            stu.logger.info(stu.getQuanInfo(cid))
        except Exception,e:
            stu.logger.error(e)

class DeleteQuanHandler(APIHandler):
    def searchAndDelQI(self,cid,idc):
        try:
            stu = Student.instance()
            qs = stu.getQuanInfo(cid)
            for q in qs:
                tmp = stu.str2dict(q)
                if tmp.has_key('idc') and tmp['idc'] == idc :
                    stu.deleteQuanInfo(cid,q)
                    return 0

            return 1

        except Exception,e:
            stu.logger.error(e)
            return -1


    @tornado.web.authenticated
    def get(self):
        try:
            if isStudent(self):
                self.finish(success=False,notification='权限不足,无法修改数据')
                return


            stu = Student.instance()
            quanidc = self.get_argument('idc','')
            cname = self.get_argument('cname','')
            if quanidc == '':
                stu.logger.warning('request param idc is empty')
                self.finish(success=False)
                return
            if cname == '':
                stu.logger.warning('request param cname is empty')
                self.finish(success=False)
                return

            cid = stu.getClassIDbyName(cname)
            ret = self.searchAndDelQI(cid,quanidc)
            if ret == 0:
                stu.logger.info('delete qi done')
                self.finish(success=True)
                return
            self.finish(success=False)
            return
        except Exception,e:
            stu.logger.error(e)
            self.finish(success=False)
            return

    def post(self):
        pass


class QuitHandler(APISecureHandler):
    def get(self):
        self.set_secure_cookie('remb','0')
        self.redirect('/')
        return

class LoginHandler(APISecureHandler):
    def post(self):
        #get argument
        rdb = Student.instance()
        rdb.logger.info("login handler")
        user = self.get_argument('user','')
        pwd = self.get_argument('pwd','')
        remb = self.get_argument('remb','0')
        rdb.logger.info('user:' + user)
        rdb.logger.info('pwd:' + pwd)
        rdb.logger.info('remb:' + remb)
        #audit the user
        if user==''or pwd=='':
            #self.finish(success=False)
            self.redirect('/')
            return

        else:#audit from db
            rdb.logger.info('go on check user in db')
            userInfo = rdb.getUserInfo(user)
            if userInfo:
                rdb.logger.info('userinfo from db :' + userInfo)
                userInfo = rdb.str2dict(userInfo)
                if userInfo.has_key('passwd') and userInfo['passwd'] == pwd:
                    rdb.logger.info(user + " login success")
                    self.set_secure_cookie('remb','1')
                    self.set_secure_cookie('user',user)
                    self.set_secure_cookie('role',userInfo['role'])
                    self.set_cookie('uid',user)
                    self.set_cookie('type',userInfo['role'])
                    #self.finish()
                    rdb.logger.info("redirect to /manage")
                    self.redirect('/manage?uid='+user)
                    #self.render('../main.html')
                    return
        # audit login from db failed
        rdb.logger.warning(user + " check failed in db")
        self.redirect('/')
        #self.finish(success=False)
        return

    def get(self):

        stu = Student.instance()
        stu.logger.info("in login handler get ,render to login")
        self.redirect('/')
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

        stu.logger.info(len(qinfos))
        for qi in qinfos:
            cname = unicode(qi['class'])
            if not sTable.has_key(cname):
                stu.logger.warning('There is no class has a name : %s, quan info : %s' % (str(cname),str(qi)))
                #self.finish(success=False)
                #return
                continue
            qtype = stu.getQuanIdOnName(qi['quan_type'])
            qi['quan_score'] = int(qi['quan_score'])
            stu.logger.info('begin to compu quan')
            if qtype==1001: # discipline
                stu.logger.info('begin to compu quan of disp')
                sTable[cname]['disp_score'] += qi['quan_score']
                sTable[cname]['disp_quan'] += qi['quan_score'] *0.3
            elif qtype==1002: #health
                stu.logger.info('begin to compu quan of heal')
                sTable[cname]['heal_score'] += qi['quan_score']
                sTable[cname]['heal_quan'] += qi['quan_score'] *0.2
            elif qtype==1003: # domi
                stu.logger.info('begin to compu quan of domi')
                sTable[cname]['domi_score'] += qi['quan_score']
                sTable[cname]['domi_quan'] += qi['quan_score'] *0.4
            elif qtype==1004: #activity
                stu.logger.info('begin to compu quan of acti')
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
        for line in sTable.values():
            qWeekInfos.append(line)

        #generate xls
        r = genxls(r'/opt/simp/static/downloads/quanweekinfo.xls',cquanweekinfo,qWeekInfos)
        if r:
            stu.logger.info('generate xls file success')
        else:
            stu.logger.error('generate xls file failed')


        total = len(qWeekInfos)
        qWeekInfos = doPage(self,qWeekInfos)

        self.finish('classquanweek',qWeekInfos,total=total)

class GetAttendInfoHandler(APIHandler):
    def getAttendInfoBetween(self,begin,end):
        stu = Student.instance()
        try:
            if type(begin) != type(datetime) :
                begin = datetime.strptime(begin,'%Y/%m/%d')

            if type(end) != type(datetime) :
                end = datetime.strptime(end,'%Y/%m/%d')
            stu.logger.info(begin)
            stu.logger.info(end)
            if end < begin :
                return []

            days = (end-begin).days
            stu.logger.info(days)
            rets=[]
            for n in range(0,days+1):
                day = begin + timedelta(n)
                day = day.strftime('%Y/%m/%d')
                stu.logger.info(day)
                ret = stu.getAttendInfo(day)
                stu.logger.info(ret)
                for info in ret:
                    info = json.loads(info)
                    rets.append(info)

            return rets
        except Exception,e:
            stu.logger.error(e)

    @tornado.web.authenticated
    def get(self):
        stu = Student.instance()
        try:
            cname = self.get_argument('class','').strip()
            bdate = self.get_argument('begin','').strip()
            edate = self.get_argument('end','').strip()
            name = self.get_argument('name','').strip()

            stu.logger.info(bdate)
            stu.logger.info(edate)


            firstDay,lastDay = getDateOfNWeek(0)

            if bdate == '' :
                bdate = firstDay.strftime('%Y/%m/%d')

            if edate == '' :
                edate = lastDay.strftime('%Y/%m/%d')
            stu.logger.info(bdate)
            stu.logger.info(edate)

            attendInfos = self.getAttendInfoBetween(bdate,edate)
            stu.logger.info(attendInfos)
            ret = []
            if cname == '':
                stu.logger.info("class='',so get attend info or all classes")
                ret = attendInfos
            else:
                for ai in attendInfos :
                    if cname == ai['class']:
                        ret.append(ai)
            #generate xls
            r = genxls(r'/opt/simp/static/downloads/attendinfo.xls',cattendinfo,ret)
            if r:
                stu.logger.info('generate xls file success')
            else:
                stu.logger.error('generate xls file failed')

            total = len(ret)
            ret = doPage(self,ret)
            #stu.logger.info(ret)
            stu.logger.info(name)
            if name != '' :
                ret = filter(lambda info: info.has_key('student') and info['student']==name ,ret)

            self.finish('data',ret,total=total)
        except Exception,e :
            stu.logger.error(e)

    def post(self):
        pass


class SetAttendInfoHandler(APIHandler):
    def searchAndDelAI(self,day,idc) :
        try:
            stu = Student.instance()
            ais = stu.getAttendInfo(day)
            for ai in ais:
                tmp = stu.str2dict(ai)
                if tmp.has_key('idc') and tmp['idc'] == idc :
                    stu.deleteAttendInfo(day,ai)
                    return 0
            return 1

        except Exception,e:
            stu.logger.info(e)
            return -1

    def get(self):
        pass

    @tornado.web.authenticated
    def post(self):
        try:
            if isStudent(self):
                self.finish(success=False,notification='权限不足,无法修改数据')
                return

            stu = Student.instance()
            stu.logger.info('set attend info')
            ais = json.loads(self.request.body)['data']
            if type(ais) == type({}):
                ais= [ais]
            for ai in ais :
                day = ai['date']
                if ai.has_key('idc') and ai['idc'].startswith('attend_'):
                    stu.logger.info('modify attend info,first delete')
                    self.searchAndDelAI(day,ai['idc'])
                else:
                    stu.logger.info('a new attend info')
                    ai['idc'] = 'attend_' + stu.getuuid()

                ret = stu.setAttendInfo(day,ai)

        except Exception,e:
            stu.logger.error(e)
        pass

class DeleteAttendHandler(APIHandler):
    def searchAndDelAI(self,day,idc) :
        try:
            stu = Student.instance()
            ais = stu.getAttendInfo(day)
            for ai in ais:
                tmp = stu.str2dict(ai)
                if tmp.has_key('idc') and tmp['idc'] == idc :
                    stu.deleteAttendInfo(day,ai)
                    return 0
            return 1

        except Exception,e:
            stu.logger.info(e)
            return -1

    @tornado.web.authenticated
    def get(self):
        if isStudent(self):
            self.finish(success=False,notification='权限不足,无法修改数据')
            return


        day = self.get_argument('date','')
        idc = self.get_argument('idc','')

        stu = Student.instance()

        if day == '':
            stu.logger.warning('request param day is empty')
            self.finish(success=False)
            return
        if idc == '' :
            stu.logger.warning('request param idc is empty')
            self.finish(success=False)
            return
        ret = self.searchAndDelAI(day,idc)
        if ret == 0 :
            stu.logger.info('Delete attend info done')
            self.finish(success=True)
            return
        self.finish(success=False)
        return

class GetRewardInfoHandler(APIHandler):

    def filterRewardInfoBetween(self,ris,bdate,edate):
        if bdate == '':
            bdate = '2000/01/01'
        bdate = datetime.strptime(bdate,'%Y/%m/%d')

        if edate == '':
            edate = datetime.today()
        else:
            edate = datetime.strptime(edate,'%Y/%m/%d')


        ret = []
        for ri in ris:
            rdate = datetime.strptime(ri['date'],'%Y/%m/%d')
            if rdate >= bdate and rdate <= edate:
                ret.append(ri)
        return ret

    def get(self):
        stu = Student.instance()
        try:
            cname = self.get_argument('class','').strip()
            bdate = self.get_argument('begin','').strip()
            edate = self.get_argument('end','').strip()
            name = self.get_argument('name','').strip()

            #rinfos = stu.getAllRewardInfo()
            ris = []
            if name != '':
                sid = stu.getStuIdOnName(name)
                if sid != '':
                    ris = stu.getRewardInfo2(sid)
            else:
                ris = stu.getAllRewardInfo2()

            stu.logger.info(ris)
            ris = self.filterRewardInfoBetween(ris,bdate,edate)
            stu.logger.info(ris)
            if cname != '':
                ris = filter(lambda ri: ri['class']==cname,ris)
            stu.logger.info(ris)

            total = len(ris)
            ris = doPage(self,ris)

            self.finish('data',ris,total=total)
        except Exception,e:
            stu.logger.error(e)

class SetRewardInfoHandler(APIHandler):
    def get(self):
        pass

    def searchAndDelRI(self,sid,idc):
        try:
            stu = Student.instance()
            ris = stu.getRewardInfo(sid)
            for ri in ris:
                tmp = stu.str2dict(ri)
                if idc == tmp['idc'] :
                    stu.deleteRewardInfo(sid,ri)
                    break
        except Exception,e:
            stu.logger.error(e)

    def post(self):
        try:
            if isStudent(self):
                self.finish(success=False,notification='权限不足,无法修改数据')
                return

            stu = Student.instance()
            stu.logger.info('set attend info')
            ris = json.loads(self.request.body)['data']
            if type(ris) == type({}):
                ris= [ris]
            for ri in ris :
                #day = ri['date']
                name = ri['student']
                sid = stu.getStuIdOnName(name)
                if sid == '':
                    stu.logger.error('cant find stu id of '+name)
                    self.finish(success=False,notification='姓名错误')
                    return

                stu.logger.info(ri['idc'])
                if ri.has_key('idc') and ri['idc'].startswith('reward_'):
                    stu.logger.info('modify reward info,first delete')
                    self.searchAndDelRI(sid,ri['idc'])
                else:
                    stu.logger.info('a new reward info')
                    ri['idc'] = 'reward_' + stu.getuuid()

                ret = stu.setRewardInfo(sid,ri)

        except Exception,e:
            stu.logger.error(e)


class DeleteRewardHandler(APIHandler):
    def searchAndDelRI(self,sid,idc):
        try:
            stu = Student.instance()
            ris = stu.getRewardInfo(sid)
            for ri in ris:
                tmp = stu.str2dict(ri)
                if idc == tmp['idc'] :
                    stu.deleteRewardInfo(sid,ri)
                    break
        except Exception,e:
            stu.logger.error(e)

    @tornado.web.authenticated
    def get(self):
        if isStudent(self):
            self.finish(success=False,notification='权限不足,无法修改数据')
            return

        idc = self.get_argument('idc','')
        name = self.get_argument('name','')

        stu = Student.instance()

        if name == '' :
            stu.logger.warning('request param name is empty')
            self.finish(success=False)
            return
        if idc == '' :
            stu.logger.warning('request param idc is empty')
            self.finish(success=False)
            return
        sid = stu.getStuIdOnName(name)
        ret = self.searchAndDelRI(sid,idc)
        if ret == 0 :
            stu.logger.info('Delete reward info done')
            self.finish(success=True)
            return

        self.finish(success=False)
        return



class GetHeadTeachersHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        try:
            stu = Student.instance()
            ids = stu.getAllClassIDs()
            ret = []
            for i in ids :
                ti = stu.getClassInfo(i['id'])
                if not ti :
                    stu.logger.warning('id :'+i['id']+' of head teacher has no info')
                    continue
                elif ti.has_key('teacher'):
                    tname = ti['teacher']
                    if len(tname)>0 and tname != '0' :
                        ret.append({'id':i['id'],'name':tname})
                else:
                    stu.logger.warning('id :'+i['id']+' of head teacher has no \"teacher\" info')

            self.finish('data',ret)
            return
        except Exception,e:
            stu.logger.error(e)
            self.finish(success=False)
            return

    def post(self):
        pass

class GetNewsListHandler(APISecureHandler):
    def getNewsList(self,count=25):
        stu = Student.instance()
        news = stu.getNotices(to=count-1)
        ret=[]
        for new in news:
            new = stu.str2dict(new)
            if new.has_key('idc') and new.has_key('title') :
                ret.append({'id':new['idc'],'text':new['title'],'leaf':'true','icon':'static/pic/rss.gif'})
        return ret

    @tornado.web.authenticated
    def get(self):
        try:
            stu = Student.instance()
            newslist = self.getNewsList()
            #treenode = [{'id':'newslistnode','rootVisible':'false','text':'','children':newslist}]
            treenode = json.dumps(newslist)
            self.write(treenode)
        except Exception,e:
            stu.logger.error(e)

    def post(self):
        pass

class GetNewsContentHandler(APISecureHandler):

    @tornado.web.authenticated
    def get(self):
        stu = Student.instance()
        newsid = self.get_argument('id','')
        news = stu.getNotices()
        content = NEWS_TEMPLATE
        for n in news:
            n = stu.str2dict(n)
            if n.has_key('idc') and (n['idc'] == newsid or newsid==''):
                stu.logger.info(n)
                content = (content) % (n['title'] ,n['author'],n['date'],n['content'])
                self.write(content)
                return
        self.write('')
        return

    def post(self):
        pass
class GetNewsHandler(APIHandler):

    @tornado.web.authenticated
    def get(self):
        try:
            stu = Student.instance()
            begin = self.get_argument('begin','')
            end = self.get_argument('end','')
            today = datetime.today()
            if begin == '':
                begin = today - timedelta(365*10)
            else:
                begin = datetime.strptime(begin,'%Y/%m/%d')
            if end == '':
                end = today
            else:
                end = datetime.strptime(end,'%Y/%m/%d')

            news = stu.getNotices()
            ret=[]
            for new in news:
                new = stu.str2dict(new)
                date = datetime.strptime(new['date'],'%Y/%m/%d')
                if date>= begin and date <=end :
                    ret.append(new)

            total = len(ret)
            ret = doPage(self,ret)

            self.finish("data",ret,total=total)
            return
        except Exception,e:
            stu.logger.error(e)

    def post(self):
        pass
class SetNewsHandler(APIHandler):
    def get(self):
        pass

    @tornado.web.authenticated
    def post(self):
        try:
            if isStudent(self):
                self.finish(success=False,notification='权限不足,无法修改数据')
                return


            stu = Student.instance()
            news = json.loads(self.request.body)
            news = news['data']
            if type(news)==type({}) :
                news = [news]
            all_news = stu.getNotices()
            for n in news:
                if n['author'] == '':
                    n['author'] == unicode('轶名')
                if n.has_key('content'):
                    n['content'] = n['content'].replace('\n','</p><p>')
                    n['content'] = '<p>' +n['content']
                    n['content'] = n['content'] + '</p>'
                if n.has_key('idc') and n['idc'].startswith('news_') :
                    #modify and first del it
                    stu.logger.info('modify the news')
                    for ns in all_news:
                        tmp = stu.str2dict(ns)
                        if tmp['idc'] == n['idc']:
                            stu.deleteNotice(ns)
                            stu.logger.info('delete the news : %s' % ns)
                            break
                n['idc'] = 'news_'+ stu.getuuid()
                stu.setNotice(n)
        except Exception,e:
            stu.logger.error(e)
            self.finish(success=False)

class SetUserHandler(APIHandler):
    def get(self):
        pass
    @tornado.web.authenticated
    def post(self):
        try:
            if isStudent(self):
                self.finish(success=False,notification='权限不足,无法修改数据')
                return

            stu = Student.instance()
            userinfo = json.loads(self.request.body)
            if type(userinfo)==type({}) and userinfo.has_key('data') :
                uis = userinfo['data']
                if type(uis)==type({}):
                    uis = [uis]
                all_ui = stu.getAllUserInfo()

                for ui in uis:
                    #check if user is exist in the db, if so ,rewrite the info
                    if ui.has_key('idc') and ui['idc'].startswith('user_'):
                        pass
                        #modeify and first delete it
                        stu.logger.info('modify user info')
                        for u in all_ui :
                            stu.logger.info(str(u))
                            if u.has_key('idc') and ui['idc'] == u['idc']:
                                stu.logger.info('find the user info %s' % str(u))
                                stu.deleteUserInfo(u['user'])
                                stu.logger.info('delete user info : %s' % str(u))
                                break

                    if not ui['idc'].startswith('user_'):
                        ui['idc'] = stu.getuuid()
                    #number to text
                    if ui['role'].isdigit():
                        if ui['role'] == u'0' :
                            ui['role'] == u'管理员'
                        elif ui['role'] == u'1' :
                            ui['role'] == u'老师'
                        elif ui['role'] == u'2' :
                            ui['role'] == u'学生'
                        else:
                            stu.logger.warning('role type is unknow which is %s' % str(ui['role']))

                    stu.logger.info(ui)
                    stu.setUserInfo(ui)
        except Exception,e:
            stu.logger.error(e)
            self.finish(success=False)
            return

        self.finish()
        return
class DeleteUserHandler(APIHandler):

    @tornado.web.authenticated
    def get(self):
        try:
            if isStudent(self):
                self.finish(success=False,notification='权限不足,无法修改数据')
                return

            user = self.get_argument('user','')
            stu = Student.instance()
            if user == '':
                stu.logger.warning('request param user is empty')
                self.finish(success=False)
                return
            ret = stu.deleteUserInfo(user)
            if ret == 0:
                stu.logger.error('delete user failed ,user:%s is not in db' % user)
                self.finish(success=False)
                return

            self.finish(success=True)
            return

        except Exception,e:
            stu.logger.error(e)
            self.finish(success=False)
            return

class GetUserHandler(APIHandler):

    @tornado.web.authenticated
    def get(self):
        try:
            stu = Student.instance()
            user = self.get_argument('user','')
            uis=''
            if user=='':
                uis = stu.getAllUserInfo()
            else:
                uis = stu.getUserInfo(user)
                uis = stu.str2dict(uis)
                uis = [uis]
            '''
            idc = 0
            for ui in uis:
                ui['idc'] = idc + 1
                idc = idc + 1
            '''
            total = len(uis)
            uis = doPage(self,uis)
            self.finish('data',uis,total=total)
        except Exception,e:
            stu.logger.error(e)
            self.finish(success=False)

    def post(self):
        pass

class DeleteNoticeHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        try:
            if isStudent(self):
                self.finish(success=False,notification='权限不足,无法修改数据')
                return

            stu = Student.instance()
            noticeidc = self.get_argument('noticeidc','')
            if noticeidc=='':
                stu.logger.warning('notice idc is empty')
                return

            news = stu.getNotices()
            ret=[]
            for new in news:
                tmp = stu.str2dict(new)
                if tmp['idc'] == noticeidc:
                    stu.logger.info('find the  notice of idc :%s , that is %s' % (noticeidc,new))
                    ret = stu.deleteNotice(new)
                    if ret>0:
                        stu.logger.info('delete notice of idc :%s done' % noticeidc)
                        self.finish()
                        return
                    else:
                        stu.logger.warning('delete notice idc: %s failed' % noticeidc)
                        self.finish(success=False)
                        return
            self.finish(success=False)
            return
        except Exception,e:
            stu.logger.error(e)
            self.finish(success=False)
            return

    def post(self):
        pass

class GetStudentStaticsHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        try:
            stu = Student.instance()

            day = datetime.today()
            day = day.strftime('%Y/%m/%d')
            ais = stu.getAttendInfo(day)
            ss = init_statics(studentStatics)
            for ai in ais:
                ai = json.loads(ai)
                cid = stu.getClassIdOnName(ai['class'])
                stu.logger.info(cid)
                if cid.isdigit():
                    cid = int(cid)
                else:
                    stu.logger.error('cid should be a number')
                    return
                if ss.has_key(cid):
                    stu.logger.info('ss has key %d' % cid)
                    ss[cid]['total_in_real'] -= 1
                    ps = ";%s %s %s %s" % (ai['student'],ai['nclass'],ai['type'],ai['ps'])
                    stu.logger.info(ps)
                    ss[cid]['ps'] += ps
                else:
                    stu.logger.warning('ss do not has key %d' % cid)
            ss = comp_statics(ss)
            ret = []
            for key in ss:
                if key=='total':
                    continue
                ret.append(ss[key])
            ret.append(ss['total'])

            self.finish('data',ret,total=len(ret))

        except Exception,e:
            stu.logger.error(e)
            self.finish(success=False)
            return


        pass
class GetStuTreeListHandler(APISecureHandler):
    def get(self):

        requestNode = self.get_argument('node','')
        if requestNode != 'root':
            return
        role = unicode(self.get_secure_cookie('role'))
        stuTreeList = []
        if role==unicode('管理员') :
            stuTreeList = adminStuTreeList
        elif role == unicode('教师'):
            stuTreeList = teacStuTreeList
        elif role == '学生':
            stuTreeList = stuStuTreeList
        else:
            pass

        stuTreeList = json.dumps(stuTreeList)
        #self.finish('data',stuTreeList,total=len(stuTreeList))
        #self.write(role) ;
        self.write(stuTreeList)

class UploadFileHandler(APISecureHandler):
    def get(self):
        self.render('../upload.html')
        pass

    def post(self):
        stu = Student.instance()
        fileMetas = self.request.files['file']
        ret = uploadFiles(fileMetas,logger=stu.logger)
        return


def main():
    stu = Student.instance()
    stu.logger.info("hello from feed module")
    ret = getDayOfNWeek(2)
    print ret

if __name__ == "__main__":
    instance = feed()
    instance.logger.info("hello from feed module " )
    sys.exit(0)

