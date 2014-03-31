// student status statics
Ext.define('SS.StuStatusStatics', {
	extend: 'Ext.data.Model',
	fields: [
    'class', //class nam
    'teacher',//班主任
    'total',//应到人数
    'total_in_record',//原有在籍
    'out_school',//不再校
    'in_boy',//在校男
    'in_girl',//在校女
    'in',//在校合计
    'live_boy',//住校男
    'live_girl',//住校女
    'live',//住校合计
    'home',//走读合计
    'longvaca',//请长假合计
    'quitschool',//退学人数
    'pre',//预科人数
    '32',//32
    'gj',//高技
    'solider',//当兵
    'special',//特殊情况
    'ps'//备注
    ]
});

var ss_statics_store = Ext.create('Ext.data.Store', {
    model:'SS.StuStatusStatics',
	//autoLoad: false,
    data:[
{'class':'12计一','teacher':'胡向颖','total':'27','total_in_record':'27','out_school':'3','in_boy':'22','in_girl':'5','in':'24','live_boy':'0','live_girl':'0','live':'20','home':'4','longvaca':'0','quitschool':'0','pre':'4','32':'0','gj':'1','solider':'2','special':'1','ps':'预科：（徐象梅、纪康、马艳鹏、李宗超）当兵：陈朋、张志远  特殊情况：张培'}, {'class':'12计二','teacher':'张峰连','total':'34','total_in_record':'36','out_school':'8','in_boy':'0','in_girl':'0','in':'13','live_boy':'0','live_girl':'0','live':'6','home':'7','longvaca':'0','quitschool':'2','pre':'0','32':'0','gj':'0','solider':'0','special':'0','ps':'0'}, {'class':'12电信','teacher':'林宏伟','total':'11','total_in_record':'11','out_school':'1','in_boy':'8','in_girl':'3','in':'9','live_boy':'8','live_girl':'3','live':'9','home':'0','longvaca':'0','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'1','special':'0','ps':'当兵：姜坤'}, {'class':'12物流','teacher':'马培幸','total':'16','total_in_record':'16','out_school':'','in_boy':'0','in_girl':'0','in':'16','live_boy':'0','live_girl':'0','live':'15','home':'1','longvaca':'0','quitschool':'0','pre':'1','32':'0','gj':'0','solider':'0','special':'0','ps':'预科：徐硕'},
{'class':'12图像','teacher':'雷利香','total':'11','total_in_record':'11','out_school':'2','in_boy':'0','in_girl':'0','in':'9','live_boy':'0','live_girl':'0','live':'7','home':'2','longvaca':'2','quitschool':'0','pre':'','32':'0','gj':'0','solider':'0','special':'0','ps':'请长假：（罗茜、巩思雨）'},
{'class':'12艺术','teacher':'张  涛','total':'7','total_in_record':'7','out_school':'0','in_boy':'0','in_girl':'0','in':'7','live_boy':'0','live_girl':'0','live':'7','home':'0','longvaca':'0','quitschool':'0','pre':'1','32':'0','gj':'0','solider':'0','special':'0','ps':'0'},
{'class':'11计一','teacher':'赵志明','total':'34','total_in_record':'39','out_school':'10','in_boy':'16','in_girl':'8','in':'24','live_boy':'11','live_girl':'6','live':'18','home':'7','longvaca':'12','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'1','special':'3','ps':'当兵：宗昊  请长假：（陈颖、倪传军、孙磊、赵文平、刘峥、刘昂、杨三川、钱文强、宋慧、王大名、廖继邦、张明辉）挂   特殊情况跟读：杨莹  杨萌、张洁'},
{'class':'11计二','teacher':'梁栋','total':'36','total_in_record':'36','out_school':'7','in_boy':'22','in_girl':'8','in':'21','live_boy':'13','live_girl':'3','live':'16','home':'14','longvaca':'4','quitschool':'2','pre':'0','32':'0','gj':'0','solider':'0','special':'1','ps':'请长假：（黄伦伦、吕苏明、张德熙、李强）  特殊情况跟读预科：王雨晨 退学：冯宪伟、邵帅'},
{'class':'11电信','teacher':'杨传贺','total':'21','total_in_record':'21','out_school':'3','in_boy':'4','in_girl':'12','in':'18','live_boy':'4','live_girl':'12','live':'16','home':'0','longvaca':'3','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'1','special':'1','ps':'特殊情况：张宜皓 当兵（挂 孔德丰）请长假：（董振、张星)'},
{'class':'11艺术','teacher':'杨广林','total':'31','total_in_record':'31','out_school':'0','in_boy':'6','in_girl':'1','in':'7','live_boy':'6','live_girl':'1','live':'7','home':'1','longvaca':'0','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'0','special':'0','ps':'0'},
{'class':'13计一','teacher':'李伟','total':'46','total_in_record':'0','out_school':'2','in_boy':'0','in_girl':'0','in':'44','live_boy':'0','live_girl':'0','live':'31','home':'13','longvaca':'0','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'0','special':'0','ps':'0'},
{'class':'13计二','teacher':'张波','total':'28','total_in_record':'0','out_school':'0','in_boy':'0','in_girl':'0','in':'26','live_boy':'0','live_girl':'0','live':'17','home':'9','longvaca':'0','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'0','special':'0','ps':'0'},
{'class':'13物流','teacher':'陈克坦','total':'35','total_in_record':'35','out_school':'0','in_boy':'0','in_girl':'0','in':'35','live_boy':'0','live_girl':'0','live':'35','home':'0','longvaca':'0','quitschool':'0','pre':'0','32':'0','gj':'0','solider':'0','special':'0','ps':'0'},
{'class':'13图像','teacher':'宋元鹏','total':'18','total_in_record':'18','out_school':'2','in_boy':'5','in_girl':'11','in':'16','live_boy':'4','live_girl':'8','live':'12','home':'4','longvaca':'0','quitschool':'0','pre':'2','32':'7','gj':'0','solider':'0','special':'2','ps':'0'},
{'class':'13电信','teacher':'甘信强','total':'7','total_in_record':'7','out_school':'0','in_boy':'6','in_girl':'1','in':'7','live_boy':'6','live_girl':'1','live':'7','home':'0','longvaca':'0','quitschool':'0','pre':'3','32':'0','gj':'0','solider':'0','special':'0','ps':'0'},
{'class':'合计','teacher':'','total':'362','total_in_record':'295','out_school':'38','in_boy':'89','in_girl':'49','in':'276','live_boy':'42','live_girl':'25','live':'223','home':'62','longvaca':'21','quitschool':'2','pre':'0','32':'0','gj':'0','solider':'5','special':'8','ps':'0'}
    ]
/*	proxy: {
		type: 'ajax',

		api: {
			read: SERVER + '/getstudentstatics'
		},
		reader: {
			type: 'json',
			successProperty: 'success',
			root: 'data',
			messageProperty: 'message'
		},
		listeners: {
			exception: function(proxy, response, operation) {
                //console.log(operation.getError()) ;
			}
		} 
	},*/
});

