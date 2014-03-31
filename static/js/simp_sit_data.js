
Ext.define('Sit.StuInfo', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'idc', //id
		type: 'string'
	},
    'name', //name
    'stuid',
    'identify',
    'examid',
    'birthday',
    'gender',
    'class',
    'teacher', 
    'type',
    'field',
    'status',
    'other',// ps
    'address',
    'homephone',
    'telephone']
});

var stu_info_store = Ext.create('Ext.data.Store', {
    model:'Sit.StuInfo',
	autoLoad: false,
    pageSize:30,
	proxy: {
		type: 'ajax',
		api: {
			read:   SERVER + '/getallstuinfo',
			write:  SERVER + '/setstuinfo',
            update: SERVER + '/setstuinfo',
            create: SERVER + '/setstuinfo'
		},
		reader: {
			type: 'json',
			totalProperty: 'total',
			successProperty: 'success',
			root: 'data',
			messageProperty: 'message'
		},
         writer : {
			type: 'json',
			root: 'data',
            writeAllFields: true,
            idProperty:'id'
		},

		listeners: {
			exception: function(proxy, response, operation) {
                //console.log(operation.getError()) ;
			}
		}
	}
});

Ext.define('Sit.ClassList', {
	extend: 'Ext.data.Model',
	fields: [    
    'id',
    'name' //name
    ]
});

var class_list_store = Ext.create('Ext.data.Store', {
    model:'Sit.ClassList',
	autoLoad: true,
	//autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getclassids'
		},
		reader: {
			type: 'json',
			successProperty: 'success',
			root: 'classids',
			messageProperty: 'message'
		},
		listeners: {
			exception: function(proxy, response, operation) {
                //console.log(operation.getError()) ;
			}
		}
	}
});

Ext.define('Sit.Gender', {
	extend: 'Ext.data.Model',
	fields: [    
    'id',
    'name' //name
    ]
});

var sit_gender_store = Ext.create('Ext.data.Store', {
          model: 'Sit.Gender',
          data : [
              {id: '0',name: '男'},
              {id: '1',name: '女'}
          ]
      });


Ext.define('Sit.Type', {
	extend: 'Ext.data.Model',
	fields: [    
    'id',
    'name' //name
    ]
});

var sit_type_store = Ext.create('Ext.data.Store', {
          model: 'Sit.Type',
          data : [
              {id: '0',name: '普招'},
              {id: '1',name: '三二'},
              {id: '2',name: '二三'},
              {id: '3',name: '预科'},
              {id: '4',name: '对口'},
              {id: '5',name: '高技'},
              {id: '6',name: '其他'}
          ]
      });


Ext.define('Sit.Teacher', {
	extend: 'Ext.data.Model',
	fields: [    
    'id',
    'name' //name
    ]
});

var sit_teacher_store = Ext.create('Ext.data.Store', {
    model:'Sit.Teacher',
	autoLoad: true,
	//autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getheadteachers'
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
	}
});

Ext.define('Sit.Status', {
	extend: 'Ext.data.Model',
	fields: [    
    'id',
    'name' //name
    ]
});

var sit_status_store = Ext.create('Ext.data.Store', {
          model: 'Sit.Status',
          data : [
              {id: '0',name: '在读'},
              {id: '1',name: '休学'},
              {id: '2',name: '退学'},
              {id: '3',name: '参军'},
              {id: '4',name: '请假'},
              {id: '5',name: '修长假'},
              {id: '6',name: '其它'}
          ]
      });
