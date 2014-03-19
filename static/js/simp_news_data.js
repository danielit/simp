var news_list_store = Ext.create('Ext.data.TreeStore', {
        id:'news_list_store',
        proxy: {
                    type: 'ajax',
                    url: SERVER+'/getnewslist',
                    reader: {
                            type: 'json'
                    }
        },
        root: {expanded: true},
        autoLoad: false
});
