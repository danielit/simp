var SERVER="192.168.85.77:8888"
//用户登录窗口
function getLoginWindow(){
    var loginWindow = Ext.WindowMgr.get('loginWindow');
    if(!loginWindow){
        loginWindow = Ext.create('Ext.window.Window', {
            id:'loginWindow',
                    title:'登陆窗口',
                    height: 300,
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
                        //xtype:'panel',
                        html:['<img src=static/pic/main5.jpg width=350 height=100 />',''].join('')
                    },
                    {
                    region:'center',
                    xtype:'form',
                    id:'userLoginForm',
                   // url:'http://127.0.0.1:8888/login',
                    url:+'/login',
                    frame: true,
                    monitorValid:true,
                    bodyPadding: 20,// the space between element border and content
                    bodyPadding: '20 10 5',
                    fieldDefaults:{
                        labelAlign:'right',
                        labelWidth:70,
                        msgTarget: 'side' // Add an error icon to the right of the field, displaying the message in a popup on hover.
                    },
                    defaults:{
                        margins: '20 20 20 20'
                    },
                    loyout:{
                        type:'hbox',
                        align:'stretch',
                        pack:'center'
                    },
                    items:[{
                        xtype:'textfield',
                        name:'user',
                        fieldLabel:'用户名',
                        //margins: '20 20 20 20',
                        width:300,
                        emptyText:'请输入用户名',
                        allowBlank:false,
                        blankText:'用户名不能为空'
                    },{
                        xtype:'textfield',
                        fieldLabel:'密&nbsp;&nbsp;&nbsp;码',
                        name:'pwd',
                        //margins: '20 20 20 20',
                        width:300,
                        inputType:'password',
                        emptyText:'请输入密码',
                        allowBlank:false,
                        blankText:'密码不能为空'
                    },{

                        xtype:'checkboxfield',
                        boxLabel:'记住登录状态',
                        inputValue:1,
                        checked:true,
                        name:'remb',
                        //margins: '20 20 20 60',
                        padding:'0 0 0 40',
                        width:300,
                        inputValue:1,
                        checked:true
                    }
                    ],
                      listeners:{
                    /*    actioncomplete:function(formPanel,action){
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
                   */ } 
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
// get cookie
/*
function getCookie(cookieName) {
        var start = document.cookie.indexOf(cookieName+"=");
        if (start ==-1) {
            return "";
        }
        start = start+cookieName.length+1;
        var end = document.cookie.indexOf(";",start);
        if (end=-1) {
            end = document.cookie.length;
        }
        return document.cookie.substring(start,end);
}*/
function getCookie(name){
    var result = null;
    var myCookie = ""+document.cookie+";"; 
    var searchName = name+"=";
    var startOfCookie = myCookie.indexOf(searchName);
    var endOfCookie;
    if(startOfCookie != -1){
        startOfCookie += searchName.length;
        endOfCookie = myCookie.indexOf(";",startOfCookie);
        result = (myCookie.substring(startOfCookie,endOfCookie));
    }
    return result;
}

//保存方法
function login(){
    var userLoginForm = Ext.getCmp('userLoginForm').getForm();
    if(userLoginForm.isValid()){
        userLoginForm.submit({
            url:'/login',
            method:'post',
            waitTitle:'登陆',
            waitMsg:'正在登陆，请稍后...',
            timeout:1,
            failure:function(){
                //alert("failed") ;
                Ext.Msg.show({
                    title:'登录失败',
                    msg:'用户名或密码错误，</br>请重新登录!',
                    buttons:Ext.Msg.OK,
                    closable:false,
                    fn:function(btn){},
                    icon:Ext.MessageBox.ERROR
                });

            },
            success:function(){
                var uid = getCookie("uid") ;
                //alert(stuid) ;
                var role = getCookie("type") ;
                //alert(role) ;
                var url = "" ;
                if(role=="80000"){
                    url = "/student?uid="+uid ;
                }else {
                    url = "/manage?uid="+uid ;
                }
                //Ext.getCmp("userLoginForm").hide() ;
                window.location.href = url ;
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
