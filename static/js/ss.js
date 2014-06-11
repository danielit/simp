//define the grid of student status statics 
Ext.define('SS.Grid.SSS', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.ssgrid',

	requires: ['Ext.grid.plugin.CellEditing', 'Ext.form.field.Text', 'Ext.toolbar.TextItem', 'Ext.panel.Panel', 'Ext.ux.form.SearchField', 'Ext.ux.CheckColumn', 'Ext.selection.CheckboxModel', 'Ext.selection.CellModel'],

	initComponent: function() {

		this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
			clickToEdit: 1
		});

		this.CboxModel = Ext.create('Ext.selection.CheckboxModel');
		/*this.pBar = Ext.create('Ext.PagingToolbar', {
			store: this.store,
            id:'ss.bar',
			displayInfo: true,
			displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
			emptyMsg: "没有数据"
		});
        */

		Ext.apply(this, {
			iconCls: 'icon-grid',
            icon:'static/pic/ssgrid.png',
			frame: true,
            //closeable:true,
			//closeAction: 'hiden',
            collapsible:'ture',
			//selModel: this.CboxModel,
			//bbar: this.pBar,
			plugins: [this.editing],
            defaults:{
                menuDisabled:true
            },
			columns: [{
				text: '序号',
                style:{textAlign:'center'},
                algin:'center',
				width: 40,
				sortable: true,
				resizable: false,
				draggable: false,
				//hideable: false,
                hidden:true,
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
				text: '班主任',
                style:{textAlign:'center'},
                algin:'center',
                width:50,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'teacher',
				field: {
					type: 'textfield'
				}
			},
            {
				text: '应到人数',
                style:{textAlign:'center'},
                algin:'center',
                width:60,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'total',
				field: {
					type: 'int'
				}
			},
            {
				text: '实到人数',
                style:{textAlign:'center'},
                algin:'center',
                width:60,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'total_in_real',
				field: {
					type: 'int'
				}
			},
            {
				text: '原有在籍',
                style:{textAlign:'center'},
                algin:'center',
                width:55,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'total_in_record',
				field: {
					type: 'int'
				}
			},
            {
				text: '不再校',
                style:{textAlign:'center'},
                algin:'center',
				width: 50,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'out_school',
				field: {
					type: 'int'
				}
			},
			{
				header: '在校人数',
                menuDisabled:true,
                columns:[
                {text:'男',dataIndex:'in_boy',width:40,sortable:true},
                {text:'女',dataIndex:'in_girl',width:40,sortable:true},
                {text:'合计',dataIndex:'in',width:40,sortable:true}
                ]
			},
            {
				header: '住校人数',
                menuDisabled:true,
				width: 50,
                columns:[
                {text:'男',dataIndex:'live_boy',width:40,sortable:true},
                {text:'女',dataIndex:'live_girl',width:40,sortable:true},
                {text:'合计',dataIndex:'live',width:40,sortable:true}
                ]
			},
            {
				text: '走读',
                style:{textAlign:'center'},
                algin:'center',
				width: 40,
				sortable: true,
				menuDisabled: false,
				dataIndex: 'home',
				field: {
					type: 'int'
				}
			},
            {
                text: '请长假',
                style:{textAlign:'center'},
                algin:'center',
				width: 50,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'longvaca',
				field: {
					type: 'int'
				}

            },
            {
				text: '退学',
                style:{textAlign:'center'},
                algin:'center',
				width: 40,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'quitschool',
				field: {
					type: 'int'
				}
			},
            {
				text: '预科',
                style:{textAlign:'center'},
                algin:'center',
				width: 40,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'pre',
				field: {
					type: 'int'
				}
			},
            {
				text: '三二',
                style:{textAlign:'center'},
                algin:'center',
				width: 40,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: '32',
				field: {
					type: 'int'
				}
			},
            {
				text: '高技',
                style:{textAlign:'center'},
                algin:'center',
				width: 40,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'gj',
				field: {
					type: 'int'
				}
			},
            {
				text: '当兵',
                style:{textAlign:'center'},
                algin:'center',
				width: 40,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'solider',
				field: {
					type: 'int'
				}
			},
            {
				text: '特殊情况',
                style:{textAlign:'center'},
                algin:'center',
				width: 55,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'special',
				field: {
					type: 'int'
				}
			},
           /* {
				text: '考勤信息',
                style:{textAlign:'center'},
                algin:'center',
				width: 200,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'attend_info'
			},*/
            {
				text: '备注',
                style:{textAlign:'center'},
                algin:'center',
				width: 200,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'ps'
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

//define the container for ss 
Ext.define('ss.window', {
	extend: 'Ext.container.Container',
	alias: 'widget.sscontainer',
    id:'sswin',
	initComponent: function() {
		Ext.apply(this, {
			padding: '0 0 0 0',
            icon:'static/pic/stustatic.png',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [{// ss add new info grid
				itemId: 'ssgrid',
				id: 'ssgrid',
				xtype: 'ssgrid',
				title: '在校人数统计',
				flex: 1,
                hidden:false,
				store:ss_statics_store,
				listeners: {
					selectionchange: function(selModel, selected) {}
				}
			}]
		});
		this.callParent();
	}
});

function getSSWin(){
    var ssWin = Ext.getCmp('sswin') ;
    if (ssWin==null){
        ssWin = Ext.create('ss.window',{
            title:'在校人数统计',
            id:'sswin',
            itemId:'sswin',
            xtype:'sscontainer',
		    icon: 'static/pic/css/tabs.gif'
        }) ; 
    } 
    return ssWin ;
}
function setWinShow(id,sure){
    var cmp = Ext.getCmp(id) ;
    if(cmp==null){
        //console.log('id:'+id +' cant find the id of ext cmp') ;
        return ;
    }
    if(sure){
        cmp.show() ;
    }else{
        cmp.hide() ;
    }
}
