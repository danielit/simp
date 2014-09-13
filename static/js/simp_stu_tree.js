var stu_tree_list_store = Ext.create('Ext.data.TreeStore', {
        id:'stu_tree_list_store',
        proxy: {
                    type: 'ajax',
                    url: SERVER+'/getStuTreeList',
                    reader: {
                            type: 'json'
                    }
        }
        //root: {expanded: true}
        //autoLoad : true 
});
