Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model']);

//this tab panel is for the center 
var mgrTabpanel = Ext.create('Ext.tab.Panel', {
	id: 'mgrTabpanel',
	renderTo: Ext.getBody(),
	enableTabScroll: true,
	defaults: {
		autoScroll: true,
		closable: true,
		bodyPadding: 10
	}
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
        /*if (ret==0){
            quan_week_store.load() ;
        }*/
        quan_week_store.load() ;
        quan_detail_store.load() ;
         
        //show quangridweek and quanformdetail
        setQuanWinsShow(2) ; 
    } else if (cmpId=="q.detail"){
        var quanWin = getQuanWin() ;
        var ret = add2tabpanel(mgrTabpanel,quanWin) ;
        /*if (ret == 0){
            quan_week_store.load() ;
            //quan_detail_store.load() ;
        }*/
        quan_info_store.load() ;
        //show quangriddetail
        setQuanWinsShow(1) ; 
    } else if (cmpId=="q.fillin"){
        var quanWin = getQuanWin() ;
        add2tabpanel(mgrTabpanel,quanWin) ;
        //show quangridweek and quanformdetail
        setQuanWinsShow(9) ; 

    } else if (cmpId=="sit.stuinfo"){
        var sitWin = getsitWin() ;
        stu_info_store.loadData([]) ;
        stu_info_store.load() ;
        add2tabpanel(mgrTabpanel,sitWin) ;
        sitWin.show() ; 
        
        setsitWinsShow(false) ;

    } else if (cmpId=="sit.input"){
        var sitWin = getsitWin() ;
        stu_info_store.loadData([]) ;
        add2tabpanel(mgrTabpanel,sitWin) ;
        sitWin.show() ; 

        setsitWinsShow(true) ;

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

    } else if (cmpId=="ss.statics"){
        //在校人数统计
        var ssWin = getSSWin() ;
        //ss_statics_store.load() ;
        add2tabpanel(mgrTabpanel,ssWin) ;
        ssWin.show() ;

    } else if (cmpId=="sm.lookupnotice"){
        var noticeWin = getNoticeWin() ;
        sm_notice_store.loadData([]) ;
        sm_notice_store.load() ;
        add2tabpanel(mgrTabpanel,noticeWin) ;
        noticeWin.show() ; 
        setAddNoticeWinsShow(false) ;
    
    } else if (cmpId=="sm.addnotice"){
        var noticeWin = getNoticeWin() ;
        sm_notice_store.loadData([]) ;
        add2tabpanel(mgrTabpanel,noticeWin) ;
        noticeWin.show() ; 
        setAddNoticeWinsShow(true) ;
        
    } else if (cmpId=="sm.lookupuser"){
        var userWin = getUserWin() ;
        sm_user_store.loadData([]) ;
        sm_user_store.load() ;
        add2tabpanel(mgrTabpanel,userWin) ;
        userWin.show() ; 
        setAddUserWinsShow(false) ;

    } else if (cmpId=="sm.adduser"){
        var userWin = getUserWin() ;
        sm_user_store.loadData([]) ;
        add2tabpanel(mgrTabpanel,userWin) ;
        userWin.show() ; 
        setAddUserWinsShow(true) ;

    } else if (cmpId=="sq.quit"){
        window.location.href = SERVER ;
    } else if (cmpId=="ss.loan"){
    } else if (cmpId=="ss.loan"){
    } else if (cmpId=="ss.loan"){
    } else {
    }
}

var mgrTree = Ext.create('Ext.tree.Panel', {
	title: '学生工作',
	deferRowRender: true,
    rootVisible:false,
	useArrows: true,
	listeners: {
		itemclick: {
			fn: treeItemClick
		}
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
		},{
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
			}]
		},
		{
			text: '在校情况',
			id: 'studentinschool',
			children: [{
				id: 'ss.statics',
				text: '在校学生统计',
				leaf: true
			}]
		}]
	}
});

var mgrStuInfoTree = Ext.create('Ext.tree.Panel', {
	title: '学生信息',
	deferRowRender: true,
    rootVisible:false,
	useArrows: true,
	listeners: {
		itemclick: {
			fn: treeItemClick
		}
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
    rootVisible:false,
	listeners: {
		itemclick: {
			fn: treeItemClick
		}
	},
	root: {
		id: 'sysMangeRoot',
		text: '系统管理',
		expanded: true,
		children: [{
            id:'sm.user',
            text:'用户管理',
            children:[{
			    id: 'sm.lookupuser',
			    text: '查看用户',
                leaf:true		
            },
            {
			    id: 'sm.adduser',
			    text: '添加用户',
                leaf:true		
            }]
        },
        {
            id:'sm.notice',
            text:'通知/公告管理',
            children:[
		    {
			    id: 'sm.lookupnotice',
			    text: '查看通知/公告',
                leaf:true
            },
	        {
			    id: 'sm.addnotice',
			    text: '添加通知/公告',
                leaf:true
		    }]
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
		}
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
    //Ext.Loader.injectScriptElement("static/extjs/locale/ext-lang-zh_CN.js") ;
	
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
			html: ['<img src=static/pic/main5.jpg width=1600 height=150 />', ''].join('')
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
            mgrSysTree,
			mgrQuitTree
            ]
		},
		{
			region: 'center',
			layout: 'fit',
			items: [mgrTabpanel]
		}]
	});
    //setNewsOnFirstPage() ;
// show the new list 
    // show the news content of the first one on the list
    var newsWin = getnewsWin() ;
    add2tabpanel(mgrTabpanel,newsWin) ;
    news_list_store.load() ;
    setNews2Form('','','newsform') ;
});

