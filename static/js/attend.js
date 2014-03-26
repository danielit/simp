Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model', ]);

var ATTEND_COUNTER = 0 ;

Ext.define('Attend.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.attendform',
	requires: ['Ext.data.*', 'Ext.form.*'],
	xtype: 'form-attend',
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
					id: 'attendform.class',
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
					id: 'attendform.name',
					displayField: 'name',
					valueField: 'id',
					queryMode: 'remote',
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
					id: 'cbattendtype',
					name: 'type',
                    width:300,
					displayField: 'type',
					valueField: 'type',
					queryMode: 'local',
					emptyText: '请选择考勤类型...',
					fieldLabel: '类型',
					margins: '0 6 0 0',
					store: attend_type_store,
					allowBlank: false,
					forceSelection: true
				},
                {
					id: 'attendhidden',
					//fieldLabel: '日期',
                    width:300,
					name: 'idc',
                    hidden:true
				},
				{
					xtype: 'datefield',
					id: 'attenddate',
                    format:'Y/m/d',
					fieldLabel: '日期',
                    width:300,
					name: 'date',
					allowBlank: false,
					margins: '0 6 0 0',
					maxValue: new Date(),
                    value: new Date()
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
					id: 'cbattendnclass',
					name: 'nclass',
                    width:300,
					displayField: 'nclass',
					valueField: 'nclass',
					queryMode: 'local',
					emptyText: '请选择第几节课...',
					fieldLabel: '节次',
					margins: '0 6 0 0',
					store: attend_nclass_store,
					allowBlank: false,
					forceSelection: true
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
					id: 'attendreason',
					grow: true,
					margins: '0 6 0 0',
					name: 'ps',
					fieldLabel: '备注',
					allowBlank: true,
					width: 610,
					emptyText: '如有需要，请在此填写备注...'
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
            
            val = form.getValues() ;
            console.log("get from form");
            console.log(val);
            val.class = Ext.getCmp('attendform.class').getRawValue() ;
            val.student = Ext.getCmp('attendform.name').getRawValue() ;
           
            //attend_info_store.loadData([val]) ;
            attend_info_store.add([val]) ;
            form.reset() ;
		}
	}
});

//define the grid
Ext.define('Attend.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.attendgrid',

	requires: ['Ext.grid.plugin.CellEditing', 'Ext.form.field.Text', 'Ext.toolbar.TextItem', 'Ext.panel.Panel', 'Ext.ux.form.SearchField', 'Ext.ux.CheckColumn', 'Ext.selection.CheckboxModel', 'Ext.selection.CellModel'],

	initComponent: function() {

		this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
			clickToEdit: 1
		});

		this.CboxModel = Ext.create('Ext.selection.CheckboxModel');
		this.pBar = Ext.create('Ext.PagingToolbar', {
			store: this.store,
            id:'attendgridpbar',
			displayInfo: true,
			displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
			emptyMsg: "没有数据"
		});

		Ext.apply(this, {
			iconCls: 'icon-grid',
			frame: true,
            closeable:true,
			closeAction: 'hiden',
            collapsible:'ture',
			selModel: this.CboxModel,
			bbar: this.pBar,
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
                    disabled:true,
                    itemId:'modify',
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
					xtype: 'combobox',
					id: 'attendsearch.class',
					name: 'class',
                    width:230,
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
					xtype: 'datefield',
					id: 'attendsearch.bdate',
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
					id: 'attendsearch.edate',
                    format:'Y/m/d',
					fieldLabel: '结束日期',
                    width:200,
                    labelWidth:60,
					name: 'edate',
					//allowBlank: false,
					margins: '0 6 0 0',
					maxValue: new Date(),
                    value: new Date()
				},
                {
                    xtype:'button',
                    id:'attendsearch.btn',
                    iconCls:'icon-search',
                    icon:'static/pic/search.gif',
                    text:'查询',
                    scope:this,
                    handler:this.onSearchClick
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
					scope: this,
                    //hidden:true,
					//handler: this.onSync
                    id:'attendgridsave',
                    handler:function(){
                        ret = attend_info_store.sync({
                            failure:function(batch){
                                Ext.MessageBox.show({
                                    title: '提交失败',
                                    msg: '远程服务器错误，<br/>请联系系统管理员！',
					                icon: Ext.MessageBox.ERROR,
					                buttons: Ext.Msg.OK
			                    });
                                console.log("attend submit failure") ;
                            },
                            success:function(batch){
                                Ext.MessageBox.show({
                                    title: '提交成功',
                                    msg: '数据提交成功!',
					                //msg: operation.getError(),
					                icon: Ext.MessageBox.INFO,
					                buttons: Ext.Msg.OK
			                    });
                                //attend_info_store.loadData([],false) ;
                                attend_info_store.load() ;
                                ATTEND_COUNTER = 0 ;
                                console.log("attend submit success") ;
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
				sortable: false,
				resizable: false,
				draggable: false,
				hideable: false,
				menuDisabled: true,
				dataIndex: 'idc'
			},
			{
				header: '班级',
				//flex: 1,
                width:160,
				sortable: true,
				dataIndex: 'class',
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
				field: {
					type: 'textfield'
				}
			},
            {
				header: '类型',
                style:{textAlign:'center'},
				//width: 100,
				sortable: true,
				dataIndex: 'type',
				//dataIndex: 'attendtype',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '日期',
                style:{textAlign:'center'},
				//width: 100,
				sortable: true,
				dataIndex: 'date',
				//dataIndex: 'date',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '节次',
                style:{textAlign:'center'},
				//width: 100,
				sortable: true,
				dataIndex: 'nclass',
				//dataIndex: 'attendscore',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '备注',
                style:{textAlign:'center'},
				width: 200,
				sortable: false,
				menuDisabled: true,
				//dataIndex: 'attendreason',
				dataIndex: 'ps',
				field: {
					type: 'textfield'
				}
			}]
		});
		this.callParent();
		this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
	},

    onSearchClick: function(){
        //hide the form 
        setAttendWinShow('attendform',false) ;
        //deal search
        var cname = Ext.getCmp('attendsearch.class').getRawValue() ;
        var bdate = Ext.getCmp('attendsearch.bdate').getRawValue() ;
        var edate = Ext.getCmp('attendsearch.edate').getRawValue() ;
        var cid= Ext.getCmp('attendsearch.class').getValue() ;
        if (!bdate && !edate && !cname){
            Ext.MessageBox.alert("提示",'至少选择一个查询条件!') ;
            return ;
        }
        if (cid=='0'){
            cname='' ;
        }
            console.log(cname) ;
            console.log(bdate) ;
            console.log(edate) ;
            this.store.load({
                'params':{
                    'page':1,
                    'start':0,
                    'limit':200,
                    'class':cname,
                    'begin':bdate,
                    'end':edate
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
                        console.log(operation.getError()) ;
                        return ; 
                    }
                    if (records && records.length === 0){
                        console.log(records) ;
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
		attend_info_store.sync();
	},

	onDeleteClick: function() {
		var selections = this.getView().getSelectionModel().getSelection();
		Ext.Array.forEach(selections, function(selection, index) {
			//console.log(this.store) ;
			//this.store.remove(selection);
            var attendidc = selection.data.idc ;
            var attenddate = selection.data.date ;
            //console.log(noticeidc) ;
            Ext.Ajax.request({
                url: SERVER+'/deleteattend',
                headers: {
                    'userHeader': 'userMsg'
                },
                params: { 'idc': attendidc,
                    'date':attenddate
                },
                method: 'GET',
                success: function (response, options) {
			        //attend_info_store.remove(selection);
                    attend_info_store.load() ;
                    //setAttendWinShow('attendform',false) ;
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
        setAttendWinShow('attendform',true) ;
        setAttendWinShow('attendgridsave',true) ;
        //var selected = this.getView().getSelectionModel().getSelection()[0];
        
        var selected = Ext.getCmp('attendgrid').getSelectionModel().getSelection()[0];
        var value = null ;
        if (selected){
            value = selected.raw ;
        }
        console.log(value) ;
        console.log(selected) ;
        Ext.getCmp('attendform').loadRecord(selected);
        Ext.getCmp('attendform.class').setRawValue(value.class) ;
        Ext.getCmp('attendform.name').setRawValue(value.student) ;
        //this.store.remove(selected) ;
        this.store.loadData([]) ;
    },
	onAddClick: function() {
        attendform = Ext.getCmp('attendform') ;
        if (attendform.isHidden()){
            attendform.show() ;
        }
        pbar = Ext.getCmp('attendgridpbar') ;
        if (!pbar.isHidden()){
            pbar.hide() ;
        }
      	}
});

Ext.require(['Ext.data.*', 'Ext.tip.QuickTipManager', 'Ext.window.MessageBox']);

//define the container for attend 
Ext.define('attend.window', {
	extend: 'Ext.container.Container',
	alias: 'widget.attendcontainer',
	initComponent: function() {
		Ext.apply(this, {
			padding: '0 0 0 0',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [{// attend add new info grid
				itemId: 'attendgrid',
				id: 'attendgrid',
				xtype: 'attendgrid',
				title: '学生考勤',
				flex: 1,
                hidden:false,
                //minHeight:200,
                //maxHeight:500,
				store: attend_info_store,
				listeners: {
					selectionchange: function(selModel, selected) {}
				}
			},
            {// add new attend info form
				itemId: 'attendform',
				id: 'attendform',
				xtype: 'attendform',
                title:'学生考勤',
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

function getAttendWin(){
    var attendWin = Ext.getCmp('attendwin') ;
    if (attendWin==null){
        attendWin = Ext.create('attend.window',{
            title:'学生考勤管理',
            id:'attendwin',
            itemId:'attendwin',
            xtype:'attendcontainer',
		    icon: 'static/pic/css/tabs.gif'
        }) ; 
    } 
    return attendWin ;
}
function setAttendWinShow(id,sure){
    var cmp = Ext.getCmp(id) ;
    if(cmp==null){
        console.log('cant find the id of ext cmp') ;
    }
    if(sure){
        cmp.show() ;
    }else{
        cmp.hide() ;
    }
}

function setAttendWinsShow(mask) {
    //setAttendWinShow('attendgridpbar',!mask) ;
    //setAttendWinShow('attendsearch.class',!mask) ;
    //setAttendWinShow('attendsearch.bdate',!mask) ;
    //setAttendWinShow('attendsearch.edate',!mask) ;
    //setAttendWinShow('attendsearch.btn',!mask) ;
    setAttendWinShow('attendgridsave',mask) ;
    setAttendWinShow('attendform',mask) ;
    //setattendWinShow('attendformdetail',mask & 16) ;
} 
