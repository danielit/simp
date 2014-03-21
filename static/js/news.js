Ext.Loader.setPath('Ext.ux', './static/extjs/examples/ux');

Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.container.Container', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model', ]);

Ext.define('news.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.newsform',
	requires: ['Ext.data.*', 'Ext.form.*'],
	//xtype: 'form-news',
	frame: true,
	bodyPadding: 5,
    //maxHeight:200,
    autoScroll:true,

	initComponent: function() {
		Ext.apply(this, {
		    iconCls: 'icon-form',
            collapsible:'ture',
			//align: 'center',
            //tpl:new Ext.XTemplate(),   
			items: [],
		});
		this.callParent();
	}
});

var newsListTree = Ext.create('Ext.tree.Panel', {
    //layout:'fit',
    stateId: 'navigation-panel',
    id: 'tree-panel',
    title: '通知/公告列表',
    region: 'west',
    split: true,
    width: 300,
    icon:'static/pic/article.gif',
    maxWidth: 400,
    animCollapse: true,
    rootVisible: false,  //默认不显示根节点
    useArrows: true,
    store: news_list_store,
    root: {expanded: true},
    tools: [{
        type: 'refresh',
        tooltip: '刷新',
        handler: function() {//Ext.data.Store load
            news_list_store.load({
                scope: this,
                callback: function(records, operation, success) {
                    //Ext.Msg.alert('refresh success!');
                    newsListTree.getRootNode().eachChild(function(child) { child.expand(); });
                }
            });
        }
    }
    ], collapsible: true,
    listeners: {
        'load' : function(){
            newsListTree.expandAll();
        }, 

        'itemclick': function(view, record, item, index, e) {
            nodeId = record.raw.id; //获取点击的节点id
            nodeText = record.raw.text; //获取点击的节点text
            setNews2Form(nodeId,nodeText,'newsform') ;
            //Ext.Msg.alert('info', nodeId + nodeText);
        }
    }
});

Ext.require(['Ext.data.*', 'Ext.tip.QuickTipManager', 'Ext.window.MessageBox']);
//define the container for news 
Ext.define('news.window', {
	extend: 'Ext.container.Container',
	alias: 'widget.newswin',
	
    initComponent: function() {
		Ext.apply(this, {
			padding: '0 0 0 0',
            layout:'border',
            closable:false, 
			items: [
                newsListTree,
                {
                    xtype:'newsform',
                    region:'center',
                    id:'newsform'
                }
            ]
		});
		this.callParent();
	}
});

function getnewsWin(){
    var newsWin = Ext.getCmp('newswin') ;
    if (newsWin==null){
        newsWin = Ext.create('news.window',{
            title:'通知/公告',
            id:'newswin',
            itemId:'newswin',
            //xtype:'newscontainer',
		    icon: 'static/pic/css/tabs.gif'
        }) ; 
    } 
    //newsform = Ext.getCmp('newsform') ;
    //newsform.html = "<h1>helloworld</h1> <h5>helloworld</h5> </br>hello world </br>" ;
    return newsWin ;
}
function setNews2Form(newsid,newstitle,formid){
            Ext.Ajax.request({
                url: SERVER+'/getnewscontent',
                headers: {
                    'userHeader': 'userMsg'
                },
                params: { 'id': newsid},
                method: 'GET',
                success: function (response, options) {
                    newsform = Ext.getCmp(formid) ;
                    if (newsform){
                        //newsform.html = response.responseText ; 
                        newsform.update(response.responseText) ; 
                        newsform.setTitle(newstitle) ; 
                    }
                    //Ext.MessageBox.alert('成功', '从服务端获取结果: ' + response.responseText);
                },
                failure: function (response, options) {
                    Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                }
            });
}
