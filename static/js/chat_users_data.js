var user_list_store = Ext.create('Ext.data.TreeStore', {
        id:'user_list_store',
        proxy: {
                    type: 'ajax',
                    //url: SERVER+'/Chat/getUsersList',
                    url: SERVER+'/getnewslist',
                    reader: {
                            type: 'json'
                    }
        },
        root: {expanded: true},
        autoLoad : true 
});
