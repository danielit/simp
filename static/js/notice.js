Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model', ]);

var notice_COUNTER = 0 ;

Ext.define('notice.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.noticeform',
	requires: ['Ext.data.*', 'Ext.form.*'],
	xtype: 'form-notice',
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
            icon:'static/pic/rss_add.gif',
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
					id: 'noticehidden',
                    width:300,
					name: 'idc',
                    hidden:true
				},
                {
					xtype: 'textfield',
					name: 'title',
                    width:280,
					id: 'noticeform.title',
					emptyText: '请输入标题...',
					fieldLabel: '标题',
					margins: '0 6 0 0',
					allowBlank: false,
					forceSelection: true,
					listeners: {
						scop: this,
						'select': function(combo, records, index) {}
					}
				},
                {
					xtype: 'datefield',
					id: 'noticeform.date',
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
					xtype: 'textfield',
					id: 'noticefor.author',
					grow: false,
					margins: '0 6 0 0',
					name: 'author',
					fieldLabel: '作者',
					allowBlank: false,
                    autoScroll: true,
					width: 610,
					emptyText: '请在此填写发布者...'
				}
                    ]
			},
			{
				xtype: 'container',
				itemId: 'form.container.d',
				layout: 'hbox',
                width:700,
				margin: '0 0 5 0',
				items: [{
					xtype: 'textareafield',
					id: 'noticeform.content',
					grow: false,
					margins: '0 6 0 0',
					name: 'content',
					fieldLabel: '内容',
					allowBlank: false,
                    autoScroll:true,
					width: 610,
					emptyText: '请在此填写通知/公告内容...'
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
            val.idc = ++notice_COUNTER ;
           
            //notice_info_store.loadData([val]) ;
            sm_notice_store.add([val]) ;
            console.log(val) ;
            form.reset() ;
		}
	}
});

//define the grid
Ext.define('notice.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.noticegrid',

	requires: ['Ext.grid.plugin.CellEditing', 'Ext.form.field.Text', 'Ext.toolbar.TextItem', 'Ext.panel.Panel', 'Ext.ux.form.SearchField', 'Ext.ux.CheckColumn', 'Ext.selection.CheckboxModel', 'Ext.selection.CellModel'],

	initComponent: function() {

		this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
			clickToEdit: 1
		});

		this.CboxModel = Ext.create('Ext.selection.CheckboxModel');
		this.pBar = Ext.create('Ext.PagingToolbar', {
			store: this.store,
            id:'noticegridpbar',
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
                    icon:'static/pic/rss_load.gif',
					text: '修改',
                    disabled:true,
                    itemId:'modify',
					scope: this,
					handler: this.onModifyClick
				},'|',
				{
					iconCls: 'icon-delete',
                    icon:'static/pic/rss_delete.gif',
					text: '删除',
					disabled: true,
					itemId: 'delete',
					scope: this,
					handler: this.onDeleteClick
				},'|',
                {
					xtype: 'combobox',
					id: 'noticesearch.class',
					name: 'class',
                    width:300,
                    labelWidth:40,
					displayField: 'name',
					valueField: 'id',
					queryMode: 'remote',
					emptyText: '请选择班级...',
					fieldLabel: '班级',
					hideLabel: false,
					margins: '0 6 0 0',
					store: sm_notice_store,
					allowBlank: false,
					forceSelection: true
				},
                {
					xtype: 'datefield',
					id: 'noticesearch.bdate',
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
					id: 'noticesearch.edate',
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
                    id:'noticesearch.btn',
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
                    icon:'static/pic/rss_add.gif',
					text: '提交',
				    margins: '0 0 0 50%',
					scope: this,
                    //hidden:true,
					//handler: this.onSync
                    id:'noticegridsave',
                    handler:function(){
                        //alert('sm_nontice_store sync') ;
                        ret = sm_notice_store.sync({
                            failure:function(batch){
                                Ext.MessageBox.show({
                                    title: '提交失败',
                                    msg: '远程服务器错误，<br/>请联系系统管理员！',
					                icon: Ext.MessageBox.ERROR,
					                buttons: Ext.Msg.OK
			                    });
                                console.log("notice submit failure") ;
                            },
                            success:function(batch){
                                Ext.MessageBox.show({
                                    title: '提交成功',
                                    msg: '数据提交成功!',
					                //msg: operation.getError(),
					                icon: Ext.MessageBox.INFO,
					                buttons: Ext.Msg.OK
			                    });
                                sm_notice_store.loadData([],false) ;
                                notice_COUNTER = 0 ;
                                console.log("notice submit success") ;
                            }
                        }) ; 
                        console.log(ret) ;
                    }
				}]
			}],
			columns: [{
				text: '编号',
				//width: 40,
                style:{textAlign:'center'},
				sortable: false,
				resizable: false,
				draggable: false,
				hideable: true,
                hidden:true,
				menuDisabled: true,
				dataIndex: 'idc'
			},
			{
				header: '标题',
				//flex: 1,
                width:160,
				sortable: true,
				dataIndex: 'title',
                style:{textAlign:'center'},
				field: {
					type: 'textfield'
				}
			},
			{
				header: '作者',
				//width: 100,
				sortable: true,
                style:{textAlign:'center'},
				dataIndex: 'author',
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
				//dataIndex: 'noticetype',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '摘要',
                style:{textAlign:'center'},
				width: 200,
				sortable: true,
				dataIndex: 'summary',
				//dataIndex: 'date',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '内容',
                style:{textAlign:'center'},
				width: 300,
				sortable: true,
				dataIndex: 'content',
				//dataIndex: 'noticescore',
				field: {
					type: 'textfield'
				}
			}]
		});
		this.callParent();
		this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
	},

    onSearchClick: function(){
    
        var cname = Ext.getCmp('noticesearch.class').getRawValue() ;
        var bdate = Ext.getCmp('noticesearch.bdate').getRawValue() ;
        var edate = Ext.getCmp('noticesearch.edate').getRawValue() ;
        var cid= Ext.getCmp('noticesearch.class').getValue() ;
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
		sm_notice_store.sync();
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
        //first let modify form show
        setAddNoticeWinsShow('noticeform',true) ;
        //setnoticeWinShow('noticegridsave',true) ;
        //var selected = this.getView().getSelectionModel().getSelection()[0];
        
        var selected = Ext.getCmp('noticegrid').getSelectionModel().getSelection()[0];
        var value = null ;
        if (selected){
            value = selected.raw ;
        }
        console.log(value) ;
        console.log(selected) ;
        //Ext.getCmp('noticeform').loadRecord(value);
        Ext.getCmp('noticeform').loadRecord(selected);
        this.store.remove(selected) ;
        --notice_COUNTER ;
    },
	onAddClick: function() {
        noticeform = Ext.getCmp('noticeform') ;
        if (noticeform.isHidden()){
            noticeform.show() ;
        }
        pbar = Ext.getCmp('noticegridpbar') ;
        if (!pbar.isHidden()){
            pbar.hide() ;
        }
      	}
});

Ext.require(['Ext.data.*', 'Ext.tip.QuickTipManager', 'Ext.window.MessageBox']);

//define the container for notice 
Ext.define('notice.window', {
	extend: 'Ext.container.Container',
	alias: 'widget.noticecontainer',
	initComponent: function() {
		Ext.apply(this, {
			padding: '0 0 0 0',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [{// notice add new info grid
				itemId: 'noticegrid',
				id: 'noticegrid',
				xtype: 'noticegrid',
				title: '通知/公告管理',
				flex: 1,
                hidden:false,
                //minHeight:200,
                //maxHeight:500,
				store: sm_notice_store,
				listeners: {
					selectionchange: function(selModel, selected) {}
				}
			},
            {// add new notice info form
				itemId: 'noticeform',
				id: 'noticeform',
				xtype: 'noticeform',
                title:'添加通知/公告',
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

function getNoticeWin(){
    var noticeWin = Ext.getCmp('noticewin') ;
    if (noticeWin==null){
        noticeWin = Ext.create('notice.window',{
            title:'通知/公告管理',
            id:'noticewin',
            itemId:'noticewin',
            xtype:'noticecontainer',
		    icon: 'static/pic/css/tabs.gif'
        }) ; 
    } 
    return noticeWin ;
}


function setAddNoticeWinsShow(show) {
    setWinShow('noticesearch.class',!show) ;
    setWinShow('noticesearch.bdate',!show) ;
    setWinShow('noticesearch.edate',!show) ;
    setWinShow('noticesearch.btn',!show) ;
    setWinShow('noticegridsave',show) ;
    setWinShow('noticeform',show) ;
    //setnoticeWinShow('noticeformdetail',mask & 16) ;
} 
