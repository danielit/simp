Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model' ]);


Ext.define('Sit.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.sitform',
	requires: ['Ext.data.*', 'Ext.form.*'],
	xtype: 'form-sit',
	frame: true,
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
            icon:'static/pic/sitform.png',
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
					xtype: 'textfield',
					name: 'name',
                    width:250,
					id: 'sitform.name',
					emptyText: '请输入姓名...',
					fieldLabel: '姓名',
					margins: '0 6 0 0',
					allowBlank: false,
					forceSelection: true,
					listeners: {
						scop: this,
						'select': function(combo, records, index) {}
					}
				},
                {
					xtype: 'textfield',
					name: 'stuid',
                    width:250,
					id: 'sitform.stuid',
					emptyText: '请输入学号...',
					fieldLabel: '学号',
					margins: '0 6 0 0',
					//allowBlank: false,
					forceSelection: true,
					listeners: {
						scop: this,
						'select': function(combo, records, index) {}
					}
				},
                {
					xtype: 'textfield',
					name: 'identify',
                    width:250,
					id: 'sitform.identify',
					emptyText: '请输入身份证号...',
					fieldLabel: '身份证号',
					margins: '0 6 0 0',
					//allowBlank: false,
					forceSelection: true,
					listeners: {
						scop: this,
						'select': function(combo, records, index) {}
					}
				},
                {
					xtype: 'textfield',
					name: 'examid',
                    width:250,
					id: 'sitform.examid',
					emptyText: '请输入准考证号...',
					fieldLabel: '准考证号',
					margins: '0 6 0 0',
					//allowBlank: false,
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
					xtype: 'textfield',
					name: 'address',
                    width:250,
					id: 'sitform.address',
					emptyText: '请输入家庭住址...',
					fieldLabel: '家庭住址',
					margins: '0 6 0 0',
					//allowBlank: false,
					forceSelection: true,
					listeners: {
						scop: this,
						'select': function(combo, records, index) {}
					}
				},
                {
					xtype: 'textfield',
					name: 'homephone',
                    width:250,
					id: 'sitform.homephone',
					emptyText: '请输入家庭联系方式...',
					fieldLabel: '家庭电话',
					margins: '0 6 0 0',
					//allowBlank: false,
					forceSelection: true,
					listeners: {
						scop: this,
						'select': function(combo, records, index) {}
					}
				},
                {
					xtype: 'textfield',
					name: 'telephone',
                    width:250,
					id: 'sitform.telephone',
					emptyText: '请输联系方式...',
					fieldLabel: '联系电话',
					margins: '0 6 0 0',
					//allowBlank: false,
					forceSelection: true,
					listeners: {
						scop: this,
						'select': function(combo, records, index) {}
					}
				},
                {
					id: 'sithidden',
					//fieldLabel: '日期',
                    width:250,
					name: 'idc',
                    hidden:true
				},
				{
					xtype: 'datefield',
					id: 'sitform.birthday',
                    format:'Y/m/d',
					fieldLabel: '出生日期',
                    width:250,
					name: 'birthday',
					//allowBlank: false,
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
					xtype: 'combobox',
					id: 'sitform.class',
					name: 'class',
                    width:250,
					displayField: 'name',
					valueField: 'id',
					queryMode: 'remote',
					emptyText: '请选择班级...',
					fieldLabel: '班级',
					hideLabel: false,
					margins: '0 6 0 0',
					store: class_id_store,
					//allowBlank: false,
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
					id: 'sitform.gender',
					name: 'gender',
                    width:250,
					displayField: 'name',
					valueField: 'id',
					queryMode: 'local',
					emptyText: '请选择性别...',
					fieldLabel: '性别',
					margins: '0 6 0 0',
					store: sit_gender_store,
					//allowBlank: false,
					forceSelection: true
				},
                {
					xtype: 'combobox',
					id: 'sitform.type',
					name: 'type',
                    width:250,
					displayField: 'name',
					valueField: 'id',
					queryMode: 'local',
					emptyText: '请选择学生类型...',
					fieldLabel: '学生类型',
					margins: '0 6 0 0',
					store: sit_type_store,
					//allowBlank: false,
					forceSelection: true
				},/*
                {
					xtype: 'combobox',
					id: 'sitform.teacher',
					name: 'teacher',
                    width:250,
					displayField: 'name',
					valueField: 'id',
					queryMode: 'local',
					emptyText: '请选择班主任老师...',
					fieldLabel: '班主任',
					margins: '0 6 0 0',
					store: sit_teacher_store,
					//allowBlank: false,
					forceSelection: true
				}*/
                {
					xtype: 'combobox',
					id: 'sitform.status',
					name: 'status',
                    width:250,
					displayField: 'name',
					valueField: 'id',
					queryMode: 'local',
					emptyText: '请选择在校状态...',
					fieldLabel: '在校状态',
					margins: '0 6 0 0',
					store: sit_status_store,
					//allowBlank: false,
					forceSelection: true
				}
                ]
			},

			{
				xtype: 'container',
				itemId: 'form.container.d',
				layout: 'hbox',
				margin: '0 0 5 0',
				items: [/*{
					xtype: 'combobox',
					id: 'sitform.status',
					name: 'status',
                    width:250,
					displayField: 'name',
					valueField: 'id',
					queryMode: 'local',
					emptyText: '请选择在校状态...',
					fieldLabel: '在校状态',
					margins: '0 6 0 0',
					store: sit_status_store,
					//allowBlank: false,
					forceSelection: true
				},*/
                {
					xtype: 'textfield',
					id: 'sitform.teacher',
					name: 'teacher',
					allowBlank: true,
                    hidden:true
				},
                {
					xtype: 'textfield',
					id: 'sitform.other',
					grow: true,
					margins: '0 6 0 0',
					name: 'other',
					fieldLabel: '备注',
					allowBlank: true,
					width: 505,
					emptyText: '如有需要，请在此填写...'
				}]
			},
            {
				xtype: 'container',
				itemId: 'form.container.e',
				layout: 'hbox',
				margin: '0 0 5 0',
                align:'center',
                defaults:{
                    margin: '0 0 5 25'
                },
				items: [{
					xtype: 'button',
                    width:80,
                    margin: '0 0 0 480',
                    icon:'static/pic/reset.png',
                    text:'重置',
                    scope:this,
				    handler: this.onResetClick
				},
                {
					xtype: 'button',
                    icon:'static/pic/confirm.png',
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
            
            val = form.getValues() ;
            //console.log("get from form");
            //console.log(val);
            val['class'] = Ext.getCmp('sitform.class').getRawValue() ;
            val['status'] = Ext.getCmp('sitform.status').getRawValue() ;
            val.gender = Ext.getCmp('sitform.gender').getRawValue() ;
            val.type = Ext.getCmp('sitform.type').getRawValue() ;
            //val.student = Ext.getCmp('sitform.name').getRawValue() ;
            //val.teacher = Ext.getCmp('sitform.teacher').getRawValue() ;
            //val.idc = ++SIT_COUNTER ;
           
            //sit_info_store.loadData([val]) ;
            stu_info_store.add([val]) ;
            form.reset() ;
		}else {
            //console.log('form is not valid') ;
        }
	}
});

//define the grid
Ext.define('Sit.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.sitgrid',

	requires: ['Ext.grid.plugin.CellEditing', 'Ext.form.field.Text', 'Ext.toolbar.TextItem', 'Ext.panel.Panel', 'Ext.ux.form.SearchField', 'Ext.ux.CheckColumn', 'Ext.selection.CheckboxModel', 'Ext.selection.CellModel'],

	initComponent: function() {

		this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
			clickToEdit: 1
		});

		this.CboxModel = Ext.create('Ext.selection.CheckboxModel');
		this.pBar = Ext.create('Ext.PagingToolbar', {
			store: this.store,
            id:'sitgridpbar',
			displayInfo: true,
			displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
			emptyMsg: "没有数据"
		});

		Ext.apply(this, {
			iconCls: 'icon-grid',
            icon:'static/pic/sitgrid.png',
			frame: true,
            closeable:true,
			closeAction: 'hiden',
            collapsible:'ture',
			selModel: this.CboxModel,
			bbar: this.pBar,
			plugins: [this.editing],
			dockedItems: [{
				xtype: 'toolbar',
				items: [/*{ iconCls: 'icon-add',
					text: '增加',
					scope: this,
					handler: this.onAddClick
				},'|',*/
                {
					iconCls: 'icon-modify',
                    icon:'static/pic/modifyuser.png',
					text: '修改',
                    disabled:true,
                    itemId:'modify',
					scope: this,
					handler: this.onModifyClick
				},'|',
				{
					iconCls: 'icon-delete',
                    icon:'static/pic/deluser.png',
					text: '删除',
					disabled: true,
					itemId: 'delete',
					scope: this,
					handler: this.onDeleteClick
				},'|',
                {
					xtype: 'combobox',
					id: 'sitsearch.class',
					name: 'class',
                    width:250,
                    labelWidth:40,
					displayField: 'name',
					valueField: 'id',
					queryMode: 'remote',
					emptyText: '请选择班级...',
					fieldLabel: '班级',
					hideLabel: false,
					margins: '0 6 0 0',
					store: class_id_store,
					allowBlank: false,
					forceSelection: true
				},
                {
                    xtype: 'textfield',
					name: 'name',
                    width:200,
                    labelWidth:60,
                    id:'sitsearch.name',
					emptyText: '此项可以为空',
					fieldLabel: '姓&nbsp&nbsp&nbsp&nbsp&nbsp名',
					margins: '0 6 0 0',
					allowBlank: true,
					forceSelection: true
                },

                /*
                {
					xtype: 'datefield',
					id: 'sitsearch.bdate',
                    format:'Y/m/d',
					fieldLabel: '开始日期',
                    width:200,
                    labelWidth:60,
					name: 'bdate',
					//allowBlank: false,
					margins: '0 6 0 0',
					maxValue: new Date()
				},
                {
					xtype: 'datefield',
					id: 'sitsearch.edate',
                    format:'Y/m/d',
					fieldLabel: '结束日期',
                    width:200,
                    labelWidth:60,
					name: 'edate',
					//allowBlank: false,
					margins: '0 6 0 0',
					maxValue: new Date(),
                    value: new Date()
				},*/
                {
                    xtype:'button',
                    id:'sitsearch.btn',
                    //iconCls:'icon-search',
                    icon:'static/pic/search.gif',
                    text:'查询',
                    scope:this,
                    handler:this.onSearchClick
                },
                {
                    xtype:'button',
                    id:'stuinfo.download',
                    icon:'static/pic/download.png',
                    text:'下载',
                    scope:this,
                    handler:this.onDownloadStu
                }]
			},
			{
				weight: 1,
				xtype: 'toolbar',
				dock: 'bottom',
				ui: 'footer',
				items: ['->', {
					iconCls: 'icon-save',
                    icon:'static/pic/quansave.png',
					text: '提交',
				    margins: '0 0 0 50%',
					scope: this,
                    //hidden:true,
					//handler: this.onSync
                    id:'sitgridsave',
                    handler:function(){
                        ret = stu_info_store.sync({
                            failure:function(batch){
                                Ext.MessageBox.show({
                                    title: '提交失败',
                                    msg: '远程服务器错误，<br/>请联系系统管理员！',
					                icon: Ext.MessageBox.ERROR,
					                buttons: Ext.Msg.OK
			                    });
                                //console.log("sit submit failure") ;
                            },
                            success:function(batch){
                                Ext.MessageBox.show({
                                    title: '提交成功',
                                    msg: '数据提交成功!',
					                //msg: operation.getError(),
					                icon: Ext.MessageBox.INFO,
					                buttons: Ext.Msg.OK
			                    });
                                //stu_info_store.loadData([],false) ;
                                //SIT_COUNTER = 0 ;
                                stu_info_store.load() ;
                            }
                        }) ; 
                        //console.log(ret) ;
                    }
				}]
			}],

			columns: [{
				text: '序号',
                style:{textAlign:'center'},
                algin:'center',
				width: 60,
				sortable: true,
				resizable: false,
				draggable: false,
				hideable: false,
                //hidden:true,
				//menuDisabled: true,
				dataIndex: 'idc'
			},
			{
				text: '姓名',
                style:{textAlign:'center'},
                algin:'center',
                width:60,
				//flex: 1,
				sortable: 'true',
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
				text: '家庭电话',
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
				text: '联系电话',
                style:{textAlign:'center'},
                algin:'center',
                width:100,
				//flex: 1,
				sortable: true,
				dataIndex: 'telephone',
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
				dataIndex: 'status',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '备注',
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
    onDownloadStu: function(){
        window.location.href = '/static/downloads/stuinfo.xls' ;
    },
    onSearchClick: function(){
    
        //hide the form
        setsitWinShow('sitform',false) ;
        //var cname = Ext.getCmp('sitsearch.class').getRawValue() ;
        //var bdate = Ext.getCmp('sitsearch.bdate').getRawValue() ;
        //var edate = Ext.getCmp('sitsearch.edate').getRawValue() ;
        var cid= Ext.getCmp('sitsearch.class').getValue() ;
        var name = Ext.getCmp('sitsearch.name').getValue() ;
        if (!cid){
            //Ext.MessageBox.alert("提示",'请选择班级!') ;
            cid='0' ;
        }
            this.store.load({
                'params':{
                    'page':0,
                    'start':0,
                    'limit':200,
                    'cid':cid,
                    'name':name
                },
                scope:this,
                callback:function(records,operations,success){
                    if (success === false){
                        Ext.MessageBox.show({
                            title: '查询失败',
                            msg: '远程服务器错误，<br/>请联系系统管理员！',
					        //msg: operation.getError(),
					        icon: Ext.MessageBox.ERROR,
					        buttons: Ext.Msg.OK
			            });
                        //console.log(operation.getError()) ;
                        return ; 
                    }
                    if (records && records.length === 0){
                        //console.log(records) ;
                    }
                }
            }) ;
    },

    onSelectChange: function(selModel, selections) {
        if (selections) {
		    this.down('#delete').setDisabled(selections.length === 0);
		    this.down('#modify').setDisabled(selections.length === 0);
        }
	},

	onSync: function() {
		stu_info_store.sync();
	},

	onDeleteClick: function() {
		var selections = this.getView().getSelectionModel().getSelection();
		Ext.Array.forEach(selections, function(selection, index) {
			////console.log(this.store) ;
			//this.store.remove(selection);
            var stuidc = selection.data.idc ;
            var stuid = selection.data.stuid ;
            ////console.log(noticeidc) ;
            Ext.Ajax.request({
                url: SERVER+'/deletestu',
                headers: {
                    'userHeader': 'userMsg'
                },
                params: { 'idc': stuidc,
                'stuid':stuid},
                method: 'GET',
                success: function (response, options) {
			        //sit_info_store.remove(selection);
			        stu_info_store.load();
                    Ext.MessageBox.alert('成功', '删除成功');
                },
                failure: function (response, options) {
                    Ext.MessageBox.alert('失败', '请求超时或网络故障');
                }
            });

		},
		this);
	},
//get the data from grid to form
	onModifyClick: function() {
        //first let modify form show
        setsitWinShow('sitform',true) ;
        setsitWinShow('sitgridsave',true) ;
        
        var selected = Ext.getCmp('sitgrid').getSelectionModel().getSelection()[0];
        var value = null ;
        if (selected){
            value = selected.raw ;
        }
        //console.log(value) ;
        //console.log(selected) ;
        //Ext.getCmp('sitform').loadRecord(value);
        Ext.getCmp('sitform').loadRecord(selected);
        
        Ext.getCmp('sitform.class').setRawValue(value['class']) ;
        //Ext.getCmp('sitform.name').setRawValue(value.student) ;
        Ext.getCmp('sitform.status').setRawValue(value['status']) ;
        Ext.getCmp('sitform.gender').setRawValue(value.gender) ;
        //Ext.getCmp('sitform.teacher').setRawValue(value.teacher) ;
        Ext.getCmp('sitform.type').setRawValue(value.type) ;
        //this.store.remove(selected) ;
        //--SIT_COUNTER ;
        this.store.loadData([]) ;
    },
	onAddClick: function() {
        sitform = Ext.getCmp('sitform') ;
        if (sitform.isHidden()){
            sitform.show() ;
        }
        pbar = Ext.getCmp('sitgridpbar') ;
        if (!pbar.isHidden()){
            pbar.hide() ;
        }
      	}
});

Ext.require(['Ext.data.*', 'Ext.tip.QuickTipManager', 'Ext.window.MessageBox']);

//define the container for sit 
Ext.define('sit.window', {
	extend: 'Ext.container.Container',
	alias: 'widget.sitcontainer',
	initComponent: function() {
		Ext.apply(this, {
			padding: '0 0 0 0',
            icon:'static/pic/sitwin.png',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [{// sit add new info grid
				itemId: 'sitgrid',
				id: 'sitgrid',
				xtype: 'sitgrid',
				title: '学生信息',
				flex: 1,
                hidden:false,
				store:stu_info_store,
				listeners: {
					selectionchange: function(selModel, selected) {}
				}
			},
            {// add new sit info form
				itemId: 'sitform',
				id: 'sitform',
				xtype: 'sitform',
                title:'学生信息录入',
                minHeight:100,
                maxHeight:500,
				hidden: false,
				manageHeight: false,
				margins: '0 0 0 0'
			}]
		});
		this.callParent();
	}
});

function getsitWin(){
    var sitWin = Ext.getCmp('sitwin') ;
    if (sitWin==null){
        sitWin = Ext.create('sit.window',{
            title:'学生基本信息',
            id:'sitwin',
            itemId:'sitwin',
            xtype:'sitcontainer',
		    icon: 'static/pic/css/tabs.gif'
        }) ; 
    } 
    return sitWin ;
}
function setsitWinShow(id,sure){
    var cmp = Ext.getCmp(id) ;
    if(cmp==null){
        //console.log('cant find the id of ext cmp') ;
    }
    if(sure){
        cmp.show() ;
    }else{
        cmp.hide() ;
    }
}

function setsitWinsShow(mask) {
    //setsitWinShow('sitgridpbar',!mask) ;
    //setsitWinShow('sitsearch.class',!mask) ;
    //setsitWinShow('sitsearch.btn',!mask) ;
    setsitWinShow('sitgridsave',mask) ;
    setsitWinShow('sitform',mask) ;
    //setsitWinShow('sitformdetail',mask & 16) ;
} 

