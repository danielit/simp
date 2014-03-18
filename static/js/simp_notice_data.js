Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model', ]);


Ext.define('SM.Notice', {
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

var sm_notice_store = Ext.create('Ext.data.Store', {
    model:'SM.Notice',
	autoLoad: false,
    pageSize:45,
	//autoSync: true,
	proxy: {
		type: 'ajax',
        api: {
            read: SERVER+ '/getnotices',
			write: SERVER + '/setnotices',
            update: SERVER + '/setnotices',
            create: SERVER + '/setnotices'
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
