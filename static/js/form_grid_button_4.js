// define const var
HOST = "http://127.0.0.1"
PORT = "8888"
SERVER = HOST + ":" + PORT
QUAN_COUNTER = 0
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
    //buffered: true,
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
    //buffered: true,
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
            read: SERVER+ '/getquaninfos',
			write: SERVER + '/writequaninfos',
            update: SERVER + '/updatequaninfos',
            create: SERVER + '/addquaninfos'
		},
		reader: {
			type: 'json',
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
			iconCls: 'icon-form',
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
					id: 'quanhidden',
					//fieldLabel: '日期',
					name: 'idc',
                    hidden:true
				},
				{
					xtype: 'datefield',
					id: 'quandate',
                    format:'Y/m/d',
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
					id: 'quanscore',
					name: 'quan_score',
					fieldLabel: '量化',
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
					name: 'quan_reason',
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
			//Ext.MessageBox.alert('Submitted Values', form.getValues(true));
            
            val = form.getValues() ;
            val.class = Ext.getCmp('cbclass').getRawValue() ;
            val.student = Ext.getCmp('cbname').getRawValue() ;
            val.quan_type = Ext.getCmp('cbquantype').getRawValue() ;
            dt = Ext.getCmp('quandate').getValue() ;
            console.log(dt) ;
            dtraw = Ext.getCmp('quandate').getRawValue() ;
            console.log(dtraw) ;
            val.quan_date = new Date(dt).toLocaleDateString() ; 
            val.quan_date = dtraw ; 
            console.log(val.quan_date) ;
            val.quan_score = Ext.getCmp('quanscore').getValue() ;
            val.quan_reason = Ext.getCmp('quanreason').getValue() ;
            //id is used for somthing in extjs4 ,so we cann't use it ,here use 'idc' for id
            //val.idc = quan_info_store.getCount() + 1 ;
            val.idc = ++QUAN_COUNTER ;

            console.log(val) ;
            
            quan_info_store.add(val) ;

            form.reset() ;
/*
            qg = Ext.getCmp('quangrid') ;
            console.log(qg.getCollapsed()) ;
            if(qg.getCollapsed() == false){ //if not collasped return false ,else return top left buttom right 
                ret = qg.collapse() ;
                console.log('collapse') ;

                console.log(ret) ;
                
            }else {
                qg.expand() ;
                console.log('expand') ;
            }
            
 */           
            /*var quaninfo = Ext.create('Quan.Info',{
                id:quan_info_store.count()+1,
                'class':cls,
                student:stu,
                quan_type:type,
                quan_date:dt,
                quan_score:score,
                quan_reason:reason
            }) ;*/ 
           //about key -> value, add 'id' to form ,and a globe counter for 'id'
            //rec = form.getRecord() ;
            //rec.set(val) ;
            //console.log(quaninfo.data) ;
            //quan_info_store.add(quaninfo) ;
            //quan_info_store.insert(quan_info_store.count(),quaninfo) ;
            //quan_info_store.insert(quan_info_store.getCount(),val) ;
            //val['id'] = quan_info_store.count()+1;
            //quan_info_store.add(val) ;
            //recs = quan_info_store.getNewRecords() ;
            //console.log(recs[0]) ;
           // form.reset() ;
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
					text: '增加',
					scope: this,
					handler: this.onAddClick
				},'|',
                {
					iconCls: 'icon-modify',
					text: '修改',
					scope: this,
					handler: this.onModifyClick
				},'|',
				{
					iconCls: 'icon-delete',
					text: '删除',
					disabled: true,
					itemId: 'delete',
					scope: this,
					handler: this.onDeleteClick
				},'|', 
                {
					//iconCls: 'icon-search',
					width: 300,
					fieldLabel: '搜索',
					//labelWidth: 50,
					xtype: 'searchfield',
					store: this.store
				}]
			},
			/*{
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
			},*/
			{
				weight: 1,
				xtype: 'toolbar',
				dock: 'bottom',
				ui: 'footer',
				items: ['->', {
					iconCls: 'icon-save',
					text: '提交',
					scope: this,
					//handler: this.onSync
                    handler:function(){
                       /* console.log('sync is click') ;
                        console.log(quan_info_store.count()) ;
                        console.log(quan_info_store.getNewRecords().length);
                        console.log(quan_info_store.getUpdatedRecords().length);
                        console.log(quan_info_store.getRemovedRecords().length);
                        */
                        ret = quan_info_store.sync({
                            success:function(batch){
                                console.log("success") ;
                                console.log(batch) ;
                            },
                            failure:function(batch){
                                console.log("failure") ;
                                console.log(batch) ;
                            }
                        }) ; 
                        //ret = quan_info_store.commitChanges() ;
                        //ret = quan_info_store.sync() ;
                        //ret=quan_info_store.save() ;
                        console.log(ret) ;
                    }
				}]
			}],
			columns: [{
				text: '序号',
				//width: 40,
				sortable: true,
				resizable: false,
				draggable: false,
				hideable: false,
				menuDisabled: true,
				dataIndex: 'idc'
			},
			{
				header: '班级',
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'class',
				field: {
					type: 'textfield'
				}
			},
			{
				header: '学生',
				//width: 100,
				sortable: true,
				dataIndex: 'student',
				//dataIndex: 'stuname',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '类型',
				//width: 100,
				sortable: true,
				dataIndex: 'quan_type',
				//dataIndex: 'quantype',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '日期',
				//width: 100,
				sortable: true,
				dataIndex: 'quan_date',
				//dataIndex: 'date',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '量化',
				//width: 100,
				sortable: true,
				dataIndex: 'quan_score',
				//dataIndex: 'quanscore',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '原由',
				//width: 100,
				sortable: false,
				menuDisabled: true,
				//dataIndex: 'quanreason',
				dataIndex: 'quan_reason',
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
		quan_info_store.sync();
	},

	onDeleteClick: function() {
		var selections = this.getView().getSelectionModel().getSelection();
		Ext.Array.forEach(selections, function(selection, index) {
			//console.log(this.store) ;
			this.store.remove(selection);
		},
		this);
	},
//get the data from grid to form
	onModifyClick: function() {
		var selection = this.getView().getSelectionModel().getSelection()[0];
		if (selection) {
			console.log(selection);
		}
	},
	onAddClick: function() {
        quanform = Ext.getCmp('quanform') ;
        if (quanform.isHidden()){
            quanform.show() ;
        }
	}
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
			//height: Ext.themeName === 'neptune' ? 500: 450, renderTo: Ext.getBody(), title: '量化管理', icon: 'static/pic/css/tabs.gif',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [{
				itemId: 'quangrid',
				id: 'quangrid',
				xtype: 'quangrid',
				title: '量化信息',
				flex: 1,
                //minHeight:200,
                //maxHeight:500,
				store: quan_info_store,
				listeners: {
					selectionchange: function(selModel, selected) {
						value = null
						if (selected && selected[0]) {
							console.log(selected[0]);
							value = selected[0].raw;
						}
						//Ext.getCmp('quanform').setValue(value);
                        if (value != null){ 
                            console.log(value) ;
                            Ext.getCmp('cbclass').setRawValue(value.class) ;
                            Ext.getCmp('cbname').setRawValue(value.student) ;
                            Ext.getCmp('cbquantype').setRawValue(value.quan_type) ;
                            Ext.getCmp('quanscore').setRawValue(value.quan_score) ;
                            Ext.getCmp('quanreason').setValue(value.quan_reason) ;
                            //Ext.getCmp('quanhidden').setValue(value.idc) ;
                            //add a new record ,not modify , of course , we can do a modify op 
                            //Ext.getCmp('quanhidden').setValue(++QUAN_COUNTER) ;

                            date = value.quan_date ;
                            date = date.replace('年','/') ;
                            date = date.replace('月','/') ;
                            date = date.replace('日','') ;
                            //date = date.split('/') ;
                            //date = date[1] + '/' + date[2] + '/' + date[0] ;
                            Ext.getCmp('quandate').setRawValue(date) ;

                        }
            //id is used for somthing in extjs4 ,so we cann't use it ,here use 'idc' for id
            //val.idc = quan_info_store.getCount() + 1 ;


					}
				}
			},{
				itemId: 'quanform',
				id: 'quanform',
				xtype: 'quanform',
                minHeight:100,
                maxHeight:500,
				hidden: true,
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

