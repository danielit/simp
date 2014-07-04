Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model' ]);

Ext.require(['Ext.data.*', 'Ext.tip.QuickTipManager', 'Ext.window.MessageBox']);
//define the container for users 
Ext.define('users.window', {
	extend: 'Ext.container.Container',
	alias: 'widget.userswin',
	
    initComponent: function() {
		Ext.apply(this, {
			padding: '0 0 0 0',
            layout:'border',
            closable:false, 
			items: [
                ]
		});
		this.callParent();
	}
});

function getUsersWin(item){
    var usersWin = Ext.getCmp('userswin') ;
    if (usersWin==null){
        usersWin = Ext.create('users.window',{
            title:'xxx',
            id:'userswin',
            itemId:'userswin',
            items:[item],
            //xtype:'userscontainer',
		    icon: 'static/pic/css/tabs.gif'
        }) ; 
    } 
    //usersform = Ext.getCmp('usersform') ;
    //usersform.html = "<h1>helloworld</h1> <h5>helloworld</h5> </br>hello world </br>" ;
    return usersWin ;
}

Ext.onReady(function(){
    var chatTree = Ext.create('Ext.tree.Panel', {
        id: 'tree-panel',
        title: '在线聊天',
        //el:'treexx',
        renderTo:'treexx' ,
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
            'itemclick': function(view, record, item, index, e) {
                nodeId = record.raw.id; //获取点击的节点id
                nodeText = record.raw.text; //获取点击的节点text
                //setusers2Form(nodeId,nodeText,'usersform') ;
                Ext.Msg.alert('info', nodeId + nodeText);
            }
        }
    });
    //var w = Ext.getBody().getWidth() ;
    //var h = Ext.getBody().getHeight() ;
    //alert(w) ;
    //alert(h) ;
    //chatTree.setXY([h*0.7,110]) ;
    //chatTree.alignTo(Ext.getBody(),'tr') ;
}) ;
