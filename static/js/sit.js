
Ext.define('SI.AllStuInfo', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'idc', //id
		type: 'int',
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
    'other',// student status  
    'address',
    'homephone'
    ]
});

var all_stu_info_store= Ext.create('Ext.data.Store', {
    model:'SI.AllStuInfo',
	autoLoad: true,
	//autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getallstuinfo',
		},
		reader: {
			type: 'json',
			successProperty: 'success',
			root: 'data',
			messageProperty: 'message'
		},
		listeners: {
			exception: function(proxy, response, operation) {
                console.log(operation.getError()) ;
			}
		}
	},
});

Ext.define('SI.ClassList', {
	extend: 'Ext.data.Model',
	fields: [    
    'id',
    'name' //name
    ]
});

var class_list_store = Ext.create('Ext.data.Store', {
    model:'SI.ClassList',
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
                console.log(operation.getError()) ;
			}
		}
	},
});


//define the grid of displaying quan of week
Ext.define('SI.Grid.StuInfo', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.stuinfogrid',

	requires: ['Ext.grid.plugin.CellEditing', 'Ext.form.field.Text', 'Ext.toolbar.TextItem', 'Ext.panel.Panel', 'Ext.ux.form.SearchField', 'Ext.ux.CheckColumn', 'Ext.selection.CheckboxModel', 'Ext.selection.CellModel'],

	initComponent: function() {

		this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
			clickToEdit: 1
		});

		this.CboxModel = Ext.create('Ext.selection.CheckboxModel');
		this.pBar = Ext.create('Ext.PagingToolbar', {
			store: this.store,
            id:'stuinfobar',
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
                    id:'sit.grid.cb.class',
					name: 'week',
                    width:300,
					displayField: 'name',
					valueField: 'id',
					queryMode: 'remote',
					emptyText: '所有学生信息',
					fieldLabel: '请选择',
					margins: '0 6 0 0',
					store: class_list_store,
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
					handler: this.onLookOverClass
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
				width: 60,
				sortable: true,
				resizable: false,
				draggable: false,
				hideable: false,
				//menuDisabled: true,
				dataIndex: 'idc'
			},
			{
				text: '姓名',
                style:{textAlign:'center'},
                algin:'center',
                width:60,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'name',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '学号',
                style:{textAlign:'center'},
                algin:'center',
                width:100,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'stuid',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '身份证号',
                style:{textAlign:'center'},
                algin:'center',
                width:140,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'identify',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '准考证号',
                style:{textAlign:'center'},
                algin:'center',
                width:125,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'examid',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '出生日期',
                style:{textAlign:'center'},
                algin:'center',
                width:80,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'birthday',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '性别',
                style:{textAlign:'center'},
                algin:'center',
                width:40,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'gender',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '学生类型',
                style:{textAlign:'center'},
                algin:'center',
                width:60,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'type',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '班级',
                style:{textAlign:'center'},
                algin:'center',
                width:160, //flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'class',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '家庭住址',
                style:{textAlign:'center'},
                algin:'center',
                width:160,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'address',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '联系电话',
                style:{textAlign:'center'},
                algin:'center',
                width:100,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'homephone',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '班主任',
                style:{textAlign:'center'},
                algin:'center',
                width:60,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'teacher',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '在校状态',
                style:{textAlign:'center'},
                algin:'center',
                width:70,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'other',
				field: {
					type: 'textfield'
				}
			}]
		});
		this.callParent();
		this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
	},

	onSelectChange: function(selModel, selections) {
       /* if (selections) {
		    this.down('#delete').setDisabled(selections.length === 0);
        }*/
	},
    onLookOverClass: function(){
        var cid= Ext.getCmp('sit.grid.cb.class').getValue() ;
        console.log('look over stu info of cid',cid) ; 
        //quan_week_store.loadData([],false) ;
        all_stu_info_store.load({
            'params':{
                'cid':cid
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

function getSitInfoGrid(){
    var sitInfoGrid = Ext.getCmp('sit.stuinfo.grid') ;
    if (sitInfoGrid==null){
        sitInfoGrid = Ext.create('SI.Grid.StuInfo',{
            title:'学生基本信息',
            id:'sit.stuinfo.grid',
            itemId:'stuinfo.grid',
            store:all_stu_info_store,
		    icon: 'static/pic/css/tabs.gif'
        }) ; 
    } 
    return sitInfoGrid ;
}

