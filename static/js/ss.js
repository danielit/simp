// student status statics 

Ext.define('SS.StuStatusStatics', {
	extend: 'Ext.data.Model',
	fields: [
    'class', //class name
    'teacher',//班主任 
    'total',//应到人数
    'total_in_record',//原有在籍
    'out_school',//不再校
    'in_boy',//在校男
    'in_girl',//在校女
    'in',//在校合计
    'live_boy',//住校男
    'live_gril',//住校女
    'live',//住校合计
    'home',//走读合计
    'longvaca',//请长假合计
    'quitschool',//退学人数
    'pre',//预科人数
    '32',//32
    'gj',//高技
    'solider',//当兵
    'special',//特殊情况
    'ps'//备注
    ]
});

var sss_store = Ext.create('Ext.data.Store', {
    model:'SS.StuStatusStatics',
	autoLoad: true,
	//autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read: SERVER + '/getsss',
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

//define the grid of student status statics 
Ext.define('SS.Grid.SSS', {
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
            id:'sss.bar',
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
				text: '班主任',
                style:{textAlign:'center'},
                algin:'center',
                width:160,
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
                width:160,
				//flex: 1,
				sortable: true,
				//dataIndex: 'classname',
				dataIndex: 'total',
				field: {
					type: 'int'
				}
			},
            {
				text: '原有在籍',
                style:{textAlign:'center'},
                algin:'center',
                width:160,
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
				//width: 100,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'outschool',
				field: {
					type: 'int'
				}
			},
			{
				header: '在校人数',
                menuDisabled:true,
                columns:[
                {text:'男',dataIndex:'in_boy',width:60,sortable:true},
                {text:'女',dataIndex:'in_girl',width:60,sortable:true},
                {text:'合计',dataIndex:'in',width:60,sortable:true}
                ]
			},
            {
				header: '住校人数',
                menuDisabled:true,
				//width: 100,
				//dataIndex: 'quantype',
                columns:[
                {text:'男',dataIndex:'live_boy',width:60,sortable:true},
                {text:'女',dataIndex:'live_girl',width:60,sortable:true},
                {text:'合计',dataIndex:'live',width:60,sortable:true}
                ]
			},
            {
				text: '走读',
                style:{textAlign:'center'},
                algin:'center',
				//width: 100,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'home',
				field: {
					type: 'int'
				}
			},
            {
                text: '请长假',
                style:{textAlign:'center'},
                algin:'center',
				//width: 100,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'longvaca',
				field: {
					type: 'int'
				}

            },
            {
				text: '退学人数',
                style:{textAlign:'center'},
                algin:'center',
				//width: 100,
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
				//width: 100,
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
				//width: 100,
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
				//width: 100,
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
				//width: 100,
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
				//width: 100,
				sortable: true,
				menuDisabled: false,
				//dataIndex: 'quanreason',
				dataIndex: 'special',
				field: {
					type: 'int'
				}
			},
               {
				text: '备注',
                style:{textAlign:'center'},
                algin:'center',
				//width: 100,
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
        console.log('look over week quan of',week) ; 
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
                    console.log(records) ;
                }
            }
        }) ;
    }
});

