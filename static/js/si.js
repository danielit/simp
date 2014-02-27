/*
  * * student information 
 * 
 * */

/*
 * student state 
 * such as: in school , vacation, long vacation,left
 * */
Ext.define('si.model.studentstate', {
        extend: 'Ext.data.Model',

    requires: [
            'Ext.data.Field'
        ],

    fields: [
            {
                name: 'name'
            },
            {
                name: 'value'
            }
    ]
});

/*
 * student base information 
 * */
Ext.define('si.model.stubaseinfo', {
        extend: 'Ext.data.Model',

    requires: [
            'Ext.data.Field'
        ],

    fields: [
            {
                name: 'name'
            },
            {
                name: 'state'
            },
            {
                name: 'identify'
            },
            {
                name: 'birthday'
            },
            {
                name: 'gender'
            },
            {
                name: 'politic'
            },
            {
                name: 'depart'
            },
            {
                name: 'specialty'
            },
            {
                name: 'grade'
            },
            {
                name: 'class'
            },
            {
                name: 'type'
            },
            {
                name: 'teacher'
            }
    ]
});


/*
 * student base informatin store 
 * */
Ext.define('si.store.stubaseinfo', {
    extend: 'Ext.data.Store',

    requires: [
        //'stubaseinfo.model.stubaseinfomodel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'si.model.stubaseinfo',
            storeId: 'stubaseinfo',
            proxy: {
                type: 'ajax',
                api: {
                    read: SERVER+'/getstubaseinfo',
                    write: SERVER+'/setstubaseinfo',
                    update: SERVER+'/setstubaseinfo'
                },
                url: 'SERVER/getstubaseinfo',
                reader: {
                    type: 'json',
                    root: 'data'
                },
                writer: {
                    type: 'json',
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});

/*
 * student state store 
 * */
Ext.define('si.store.stustate', {
    extend: 'Ext.data.Store',

    requires: [
    //    'stubaseinfo.model.stustatemodel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'si.model.stustate',
            storeId: 'stustate',
            proxy: {
                type: 'ajax',
                url: 'SERVER/getstustatelist',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});



Ext.define('si.form.stubaseinfo', {
    extend: 'Ext.form.Panel',

    requires: [
        'Ext.container.Container',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Display',
        'Ext.button.Button'
    ],

    height: 342,
    id: 'stubaseiinfoform',
    margin: '0 0 10 0',
    width: 652,
    bodyPadding: 10,
    title: '学生基本信息',
    defaults:{
                margins:'0 0 10 0',
                margin:'0 0 10 0'
    },

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            
            items: [
                {
                    xtype: 'container',
                    //margin: '0,0,10,0',
                    defaults:{
                        margin:'0 0 10 0',
                        margins:'0 0 10 0'
                    },
                    items: [
                        {
                            xtype: 'container',
                            //margin: '0,0,10,0',
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    formBind: false,
                                    autoShow: true,
                                    fieldLabel: '姓名',
                                    labelAlign: 'right',
                                    name: 'name',
                                    readOnly: true,
                                    allowBlank: false,
                                    validateBlank: true,
                                    vtype: 'alpha'
                                },
                                {
                                    xtype: 'combobox',
                                    fieldLabel: '在校状态',
                                    labelAlign: 'right'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            //margin: '0,0,10,0',
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    validator: function(value) {

                                    },
                                    formBind: false,
                                    autoShow: true,
                                    fieldLabel: '身份证号',
                                    labelAlign: 'right',
                                    name: 'idnum',
                                    readOnly: true,
                                    allowBlank: false,
                                    validateBlank: true,
                                    vtype: 'alpha'
                                },
                                {
                                    xtype: 'datefield',
                                    fieldLabel: '出生日期',
                                    labelAlign: 'right',
                                    format: 'Y-m-d'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'container',
                    //margin: '0,0,10,0',
                    layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            id: 'stubaseinfotips',
                            fieldLabel: '',
                            //labelAlign: 'right',
                            name: 'stubaseiinfotips',
                            value: '姓名、性别、出生年月、省份证号等是教育部学籍学历注册的关键信息，请保证准确无误。\r\n出生日期应与身份证号中所体体现的一致。'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    //margin: '0,0,10,0',
                    //
                    defaults:{
                        margin:'0 0 10 0',
                        margins:'0 0 10 0'
                    },

                    items: [
                        {
                            xtype: 'container',
                            //margin: '0,0,10,0',
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    formBind: false,
                                    autoShow: true,
                                    itemId: 'gender',
                                    fieldLabel: '性别',
                                    labelAlign: 'right',
                                    name: 'gender',
                                    value: '{男,女}',
                                    allowBlank: false,
                                    validateBlank: true,
                                    vtype: 'alpha'
                                },
                                {
                                    xtype: 'textfield',
                                    formBind: false,
                                    autoShow: true,
                                    fieldLabel: '政治面貌',
                                    labelAlign: 'right',
                                    name: 'politic',
                                    allowBlank: false,
                                    validateBlank: true,
                                    vtype: 'alpha'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            //margin: '0,0,10,0',
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    formBind: false,
                                    autoShow: true,
                                    itemId: 'gender',
                                    fieldLabel: '系部',
                                    labelAlign: 'right',
                                    name: 'depart',
                                    allowBlank: false,
                                    validateBlank: true,
                                    vtype: 'alpha'
                                },
                                {
                                    xtype: 'textfield',
                                    formBind: false,
                                    autoShow: true,
                                    fieldLabel: '专业',
                                    labelAlign: 'right',
                                    name: 'spec',
                                    allowBlank: false,
                                    allowOnlyWhitespace: false,
                                    validateBlank: true,
                                    vtype: 'alpha'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            //margin: '0,0,10,0',
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    formBind: false,
                                    autoShow: true,
                                    itemId: 'gender',
                                    fieldLabel: '年级',
                                    labelAlign: 'right',
                                    name: 'grade',
                                    allowBlank: false,
                                    validateBlank: true,
                                    vtype: 'alpha'
                                },
                                {
                                    xtype: 'textfield',
                                    formBind: false,
                                    autoShow: true,
                                    fieldLabel: '班级',
                                    labelAlign: 'right',
                                    name: 'class',
                                    allowBlank: false,
                                    validateBlank: true,
                                    vtype: 'alpha'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            //margin: '0,0,10,0',
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    formBind: false,
                                    autoShow: true,
                                    itemId: 'gender',
                                    fieldLabel: '班主任',
                                    labelAlign: 'right',
                                    name: 'mteacher',
                                    allowBlank: false,
                                    validateBlank: true,
                                    vtype: 'alpha'
                                },
                                {
                                    xtype: 'textfield',
                                    formBind: false,
                                    autoShow: true,
                                    fieldLabel: '类别',
                                    labelAlign: 'right',
                                    name: 'type',
                                    allowBlank: false,
                                    validateBlank: true,
                                    vtype: 'alpha'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            //margin: '0,0,10,0',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'center'
                            },
                            defaults:{
                                margin:'0 10 0 0',
                                margins:'0 10 0 0'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    handler: function(button, e) {
                                        alert("cancel") ;
                                    },
                                    //margins: '0,20,0,0',
                                    id: '',
                                    itemId: 'cancel',
                                    text: '取消'
                                },
                                {
                                    xtype: 'button',
                                    handler: function(button, e) {
                                        alert("save") ;
                                    },
                                    //margins: '0,20,0,0',
                                    id: 'save',
                                    text: '保存'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});

function getStuBaseInfoForm(){
    var siForm = Ext.getCmp("si.baseinfo") ;
    if (siForm==null){
        siForm = Ext.create('si.form.stubaseinfo',{
                id:'si.baseinfo',
                title:'学生基本信息',
                itemId:'si.baseinfo',
                icon:'static/pic/css/tabs.gif',
                closeable:true,
                closeAction:'hide'
        }) ;
    }
    return siForm ;
}
