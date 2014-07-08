Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.require(['Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.String.*','Ext.ZIndexManager']);

Ext.require(['Ext.data.*', 'Ext.tip.QuickTipManager', 'Ext.window.MessageBox']);

var POS_X = 500 ;
var POS_Y = 200 ;
var lastChatWin = null ;
/**
 * @desc : when one node of chatting list is clicked
 *         pop up the chatting window
 */
function treeItemClick(view, record, item, index, e) {
    nodeId = record.raw.id; //get node id, which is userid who is going to talk to
    nodeText = record.raw.text; //get node text, which is name who is going to talk to
    chatWinId = nodeId ; // the id of chating window is the target' id who is going to talk to
    chatWin = getChatForm(chatWinId,nodeText,DEF_PERSONAL_SIGN,DEF_PERSONAL_PIC); 
    console.log(chatWin) ;
    if(lastChatWin!=null && lastChatWin != chatWin){
        lastChatWin.hide() ;
    }
    chatWin.show() ;
    chatWin.setXY([POS_X,POS_Y]) ;
    lastChatWin = chatWin ;
    //recv msg of some body(whoes id is the same to the nodeId)
    var ret = recvMsgs(nodeId) ;
    if (ret){
        // recv done
    }else{
        // recv failed
    }
}
/**
 * @desc : send msg to the chating server,
 *          take advance of ajax of extjs
 * @param : uid : the id of user who the msg will send to 
 * @param : msg : The msg to send
 */
function sendMsg(uid,msg){
    var ret = true ;
    Ext.Ajax.request({                
        url: SERVER+'/Chat/send',
        headers: {
            'userHeader': 'userMsg'
        },
        params: { 
            'to': uid,
            'msg': msg
        },
        method: 'POST',
        success: function (response, options) {
            //doSendMsgCallback(response.response.Text); 
            Ext.MessageBox.alert('成功', '删除成功');
        },
        failure: function (response, options) {
            ret = false ;
            // if send msg failed ,send it again
            doSendMsgCallback(uid,msg,response.response.Text); 
            Ext.MessageBox.alert('失败', '请求超时或网络故障');
        }
    });
    return ret ;
}
/**
 * @desc : do somthing when send msg to server failed
 *          and then send msg again
 */
function doSendMsgCallback(uid,msg,jsonData){
    var data = Ext.util.JSON.decode(jsonData) ;
    sendMsg(uid,msg) ;
}
/**
 * @desc : check if has msgs for me
 *         if has call doHasMsgCallback
 */
function hasMsgs(){
    var ret = true ;
    Ext.Ajax.request({                
        url: SERVER+'/Chat/check',
        params: { 
        },
        method: 'get',
        success:function (response, options) {
            ret = true ;
            Ext.MessageBox.alert('成功', 'check done');
            doHasMsgsCallback(response.responseText) ;
        },
        failure: function (response, options) {
            ret = false ;
            Ext.MessageBox.alert('失败', 'check failed');
        }
    });
    return ret ;

} 
/**
 * @desc : when thereis msgs for me ,
 *         check if the chatting window is opened ,recv then and display it
 *               if the chatting window is not opend, set the node of chatting list sparking 
 */
function doHasMsgsCallback(jsonData){
    var msgInfos = Ext.util.JSON.decode(jsonData) ;
    console.log(msgInfos) ;
    //
    
}
function recvMsgs(uid){
    var ret = true ;
    Ext.Ajax.request({                
        url: SERVER+'/Chat/recv',
        headers: {
            'userHeader': 'userMsg'
        },
        params: { 
            'from': uid,
            //'msg':'hello world'
        },
        method: 'get',
        success:function (response, options) {
		    //attend_info_store.remove(selection);
            attend_info_store.load() ;
            //setAttendWinShow('attendform',false) ;
            ret = true ;
            //Ext.MessageBox.alert('成功', '成功');
            doRecvMsgCallback(response.responseText) ;
        },
        failure: function (response, options) {
            ret = false ;
            //Ext.MessageBox.alert('失败', '请求超时或网络故障');
        }
    });
    return ret ;
}
function doRecvMsgCallback(jsonData){
    var jsonObj = Ext.util.JSON.decode(jsonData);
    console.log(msgInfos) ;
}

function onSendClick(el,ev) {
    var form = this.getForm();
    var formPanel = form.owner ;
    var talkWin = formPanel.getComponent('talk_win') ;
    var sendWin = formPanel.getComponent('send_win') ;
    var msg = sendWin.getValue() ;
    //msg = msg+"     <br/>" ;
    /*
    var msg_send_tpl = '<div style="text-align:right;align:right;margin:5px 5px 5px 5px"><tr><td>{0}<img src="../pic/rss.gif"/><br/><font size=4>{1}</font></td><tr/></div>';
    var mmsg = Ext.String.format(msg_send_tpl,(new Date()).toLocaleString(),msg) ;
    talkWin.body.insertHtml('beforeEnd',mmsg);
    //talkWin.updateLayout() ;
    talkWin.body.scroll('b', 10000, {duration: 0.1});
    */
    var fmsg = formatMsg(msg,"我",false) ;
    setMsg2ChatWin(talkWin,fmsg) ;
    sendWin.setValue('') ;
    sendMsg(formPanel.id,msg) ;
}
function formatMsg(msg,who,isSend){
    var msg_send_tpl = '<div style="text-align:right;align:right;margin:5px 5px 5px 5px"><tr><td>\<{1}\> {0}<img src="{2}"/><br/><font size=4 margin-right="5px">{3}</font></td><tr/></div>';
    var msg_recv_tpl = '<div style="text-align:left; align:left; margin:5px 5px 5px 5px"><tr><td><img src="{2}"/>{0} \<{1}\>:<br/> <font size=4 margin-left="5px">{3}</font></td><tr/></div>';

    var tpl = '' ;
    if (isSend){
        tpl = msg_send_tpl ;
    }else{
        tpl = msg_recv_tpl ;
    }
    var ret = Ext.String.format(tpl,(new Date()).toLocaleString(),who,PIC+DEF_PERSONAL_PIC,msg) ;
    return ret ;
}
function setMsg2ChatWin(chatWin,msg){
    //chatWin = Ext.getCmp(winId) ;
    if (chatWin==null){
        return false ;
    }
    chatWin.body.insertHtml('beforeEnd',msg) ;
    //chatWin.updateLayout() ;
    chatWin.body.scroll('b', 10000, {duration: 0.1});
    return true ;
}

function onCloseClick(el,ev) {
    var form = this.getForm();
    var formPanel = form.owner ;
    form.reset() ;
    formPanel.setVisible(false) ;
}
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
                    handler:onCloseClick,
                    scope:this
                },'-',
                {
                    xtype:'button',
                    text: '发送',
                    itemId:'send_btn',
                    icon:this.iconPath+'send_msg.gif',
                    handler:onSendClick,
                    scope:this
                }]
            //}]
	    });
		this.callParent();
	}
});
/**
 * @param winId : id of the win
 * @param pSign : personal sign 
 * @param picture : picture of himself or herself
 * @param icon : icon of the chating window 
 */
function getChatForm(winId,winTitle,pSign,picture){
    var chatForm = Ext.getCmp(winId) ;
    if (chatForm == null){
        chatFrom = Ext.create('Chat.Form',{
            id:winId,
            personalSign:pSign,
            picUrl:PIC+picture,
            iconPath:ICON,
            title:winTitle,
            renderTo:'chatzz',
            floatable:true,
            draggable:true,
            closable:true,
            //minimizable:true,
            minButtonWidth:100,
            closeAction:'hide'
        //resizable:true
        }) ;
    }else{
        chatForm.show() ;
    }

    return chatForm ;
}
/*
Ext.onReady(function(){
    
    var cf = getChatForm('idx2idy','TestWin','Good Good Study, Day Day Up ...','../pic/user123.jpg','../pic/') ;
}) ;
*/
Ext.onReady(function(){
    var chatTree = Ext.create('Ext.tree.Panel', {
        id: 'tree-panel',
        title: '在线聊天',
        //el:'treexx',
        renderTo:'chatyy' ,
        //renderTo:Ext.getBody() ,
        //el:'treexx',
        width: 260,
        border:5,
        frame:true,
        bodyBorder:true,
        icon:'../pic/article.gif',
        floatable:true,
        draggable:true,
        resizable:true,
        overflowY:'auto',
        maxWidth: 400,
        maxHeight:700,
        minWidth: 200,
        minHeight:500,
        animCollapse: true,
        rootVisible: false,  //默认显示根节点
        useArrows: true,
        store: user_list_store,
        root: {expanded: true},
        collapsible: true,
        listeners: {
            'itemclick':treeItemClick 
        }
    });
    //recv msg from server on Timmer
    //window.setInterval(recvMsg,1500) ;
}) ;
            
