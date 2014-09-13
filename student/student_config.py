#!/usr/bin/env python
#-*- coding=utf-8 -*-

redisMasterHosts={'host': '127.0.0.1', 'port': 6379, 'db': 0}


LogConfiguration = {
    "prefix": "/opt/simp/log/students.log",
    "when": "D" # "H" or "D" or "W" or "midnight"
}

firstDayOfTerm='2014/2/17'
studentStatics = {2012000001:{'class':'2012级计算机应用技术一班','teacher':'胡向颖','total':'27','total_in_record':'27','out_school':'3','in_boy':'22','in_girl':'5','in':'24','live_boy':'0','live_girl':'0','live':'20','home':'4','longvaca':'0','quitschool':'0','pre':'4','32':'0','gj':'1','solider':'2','special':'1','ps':'预科：（徐象梅、纪康、马艳鹏、李宗超）当兵：陈朋、张志远  特殊情况：张培'}
     ,2012000002:{'class':'2012级计算机应用技术二班','teacher':'张峰连','total':'34','total_in_record':'36','out_school':'8','in_boy':'0','in_girl':'0','in':'13','live_boy':'0','live_girl':'0','live':'6','home':'7','longvaca':'0','quitschool':'2','pre':'0','32':'0','gj':'0','solider':'0','special':'0','ps':''}
    ,2012000101:{'class':'2012级电子信息工程技术班','teacher':'林宏伟','total':'11','total_in_record':'11','out_school':'1','in_boy':'8','in_girl':'3','in':'9','live_boy':'8','live_girl':'3','live':'9','home':'0','longvaca':'0','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'1','special':'0','ps':'当兵：姜坤'}
    ,2012000301:{'class':'2012级物流管理班','teacher':'马培幸','total':'16','total_in_record':'16','out_school':'0','in_boy':'0','in_girl':'0','in':'16','live_boy':'0','live_girl':'0','live':'15','home':'1','longvaca':'0','quitschool':'0','pre':'1','32':'0','gj':'0','solider':'0','special':'0','ps':'预科：徐硕'}
    ,2012000401:{'class':'2012级图形图像设计班','teacher':'雷利香','total':'11','total_in_record':'11','out_school':'2','in_boy':'0','in_girl':'0','in':'9','live_boy':'0','live_girl':'0','live':'7','home':'2','longvaca':'2','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'0','special':'0','ps':'请长假：（罗茜、巩思雨）'}
    ,2012000201:{'class':'2012级艺术设计班','teacher':'张  涛','total':'7','total_in_record':'7','out_school':'0','in_boy':'0','in_girl':'0','in':'7','live_boy':'0','live_girl':'0','live':'7','home':'0','longvaca':'0','quitschool':'0','pre':'1','32':'0','gj':'0','solider':'0','special':'0','ps':''}
#,{'class':'11计一','teacher':'赵志明','total':'34','total_in_record':'39','out_school':'10','in_boy':'16','in_girl':'8','in':'24','live_boy':'11','live_girl':'6','live':'18','home':'7','longvaca':'12','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'1','special':'3','ps':'当兵：宗昊  请长假：（陈颖、倪传军、孙磊、赵文平、刘峥、刘昂、杨三川、钱文强、宋慧、王大名、廖继邦、张明辉）挂   特殊情况跟读：杨莹  杨萌、张洁'},
#,{'class':'11计二','teacher':'梁栋','total':'36','total_in_record':'36','out_school':'7','in_boy':'22','in_girl':'8','in':'21','live_boy':'13','live_girl':'3','live':'16','home':'14','longvaca':'4','quitschool':'2','pre':'0','32':'0','gj':'0','solider':'0','special':'1','ps':'请长假：（黄伦伦、吕苏明、张德熙、李强）  特殊情况跟读预科：王雨晨 退学：冯宪伟、邵帅'}
#,{'class':'11电信','teacher':'杨传贺','total':'21','total_in_record':'21','out_school':'3','in_boy':'4','in_girl':'12','in':'18','live_boy':'4','live_girl':'12','live':'16','home':'0','longvaca':'3','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'1','special':'1','ps':'特殊情况：张宜皓 当兵（挂 孔德丰）请长假：（董振、张星)'}
#,{'class':'11艺术','teacher':'杨广林','total':'31','total_in_record':'31','out_school':'0','in_boy':'6','in_girl':'1','in':'7','live_boy':'6','live_girl':'1','live':'7','home':'1','longvaca':'0','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'0','special':'0','ps':'0'}
    ,2013000001:{'class':'2013级计算机应用技术一班','teacher':'李伟','total':'46','total_in_record':'46','out_school':'2','in_boy':'0','in_girl':'0','in':'44','live_boy':'0','live_girl':'0','live':'31','home':'13','longvaca':'0','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'0','special':'0','ps':''}
    ,2013000002:{'class':'2013级计算机应用技术二班','teacher':'张波','total':'28','total_in_record':'28','out_school':'0','in_boy':'0','in_girl':'0','in':'26','live_boy':'0','live_girl':'0','live':'17','home':'9','longvaca':'0','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'0','special':'0','ps':''}
    ,2013000301:{'class':'2013级物流管理班','teacher':'陈克坦','total':'35','total_in_record':'35','out_school':'0','in_boy':'0','in_girl':'0','in':'35','live_boy':'0','live_girl':'0','live':'35','home':'0','longvaca':'0','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'0','special':'0','ps':''}
    ,2013000501:{'class':'2013级图像-艺术设计班','teacher':'宋元鹏','total':'18','total_in_record':'18','out_school':'2','in_boy':'5','in_girl':'11','in':'16','live_boy':'4','live_girl':'8','live':'12','home':'4','longvaca':'0','quitschool':'0','pre':'2','32':'7','gj':'0','solider':'0','special':'2','ps':''}
    ,2013000101:{'class':'2013级电子信息工程技术班','teacher':'甘信强','total':'7','total_in_record':'7','out_school':'0','in_boy':'6','in_girl':'1','in':'7','live_boy':'6','live_girl':'1','live':'7','home':'0','longvaca':'0','quitschool':'0','pre':'3','32':'0','gj':'0','solider':'0','special':'0','ps':''}
    #,'total':{'class':'合计','teacher':'','total':'362','total_in_record':'295','out_school':'38','in_boy':'89','in_girl':'49','in':'276','live_boy':'42','live_girl':'25','live':'223','home':'62','longvaca':'21','quitschool':'2','pre':'0','32':'0','gj':'0','solider':'5','special':'8','ps':'0'}
}
def init_statics(studentStatics):
    studentStatics['total']={}
    studentStatics['total']['class']= '合计'
    studentStatics['total']['teacher']= ''
    studentStatics['total']['ps']= ''
    for y in studentStatics[2013000101]:
        if y=='class' or y=='teacher' or y=='ps':
            continue
        studentStatics['total'][y] = 0

    for x in studentStatics:#实到人数初始化为应到人数
        studentStatics[x]['total_in_real'] = int(studentStatics[x]['total'])

    return studentStatics

def comp_statics(studentStatics):
    '''
    sum=0
    for k in studentStatics.keys():
        if k=='total':
            continue
        print k,k=='total',studentStatics[k]['total'],sum
        sum += int(studentStatics[k]['total'])
    print
    '''
    for x in studentStatics:
        if x=='total':
            continue
        for y in studentStatics[x]:
            if y=='class' or y=='teacher' or y=='ps':
                continue
            #if not (studentStatics[x][y]).isdigit():
            studentStatics['total'][y] += int(studentStatics[x][y])
            #print x,':',y,studentStatics[x][y]
    return studentStatics



#generate xls files
cstuinfo = ['name',
        'stuid',
        'identify',
        'examid',
        'birthday',
        'gender',
        'class',
        'teacher',
        'type',
        #'field',
        'status',
        'address',
        'homephone',
        'telephone',
        'other'#ps
    ]

cattendinfo = ['student', #id
        'class',
        'type',
        'date',
        'nclass',
        'ps'
     ]

cquaninfo = ['class',
        'student',
        'quan_type',
        'quan_date',
        'quan_score',
        'quan_reason'
    ]

cquanweekinfo = ['class',#class name
        'disp_score',# dicpline
        'disp_quan',
        'disp_rank',
        'heal_score',#health
        'heal_quan',
        'heal_rank',
        'domi_score',#dominitory
        'domi_quan',
        'domi_rank',
        'acti_score',#activity or other
        'acti_quan',
        'acti_rank',
        'total',
        'rank'
    ]

stuStuTreeList = [{
		'id': 'stuMangeRoot',
		'text': '学生管理',
		'expanded': True,
		'children': [{

            'id': 'quan',
			'text': '日常量化',
            'children':[{
                'id':'q.weeksummary',
                'text':'周量化汇总表', 'leaf':True
            },
            {
                'id':'q.detail',
                'text':'量化详单',
                'leaf':True
            }]
		},{
			'id': 'studentattend',
			'text': '学生考勤',
            'children':[{
                'id':'sa.lookup',
                'text':'考勤查询',
                'leaf':True
            }]
		},
        {
			'id': 'studentreward',
            'text': '学生奖惩',
            'children':[{
                'id':'sr.lookup',
                'text':'奖惩查询',
                'leaf':True
            }]
		},

	    {
			'id': 'sit.info',
			'text': '学生信息',
			'children': [{
				'id': 'sit.stuinfo',
				'text': '学生信息',
				'leaf': True
			}]
		},
		{
			'text': '在校情况',
			'id': 'studentinschool',
			'children': [{
				'id': 'ss.statics',
				'text': '在校学生统计',
				'leaf': True
			}]
		}]
	}]

teacStuTreeList = [{
		'id': 'stuMangeRoot',
		'text': '学生管理',
		'expanded': True,
		'children': [{

            'id': 'quan',
			'text': '日常量化',
            'children':[{
                'id':'q.weeksummary',
                'text':'周量化汇总表', 'leaf':True
            },
            {
                'id':'q.detail',
                'text':'量化详单',
                'leaf':True
            }]
		},{
			'id': 'studentattend',
			'text': '学生考勤',
            'children':[{
                'id':'sa.lookup',
                'text':'考勤查询',
                'leaf':True
            },{
                'id':'sa.input',
                'text':'考勤录入',
                'leaf':True
            }]
		},
        {
			'id': 'studentreward',
            'text': '学生奖惩',
            'children':[{
                'id':'sr.lookup',
                'text':'奖惩查询',
                'leaf':True
            },{
                'id':'sr.input',
                'text':'奖惩录入',
                'leaf':True
            }]
		},


	    {
			'id': 'sit.info',
			'text': '学生信息',
			'children': [{
				'id': 'sit.stuinfo',
				'text': '学生信息',
				'leaf': True
			},
            {
				'id': 'sit.input',
				'text': '信息录入',
				'leaf': True
			}]
		},
		{
			'text': '在校情况',
			'id': 'studentinschool',
			'children': [{
				'id': 'ss.statics',
				'text': '在校学生统计',
				'leaf': True
			}]
		}]
	}]

sysManageTree= {
		'id': 'sysMangeRoot',
		'text': '系统管理',
		'expanded': True,
		'children': [{
            'id':'sm.user',
            'text':'用户管理',
            'children':[{
			    'id': 'sm.lookupuser',
			    'text': '查看用户',
                'leaf':True
            },
            {
			    'id': 'sm.adduser',
			    'text': '添加用户',
                'leaf':True
            }]
        },
        {
            'id':'sm.notice',
            'text':'通知/公告管理',
            'children':[
		    {
			    'id': 'sm.lookupnotice',
			    'text': '查看通知/公告',
                'leaf':True
            },{
			    'id': 'sm.addnotice',
			    'text': '添加通知/公告',
                'leaf':True
		    }]
        }]
	}


adminStuTreeList = [{
		'id': 'stuMangeRoot',
		'text': '学生管理',
		'expanded': True,
		'children': [{

            'id': 'quan',
			'text': '日常量化',
            'children':[{
                'id':'q.weeksummary',
                'text':'周量化汇总表', 'leaf':True
            },
            {
                'id':'q.detail',
                'text':'量化详单',
                'leaf':True
            },
            {
                'id':'q.fillin',
                'text':'量化信息登记',
                'leaf':True
            }]
		},{
			'id': 'studentattend',
			'text': '学生考勤',
            'children':[{
                'id':'sa.lookup',
                'text':'考勤查询',
                'leaf':True
            },{
                'id':'sa.input',
                'text':'考勤录入',
                'leaf':True
            }]
		},
        {
			'id': 'studentreward',
            'text': '学生奖惩',
            'children':[{
                'id':'sr.lookup',
                'text':'奖惩查询',
                'leaf':True
            },{
                'id':'sr.input',
                'text':'奖惩录入',
                'leaf':True
            }]
		},
	    {
			'id': 'sit.info',
			'text': '学生信息',
			'children': [{
				'id': 'sit.stuinfo',
				'text': '学生信息',
				'leaf': True
			},
            {
				'id': 'sit.input',
				'text': '信息录入',
				'leaf': True
			}]
		},
		{
			'text': '在校情况',
			'id': 'studentinschool',
			'children': [{
				'id': 'ss.statics',
				'text': '在校学生统计',
				'leaf': True
			}]
		}]
	},sysManageTree]

if __name__=='__main__':
    print adminStuTreeList
