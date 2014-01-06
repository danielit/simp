// define const var
HOST = "http://127.0.0.1"
PORT = "8888"
SERVER = HOST + ":" + PORT
Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model', ]);

HOST = "127.0.0.1";
PORT = "8888";
SERVER = "http://" + HOST + ":" + PORT;

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
		name: 'id',
		type: 'int',
	},
    {
        name:'classname',
        type:'string'
    }, 
    {
        name:'stuname',
        type:'string'
    }, 
    {
        name:'quantype',
        type:'string'
    },
    {
        name:'date',
        type:'date'
    },
    {
        name:'quanscore',
        type:'int'
    },
    {
        name:'quanreason',
        type:'string'
    }]
});

var class_id_store = Ext.create('Ext.data.Store', {
	model: 'Quan.ClassID',
	autoLoad: true,
	//autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getclassids',
		},
		reader: {
			type: 'json',
			successProperty: 'success',
			root: 'classids',
			messageProperty: 'message'
		},
		listeners: {
			exception: function(proxy, response, operation) {
				Ext.MessageBox.show({
					title: 'REMOTE EXCEPTION',
					msg: operation.getError(),
					icon: Ext.MessageBox.ERROR,
					buttons: Ext.Msg.OK
				});
			}
		}
	},
});

var student_name_id_store = Ext.create('Ext.data.Store', {
	model: 'Quan.StudentID',
	//autoLoad: true,
	//autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getstunameidsonclassid',
		},
		reader: {
			type: 'json',
			successProperty: 'success',
			root: 'stunameids',
			messageProperty: 'message'
		},
		listeners: {
			exception: function(proxy, response, operation) {
				Ext.MessageBox.show({
					title: 'REMOTE EXCEPTION',
					msg: operation.getError(),
					icon: Ext.MessageBox.ERROR,
					buttons: Ext.Msg.OK
				});
			}
		}
	},
});

var quan_type_store = Ext.create('Ext.data.Store', {
	model: 'Quan.Type',
	autoLoad: true,
	//autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getquantypes',
		},
		reader: {
			type: 'json',
			successProperty: 'success',
			root: 'quantypes',
			messageProperty: 'message'
		},
		listeners: {
			exception: function(proxy, response, operation) {
				Ext.MessageBox.show({
					title: 'REMOTE EXCEPTION',
					msg: operation.getError(),
					icon: Ext.MessageBox.ERROR,
					buttons: Ext.Msg.OK
				});
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
            read: SERVER+ '',
			write: SERVER + '/writequaninfos',
            update: SERVER + '/updatequaninfos',
            create: SERVER + '/createquaninfos'
		},
		reader: {
			type: 'json',
			successProperty: 'success',
			root: 'quan',
			messageProperty: 'message'
		},
        writer : {
			type: 'json',
			root: 'quaninfos',
            writeAllFields: true
		},

		listeners: {
			exception: function(proxy, response, operation) {
				Ext.MessageBox.show({
					title: 'REMOTE EXCEPTION',
					msg: operation.getError(),
					icon: Ext.MessageBox.ERROR,
					buttons: Ext.Msg.OK
				});
			}
		}
	},
});


Ext.define('Quan.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.quanform',
	requires: ['Ext.data.*', 'Ext.form.*'],
	xtype: 'form-quan',
	frame: true,
	title: '量化',
	bodyPadding: 5,

	initComponent: function() {
		Ext.apply(this, {
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'qtip'
			},
			layout: 'anchor',
			anchor: '100%',
            collapsible:'ture',
			align: 'center',
			items: [{
				xtype: 'container',
				itemId: 'form.container.a',
				layout: 'hbox',
				defaultType: 'textfield',
				margin: '0 0 5 0',
				items: [{
					xtype: 'combobox',
					id: 'cbclass',
					name: 'class',
					displayField: 'name',
					valueField: 'id',
					queryMode: 'remote',
					emptyText: '请选择班级...',
					fieldLabel: '班级',
					hideLabel: false,
					margins: '0 6 0 0',
					store: class_id_store,
					allowBlank: false,
					forceSelection: true,
					listeners: {
						scop: this,
						'select': function(combo, records, index) {
							classid = combo.getValue();
							student_name_id_store.load({
								'params': {
									'classid': classid
								}
							});
						}
					}
				},
				{
					xtype: 'combobox',
					name: 'student',
					id: 'cbname',
					displayField: 'name',
					valueField: 'id',
					queryMode: 'local',
					emptyText: '请选择姓名...',
					fieldLabel: '姓名',
					margins: '0 6 0 0',
					store: student_name_id_store,
					allowBlank: false,
					forceSelection: true,
					listeners: {
						scop: this,
						'select': function(combo, records, index) {}
					}
				}]
			},
			{
				xtype: 'container',
				itemId: 'form.container.b',
				layout: 'hbox',
				defaultType: 'textfield',
				margin: '0 0 5 0',
				items: [{
					xtype: 'combobox',
					id: 'cbquantype',
					name: 'quan_type',
					displayField: 'name',
					valueField: 'id',
					queryMode: 'remote',
					emptyText: '请选择量化类型...',
					fieldLabel: '类型',
					margins: '0 6 0 0',
					store: quan_type_store,
					allowBlank: false,
					forceSelection: true

				},
				{
					xtype: 'datefield',
					id: 'quandate',
					fieldLabel: '日期',
					name: 'quan_date',
					allowBlank: false,
					margins: '0 6 0 0',
					maxValue: new Date()
				}]

			},
			{
				xtype: 'container',
				itemId: 'form.container.c',
				layout: 'hbox',
				defaultType: 'textfield',
				margin: '0 0 5 0',
				items: [{
					xtype: 'numberfield',
					id: 'quanscroe',
					name: 'quan_score',
					id: 'quan_score',
					fieldLabel: '量化分',
					margins: '0 6 0 0',
					value: 0,
					maxValue: 20,
					minValue: - 20,
					allowBlank: false

				}]
			},
			{
				xtype: 'container',
				itemId: 'form.container.d',
				layout: 'hbox',
				margin: '0 0 5 0',
				items: [{
					xtype: 'textareafield',
					id: 'quanreason',
					grow: true,
					margins: '0 6 0 0',
					name: 'reason',
					id: 'reason',
					fieldLabel: '原由',
					allowBlank: false,
					width: 500,
					//autoWidth:true,
					emptyText: '请填写此次量化处理原因...'
				}]
			}],
			buttons: [{
				text: '取消',
				scope: this,
				handler: this.onResetClick
			},
			{
				text: '确定',
				scope: this,
				handler: this.onCompleteClick
			}]
		});
		this.callParent();
	},

	onResetClick: function() {
		this.getForm().reset();
	},

	onCompleteClick: function() {
		var form = this.getForm();
		if (form.isValid()) {
			Ext.MessageBox.alert('Submitted Values', form.getValues(true));
		}
	},

	onMailingAddrFieldChange: function(field) {
		var copyToBilling = this.down('[name=billingSameAsMailing]').getValue(),
		copyField = this.down('[name=' + field.billingFieldName + ']');

		if (copyToBilling) {
			copyField.setValue(field.getValue());
		} else {
			copyField.clearInvalid();
		}
	},

	/**
                     *      * Enables or disables the billing address fields according to whether the checkbox is checked.
                     *           * In addition to disabling the fields, they are animated to a low opacity so they don't take
                     *                * up visual attention.
                     *                     */
	onSameAddressChange: function(box, checked) {
		var fieldset = box.ownerCt;
		Ext.Array.forEach(fieldset.previousSibling().query('textfield'), this.onMailingAddrFieldChange, this);
		Ext.Array.forEach(fieldset.query('textfield'), function(field) {
			field.setDisabled(checked);
			// Animate the opacity on each field. Would be more efficient to wrap them in a container
			// and animate the opacity on just the single container element, but IE has a bug where
			// the alpha filter does not get applied on position:relative children.
			// This must only be applied when it is not IE6, as it has issues with opacity when cleartype
			// is enabled
			if (!Ext.isIE6) {
				field.el.animate({
					opacity: checked ? 0.3: 1
				});
			}
		});
	}
});

//define the grid
Ext.define('Quan.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.quangrid',

	requires: ['Ext.grid.plugin.CellEditing', 'Ext.form.field.Text', 'Ext.toolbar.TextItem', 'Ext.panel.Panel', 'Ext.ux.form.SearchField', 'Ext.ux.CheckColumn', 'Ext.selection.CheckboxModel', 'Ext.selection.CellModel'],

	initComponent: function() {

		this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
			clickToEdit: 1
		});

		this.CboxModel = Ext.create('Ext.selection.CheckboxModel');
		this.pBar = Ext.create('Ext.PagingToolbar', {
			store: this.store,
			displayInfo: true,
			displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
			emptyMsg: "没有数据"
		});

		Ext.apply(this, {
			iconCls: 'icon-grid',
			frame: true,
            //closeable:true,
			//closeAction: 'hiden',
            collapsible:'ture',
			selModel: this.CboxModel,
			bbar: this.pBar,
			plugins: [this.editing],
			dockedItems: [{
				xtype: 'toolbar',
				items: [{
					iconCls: 'icon-add',
					text: '修改',
					scope: this,
					handler: this.onModifyClick
				},
				{
					iconCls: 'icon-delete',
					text: '删除',
					disabled: true,
					itemId: 'delete',
					scope: this,
					handler: this.onDeleteClick
				},
				'-', {
					width: 300,
					fieldLabel: '搜索',
					labelWidth: 50,
					xtype: 'searchfield',
					store: this.store
				}]
			},
			{
				weight: 2,
				xtype: 'toolbar',
				dock: 'bottom',
				items: [{
					xtype: 'tbtext',
					text: '<b>@cfg</b>'
				},
				'|', {
					text: 'autoSync',
					enableToggle: true,
					pressed: true,
					tooltip: 'When enabled, Store will execute Ajax requests as soon as a Record becomes dirty.',
					scope: this,
					toggleHandler: function(btn, pressed) {
						this.store.autoSync = pressed;
					}
				},
				{
					text: 'batch',
					enableToggle: true,
					pressed: true,
					tooltip: 'When enabled, Store will batch all records for each type of CRUD verb into a single Ajax request.',
					scope: this,
					toggleHandler: function(btn, pressed) {
						this.store.getProxy().batchActions = pressed;
					}
				},
				{
					text: 'writeAllFields',
					enableToggle: true,
					pressed: false,
					tooltip: 'When enabled, Writer will write *all* fields to the server -- not just those that changed.',
					scope: this,
					toggleHandler: function(btn, pressed) {
						this.store.getProxy().getWriter().writeAllFields = pressed;
					}
				}]
			},
			{
				weight: 1,
				xtype: 'toolbar',
				dock: 'bottom',
				ui: 'footer',
				items: ['->', {
					iconCls: 'icon-save',
					text: '提交',
					scope: this,
					handler: this.onSync
				}]
			}],
			columns: [{
				text: 'ID',
				//width: 40,
				sortable: true,
				resizable: false,
				draggable: false,
				hideable: false,
				menuDisabled: true,
				dataIndex: 'id'
			},
			{
				header: 'Email',
				flex: 1,
				sortable: true,
				dataIndex: 'email',
				field: {
					type: 'textfield'
				}
			},
			{
				header: 'First',
				//width: 100,
				sortable: true,
				dataIndex: 'first',
				field: {
					type: 'textfield'
				}
			},
			{
				header: 'Last',
				//width: 100,
				sortable: true,
				dataIndex: 'last',
				field: {
					type: 'textfield'
				}
			}]
		});
		this.callParent();
		this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
	},

	onSelectChange: function(selModel, selections) {
        if (selections) {
		    this.down('#delete').setDisabled(selections.length === 0);
        }
	},

	onSync: function() {
		this.store.sync();
	},

	onDeleteClick: function() {
		var selections = this.getView().getSelectionModel().getSelection();
		Ext.Array.forEach(selections, function(selection, index) {
			//console.log(this.store) ;
			this.store.remove(selection);
		},
		this);
	},

	onModifyClick: function() {
		var selection = this.getView().getSelectionModel().getSelection()[0];
		if (selection) {
			console.log(selection);
		}
	}
	/*
	onAddClick: function() {
		var rec = new Writer.Person({
			first: '',
			last: '',
			email: ''
		}),
		edit = this.editing;

		edit.cancelEdit();
		this.store.insert(0, rec);
		edit.startEditByPosition({
			row: 0,
			column: 1
		});
	}
*/
});

Ext.require(['Ext.data.*', 'Ext.tip.QuickTipManager', 'Ext.window.MessageBox']);

//define the container for quan 
Ext.define('Quan.window', {
	extend: 'Ext.container.Container',
	alias: 'widget.quancontainer',

	initComponent: function() {
		Ext.apply(this, {
			padding: '0 0 0 0',
			//width: 700,
			//height: Ext.themeName === 'neptune' ? 500: 450,
			renderTo: Ext.getBody(),
			title: '量化管理',
			icon: 'static/pic/css/tabs.gif',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [{
				itemId: 'quangrid',
				xtype: 'quangrid',
				title: '量化信息',
				flex: 1,
				store: quan_info_store,
				listeners: {
					selectionchange: function(selModel, selected) {
						value = null
						if (selected && selected[0]) {
							console.log(selected[0]);
							value = selected[0].raw.id;
						}
						Ext.getCmp('cbclass').setValue(value);
					}
				}
			},{
				itemId: 'quanform',
				xtype: 'quanform',
                minHeight:100,
				hidden: false,
				manageHeight: false,
				margins: '0 0 0 0',
			}]
		});
		this.callParent();
	}
});

Ext.onReady(function() {
 var main = Ext.create('Ext.container.Viewport', {
		layout: {
			type: 'border',
			padding: '5'
		},
		items: [{
			region: 'north',
			//height: 130,
			bodyPadding: 0,
			split: false,
            xtype:'quancontainer',
            id:'quancontainer'
		}]
    }) ;
}) ;


/*
Ext.onReady(function() {
 	var win = Ext.create('Ext.container.Container', {
		padding: '0 0 0 0',
		width: 700,
		height: Ext.themeName === 'neptune' ? 500: 450,
		renderTo: Ext.getBody(),
		title: '量化管理',
		icon: 'static/pic/css/tabs.gif',
		id: 'test001',
		layout: {
			type: 'vbox',
			align: 'stretch',
			pack: 'start'
		},
		items: [{
			itemId: 'quangrid',
			xtype: 'quangrid',
			title: '量化信息',
			flex: 1,
			store: class_id_store,
			listeners: {
				selectionchange: function(selModel, selected) {
					value = null
					if (selected && selected[0]) {
						console.log(selected[0]);
						value = selected[0].raw.id;
					}
					Ext.getCmp('cbclass').setValue(value);
				}
			}
		},
		{
			itemId: 'quanform',
			xtype: 'quanform',
			hidden: false,
			manageHeight: false,
			margins: '0 0 0 0',
			listeners: {
				create: function(form, data) {
					store.insert(0, data);
				}
			}
		}]
	});
});
*/

