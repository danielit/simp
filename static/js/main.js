Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model',
]);
//this tab panel is for the center 
var mgrTabpanel = Ext.create('Ext.tab.Panel', {
	id: 'mgrTabpanel',
	renderTo: Ext.getBody(),
	enableTabScroll: true,
	defaults: {
		autoScroll: true,
		closable: true,
		bodyPadding: 10
	},
	items: [{
		id: 'tab_notices',
		closable: false,
		title: '通知/公告',
		icon: 'static/pic/css/tabs.gif',
		html: 'A simple tab'
	}]
});


/*
 * add tab to a tabpanel
 */
function add2tabpanel(tabs, obj) {
	// if already added to panel,do nothing
    var ret = 0 ;
	if (tabs == obj.ownerCt) {
		// do something
        ret = 1 ;
    } else {
        //obj.ownerCt = tabs ;
		tabs.add(obj);
	}
	// set the tab to be activity
	tabs.setActiveTab(obj);
    return ret ;
}

function treeItemClick(view, record, item, index, e) {
    
    var cmpId = record.raw.id ;

    if(cmpId=="q.weeksummary"){         
        var quanWin = getQuanWin() ;
        var ret = add2tabpanel(mgrTabpanel,quanWin) ;
        if (ret==0){
            quan_week_store.load() ;
            quan_detail_store.load() ;
        }
         
        //show quangridweek and quanformdetail
        setQuanWinsShow(2) ; 
    } else if (cmpId=="q.detail"){
        var quanWin = getQuanWin() ;
        var ret = add2tabpanel(mgrTabpanel,quanWin) ;
        if (ret == 0){
            quan_week_store.load() ;
            quan_detail_store.load() ;
        }
        //show quangriddetail
        setQuanWinsShow(4) ; 
    } else if (cmpId=="q.fillin"){
        var quanWin = getQuanWin() ;
        add2tabpanel(mgrTabpanel,quanWin) ;
        //show quangridweek and quanformdetail
        setQuanWinsShow(9) ; 

    } else if (cmpId=="sit.stuinfo"){
        //alert(cmpId) ;
        var sitInfoGrid = getSitInfoGrid();
        var ret = add2tabpanel(mgrTabpanel,sitInfoGrid) ;
        if (ret==0){
            all_stu_info_store.load() ;
        }
    } else if (cmpId=="sa.input"){
        var attendWin = getAttendWin() ;
        attend_info_store.loadData([]) ;
        add2tabpanel(mgrTabpanel,attendWin) ;
        attendWin.show() ; 

        setAttendWinsShow(true) ;

    } else if (cmpId=="sa.lookup"){
        var attendWin = getAttendWin() ;
        attend_info_store.loadData([]) ;
        attend_info_store.load() ;
        add2tabpanel(mgrTabpanel,attendWin) ;
        attendWin.show() ; 
        
        setAttendWinsShow(false) ;
} else if (cmpId=="ss.loan"){ } else if (cmpId=="ss.loan"){
        // student information
    } else if (cmpId=="si.baseinfo"){
        var siForm = getStuBaseInfoForm() ;
        add2tabpanel(mgrTabpanel,siForm) ;

    } else if (cmpId=="ss.loan"){
    } else if (cmpId=="ss.loan"){
    } else if (cmpId=="ss.loan"){
    } else if (cmpId=="ss.loan"){
    } else if (cmpId=="ss.loan"){
    } else {
    }
}

var mgrTree = Ext.create('Ext.tree.Panel', {
	title: '学生工作',
	deferRowRender: true,
	useArrows: true,
	listeners: {
		itemclick: {
			fn: treeItemClick
		},
	},
	root: {
		id: 'stuMangeRoot',
		text: '学生管理',
		expanded: true,
		children: [{
			id: 'quan',
			text: '日常量化',
            children:[{
                id:'q.weeksummary',
                text:'周量化汇总表',
                leaf:true
            },
            {
                id:'q.detail',
                text:'量化详单',
                leaf:true
            },
            {
                id:'q.fillin',
                text:'量化信息登记',
                leaf:true
            }]
		},/*
		{
			id: 'scholarship',
			text: '奖助学金',
            children:[{
                id:'ss.reward',
                text:'奖学金',
                leaf:true
            },{
                id:'ss.help',
                text:'助学金',
                leaf:true
            },{
                id:'ss.loan',
                text:'助学贷款',
                leaf:true
            }]
		},*/
        {
			id: 'studentattend',
			text: '学生考勤',
            children:[{
                id:'sa.lookup',
                text:'考勤查询',
                leaf:true
            },{
                id:'sa.input',
                text:'考勤录入',
                leaf:true
            }]
		},
	    {
			id: 'sit.info',
			text: '学生信息',
			children: [{
				id: 'sit.stuinfo',
				text: '学生信息',
				leaf: true
			},
            {
				id: 'sit.input',
				text: '信息录入',
				leaf: true
			}/*,
			{
				id: 'sit.score',
				text: '学生成绩',
				leaf: true
			}*/]
		},
		{
			text: '在校情况',
			id: 'studentinschool',
			children: [{
				id: 's.in',
				text: '在校学生统计',
				leaf: true
			}/*,
			{
				id: 's.out',
				text: '离校学生',
				leaf: true
			}*/]

		}]
	}
});

var mgrStuInfoTree = Ext.create('Ext.tree.Panel', {
	title: '学生信息',
	deferRowRender: true,
	useArrows: true,
	listeners: {
		itemclick: {
			fn: treeItemClick
		},
	},
	root: {
		id: 'stuInfoRoot',
		text: '学生信息',
		expanded: true,
		children: [{
			id: 'si.baseinfo',
			text: '基本信息',
            leaf:true		
        },
		{
			id: 'si.resume',
			text: '个人简历',
            leaf:true
        },
	    {
			id: 'si.activity',
			text: '参加活动及获奖情况',
            leaf:true
			
		},
		{
			id: 'si.family',
			text: '家庭主要成员',
		    leaf :true	
		}]
	}
});

var mgrSysTree= Ext.create('Ext.tree.Panel', {
	title: '系统管理',
	deferRowRender: true,
	useArrows: true,
    //rootVisible:false,
	listeners: {
		itemclick: {
			fn: treeItemClick
		},
	},
	root: {
		id: 'sysMangeRoot',
		text: '系统管理',
		expanded: true,
		children: [{
			id: 'sm.adduser',
			text: '添加用户',
            leaf:true		
        },
        {
			id: 'sm.deluser',
			text: '删除用户',
            leaf:true		
        },
		{
			id: 'sm.addnotice',
			text: '添加通知/公告',
            leaf:true
        },
	    {
			id: 'sm.delnotice',
			text: '删除通知/公告',
            leaf:true
		}]
	}
});

var mgrQuitTree= Ext.create('Ext.tree.Panel', {
	title: '退出系统',
	deferRowRender: true,
	useArrows: true,
    rootVisible:false,
	listeners: {
		itemclick: {
			fn: treeItemClick
		},
	},
	root: {
		id: 'sysQuitRoot',
		//text: '系统管理',
		expanded: true,
		children: [{
			id: 'sq.quit',
			text: '退出',
            leaf:true		
        }]
	}
});



Ext.onReady(function() {
    Ext.Loader.injectScriptElement("static/extjs/locale/ext-lang-zh_CN.js") ;
	
	Ext.create('Ext.container.Viewport', {
		layout: {
			type: 'border',
			padding: '5'
		},
		items: [{
			region: 'north',
			height: 130,
			bodyPadding: 0,
			split: false,
			html: ['<img src=static/pic/main6.jpg width=1600 height=150 />', ''].join(''),
		},
		{
			title: '工具栏',
			id: 'toolbar',
			region: 'west',
			layout: 'accordion',
			stateId: 'statePanelExample',
			statefule: true,
			split: true,
			width: 220,
			collapsible: true,

			items: [
			mgrTree,
            //mgrStuInfoTree,
            mgrSysTree,
			/*{
				title: '在线帮助',
				html: 'Online Help'
			},*/
            mgrQuitTree
            ]
		},
		{
			region: 'center',
			layout: 'fit',
			items: [mgrTabpanel]
		}]
	});
    
});
