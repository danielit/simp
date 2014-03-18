// student status statics 

Ext.define('SS.StuStatusStatics', {
	extend: 'Ext.data.Model',
	fields: [
    'class', //class name
    'teacher',//班主任 
    'total',//应到人数
    'total_in_record',//原有在籍
    'out_school',//不再校
    'in_boy',//在校男
    'in_girl',//在校女
    'in',//在校合计
    'live_boy',//住校男
    'live_gril',//住校女
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
	autoLoad: false,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getstudentstatics',
		},
		reader: {
			type: 'json',
			successProperty: 'success',
			root: 'data',
			messageProperty: 'message'
		},
		listeners: {
			exception: function(proxy, response, operation) {
                console.log(operation.getError()) ;
			}
		}
	},
});
