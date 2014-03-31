Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model' ]);

Ext.define('Stu.Info', {
	extend: 'Ext.form.Panel',
	alias: 'widget.stuinfoform',
	requires: ['Ext.data.*', 'Ext.form.*'],
	xtype: 'stuinfo-form',

	frame: true,
	title: '学生基本信息',
	bodyPadding: 5,

	initComponent: function() {

		Ext.apply(this, {
			//width: 1000,
			fieldDefaults: {
				labelAlign: 'right',
				labelWidth: 60,
                width:200,
				msgTarget: 'qtip'
			},

			items: [{
		            xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
    
					margin: '0 0 5 0',
					items: [
                    {
						fieldLabel: '系部',
						name: 'department',
						//flex: 1,
						allowBlank: false
					},{
						fieldLabel: '专业',
						name: 'discipline',
						//flex: 1,
						allowBlank: false
					},{
					    xtype:'panel',	
                        html:'<img src="static/pic/main.jpg" width ="100" height="150" />'
					},{
						fieldLabel: '班级',
						name: 'class',
						//flex: 1,
						allowBlank: false
					},{
						fieldLabel: '学历层次',
						name: 'layer',
						//flex: 1,
						allowBlank: false
					}]
				},{
					xtype: 'container',
					layout: 'hbox',
                    //width:800,
					defaultType: 'textfield',
					margin: '0 0 5 0',
					items: [{
						fieldLabel: '姓名',
						name: 'name',
						//flex: 1,
						allowBlank: false
					},{
						fieldLabel: '曾用名',
						name: 'oldname',
						//flex: 1,
						allowBlank: false
					},{
						fieldLabel: '学号',
						name: 'stuno',
						//flex: 1,
						allowBlank: false
					},{
						fieldLabel: '性别',
						name: 'gender',
						//flex: 1,
						allowBlank: false
					}]
				},{
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					margin: '0 0 5 0',
					items: [{
						fieldLabel: '身份证号',
						name: 'idnum',
						//flex: 1,
						allowBlank: false
					},{
						fieldLabel: '籍贯',
						name: 'oldaddress',
						//flex: 1,
						allowBlank: false
					},{
						fieldLabel: '民族',
						name: 'ethnic',
						//flex: 1,
						allowBlank: false
					},{
						fieldLabel: '家庭住址',
						name: 'email',
						//flex: 1,
						allowBlank: false
					}]
				},{
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					margin: '0 0 5 0',
					items: [{
						fieldLabel: '政治面貌',
						name: 'poltype',
						//flex: 1,
						allowBlank: false
					},{
						fieldLabel: '手机',
						name: 'phone',
						//flex: 1,
						allowBlank: false
					},{
						fieldLabel: '电子邮件',
						name: 'email',
						//flex: 1,
						allowBlank: false
					},{
						fieldLabel: 'QQ',
						name: 'qq',
						//flex: 1,
						allowBlank: false
					}]
				}],

			buttons: [{
				text: '重置',
				scope: this,
				handler: this.onResetClick
			},
			{
				text: '保存',
				//width: 
				scope: this,
				handler: this.onCompleteClick
			}]
		});
		this.callParent();
	},
    onSaveClick:function() {

    },
    onResetClick:function(){

    }
});
Ext.onReady(function() {
	var win = Ext.create('Ext.container.Container', {
		padding: '0 0 0 0',
		//width: 500,
		height: Ext.themeName === 'neptune' ? 500: 450,
		renderTo: Ext.getBody(),
		title: '量化管理',
		icon: 'static/pic/css/tabs.gif',
		layout: {
			type: 'vbox',
			align: 'stretch',
			pack: 'start'
		},
		items: [{
			itemId: 'checkout',
			xtype: 'stuinfoform',
			title: '基本信息登记表'
		}]
	});
});

