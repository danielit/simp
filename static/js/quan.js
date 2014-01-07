// define const var
HOST = "http://42.96.152.39"
PORT = "80"
SERVER = HOST + ":" + PORT

QUAN_COUNTER = 0
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
    'dicp_score',// dicpline
    'dicp_quan',
    'dicp_rank',
    'heal_score',//health
    'heal_quan',
    'heal_rank',
    'domi_score',//dominitory
    'domi_quan',
    'domi_rank',
    'acti_score',//activity or other
    'acti_quan',
    'acti_rank'
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
                console.log(operation.getError()) ;
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
                console.log(operation.getError()) ;
			}
		}
	},
});

var quan_week_store = Ext.create('Ext.data.Store', {
    model:'Quan.WeekInfo',
	autoLoad: true,
	//autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getclassquanofweek',
		},
		reader: {
			type: 'json',
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

Ext.define('Quan.DetailForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.quandetailform',
	xtype: 'quandetailform',
	requires: ['Ext.data.*', 'Ext.form.*'],
	frame: true,
	title: '量化详单',
	bodyPadding: 5,

	initComponent: function() {
		Ext.apply(this, {
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'qtip'
			},
            defaults:{
                style:{
                    textAlgin:'center'
                }
            },
            iconCls: 'icon-form',
			layout: 'anchor',
			anchor: '100%',
            collapsible:'ture',
			align: 'center',
            items:[{
                xtype:'displayfield',
                fieldLabel:'纪律',
                name:'quan_disc',
                id:'detailform.quan_disc',
                value:'discipline'
            },
            {
                xtype:'displayfield',
                fieldLabel:'卫生',
                name:'quan_heath',
                id:'detailform.quan_heath',
                value:'health'
            },
            {
                xtype:'displayfield',
                fieldLabel:'宿舍',
                name:'quan_domi',
                id:'detailform.quan_domi',
                value:'domitory'
            },
            {
                xtype:'displayfield',
                fieldLabel:'活动及其它',
                name:'quan_acti',
                id:'detailform.quan_acti',
                value:'activty'
            }]
        });
	    this.callParent();
    }
});


Ext.define('Quan.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.quanform',
	requires: ['Ext.data.*', 'Ext.form.*'],
	xtype: 'form-quan',
	frame: true,
	title: '量化',
	bodyPadding: 5,
    maxHeight:200,
    autoScroll:true,

	initComponent: function() {
		Ext.apply(this, {
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'qtip',
                anchor:'100%'
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
                align:'center',
				defaultType: 'textfield',
				margin: '0 0 5 0',
				items: [{
					xtype: 'combobox',
					id: 'cbclass',
					name: 'class',
                    width:300,
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
                    width:300,
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
                    width:300,
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
                    width:300,
					name: 'idc',
                    hidden:true
				},
				{
					xtype: 'datefield',
					id: 'quandate',
                    format:'Y/m/d',
					fieldLabel: '日期',
                    width:300,
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
                    width:300,
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
                width:700,
				margin: '0 0 5 0',
				items: [{
					xtype: 'textareafield',
					id: 'quanreason',
					grow: true,
					margins: '0 6 0 0',
					name: 'quan_reason',
					fieldLabel: '原由',
					allowBlank: false,
					width: 610,
					emptyText: '请填写此次量化处理原因...'
				}]
			},
            {
				xtype: 'container',
				itemId: 'form.container.e',
				layout: 'hbox',
                width:700,
				margin: '0 0 5 0',
                align:'center',
                defaults:{
                    margin: '0 0 5 25',
                },
				items: [{
					xtype: 'button',
                    width:80,
                    margin: '0 0 0 240',
                    text:'重置',
                    scope:this,
				    handler: this.onResetClick
				},
                {
					xtype: 'button',
                    text:'确认',
                    width:80,
                    scope:this,
				    handler: this.onCompleteClick
                }]
			}
        ]
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
            val.idc = ++QUAN_COUNTER ;
            
            quan_info_store.add(val) ;

            form.reset() ;
            
            //quangrid = Ext.getCmp('quangrid') ;
            //console.log(quangrid.getHeight()) ;

		}
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
		/*this.pBar = Ext.create('Ext.PagingToolbar', {
			store: this.store,
            id:'quangridpbar',
			displayInfo: true,
			displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
			emptyMsg: "没有数据"
		});*/

		Ext.apply(this, {
			iconCls: 'icon-grid',
			frame: true,
            //closeable:true,
			//closeAction: 'hiden',
            collapsible:'ture',
			selModel: this.CboxModel,
			//bbar: this.pBar,
			plugins: [this.editing],
			dockedItems: [{
				xtype: 'toolbar',
				items: [/*{
					iconCls: 'icon-add',
					text: '增加',
					scope: this,
					handler: this.onAddClick
				},'|',*/
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
					labelWidth: 50,
					xtype: 'searchfield',
					store: this.store
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
				    margins: '0 0 0 50%',
                    /*style:{
                        marginRight:'25%'
                    },*/
					scope: this,
                    //hidden:true,
					//handler: this.onSync
                    id:'quangridsave',
                    handler:function(){
                        ret = quan_info_store.sync({
                            failure:function(batch){
                                Ext.MessageBox.show({
                                    title: '提交失败',
                                    msg: '远程服务器错误，<br/>请联系系统管理员！',
					                //msg: operation.getError(),
					                icon: Ext.MessageBox.ERROR,
					                buttons: Ext.Msg.OK
			                    });
                                console.log("quan submit failure") ;
                            },
                            success:function(batch){
                                Ext.MessageBox.show({
                                    title: '提交成功',
                                    msg: '数据提交成功!',
					                //msg: operation.getError(),
					                icon: Ext.MessageBox.INFO,
					                buttons: Ext.Msg.OK
			                    });
                                //quan_info_store.removeAll() ;
                                quan_info_store.loadData([],false) ;
                                QUAN_COUNTER = 0 ;
                                console.log("quan submit success") ;
                            }
                        }) ; 
                        console.log(ret) ;
                    }
				}]
			}],
			columns: [{
				text: '序号',
				//width: 40,
                style:{textAlign:'center'},
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
                style:{textAlign:'center'},
				dataIndex: 'class',
				field: {
					type: 'textfield'
				}
			},
			{
				header: '学生',
				//width: 100,
				sortable: true,
                style:{textAlign:'center'},
				dataIndex: 'student',
				//dataIndex: 'stuname',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '类型',
                style:{textAlign:'center'},
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
                style:{textAlign:'center'},
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
                style:{textAlign:'center'},
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
                style:{textAlign:'center'},
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
		/*
         *this is not finished , first set the value to form  
         *then set value back to grid
         *
         */ 
        //var selected = this.getView().getSelectionModel().getSelection()[0];
        var selected = Ext.getCmp('quangrid').getSelectionModel().getSelection()[0];
        var value = null ;
        if (selected){
            value = selected.raw ;
        }
        console.log(value) ;
        //Ext.getCmp('quanform').setValue(value);
        if (value != null){ 
            console.log(value) ;
            Ext.getCmp('cbclass').setRawValue(value.class) ;
            Ext.getCmp('cbname').setRawValue(value.student) ;
            Ext.getCmp('cbquantype').setRawValue(value.quan_type) ;
            Ext.getCmp('quanscore').setRawValue(value.quan_score) ;
            Ext.getCmp('quanreason').setValue(value.quan_reason) ;
            //date = value.quan_date ;
            //date = date.replace('年','/') ;
            //date = date.replace('月','/') ;
            //date = date.replace('日','') ;
            Ext.getCmp('quandate').setRawValue(value.quan_date) ;

            this.store.remove(selected) ;
            --QUAN_COUNTER ;
        }else {
            Ext.MessageBox.alert('提示',' 请选择需要修改的行') ;
            console.log("the selected record is null or somthing") ;
        }
        console.log(selected);
        /**/
	},
	onAddClick: function() {
        quanform = Ext.getCmp('quanform') ;
        if (quanform.isHidden()){
            quanform.show() ;
        }
        pbar = Ext.getCmp('quangridpbar') ;
        if (!pbar.isHidden()){
            pbar.hide() ;
        }
      	}
});

//define the grid of displaying quan of week
Ext.define('Quan.Grid.Week', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.quangridweek',

	requires: ['Ext.grid.plugin.CellEditing', 'Ext.form.field.Text', 'Ext.toolbar.TextItem', 'Ext.panel.Panel', 'Ext.ux.form.SearchField', 'Ext.ux.CheckColumn', 'Ext.selection.CheckboxModel', 'Ext.selection.CellModel'],

	initComponent: function() {

		this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
			clickToEdit: 1
		});

		this.CboxModel = Ext.create('Ext.selection.CheckboxModel');
		this.pBar = Ext.create('Ext.PagingToolbar', {
			store: this.store,
            id:'quangridweekpbar',
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
				items: [                {
                	xtype: 'combobox',
                    id:'quan.grid.cb.week',
					name: 'week',
                    width:300,
					displayField: 'week',
					valueField: 'id',
					queryMode: 'local',
					emptyText: '第xx周量化汇总',
					fieldLabel: '请选择',
					margins: '0 6 0 0',
					store: week_list_store,
					allowBlank: false,
					forceSelection: true,
					listeners: {
						scop: this,
						'select': function(combo, records, index) {}
					}
                },{
					iconCls: 'icon-add',
					text: '查看',
					scope: this,
					handler: this.onLookOverWeekQuan
				}/*,
                {
					iconCls: 'icon-detail',
					text: '显示量化详单',
					scope: this,
					handler: this.onLookOverWeekQuan
				}*/]
			},
			{
				weight: 1,
				xtype: 'toolbar',
				dock: 'bottom',
				ui: 'footer',
				items: [/*'->', {
					iconCls: 'icon-save',
					text: '提交',
					scope: this,
                    //hidden:true,
					//handler: this.onSync
                    id:'quangridweeksave',
                    handler:function(){
                        console.log(ret) ;
                    }
				}*/]
			}],
            defaults:{
                menuDisabled:true
            },
			columns: [{
				text: '序号',
                style:{textAlign:'center'},
                algin:'center',
				width: 80,
				sortable: true,
				resizable: false,
				draggable: false,
				hideable: false,
				//menuDisabled: true,
				dataIndex: 'idc'
			},
			{
				text: '班级',
                style:{textAlign:'center'},
                algin:'center',
                width:160,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'class',
				field: {
					type: 'textfield'
				}
			},
			{
				header: '纪律',
                menuDisabled:true,
                columns:[
                {text:'分数',dataIndex:'disc_score',width:80,sortable:true},
                {text:'量化分',dataIndex:'disc_quan',width:80,sortable:true},
                {text:'排名',dataIndex:'disc_rank',width:80,sortable:true}
                ]
			},
            {
				header: '卫生',
                menuDisabled:true,
				//width: 100,
				//dataIndex: 'quantype',
                columns:[
                {text:'分数',dataIndex:'heal_score',width:80,sortable:true},
                {text:'量化分',dataIndex:'heal_quan',width:80,sortable:true},
                {text:'排名',dataIndex:'heal_rank',width:80,sortable:true}
                ]
			},
            {
				header: '宿舍',
                menuDisabled:true,
                columns:[
                {text:'分数',dataIndex:'domi_score',width:80,sortable:true},
                {text:'量化分',dataIndex:'domi_quan',width:80,sortable:true},
                {text:'排名',dataIndex:'domi_rank',width:80,sortable:true}
                ]
			},
            {
				header: '活动及其它',
                menuDisabled:true,
                 columns:[
                {text:'分数',dataIndex:'acti_score',width:80,sortable:true},
                {text:'量化分',dataIndex:'acti_quan',width:80,sortable:true},
                {text:'排名',dataIndex:'acti_rank',width:80,sortable:true}
                ]
			},
            {
				text: '合计',
                style:{textAlign:'center'},
                algin:'center',
				//width: 100,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'quan_total',
				field: {
					type: 'int'
				}
			},
            {
                text: '名次',
                style:{textAlign:'center'},
                algin:'center',
				//width: 100,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'quan_rank',
				field: {
					type: 'int'
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
    onLookOverWeekQuan: function(){
        var week = Ext.getCmp('quan.grid.cb.week').getValue() ;
        console.log('look over week quan of',week) ; 
        quan_week_store.loadData([],false) ;
        quan_week_store.load({
            params:{
                week:week
            },
            scope:this,
            callback:function(records,operations,success){
                if (success === false){
                    Ext.MessageBox.show({
                        title: '量化查询失败',
                        msg: '远程服务器错误，<br/>请联系系统管理员！',
					    //msg: operation.getError(),
					    icon: Ext.MessageBox.ERROR,
					    buttons: Ext.Msg.OK
			        });
                    return ; 
                }
                if (records && records.length === 0){
                    console.log(records) ;
                }
            }
        }) ;
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
			items: [{// quan add new info grid
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
						/*value = null
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

                            date = value.quan_date ;
                            date = date.replace('年','/') ;
                            date = date.replace('月','/') ;
                            date = date.replace('日','') ;
                            Ext.getCmp('quandate').setRawValue(date) ;

                        }
					*/}
				}
			},
            {// quan add new info grid
				itemId: 'quangridweek',
				id: 'quangridweek',
				xtype: 'quangridweek',
				title: '信息工程系周量化汇总表',
				flex: 1,
                //minHeight:200,
                //maxHeight:500,
				store: quan_week_store,
				listeners: {
					selectionchange: function(selModel, selected) {
						value = null
						if (selected && selected[0]) {
							console.log(selected[0]);
							value = selected[0].raw;
                            console.log(value) ;
						}
						//Ext.getCmp('quanform').setValue(value);
					}
				}
			},
            {// add new quan info form
				itemId: 'quanform',
				id: 'quanform',
				xtype: 'quanform',
                minHeight:100,
                maxHeight:500,
				hidden: false,
				manageHeight: false,
				margins: '0 0 0 0',
			},
            {
                id:'quandetailform',
                xtype:'quandetailform',
				margins: '0 0 0 0',
                //hidden:false
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

