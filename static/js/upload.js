Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model' ]);
//Ext.define('Attend.Upload', {
//	extend: 'Ext.form.Panel',
//	alias: 'widget.attendupload',
Ext.onReady(function(){
Ext.create('Ext.form.Panel', {
        title: '文件上传',
        width: 400,
        bodyPadding: 10,
        id:'formupload',
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
            text:'continue add',
            handler:function(){
                var form = Ext.getCmp('formupload') ;
                form.add({
            xtype: 'filefield',
            name: 'file',
            fieldLabel: '文件',
            labelWidth: 50,
            msgTarget: 'side',
            //allowBlank: false,
            anchor: '100%',
            buttonText: '选着要上传.' 
                }) ;

            }
        },{
            text: 'Upload',
            handler: function() {
                var form = this.up('form').getForm();
                if(form.isValid()){
                    form.submit({
                        url: 'upload',
                        waitMsg: 'Uploading your photo...',
                        success: function(fp, o) {
                        Ext.Msg.alert('Success', 'Your photo "' + o.result.file + '" has been uploaded.');
                        }
                    });
                }
            }
        }]
});
}) ;
