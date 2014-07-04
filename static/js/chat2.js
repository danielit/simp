Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model' ]);

Ext.require(['Ext.data.*', 'Ext.tip.QuickTipManager', 'Ext.window.MessageBox']);
//define the container for users 
Ext.define('Chat.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.chatform',
	requires: ['Ext.data.*', 'Ext.form.*'],
	xtype: 'form-chat',
	frame: true,
	bodyPadding: 5,
    minWidth: 300,
    mixHeight: 300,
    //autoScroll:true,
    config:{
        iconPath:'./pic/',
        picUrl:'../pic/rss.gif',
        personalSign:'Good Good Study , Day Day Up ...'
    },

	initComponent: function() {
		Ext.apply(this, {
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'qtip'
			},
            icon:this.iconPath+'chat.jpg',
            width:590,
            height:550,
            collapsible:true,
			align: 'center',
			items: [{
                xtype : 'form',
                autoScroll:true,
                itemId:'talk_win',
                grow : false,
                name : 'message',
                hideLabel: true,
                height:275 ,
                anchor : '100%'
            },
            {
                xtype: 'htmleditor',
                height:130,
                itemId:'send_win',
                hideLabel: true,
                anchor : '100%'
            }],
            tbar:[{
                xtype: 'box', //或者xtype: 'component',
                width: 50,
                height: 50,  
                margins:'2 5 2 5',
                autoEl: {
                    tag: 'img',    //指定为img标签    
                    src: this.picUrl//'../pic/rss.gif'    //指定url路径    
                }
            },'-',{
                xtype:'displayfield',
                hideLabel: true,
                value:this.personalSign//'有志者事竟成<br/>Just Fightning !'

            }],
            bbar:['->',{
                    xtype:'button',
                    text: '关闭',
                    icon:this.iconPath+'close_chat_win.gif',
                    handler:this.onCloseClick,
                    scope:this
                },'-',
                {
                    xtype:'button',
                    text: '发送',
                    icon:this.iconPath+'send_msg.gif',
                    handler:this.onSendClick,
                    scope:this
                }]
            //}]
	    });
		this.callParent();
	},
	onCloseClick: function() {
        var form = this.getForm();
        var formPanel = form.owner ;
        form.reset() ;
        console.log(form.owner) ;
        console.log(formPanel.id) ;
        formPanel.setVisible(false) ;
	}, 
	onSendClick: function() {
		var form = this.getForm();
        var formPanel = form.owner ;
        var talkWin = formPanel.getComponent('talk_win') ;
        var sendWin = formPanel.getComponent('send_win') ;
        var msg = sendWin.getValue() ;
        //alert(msg) ;
        msg = msg+"     <br/>" ;
        var msg_send_tpl = '<div style="text-align:right;align:right;margin:5px 5px 5px 5px"><tr><td>{0}<img src="../pic/rss.gif"/><br/><font size=4>{1}</font></td><tr/></div>';
        var mmsg = Ext.String.format(msg_send_tpl,'2014-2-3',msg) ;
        talkWin.body.insertHtml('beforeEnd',mmsg);
        talkWin.updateLayout() ;
        talkWin.body.scroll('b', 10000, {duration: 0.1});
        sendWin.setValue('') ;
	}
});
/**
 * @param winId : id of the win
 * @param pSign : personal sign 
 * @param picture : picture of himself or herself
 * @param iPaht : icon path 
 */
function getChatForm(winId,pSign,picture,iPath){
    var chatForm = Ext.getCmp(winId) ;
    if (chatForm == null){
        chatFrom = Ext.create('Chat.Form',{
            id:winId,
            personalSign:pSign,
            picUrl:picture,
            iconPath:iPath,
            title:'test win',
            renderTo:'treexx',
            floatable:true,
            draggable:true,
            closable:true,
            //minimizable:true,
            minButtonWidth:100,
            closeAction:'hide'
        //resizable:true
        }) ;
    }
    return chatForm ;


}
Ext.onReady(function(){
    
    /*var chatFrom = Ext.create('Chat.Form',{
        id:'idaa2idbb',
        title:'test win',
        renderTo:'treexx',
        floatable:true,
        draggable:true,
        closable:true,
        minimizable:true,
        minButtonWidth:100,
        closeAction:'hide'
        //resizable:true
    }) ;
    */
    var cf = getChatForm('idx2idy','Good Good Study, Day Day Up ...','../pic/user123.jpg','../pic/') ;
    /*
    new Ext.KeyMap(Ext.getCmp("idx2idy").getComponent('send_win').getEl(), [{
                key: 13,
                ctrl: true,
                stopEvent: true,
                fn: sendmsg
            }]);
    */
}) ;
