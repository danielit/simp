//用户登录窗口
function getLoginWindow(){
    var loginWindow = Ext.WindowMgr.get('loginWindow');
    if(!loginWindow){
        loginWindow = Ext.create('Ext.window.Window', {
            id:'loginWindow',
                    title:'登陆窗口',
                    height: 260,
                    width: 350,
                    plain:true,
                    resizable:false,//not be able to resize the window
                    closable:false,// can't be closed
                    draggable:false,// can't be dragged
                    buttonAlign:'center',
                    modal: true,// can't touch other ui when it displayed
                    plain:true,
                 //   layout:'fit',
                    layout:'border',
                    items:[
                    {
                        region:'north',
                        xtype:'datefield'
                    },
                    {
                    region:'center',
                    xtype:'form',
                    id:'userLoginForm',
                   // url:'http://127.0.0.1:8888/login',
                    url:'http://192.168.84.251:8888/login',
                    frame: true,
                    monitorValid:true,
                    bodyPadding: 20,// the space between element border and content
                    bodyPadding: '20 10 5',
                    fieldDefaults:{
                        labelAlign:'right',
                        labelWidth:70,
                        msgTarget: 'side' // Add an error icon to the right of the field, displaying the message in a popup on hover.
                    },
                    items:[{
                        xtype:'textfield',
                        name:'userLoginForm.userName',
                        fieldLabel:'用户名',
                        margins: '20 20 20 20',
                        width:300,
                        emptyText:'请输入用户名',
                        allowBlank:false,
                        blankText:'用户名不能为空'
                    },{
                        xtype:'textfield',
                        fieldLabel:'密&nbsp;&nbsp;&nbsp;码',
                        name:'userLoginForm.userPwd',
                        margins: '20 20 20 20',
                        width:300,
                        inputType:'password',
                        emptyText:'请输入密码',
                        allowBlank:false,
                        blankText:'密码不能为空'
                    }],
                    listeners:{
                        actioncomplete:function(formPanel,action){
                            location.href=basePath+'/success/loginSuccess.action';
                        },
                        actionfailed:function(formPanel,action){
                            if(action.result){
                                Ext.Msg.show({
                                    title:'登陆',
                                    msg:action.result.msg,
                                    buttons:Ext.Msg.OK,
                                    closable:false,
                                    fn:function(btn){},
                                    icon:Ext.MessageBox.QUESTION
                                });
                            }else {
                                alert(action.response.responseText);
                            }
                        }
                    }
                    }],
                    buttons:[{
                        text:'登录',
                        id:'loginBtn',
                        width:80,
                        height:30,
                        listeners:{
                            click:function(){
                                login();
                            }
                        }
                    },{
                        text:'重置',
                        width:80,
                        height:30,
                        formBind: true,
                        listeners:{
                            click:function(btn,even,opt){
                                Ext.getCmp('userLoginForm').form.reset();
                            }
                        }
                    }],
                        listeners : {
                            render: function(input) {
                                new Ext.KeyMap(input.getEl(), [{
                                    key : Ext.EventObject.ENTER,
                                fn : function(){
                                    login();
                                }
                                }]);
                            }
                        }
        });
    }
    return loginWindow;
}
//保存方法
function login(){
    var userLoginForm = Ext.getCmp('userLoginForm').getForm();
    if(userLoginForm.isValid()){
        userLoginForm.submit({
            //url:'http://127.0.0.1:8888/login',
            method:'post',
            waitTitle:'登陆',
            waitMsg:'正在登陆，请稍后...',
            timeout:1,
            failure:function(){
                alert() ;
            }
        });
    }
}

Ext.application({
   name:"Login", 
   launch:function(){
       win = getLoginWindow() ;
       win.show() ;
   }
})
