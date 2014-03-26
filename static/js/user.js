Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model', ]);


Ext.define('user.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.userform',
	requires: ['Ext.data.*', 'Ext.form.*'],
	xtype: 'form-user',
	frame: true,
	bodyPadding: 5,
    //height:350,
    //minHeight:350,
    //maxHeight:400,
    autoScroll:true,

	initComponent: function() {
		Ext.apply(this, {
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'qtip',
                anchor:'100%'
			},
			iconCls: 'icon-form',
            icon:'static/pic/user.png',
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
				margin: '20 0 10 0',
				items: [{
					id: 'userhidden',
					name: 'idc',
                    hidden:true
				},
                {
					xtype: 'textfield',
					name: 'user',
                    width:300,
					id: 'userform.user',
					emptyText: '请输入用户名...',
					fieldLabel: '用户名',
					margins: '0 6 0 0',
					allowBlank: false
				},
                {
					xtype: 'textfield',
					name: 'passwd',
                    width:300,
					id: 'userform.passwd',
					emptyText: '请输入密码...',
					fieldLabel: '初始密码',
					margins: '0 6 0 0',
					allowBlank: false
				}]
			},
			{
				xtype: 'container',
				itemId: 'form.container.b',
				layout: 'hbox',
				defaultType: 'textfield',
				margin: '0 0 5 0',
				items: [
                {
                    xtype: 'combobox',
					id: 'userform.role',
					name: 'role',
                    width:300,
					displayField: 'name',
					valueField: 'id',
					queryMode: 'local',
					emptyText: '请选择用户角色...',
					fieldLabel: '用户角色',
					hideLabel: false,
					margins: '0 6 0 0',
					store: user_role_store,
					allowBlank:false,
                    value:'学生'
			    },
                {
					xtype: 'textfield',
					id: 'userform.number',
					grow: false,
					margins: '0 6 0 0',
					name: 'number',
					fieldLabel: '关联号码',
					allowBlank: true,
                    autoScroll: true,
					width: 300,
					emptyText: '请在此填写学号或教工号...'
				}]
			},
			{
				xtype: 'container',
				itemId: 'form.container.e',
				layout: 'hbox',
                width:700,
				margin: '20 0 5 0',
                align:'center',
                defaults:{
                    margin: '0 0 10 25',
                },
				items: [{
					xtype: 'button',
                    width:80,
                    margin: '0 0 0 240',
                    text:'重置',
                    icon:'static/pic/reset.png',
                    scope:this, handler: this.onResetClick
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
            
            val = form.getValues() ;
            //val.idc = ++user_COUNTER ;
           
            //user_info_store.loadData([val]) ;
            
            val.role = Ext.getCmp('userform.role').getRawValue() ;
            sm_user_store.add([val]) ;
            console.log(val) ;
            form.reset() ;
		}
	}
});

//define the grid
Ext.define('user.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.usergrid',

	requires: ['Ext.grid.plugin.CellEditing', 'Ext.form.field.Text', 'Ext.toolbar.TextItem', 'Ext.panel.Panel', 'Ext.ux.form.SearchField', 'Ext.ux.CheckColumn', 'Ext.selection.CheckboxModel', 'Ext.selection.CellModel'],

	initComponent: function() {

		this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
			clickToEdit: 1
		});

		this.CboxModel = Ext.create('Ext.selection.CheckboxModel');
		this.pBar = Ext.create('Ext.PagingToolbar', {
			store: this.store,
            id:'usergridpbar',
			displayInfo: true,
			displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
			emptyMsg: "没有数据"
		});

		Ext.apply(this, {
			iconCls: 'icon-grid',
            icon:'static/pic/userlist.png',
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
				
                },
                /*
                {
					xtype: 'datefield',
					id: 'usersearch.bdate',
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
					id: 'usersearch.edate',
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
                    xtype:'textfield',
                    name:'user',
                    id:'usersearch.user',
                    margins:'0 5 0 5',
                    width:300,
                    labelWidth:50,
                    fieldLabel:'用户名',
                    allowBlank:false
                },
                {
                    xtype:'button',
                    id:'usersearch.btn',
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
                    icon:'static/pic/adduser.png',
					text: '提交',
				    margins: '0 0 0 50%',
					scope: this,
                    //hidden:true,
					//handler: this.onSync
                    id:'usergridsave',
                    handler:function(){
                        //alert('sm_nontice_store sync') ;
                        ret = sm_user_store.sync({
                            failure:function(batch){
                                Ext.MessageBox.show({
                                    title: '提交失败',
                                    msg: '远程服务器错误，<br/>请联系系统管理员！',
					                icon: Ext.MessageBox.ERROR,
					                buttons: Ext.Msg.OK
			                    });
                                console.log("user submit failure") ;
                            },
                            success:function(batch){
                                Ext.MessageBox.show({
                                    title: '提交成功',
                                    msg: '数据提交成功!',
					                //msg: operation.getError(),
					                icon: Ext.MessageBox.INFO,
					                buttons: Ext.Msg.OK
			                    });
                                sm_user_store.loadData([],false) ;
                                sm_user_store.load() ;
                                //user_COUNTER = 0 ;
                                console.log("user submit success") ;
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
                hidden:false,
				menuDisabled: true,
				dataIndex: 'idc'
			},
			{
				header: '用户名',
				//flex: 1,
                width:160,
				sortable: true,
				dataIndex: 'user',
                style:{textAlign:'center'},
				field: {
					type: 'textfield'
				}
			},
			{
				header: '密码',
				//width: 100,
				sortable: true,
                style:{textAlign:'center'},
				dataIndex: 'passwd',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '用户角色',
                style:{textAlign:'center'},
				//width: 100,
				sortable: true,
				dataIndex: 'role',
				//dataIndex: 'usertype',
				field: {
					type: 'textfield'
				}
			},
            {
				header: '关联号码',
                style:{textAlign:'center'},
				width: 200,
				sortable: true,
				dataIndex: 'number',
				//dataIndex: 'date',
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
        setWinShow('userform',false) ;
        //deal search
        var user = Ext.getCmp('usersearch.user').getValue() ;
        //var bdate = Ext.getCmp('usersearch.bdate').getRawValue() ;
        //var edate = Ext.getCmp('usersearch.edate').getRawValue() ;
        //var cid= Ext.getCmp('usersearch.class').getValue() ;
        if (!user || user == ""){
            Ext.MessageBox.alert("提示",'请输入要查找的用户名!') ;
            return ;
        }
        this.store.load({
                'params':{
                    'page':1,
                    'start':0,
                    'limit':200,
                    'user':user
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
		sm_user_store.sync();
	},

	onDeleteClick: function() {
		var selections = this.getView().getSelectionModel().getSelection();
		Ext.Array.forEach(selections, function(selection, index) {
			//console.log(this.store) ;
			//this.store.remove(selection);
            var idc = selection.data.idc ;
            var user = selection.data.user;
            //console.log(noticeidc) ;
            Ext.Ajax.request({
                url: SERVER+'/deleteuser',
                headers: {
                    'userHeader': 'userMsg'
                },
                params: { 'idc': idc,
                'user':user},
                method: 'GET',
                success: function (response, options) {
			       //sm_notice_store.remove(selection);
                    sm_user_store.load() ;
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
        setAddUserWinsShow('userform',true) ;
        
        var selected = Ext.getCmp('usergrid').getSelectionModel().getSelection()[0];
        if (selected) {
            console.log(selected) ;
            Ext.getCmp('userform').loadRecord(selected);
            this.store.remove(selected) ;
            this.store.loadData([]) ;
        } else {
            console.log('selected row is none') ;
            /*
            Ext.MessageBox.show({
                title: '提',
                msg: '远程服务器错误，<br/>请联系系统管理员！',
				icon: Ext.MessageBox.ERROR,
				buttons: Ext.Msg.OK
			 });
             */
        }
    },
	onAddClick: function() {
        userform = Ext.getCmp('userform') ;
        if (userform.isHidden()){
            userform.show() ;
        }
        pbar = Ext.getCmp('usergridpbar') ;
        if (!pbar.isHidden()){
            pbar.hide() ;
        }
      	}
});

Ext.require(['Ext.data.*', 'Ext.tip.QuickTipManager', 'Ext.window.MessageBox']);

//define the container for user 
Ext.define('user.window', {
	extend: 'Ext.container.Container',
	alias: 'widget.usercontainer',
	initComponent: function() {
		Ext.apply(this, {
			padding: '0 0 0 0',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [{// user add new info grid
				itemId: 'usergrid',
				id: 'usergrid',
				xtype: 'usergrid',
                title:'用户列表',
				flex: 1,
                hidden:false,
                //minHeight:200,
                //maxHeight:500,
				store: sm_user_store,
				listeners: {
					selectionchange: function(selModel, selected) {}
				}
			},
            {// add new user info form
				itemId: 'userform',
				id: 'userform',
				xtype: 'userform',
                title:'添加用户',
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

function getUserWin(){
    var userWin = Ext.getCmp('userwin') ;
    if (userWin==null){
        userWin = Ext.create('user.window',{
            title:'用户管理',
            id:'userwin',
            itemId:'userwin',
            xtype:'usercontainer',
		    icon: 'static/pic/css/tabs.gif'
        }) ; 
    } 
    return userWin ;
}


function setAddUserWinsShow(show) {
    //setWinShow('usergridpbar',!show) ;
    //setWinShow('usersearch.btn',!show) ;
    //setWinShow('usersearch.user',!show) ;
    setWinShow('usergridsave',show) ;
    setWinShow('userform',show) ;
    //setuserWinShow('userformdetail',mask & 16) ;
} 
					
