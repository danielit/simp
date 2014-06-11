#!/usr/bin/python
# *-- encoding: utf-8 --*
import redis
import json
import sys
sys.path.append("../")
import student

def load2Redis(fileName):
    rdb = student.Student.instance()
    stuinfo={}
    try:
        with open(fileName,'r') as f:
            for line in f:
                stuinfo={}
                info = line.decode('gbk').encode('utf-8').split(',')
                if len(info)<40:
                    print 'ERROR:The info is to short'
                    print len(info)
                    continue
                stuinfo['stuid'] = unicode(info[1])
                stuinfo['examid'] = info[0]
                stuinfo['name'] = unicode(info[6])
                #print stuinfo['name']

                if info[7]=='':
                    stuinfo['gender'] =u'女'
                else:
                    stuinfo['gender'] =u'男'

                stuinfo['identify'] = info[4]
                if len(info[4]) == 18:
                    stuinfo['birthday'] = info[4][6:10]+'/'+ info[4][10:12] + '/' + info[4][12:14]
                else:
                    stuinfo['birthday'] = ''
                stuinfo['type'] = info[3]
                stuinfo['address'] = info[39]
                stuinfo['homephone'] = info[32] + ';' + info[33] + ';' + info[34]
                stuinfo['other'] = info[9] #??
                if info[5].isdigit():
                    stuinfo['class'] = info[5]
                else:
                    stuinfo['class'] = stu.getClassIdOnName(info[5])
                stuinfo['teacher'] = ''
                stuinfo['field'] = ''

                stuinfo['telephone'] = info[21]
                stuinfo['status'] = u''
                stuinfo['domno'] = info[10]
                if len(info[23]) == 0 :
                    stuinfo['duty'] = u'学生'
                stuinfo['duty'] = info[23]
                stuinfo['qq'] = info[22]

                #stuinfo = json.dumps(stuinfo)
                print stuinfo

                rdb.setStuInfo(stuinfo)
                rdb.logger.info(stuinfo)

    except Exception,e:
        print "ERROR:" + str(e)



def main():
    reload(sys)
    sys.setdefaultencoding('utf-8')
    fileName="19.csv"
    load2Redis(fileName)

if __name__=="__main__":
    main()
