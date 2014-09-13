Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model']);

var reward_COUNTER = 0 ;

Ext.define('reward.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.rewardform',
	requires: ['Ext.data.*', 'Ext.form.*'],
	xtype: 'form-reward',
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
            icon:'static/pic/attendform.png',
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
					id: 'rewardform.class',
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
					id: 'rewardform.name',
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
					id: 'cbrewardtype',
					name: 'type',
                    width:300,
					displayField: 'type',
					valueField: 'type',
					queryMode: 'local',
					emptyText: '请选择奖惩类型...',
					fieldLabel: '类型',
					margins: '0 6 0 0',
					store: reward_type_store,
					allowBlank: false,
					forceSelection: true
				},
                {
					id: 'rewardhidden',
                    width:300,
					name: 'idc',
                    hidden:true
				},
				{
					xtype: 'datefield',
					id: 'rewarddate',
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
					id: 'rewardform.dtype',
					name: 'dtype',
                    width:300,
					displayField: 'nclass',
					valueField: 'nclass',
					queryMode: 'local',
					emptyText: '请选择级别...',
					fieldLabel: '级别',
					margins: '0 6 0 0',
					store: reward_nclass_store,
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
					id: 'rewardreason',
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
                    margin: '0 0 5 25'
                },
				items: [{
					xtype: 'button',
                    width:80,
                    icon:'static/pic/reset.png',
                    margin: '0 0 0 240',
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
            val['class'] = Ext.getCmp('rewardform.class').getRawValue() ;
            val.student = Ext.getCmp('rewardform.name').getRawValue() ;
            val.dtype = Ext.getCmp('rewardform.dtype').getRawValue() ;
           
            //reward_info_store.loadData([val]) ;
            reward_info_store.add([val]) ;
            form.reset() ;
		}
	}
});

//define the grid
Ext.define('reward.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.rewardgrid',

	requires: ['Ext.grid.plugin.CellEditing', 'Ext.form.field.Text', 'Ext.toolbar.TextItem', 'Ext.panel.Panel', 'Ext.ux.form.SearchField', 'Ext.ux.CheckColumn', 'Ext.selection.CheckboxModel', 'Ext.selection.CellModel'],

	initComponent: function() {

		this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
			clickToEdit: 1
		});

		this.CboxModel = Ext.create('Ext.selection.CheckboxModel');
		this.pBar = Ext.create('Ext.PagingToolbar', {
			store: this.store,
            id:'rewardgridpbar',
			displayInfo: true,
			displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
			emptyMsg: "没有数据"
		});

		Ext.apply(this, {
			iconCls: 'icon-grid',
            icon:'static/pic/attendgrid.png',
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
                    icon:'static/pic/attendmodify.png',
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
					id: 'rewardsearch.class',
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
					id: 'rewardsearch.bdate',
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
					id: 'rewardsearch.edate',
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
                    xtype: 'textfield',
					name: 'name',
                    width:200,
                    labelWidth:60,
                    id:'rewardsearch.name',
					emptyText: '此项可以为空',
					fieldLabel: '姓&nbsp&nbsp&nbsp&nbsp&nbsp名',
					margins: '0 6 0 0',
					allowBlank: true,
					forceSelection: true
                },
                {
                    xtype:'button',
                    id:'rewardsearch.btn',
                    iconCls:'icon-search',
                    icon:'static/pic/search.gif',
                    text:'查询',
                    scope:this,
                    handler:this.onSearchClick
                },
                {
                    xtype:'button',
                    icon:'static/pic/download.png',
                    id:'reward.download',
					text: '下载',
					scope: this,
					handler: this.onDownloadreward
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
                    id:'rewardgridsave',
                    handler:function(){
                        ret = reward_info_store.sync({
                            failure:function(batch){
                                Ext.MessageBox.show({
                                    title: '提交失败',
                                    msg: '远程服务器错误，<br/>请联系系统管理员！',
					                icon: Ext.MessageBox.ERROR,
					                buttons: Ext.Msg.OK
			                    });
                                //console.log("reward submit failure") ;
                            },
                            success:function(batch){
                                Ext.MessageBox.show({
                                    title: '提交成功',
                                    msg: '数据提交成功!',
					                //msg: operation.getError(),
					                icon: Ext.MessageBox.INFO,
					                buttons: Ext.Msg.OK
			                    });
                                //reward_info_store.loadData([],false) ;
                                reward_info_store.load() ;
                                reward_COUNTER = 0 ;
                                //console.log("reward submit success") ;
                            }
                        }) ; 
                        //console.log(ret) ;
                    } }]
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
				header: '姓名',
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
				//dataIndex: 'rewardtype', 
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
				header: '级别',
                style:{textAlign:'center'},
				//width: 100,
				sortable: true,
				dataIndex: 'dtype',
				//dataIndex: 'rewardscore',
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
				//dataIndex: 'rewardreason',
				dataIndex: 'ps',
				field: {
					type: 'textfield'
				}
			}]
		});
		this.callParent();
		this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
	},
    onDownloadreward:function(){
        window.location.href = '/static/downloads/rewardinfo.xls' ;
    },
    onSearchClick: function(){
        //hide the form 
        setrewardWinShow('rewardform',false) ;
        //deal search
        var cname = Ext.getCmp('rewardsearch.class').getRawValue() ;
        var bdate = Ext.getCmp('rewardsearch.bdate').getRawValue() ;
        var edate = Ext.getCmp('rewardsearch.edate').getRawValue() ;
        var cid = Ext.getCmp('rewardsearch.class').getValue() ;
        var name = Ext.getCmp('rewardsearch.name').getValue() ;
        if (!bdate && !edate && !cname){
            Ext.MessageBox.alert("提示",'至少选择一个查询条件!') ;
            return ;
        }
        if (cid=='0'){
            cname='' ;
        }
            //console.log(cname) ;
            //console.log(bdate) ;
            //console.log(edate) ;
            this.store.load({
                'params':{
                    'page':1,
                    'start':0,
                    'limit':200,
                    'class':cname,
                    'begin':bdate,
                    'end':edate,
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
		reward_info_store.sync();
	},

	onDeleteClick: function() {
		var selections = this.getView().getSelectionModel().getSelection();
		Ext.Array.forEach(selections, function(selection, index) {
			////console.log(this.store) ;
			//this.store.remove(selection);
            var rewardidc = selection.data.idc ;
            var rewardname = selection.data.student;
            ////console.log(noticeidc) ;
            Ext.Ajax.request({
                url: SERVER+'/deletereward',
                headers: {
                    'userHeader': 'userMsg'
                },
                params: { 'idc': rewardidc,
                    'name':rewardname
                },
                method: 'GET',
                success: function (response, options) {
			        //reward_info_store.remove(selection);
                    reward_info_store.load() ;
                    //setrewardWinShow('rewardform',false) ;
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
        setrewardWinShow('rewardform',true) ;
        setrewardWinShow('rewardgridsave',true) ;
        //var selected = this.getView().getSelectionModel().getSelection()[0];
        
        var selected = Ext.getCmp('rewardgrid').getSelectionModel().getSelection()[0];
        var value = null ;
        if (selected){
            value = selected.raw ;
        }
        //console.log(value) ;
        //console.log(selected) ;
        Ext.getCmp('rewardform').loadRecord(selected);
        Ext.getCmp('rewardform.class').setRawValue(value['class']) ;
        Ext.getCmp('rewardform.name').setRawValue(value.student) ;
        Ext.getCmp('rewardform.dtype').setRawValue(value.dtype) ;
        //this.store.remove(selected) ;
        this.store.loadData([]) ;
    },
	onAddClick: function() {
        rewardform = Ext.getCmp('rewardform') ;
        if (rewardform.isHidden()){
            rewardform.show() ;
        }
        pbar = Ext.getCmp('rewardgridpbar') ;
        if (!pbar.isHidden()){
            pbar.hide() ;
        }
      	}
});

Ext.define('reward.Upload', {
	extend: 'Ext.form.Panel',
	alias: 'widget.rewardupload',
//Ext.create('Ext.form.Panel', {
        title: '文件上传',
        width: 400,
        bodyPadding: 10,
        frame: true,
        renderTo: Ext.getBody(),
        items: [{
            xtype: 'filefield',
            name: 'file',
            fieldLabel: '文件',
            labelWidth: 50,
            msgTarget: 'side',
            allowBlank: false,
            anchor: '100%',
            buttonText: '选着要上传的文件...'
        }],

        buttons: [{
            text: 'Upload',
            handler: function() {
                var form = this.up('form').getForm();
                if(form.isValid()){
                    form.submit({
                        url: 'photo-upload.php',
                        waitMsg: 'Uploading your photo...',
                        success: function(fp, o) {
                        Ext.Msg.alert('Success', 'Your photo "' + o.result.file + '" has been uploaded.');
                        }
                    });
                }
            }
        }]
});


Ext.require(['Ext.data.*', 'Ext.tip.QuickTipManager', 'Ext.window.MessageBox']);

//define the container for reward 
Ext.define('reward.window', {
	extend: 'Ext.container.Container',
	alias: 'widget.rewardcontainer',
	initComponent: function() {
		Ext.apply(this, {
			padding: '0 0 0 0',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [{// reward add new info grid
				itemId: 'rewardgrid',
				id: 'rewardgrid',
				xtype: 'rewardgrid',
				title: '学生奖惩列表',
				flex: 1,
                hidden:false,
                //minHeight:200,
                //maxHeight:500,
				store: reward_info_store,
				listeners: {
					selectionchange: function(selModel, selected) {}
				}
			},
            {// add new reward info form
				itemId: 'rewardform',
				id: 'rewardform',
				xtype: 'rewardform',
                title:'学生奖惩编辑',
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

function getrewardWin(){
    var rewardWin = Ext.getCmp('rewardwin') ;
    if (rewardWin==null){
        rewardWin = Ext.create('reward.window',{
            title:'学生奖惩管理',
            id:'rewardwin',
            icon:'static/pic/attendwin.png',
            itemId:'rewardwin',
            xtype:'rewardcontainer',
		    icon: 'static/pic/css/tabs.gif'
        }) ; 
    } 
    return rewardWin ;
}
function setrewardWinShow(id,sure){
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

function setrewardWinsShow(mask) {
    //setrewardWinShow('rewardgridpbar',!mask) ;
    //setrewardWinShow('rewardsearch.class',!mask) ;
    //setrewardWinShow('rewardsearch.bdate',!mask) ;
    //setrewardWinShow('rewardsearch.edate',!mask) ;
    //setrewardWinShow('rewardsearch.btn',!mask) ;
    setrewardWinShow('rewardgridsave',mask) ;
    setrewardWinShow('rewardform',mask) ;
    //setrewardWinShow('rewardformdetail',mask & 16) ;
} 
