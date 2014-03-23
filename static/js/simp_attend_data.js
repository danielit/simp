Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model', ]);


Ext.define('Attend.NClass', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'nclass', //id
		type: 'string',
	},
    {
        name:'id',
        type:'string'
    }]
});

var attend_nclass_store = Ext.create('Ext.data.Store',{
    model: 'Attend.NClass',
    data: [
        {id:'1',nclass:'第1节'},
        {id:'2',nclass:'第2节'},
        {id:'3',nclass:'第3节'},
        {id:'4',nclass:'第4节'},
        {id:'5',nclass:'第5节'},
        {id:'6',nclass:'第6节'},
        {id:'2',nclass:'第1-2节'},
        {id:'7',nclass:'第3-4节'},
        {id:'8',nclass:'第5-6节'}
    ]
}) ;

Ext.define('Attend.Type', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'type', //id
		type: 'string',
	},
    {
        name:'id',
        type:'string'
    }]
});

var attend_type_store = Ext.create('Ext.data.Store',{
    model: 'Attend.Type',
    data: [
        {id:'1',type:'请假'},
        {id:'2',type:'迟到'},
        {id:'3',type:'早退'},
        {id:'4',type:'逃课'},
        {id:'5',type:'其它'}
    ]
}) ;

Ext.define('Attend.Info', {
	extend: 'Ext.data.Model',
	fields: [
    {
        name:'idc',
        type:'string'
    },
    {
		name: 'student', //id
		type: 'string',
	},
    {
        name:'class',
        type:'string'
    },
    {
        name:'type',
        type:'string'
    },
    {
        name:'date',
        type:'string'
    },    
    {
        name:'nclass',
        type:'string'
    },
    {
        name:'ps',
        type:'string'
    } ]
});

var attend_info_store = Ext.create('Ext.data.Store', {
    model:'Attend.Info',
	autoLoad: false,
    pageSize:30,
	//autoSync: true,
	proxy: {
		type: 'ajax',
        api: {
            read: SERVER+ '/getattendinfo',
			write: SERVER + '/setattendinfo',
            update: SERVER + '/setattendinfo',
            create: SERVER + '/setattendinfo'
		},
		reader: {
			type: 'json',
            totalProperty:'total',
			successProperty: 'success',
			root: 'data',
			messageProperty: 'message',
            idProperty:'id',
		},
        writer : {
			type: 'json',
			root: 'data',
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
