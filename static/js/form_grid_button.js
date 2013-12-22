// define const var
HOST = "http://127.0.0.1"
PORT = "8888"
SERVER = HOST + ":" + PORT
Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

//define some function which is useful for op somthing
/*
 *  add tab to a tabpanel
 */

function add2tabpanel(tabpanel, tobj) {

	if (!tobj) return false;

	if (tabpanel != tobj.ownerCt) {
		tabpanel.add(tobj);
	}
    if (tobj.isHidden()){
        tobj.show() ;
    }

	// set the tab to be activity
	tabpanel.setActiveTab(tobj);
	return true;
}

/* 
 * tree item click handler
 */
function treeItemClick(view, record, item, index, e) {
	//  //alert(record.raw.text) ;
	var n = mgrList[record.raw.id];
	switch (n) {
	case 0:
		add2tabpanel(mgrTabpanel, win);
		break;
	case 1:
		add2tabpanel(mgrTabpanel, testGrid2);
		break;
	case 2:
		tabId = "tmp2";
		var cmp = Ext.getCmp(tabId);
		if (!cmp) {
			tmpGrid = getGridPanel(tabId, 'tmp2', cols, true);
			add2tabpanel(mgrTabpanel, tmpGrid);
		} else {
			//alert('aleray create the same id tab') ;
			mgrTabpanel.setActiveTab(Ext.getCmp(tabId))
		}

		break;
	case 3:
		//	add2tabpanel(mgrTabpanel, testGrid);
		break;
	case 4:
		//  add2tabpanel(mgrTabpanel, testGrid);
		break;
	case 5:
		//  add2tabpanel(mgrTabpanel, testGrid);
		break;
	case 6:
		//      add2tabpanel(mgrTabpanel, testGrid);
		break;
	default:
		alert(record.raw.id);
		break;
	}
}

//define the form
Ext.define('Writer.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.writerform',

	requires: ['Ext.form.field.Text'],

	initComponent: function() {
		this.addEvents('create');
		Ext.apply(this, {
			activeRecord: null,
			iconCls: 'icon-user',
			frame: true,
			title: 'User -- All fields are required',
			defaultType: 'textfield',
			bodyPadding: 5,
			fieldDefaults: {
				anchor: '100%',
				labelAlign: 'right'
			},
			items: [{
				fieldLabel: 'Email',
				name: 'email',
				allowBlank: false,
				vtype: 'email'
			},
			{
				fieldLabel: 'First',
				name: 'first',
				allowBlank: false
			},
			{
				fieldLabel: 'Last',
				name: 'last',
				allowBlank: false
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				ui: 'footer',
				items: ['->', {
					iconCls: 'icon-save',
					itemId: 'save',
					text: 'Save',
					disabled: true,
					scope: this,
					handler: this.onSave
				},
				{
					iconCls: 'icon-user-add',
					text: 'Create',
					scope: this,
					handler: this.onCreate
				},
				{
					iconCls: 'icon-reset',
					text: 'Reset',
					scope: this,
					handler: this.onReset
				}]
			}]
		});
		this.callParent();
	},

	setActiveRecord: function(record) {
		this.activeRecord = record;
		if (record) {
			this.down('#save').enable();
			this.getForm().loadRecord(record);
		} else {
			this.down('#save').disable();
			this.getForm().reset();
		}
	},

	onSave: function() {
		var active = this.activeRecord,
		form = this.getForm();

		if (!active) {
			return;
		}
		if (form.isValid()) {
			form.updateRecord(active);
			this.onReset();
		}
	},

	onCreate: function() {
		var form = this.getForm();

		if (form.isValid()) {
			this.fireEvent('create', this, form.getValues());
			form.reset();
		}

	},

	onReset: function() {
		this.setActiveRecord(null);
		this.getForm().reset();
	}
});

//define the grid
Ext.define('Writer.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.writergrid',

	requires: ['Ext.grid.plugin.CellEditing', 
                'Ext.form.field.Text', 
                'Ext.toolbar.TextItem', 
    'Ext.panel.Panel',
    'Ext.ux.form.SearchField', 'Ext.ux.CheckColumn', 'Ext.selection.CheckboxModel', 'Ext.selection.CellModel'],

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
            closeAction:'hiden',
			selModel: this.CboxModel,
			bbar: this.pBar,
			plugins: [this.editing],
			dockedItems: [{
				xtype: 'toolbar',
				items: [{
					iconCls: 'icon-add',
					text: 'Add',
					scope: this,
					handler: this.onAddClick
				},
				{
					iconCls: 'icon-delete',
					text: 'Delete',
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
					text: 'Sync',
					scope: this,
					handler: this.onSync
				}]
			}],
			columns: [{
				text: 'ID',
				width: 40,
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
				width: 100,
				sortable: true,
				dataIndex: 'first',
				field: {
					type: 'textfield'
				}
			},
			{
				header: 'Last',
				width: 100,
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
		this.down('#delete').setDisabled(selections.length === 0);
	},

	onSync: function() {
		this.store.sync();
	},

	onDeleteClick: function() {
		var selection = this.getView().getSelectionModel().getSelection()[0];
		if (selection) {
			this.store.remove(selection);
		}
	},

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
		type: 'length',
		field: 'email',
		min: 1
	},
	{
		type: 'length',
		field: 'first',
		min: 1
	},
	{
		type: 'length',
		field: 'last',
		min: 1
	}]
});

Ext.require(['Ext.data.*', 'Ext.tip.QuickTipManager', 'Ext.window.MessageBox']);

Ext.onReady(function() {
	Ext.tip.QuickTipManager.init();

	Ext.create('Ext.button.Button', {
		margin: '0 0 20 20',
		text: 'Reset sample database back to initial state',
		renderTo: Ext.getBody(),
		tooltip: 'The sample database is stored in the session, including any changes you make. Click this button to reset the sample database to the initial state',
		handler: function() {
            //Ext.getCmp("form").show() ;
            tmpform = win.child('#form') ;
            if (tmpform.isHidden()){
                tmpform.show() ;
            } else {
                tmpform.hide() ;
            }
            /* 
			Ext.getBody().mask('Resetting...');
			Ext.Ajax.request({
				url: "SERVER" + '/qu',
				callback: function(options, success, response) {
					Ext.getBody().unmask();

					var didReset = true,
					o;

					if (success) {
						try {
							o = Ext.decode(response.responseText);
							didReset = o.success === true;
						} catch(e) {
							didReset = false;
						}
					} else {
						didReset = false;
					}

					if (didReset) {
						store.load();
						win.down('#form').setActiveRecord(null);
						Ext.example.msg('Reset', 'Reset successful');
					} else {
						Ext.MessageBox.alert('Error', 'Unable to reset example database');
					}

				}
			});
	*/	}
	})

	var store = Ext.create('Ext.data.Store', {
		model: 'Writer.Person',
		autoLoad: true,
		autoSync: true,
		proxy: {
			type: 'ajax',
			api: {
				read: SERVER + '/qu',
				create: SERVER + '/qu',
				update: SERVER + '/qu',
				destroy: SERVER + '/qu'
			},
			reader: {
				type: 'json',
				successProperty: 'success',
				root: 'data',
				messageProperty: 'message'
			},
			writer: {
				type: 'json',
				writeAllFields: false,
				root: 'data'
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
		listeners: {
			write: function(proxy, operation) {
				if (operation.action == 'destroy') {
					win.child('#form').setActiveRecord(null);
				}
				Ext.example.msg(operation.action, operation.resultSet.message);
			}
		}
	});
    var win = Ext.create('Ext.container.Container', {
	//var win = Ext.create('Ext.tab.Panel', {
	//var win = Ext.create('Ext.panel.Panel', {
		padding: '0 0 0 0',
		width: 500,
		height: Ext.themeName === 'neptune' ? 500: 450,
		renderTo: Ext.getBody(),
        title:'量化管理',
	    icon: 'static/pic/css/tabs.gif',
		//renderTo: mgrTabpanel,
		layout: {
			type: 'vbox',
			align: 'stretch',
            pack:'start'
		},
		items: [{
			itemId: 'grid',
			xtype: 'writergrid',
			title: 'User List',
			flex: 1,
			store: store,
			listeners: {
				selectionchange: function(selModel, selected) {
					win.child('#form').setActiveRecord(selected[0] || null);
				}
			}
		},{
			itemId: 'form',
			xtype: 'writerform',
            hidden:true,
			manageHeight: false,
			margins: '0 0 0 0',
			listeners: {
				create: function(form, data) {
					store.insert(0, data);
				}
			}
		}]
	});

	//define a tree
	var mgrTree = Ext.create('Ext.tree.Panel', {
		title: '学生工作',
		deferRowRender: true,
		useArrows: true,
		listeners: {
			itemclick: {
				fn: treeItemClick
			},
		},
		root: {
			id: 'stuMangeRoot',
			text: '学生管理',
			expanded: true,
			children: [{
				id: 'dayQuan',
				text: '日常量化',
				leaf: true
			},
			{
				id: 'money',
				text: '奖助学金',
				leaf: true
			},
			{
				id: 'stuInfo',
				text: '学生信息',
				leaf: true
			},
			{
				id: 'vacation',
				text: '学生请假',
				children: [{
					id: 'askVacation',
					text: '请假申请',
					leaf: true
				},
				{
					id: 'reviewAskVacation',
					text: '请假审批',
					leaf: true
				}]
			},
			{
				text: '在校情况',
				id: 'stuInSchool',
				children: [{
					id: 'inSchoolStu',
					text: '在校学生',
					leaf: true
				},
				{
					id: 'outSchoolStu',
					text: '离校学生',
					leaf: true
				}]

			}]
		}
	});

	// define a table panel
	var mgrTabpanel = Ext.create('Ext.tab.Panel', {
		id: 'mgrTabpanel',
		name: "mgrTabpanel",
		renderTo: Ext.getBody(),
		enableTabScroll: true,
		defaults: {
			autoScroll: true,
			closable: true,
			bodyPadding: 10
		},
		items: [{
			id: 'tab_notices',
			closable: false,
			title: '通知/公告',
			icon: 'static/pic/css/tabs.gif',
			html: 'A simple tab'
		}]
	});
	
    ret = add2tabpanel(mgrTabpanel,win) ;
    if (!ret){
        alert("add win to tabpanel false") ;
    }	
    var main = Ext.create('Ext.container.Viewport', {
		layout: {
			type: 'border',
			padding: '5'
		},
		items: [{
			region: 'north',
			height: 130,
			bodyPadding: 0,
			split: false,
			html: ['<img src=static/pic/main6.jpg width=1600 height=150 />', ''].join(''),
		},
		{
			title: '工具栏',
			id: 'toolbar',
			region: 'west',
			layout: 'accordion',
			stateId: 'statePanelExample',
			statefule: true,
			split: true,
			width: 220,
			collapsible: true,

			items: [
			mgrTree, {
				title: '系统管理',
				html: 'System Management'
			},
			{
				title: '在线帮助',
				html: 'Online Help'
			},
			{
				title: '其他',
				html: 'Other to Deal'
			}]
		},
		{
			region: 'center',
			layout: 'fit',
			items: [mgrTabpanel, ]
		}]
	});

});

