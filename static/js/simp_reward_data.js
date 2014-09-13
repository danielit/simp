Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model' ]);


Ext.define('reward.NClass', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'nclass', //id
		type: 'string'
	},
    {
        name:'id',
        type:'string'
    }]
});

var reward_nclass_store = Ext.create('Ext.data.Store',{
    model: 'reward.NClass',
    data: [
        {id:'1',nclass:'国级'},
        {id:'2',nclass:'省级'},
        {id:'3',nclass:'市级'},
        {id:'4',nclass:'县级'},
        {id:'5',nclass:'校级'},
        {id:'6',nclass:'系级'},
        {id:'7',nclass:'其他'}
    ]
}) ;

Ext.define('reward.Type', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'type', //id
		type: 'string'
	},
    {
        name:'id',
        type:'string'
    }]
});

var reward_type_store = Ext.create('Ext.data.Store',{
    model: 'reward.Type',
    data: [
        {id:'1',type:'奖励'},
        {id:'2',type:'惩罚'}
    ]
}) ;

Ext.define('reward.Info', {
	extend: 'Ext.data.Model',
	fields: [
    {
        name:'idc',
        type:'string'
    },
    {
		name: 'student', //id
		type: 'string'
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
        name:'dtype',
        type:'string'
    },
    {
        name:'ps',
        type:'string'
    } ]
});

var reward_info_store = Ext.create('Ext.data.Store', {
    model:'reward.Info',
	autoLoad: false,
    pageSize:30,
	//autoSync: true,
	proxy: {
		type: 'ajax',
        api: {
            read: SERVER+ '/getrewardinfo',
			write: SERVER + '/setrewardinfo',
            update: SERVER + '/setrewardinfo',
            create: SERVER + '/setrewardinfo'
		},
		reader: {
			type: 'json',
            totalProperty:'total',
			successProperty: 'success',
			root: 'data',
			messageProperty: 'message',
            idProperty:'id'
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
