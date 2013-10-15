Ext.require([
        'Ext.form.*',
        'Ext.window.Window'
        ]);

Ext.onReady(function() {

    var fieldUser = new Ext.form.field.Text({
        renderTo: Ext.getBody(),
        fieldLable:"User",
        labelAlign:"left",
        weight:60


    }); //field.destroy();

