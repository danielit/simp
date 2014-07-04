Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model']);

//Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.define('Chat.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.chatform',
	requires: ['Ext.data.*', 'Ext.form.*'],
	xtype: 'form-chat',
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
            icon:'static/pic/rss.jpg',
			layout: 'anchor',
			anchor: '100%',
            collapsible:'ture',
			align: 'center',
			items: [{
                xtype : 'textareafield',
                grow : false,
                name : 'message',
                hideLabel: true,
                //fieldLabel :'Message',
                anchor : '100%'
            },
            {
                xtype: 'htmleditor',
                height: 130,
                //id: 'htmleditor',
                hideLabel: true,
                anchor : '100%'
            }],
            bbar: [{
                text: '关闭',
                icon:'/static/pic/rss.gif',
                handler:this.onCloseClick()
            },'-',
            {
                text: '发送',
                icon:'/static/pic/rss.gif',
                handler:this.onSendClick()
            }]
	});
		this.callParent();
	},

	onCloseClick: function() {
        alert('close chatwin') ;
        this.getForm().reset() ;
        this.getForm().hide();
	}, 
	onSendClick: function() {
        alert('sendmsg') ;
		var form = this.getForm();
		if (form.isValid()) {
            
            //val = form.getValues() ;
            //console.log("get from form");
            //console.log(val);
            //val['class'] = Ext.getCmp('chatform.class').getRawValue() ;
            //val.student = Ext.getCmp('chatform.name').getRawValue() ;
           
            //chat_info_store.loadData([val]) ;
            //chat_info_store.add([val]) ;
            form.reset() ;
		}
	}
});
/*
Ext.require(['Ext.data.*', 'Ext.tip.QuickTipManager', 'Ext.window.MessageBox']);

//define the container for chat 
Ext.define('chat.window', {
	extend: 'Ext.container.Container',
	alias: 'widget.chatcontainer',
	initComponent: function() {
		Ext.apply(this, {
			padding: '0 0 0 0',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start'
			},
			items: [{// chat add new info grid
				itemId: 'chatgrid',
				id: 'chatgrid',
				xtype: 'chatgrid',
				title: '学生考勤列表',
				flex: 1,
                hidden:false,
                //minHeight:200,
                //maxHeight:500,
				store: chat_info_store,
				listeners: {
					selectionchange: function(selModel, selected) {}
				}
			},
            {// add new chat info form
				itemId: 'chatform',
				id: 'chatform',
				xtype: 'chatform',
                title:'学生考勤编辑',
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

function getChatWin(){
    var chatWin = Ext.getCmp('chatwin') ;
    if (chatWin==null){
        chatWin = Ext.create('chat.window',{
            title:'学生考勤管理',
            id:'chatwin',
            icon:'static/pic/chatwin.png',
            itemId:'chatwin',
            xtype:'chatcontainer',
		    icon: 'static/pic/css/tabs.gif'
        }) ; 
    } 
    return chatWin ;
}
function setChatWinShow(id,sure){
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

function setChatWinsShow(mask) {
    //setChatWinShow('chatgridpbar',!mask) ;
    //setChatWinShow('chatsearch.class',!mask) ;
    //setChatWinShow('chatsearch.bdate',!mask) ;
    //setChatWinShow('chatsearch.edate',!mask) ;
    //setChatWinShow('chatsearch.btn',!mask) ;
    setChatWinShow('chatgridsave',mask) ;
    setChatWinShow('chatform',mask) ;
    //setchatWinShow('chatformdetail',mask & 16) ;
} 
*/
Ext.onReady(function(){
    var chatFrom = Ext.create('chat.window',{
        id:'idaa2idbb',
        title:'test win',
        renderTo:'treexx',
        floatable:true,
        draggable:true
}) ;
