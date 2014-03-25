var QUAN_COUNTER = 0
Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model', ]);


Ext.define('Quan.ClassID', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'name',
		type: 'string',
	},
	{
		name: 'id',
		type: 'string',
	}]
});

Ext.define('Quan.StudentID', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'name',
		type: 'string',
	},
	{
		name: 'id',
		type: 'string',
	}]
});

Ext.define('Quan.Type', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'name',
		type: 'string',
	},
	{
		name: 'id',
		type: 'string',
	}]
});

Ext.define('Writer.Person', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: 'int',
		useNull: true
	},
	'email', 'first', 'last'],
	validations: [{
		type: 'string',
		field: 'first'
	},
	{
		type: 'string',
		field: 'last'
	}]
});

Ext.define('Quan.Info', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'idc',
		type: 'int',
	},
    {
        //name:'classname',
        name:'class',
        type:'string'
    }, 
    {
        //name:'stuname',
        name:'student',
        type:'string'
    }, 
    {
        //name:'quantype',
        name:'quan_type',
        type:'string'
    },
    {
        //name:'date',
        name:'quan_date',
        type:'string',
    },
    {
        name:'quan_score',
        //name:'quanscore',
        type:'int'
    },
    {
        //name:'quanreason',
        name:'quan_reason',
        type:'string'
    }]
});


Ext.define('Quan.WeekInfo', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'idc', //id
		type: 'int',
	},
    'class', //class name
    'disp_score',// dicpline
    'disp_quan',
    'disp_rank',
    'heal_score',//health
    'heal_quan',
    'heal_rank',
    'domi_score',//dominitory
    'domi_quan',
    'domi_rank',
    'acti_score',//activity or other
    'acti_quan',
    'acti_rank',
    'total',
    'rank'
    ]
});

Ext.define('Quan.WeekList', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'week', //id
		type: 'string',
	},
    {
        name:'id',
        type:'int'
    }]
});

var week_list_store =Ext.create('Ext.data.Store',{
    model: 'Quan.WeekList',
    data: [
        {id:'1',week:'第1周'},
        {id:'2',week:'第2周'},
        {id:'3',week:'第3周'},
        {id:'4',week:'第4周'},
        {id:'5',week:'第5周'},
        {id:'6',week:'第6周'},
        {id:'7',week:'第7周'},
        {id:'8',week:'第8周'},
        {id:'9',week:'第9周'},
        {id:'10',week:'第10周'},
        {id:'11',week:'第11周'},
        {id:'12',week:'第12周'},
        {id:'13',week:'第13周'},
        {id:'14',week:'第14周'},
        {id:'15',week:'第15周'},
        {id:'16',week:'第16周'},
        {id:'17',week:'第17周'},
        {id:'18',week:'第18周'},
        {id:'19',week:'第19周'},
        {id:'20',week:'第20周'},
        {id:'21',week:'第21周'}
    ]
}) ;


var class_id_store = Ext.create('Ext.data.Store', {
	model: 'Quan.ClassID',
	autoLoad: true,
    //pageSize:50,
	//autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getclassids',
		},
		reader: { type: 'json',
			successProperty: 'success',
			root: 'classids',
			messageProperty: 'message',
			totalProperty: 'total'
		},
		listeners: {
			exception: function(proxy, response, operation) {
                console.log(operation.getError()) ;
			}
		}
	},
});

var student_name_id_store = Ext.create('Ext.data.Store', {
	model: 'Quan.StudentID',
	autoLoad: false,
	//autoSync: true,
    //buffered: true,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getstunameidsonclassid',
		},
		reader: {
			type: 'json',
			totalProperty: 'total',
			successProperty: 'success',
			root: 'stunameids',
			messageProperty: 'message'
		},
		listeners: {
			exception: function(proxy, response, operation) {
                console.log(operation.getError()) ;
				}
		}
	},
});

var quan_type_store = Ext.create('Ext.data.Store', {
	model: 'Quan.Type',
	autoLoad: true,
    //buffered: true,
	//autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getquantypes',
		},
		reader: {
			type: 'json',
			totalProperty: 'total',
			successProperty: 'success',
			root: 'quantypes',
			messageProperty: 'message'
		},
		listeners: {
			exception: function(proxy, response, operation) {
                console.log(operation.getError()) ;
			}
		}
	},
});

var quan_info_store = Ext.create('Ext.data.Store', {
	model: 'Quan.Info',
	//autoLoad: true,
	//autoSync: true,
	proxy: {
		type: 'ajax',
        
		api: {
            read: SERVER+ '/getquaninfos',
			write: SERVER + '/addquaninfos',
            update: SERVER + '/addquaninfos',
            create: SERVER + '/addquaninfos'
		},
		reader: {
			type: 'json',
			totalProperty: 'total',
			successProperty: 'success',
			root: 'quan',
			messageProperty: 'message',
            idProperty:'id',
		},
        writer : {
			type: 'json',
			root: 'quaninfos',
            writeAllFields: true,
            idProperty:'id'
		},

		listeners: {
			exception: function(proxy, response, operation) {
                console.log(operation.getError()) ;
			}
		}
	},
});

var quan_detail_store = Ext.create('Ext.data.Store', {
	model: 'Quan.Info', autoLoad: false,
    pageSize:45,
	//autoSync: true,
	proxy: {
		type: 'ajax',
        
		api: {
            read: SERVER+ '/getquaninfos',
			write: SERVER + '/writequaninfos',
            update: SERVER + '/updatequaninfos',
            create: SERVER + '/addquaninfos'
		},
		reader: {
			type: 'json',
			totalProperty: 'total',
			successProperty: 'success',
			root: 'quan',
			messageProperty: 'message',
            idProperty:'id',
		},
        writer : {
			type: 'json',
			root: 'quaninfos',
            writeAllFields: true,
            idProperty:'id'
		},

		listeners: {
			exception: function(proxy, response, operation) {
                console.log(operation.getError()) ;
			}
		}
	},
});


var quan_week_store = Ext.create('Ext.data.Store', {
    model:'Quan.WeekInfo',
	autoLoad: false,
    pageSize:45,
	//autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getclassquanofweek',
		},
		reader: {
			type: 'json',
			totalProperty: 'total',
			successProperty: 'success',
			root: 'classquanweek',
			messageProperty: 'message'
		},
		listeners: {
			exception: function(proxy, response, operation) {
                console.log(operation.getError()) ;
			}
		}
	},
});
