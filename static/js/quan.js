
Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model' ]);


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
            icon:'static/pic/quanwrite.png',
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
                    margin: '0 0 5 25'
                },
				items: [{
					xtype: 'button',
                    width:80,
                    margin: '0 0 0 240',
                    text:'重置',
                    icon:'static/pic/reset.png',
                    scope:this,
				    handler: this.onResetClick
				},
                {
					xtype: 'button',
                    text:'确认',
                    icon:'static/pic/confirm.png',
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
            //console.log("get from form");
            //console.log(val) ;
            val['class'] = Ext.getCmp('cbclass').getRawValue() ;
            val.student = Ext.getCmp('cbname').getRawValue() ;
            val.quan_type = Ext.getCmp('cbquantype').getRawValue() ;
/*
            dt = Ext.getCmp('quandate').getValue() ;
            //console.log(dt) ;
            dtraw = Ext.getCmp('quandate').getRawValue() ;
            //console.log(dtraw) ;
            val.quan_date = new Date(dt).toLocaleDateString() ; 
            val.quan_date = dtraw ; 
            //console.log(val.quan_date) ;
            val.quan_score = Ext.getCmp('quanscore').getValue() ;
            val.quan_reason = Ext.getCmp('quanreason').getValue() ;
            //val.idc = ++QUAN_COUNTER ;
            
*/
            //quan_info_store.loadData([]) ;
            quan_info_store.add([val]) ;

            form.reset() ;
            
            //quangrid = Ext.getCmp('quangrid') ;
            ////console.log(quangrid.getHeight()) ;

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
		this.pBar = Ext.create('Ext.PagingToolbar', {
			store: this.store,
            id:'quangridpbar',
			displayInfo: true,
			displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
			emptyMsg: "没有数据"
		});

		Ext.apply(this, {
			iconCls: 'icon-grid',
            icon:'static/pic/quangrid.png',
			frame: true,
            //closeable:true,
			//closeAction: 'hiden',
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
                    icon:'static/pic/modifyuser.png',
					scope: this,
					handler: this.onModifyClick
				},'|',
				{
					iconCls: 'icon-delete',
					text: '删除',
                    icon:'static/pic/deluser.png',
					disabled: true,
					itemId: 'delete',
					scope: this,
					handler: this.onDeleteClick
				},'|', 
                {
					xtype: 'datefield',
					id: 'quan.detail.bdate',
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
					id: 'quan.detail.edate',
                    format:'Y/m/d',
					fieldLabel: '结束日期',
                    width:200,
                    labelWidth:60,
                    //labelWidth:'60',
					name: 'edate',
					//allowBlank: false,
					margins: '0 6 0 0',
					maxValue: new Date(),
                    value: new Date()
				},
                {
                    xtype: 'textfield',
					name: 'name',
                    width:200,
                    labelWidth:60,
                    id:'quan.detail.name',
					emptyText: '此项可以为空',
					fieldLabel: '姓&nbsp&nbsp&nbsp&nbsp&nbsp名',
					margins: '0 6 0 0',
					allowBlank: true,
					forceSelection: true
                },
                {
					iconCls: 'icon-search',
                    id:'quan.detail.search',
					text: '查询',
                    icon:'static/pic/search.gif',
					scope: this,
					handler: this.onSearchClick
				},
                {
                    icon:'static/pic/download.png',
                    id:'quan.detail.download',
					text: '下载',
					scope: this,
					handler: this.onDownloadQuan
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
                                //console.log("quan submit failure") ;
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
                                //quan_info_store.loadData([],false) ;
                                quan_info_store.load() ;
                                //QUAN_COUNTER = 0 ;
                                //console.log("quan submit success") ;
                            }
                        }) ; 
                        //console.log(ret) ;
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
				field: {
					type: 'textfield'
				}
			},
            {
				header: '原由',
                style:{textAlign:'center'},
				width: 200,
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
			//this.store.remove(selection);
			////console.log(this.store) ;
            var quanidc = selection.data.idc ;
            var cname = selection.data['class'];
            ////console.log(noticeidc) ;
            Ext.Ajax.request({
                url: SERVER+'/deletequan',
                headers: {
                    'userHeader': 'userMsg'
                },
                params: { 'idc': quanidc,
                    'cname':cname
                },
                method: 'GET',
                success: function (response, options) {
			        quan_info_store.remove(selection);
                    Ext.MessageBox.alert('成功', '删除成功');
                    quan_info_store.loadData([]) ;
                    quan_info_store.load() ;
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
        
        var selected = Ext.getCmp('quangrid').getSelectionModel().getSelection()[0];
        var value = null ;
        if (selected){
            value = selected.raw ;
        }

        setQuanWinsShow(9) ;
        Ext.getCmp('quanform').loadRecord(selected);

        //this.store.loadData([]) ;

        if (value != null){ 
            //console.log(value) ;

            var cbclass = Ext.getCmp('cbclass');
            cbclass.setRawValue(value['class']) ;
            Ext.getCmp('cbname').setRawValue(value.student) ;
            Ext.getCmp('cbquantype').setRawValue(value.quan_type) ;
            //Ext.getCmp('quanscore').setRawValue(value.quan_score) ;
            //Ext.getCmp('quanreason').setValue(value.quan_reason) ;
            //Ext.getCmp('quandate').setRawValue(value.quan_date) ;
            
            //cbclass.fireEvent('select',cbclass) ;
            
            //this.store.remove(selected) ;
            this.store.loadData([]) ;
            //--QUAN_COUNTER ;
        }else {
            Ext.MessageBox.alert('提示',' 请选择需要修改的行') ;
            //console.log("the selected record is null or somthing") ;
        }
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
    },
    onDownloadQuan: function(){
        window.open('/static/downloads/quaninfo.xls') ;
    }, 
    onSearchClick: function(){
        // hide the form
        setQuanWinShow('quanform',false) ;
        //deal search 
        var bdate = Ext.getCmp('quan.detail.bdate').getRawValue() ;
        var edate = Ext.getCmp('quan.detail.edate').getRawValue() ;
        var name = Ext.getCmp('quan.detail.name').getRawValue() ;
        console.log(name);
        if (bdate && edate) {
            //console.log(bdate) ;
            //console.log(edate) ;
            this.store.load({
                'params':{
                    'begin':bdate,
                    'end':edate,
                    'name':name,
                    'limit':100
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
                        //console.log(operation.getError()) ;
                        return ; 
                    }
                    if (records && records.length === 0){
                        //console.log(records) ;
                    }
                }
            }) ;
        } else {
            Ext.MessageBox.alert("提示",'请选“开始日期” 和 “结束日期”') ;
        }
    }
});

Ext.define('Quan.DeatilGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.quandetailgrid',

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
		});
        */

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
					xtype: 'datefield',
					id: 'quan.detail.bdate',
                    format:'Y/m/d',
					fieldLabel: '开始日期',
                    width:300,
					name: 'quan_date',
					//allowBlank: false,
					margins: '0 6 0 0',
					maxValue: new Date()
				},
                {
					xtype: 'datefield',
					id: 'quan.detail.edate',
                    format:'Y/m/d',
					fieldLabel: '结束日期',
                    width:300,
					name: 'quan_date',
					//allowBlank: false,
					margins: '0 6 0 0',
					maxValue: new Date(),
                    value: new Date()
				},
                {
					iconCls: 'icon-search',
					text: '查询',
					scope: this,
					handler: this.onSearchClick
				}*/]
			}],
			columns: [{
				text: '序号',
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
                width:160,
				sortable: true,
                style:{textAlign:'center'},
				dataIndex: 'class',
				field: {
					type: 'textfield'
				}
			},
			{
				header: '学生',
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
				sortable: true,
				dataIndex: 'quan_type',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '日期',
                style:{textAlign:'center'},
				sortable: true,
				dataIndex: 'quan_date',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '量化',
                style:{textAlign:'center'},
				sortable: true,
				dataIndex: 'quan_score',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '原由',
                style:{textAlign:'center'},
				width: 200,
				sortable: false,
				menuDisabled: true,
				dataIndex: 'quan_reason',
				field: {
					type: 'textfield'
				}
			}]
		});
		this.callParent();
		this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
	},
    
    onSearchClick: function(){
        var bdate = Ext.getCmp('quan.detail.bdate').getRawValue() ;
        var edate = Ext.getCmp('quan.detail.edate').getRawValue() ;
        if (bdate && edate) {
            //console.log(bdate) ;
            //console.log(edate) ;
            this.store.load({
                'params':{
                    'begin':bdate,
                    'end':edate
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
                        //console.log(operation.getError()) ;
                        return ; 
                    }
                    if (records && records.length === 0){
                        //console.log(records) ;
                    }
                }
            }) ;
        } else {
            Ext.MessageBox.alert("提示",'请选“开始日期” 和 “结束日期”') ;
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
            icon:'static/pic/quanweek.png',
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
                	xtype: 'combobox',
                    id:'quan.grid.cb.week',
					name: 'week',
                    width:200,
                    labelWidth:60,
					displayField: 'week',
					valueField: 'id',
					queryMode: 'local',
					emptyText: '最近一周量化汇总',
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
                    icon:'static/pic/search.gif',
					text: '查看',
					scope: this,
					handler: this.onLookOverWeekQuan
				},{
                    icon:'static/pic/download.png',
                    id:'quan.week.download',
					text: '下载',
					scope: this,
					handler: this.onDownloadWeekQuan
				}]
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
                        //console.log(ret) ;
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
                {text:'分数',dataIndex:'disp_score',width:60,sortable:true},
                {text:'量化分',dataIndex:'disp_quan',width:60,sortable:true},
                {text:'排名',dataIndex:'disp_rank',width:60,sortable:true}
                ]
			},
            {
				header: '卫生',
                menuDisabled:true,
				//width: 100,
				//dataIndex: 'quantype',
                columns:[
                {text:'分数',dataIndex:'heal_score',width:60,sortable:true},
                {text:'量化分',dataIndex:'heal_quan',width:60,sortable:true},
                {text:'排名',dataIndex:'heal_rank',width:60,sortable:true}
                ]
			},
            {
				header: '宿舍',
                menuDisabled:true,
                columns:[
                {text:'分数',dataIndex:'domi_score',width:60,sortable:true},
                {text:'量化分',dataIndex:'domi_quan',width:60,sortable:true},
                {text:'排名',dataIndex:'domi_rank',width:60,sortable:true}
                ]
			},
            {
				header: '活动及其它',
                menuDisabled:true,
                 columns:[
                {text:'分数',dataIndex:'acti_score',width:60,sortable:true},
                {text:'量化分',dataIndex:'acti_quan',width:60,sortable:true},
                {text:'排名',dataIndex:'acti_rank',width:60,sortable:true}
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
				dataIndex: 'total',
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
				dataIndex: 'rank',
				field: {
					type: 'int'
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
    onDownloadWeekQuan: function(){
        /*var ifr = document.createElement('iframe');
        ifr.src = '/static/downloads/quanweekinfo.xls' ;
        ifr.style.display = 'none';       
        document.getElementByTagName('body')[0].appendChild(ifr) ;
        */
 
        window.location= '/static/downloads/quanweekinfo.xls' ;
    },
    onLookOverWeekQuan: function(){
        var week = Ext.getCmp('quan.grid.cb.week').getValue() ;
        //console.log('look over week quan of',week) ; 
        //quan_week_store.loadData([],false) ;
        quan_week_store.load({
            'params':{
                'week':week
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
                    //console.log(records) ;
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
				title: '量化信息表',
				flex: 1,
                hidden:true,
                //minHeight:200,
                //maxHeight:500,
				store: quan_info_store,
				listeners: {
					selectionchange: function(selModel, selected) {}
				}
			},
            {// quan add new info grid
				itemId: 'quangridweek',
				id: 'quangridweek',
				xtype: 'quangridweek',
				title: '周量化汇总表',
				flex: 1,
                hidden:true,
                //minHeight:200,
                //maxHeight:500,
				store: quan_week_store,
				listeners: {
					selectionchange: function(selModel, selected) {
						/*
                        value = null
						if (selected && selected[0]) {
							//console.log(selected[0]);
							value = selected[0].raw;
                            //console.log(value) ;
						}
						//Ext.getCmp('quanform').setValue(value);
                        */
					}
				}
			},
            {
                id:'quangriddetail',
                title:'量化详单',
                xtype:'quandetailgrid',
				margins: '0 0 0 0',
                hidden:true,
				flex: 1,
                store:quan_detail_store
                //hidden:false
            },
            {// add new quan info form
				itemId: 'quanform',
				id: 'quanform',
				xtype: 'quanform',
                title:'量化信息登记',
                minHeight:100,
                maxHeight:500,
				hidden: true,
				manageHeight: false,
				margins: '0 0 0 0'
			},
            {
                id:'quanformdetail',
                xtype:'quandetailform',
                title: '班级量化详单',
                hidden:true ,
				margins: '0 0 0 0'
                //hidden:false
            }]
		});
		this.callParent();
	}
});
/*
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
*/

function getQuanWin(){
    var quanWin = Ext.getCmp('quanwin') ;
    if (quanWin==null){
        quanWin = Ext.create('Quan.window',{
            title:'量化管理',
            id:'quanwin',
            itemId:'quanwin',
            xtype:'quancontainer',
		    icon: 'static/pic/quanwin.png'
        }) ; 
    } 
    return quanWin ;
}
function setQuanWinShow(id,sure){
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

function setQuanWinsShow(mask) {
    setQuanWinShow('quangrid',mask & 1) ;
    setQuanWinShow('quangridweek',mask & 2) ;
    //setQuanWinShow('quangriddetail',mask & 4) ;
    setQuanWinShow('quanform',mask & 8) ;
    if (mask & 8){ // form show 
        //setQuanWinShow('quangridpbar',false) ;
        /*
         * setQuanWinShow('quan.detail.bdate',false) ;
        setQuanWinShow('quan.detail.edate',false) ;
        setQuanWinShow('quan.detail.search',false) ;
        */
    }else {
        //setQuanWinShow('quangridpbar',true) ;
        /*setQuanWinShow('quan.detail.bdate',true) ;
        setQuanWinShow('quan.detail.edate',true) ;
        setQuanWinShow('quan.detail.search',true) ;
        */
    } 
    //setQuanWinShow('quanformdetail',mask & 16) ;
} 
