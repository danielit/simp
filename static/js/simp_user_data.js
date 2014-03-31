Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model' ]);


Ext.define('SM.user', {
	extend: 'Ext.data.Model',
	fields: [
    {
        name:'idc',
        type:'string'
    },
    {
		name: 'user', //id
		type: 'string'
	},
    {
        name:'passwd',
        type:'string'
    },
    {
        name:'role',
        type:'string'
    },
    {
        name:'number',
        type:'string'
    }]
});

var sm_user_store = Ext.create('Ext.data.Store', {
    model:'SM.user',
	autoLoad: false,
    pageSize:30,
	//autoSync: true,
	proxy: {
		type: 'ajax',
        api: {
            read: SERVER+ '/getuser',
			write: SERVER + '/setuser',
            update: SERVER + '/setuser',
            create: SERVER + '/setuser'
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

Ext.define('User.Role', {
	extend: 'Ext.data.Model',
	fields: [    
    'id',
    'name' //name
    ]
});

var user_role_store = Ext.create('Ext.data.Store', {
          model: 'User.Role',
          data : [
              {id: '0',name: '管理员'},
              {id: '1',name: '老师'},
              {id: '2',name: '学生'}
          ]
      });
