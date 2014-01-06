Ext.require(['Ext.grid.Panel', 'Ext.grid.*', 'Ext.window.Window', 'Ext.container.Viewport', 'Ext.layout.container.Border', 'Ext.state.*', 'Ext.data.*', 'Ext.tab.*', 'Ext.util.*', 'Ext.toolbar.Paging', 'Ext.String.*', 'Ext.selection.Model',
]);
var HOST = "127.0.0.1"
var PORT = "8888"
/*
 * 工具栏的内容以及对应的id号 
 * */
var mgrList = {
	'dayQuan': 0,
	'money': 1,
	'stuInfo': 2,
	'askVacation': 3,
	'reviewAskVacation': 4,
	'inSchoolStu': 5,
	'outSchoolStu': 6,
};

var mgrTabpanel = Ext.create('Ext.tab.Panel', {
	id: 'mgrTabpanel',
	//name:"mgrTabpanel",
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
	},
	{
		id: 'tab2',
		title: 'Tab 2',
		html: 'Another one',
		closable: true
	}]
});

var testStuModelFields = ['stuid', 'name', 'birthday', 'gender', 'examid', 'headteac', 'identify', 'homephone'];

function getAjaxProxy(Url, Reader, Writer) {
	var testAjaxProxy = Ext.create('Ext.data.proxy.Ajax', {
		url: Url,
		reader: Reader,
		// this is used to read the response data, use "GET"
		writer: Writer // this is used to write date to server, use "POST" 
	});

	return testAjaxProxy;
}

var U = Ext.String.format("http://{0}:{1}/getallstuinfo", HOST, PORT);
//var U = "http://192.168.84.251:8888/getallstuinfo";
var R = {
	type: 'json',
	root: 'users'
}; //,'extraParams':{'testid':12345,'text':'helloworld'}} ;
var testAjaxProxy = getAjaxProxy(U, R, {});
// through set extra param ,we can send some information to server
testAjaxProxy.setExtraParam("testid", 123456);
testAjaxProxy.setExtraParam("text", "helloa");
Ext.define('Student', {
	extend: 'Ext.data.Model',
	fields: testStuModelFields,
	proxy: testAjaxProxy
	/*
    proxy:{
        type:'ajax',
        url:'http://127.0.0.1:8888/getallstuinfo',
        reader:{
            type:'json', // reader used to encode json data 
            root:'users' // the way to find data in response way ,{"success":ture,"users":{...}}
        }
    }*/
});

var teststore = Ext.create('Ext.data.Store', {
	model: 'Student',
	autoLoad: false // load data from url which model setted
});

//var selectMode = new Ext.grid.RowSelectionModel({ singleSelect: true }) ;
var selectMode = new Ext.selection.Model({
	model: "SIMPLE"
});
var dataColumns = new Ext.grid.column.Column({
	items: [{
		xtype: 'rownumberer'
	},
	{
		text: '学号',
		dataIndex: 'stuid'
	},
	{
		text: '姓名',
		dataIndex: 'name'
	},
	{
		text: '年龄',
		dataIndex: 'birthady'
	},
	{
		text: '性别',
		dataIndex: 'gender'
	},
	{
		text: '身份证',
		dataIndex: 'identify'
	},
	{
		text: '家庭联系方式',
		dataIndex: 'homephone'
	}],
	defaults: {
		align: 'center',
		flex: 1
	}
});

var testGrid = Ext.create('Ext.grid.Panel', {
	xtype: 'grid',
	title: 'Simpsons',
	closable: true,
	store: teststore,
	loadMask: true,
	autoHeight: true,
	viewConfig: {
		forceFit: true
	},
    defaults:{
        align:'center',
        flex:1,
        //width: 50,
        //maxWidth:200

    },
	border: true,
	selModel: selectMode,
    //columns: dataColumns,
    columns:[{
        header:'编号',
        text:'编号',
        width:60,
		xtype: 'rownumberer'
	},
	{
		header: '学号',
		dataIndex: 'stuid'
	},
	{
		header: '姓名',
		dataIndex: 'name'
	},
	{
		header: '年龄',
		dataIndex: 'birthday'
	},
	{
		header: '性别',
		dataIndex: 'gender'
	},
	{
		header: '身份证',
		dataIndex: 'identify'
	},
	{
		header: '家庭联系方式',
		dataIndex: 'homephone'
	}],
    border: 5,
	style: {
		//borderColor: 'blue',
		borderStyle: 'solid'
	},
	// paging bar on the bottom
	bbar: Ext.create('Ext.PagingToolbar', {
		store: teststore,
		displayInfo: true,
		displayMsg: 'Displaying topics {0} - {1} of {2}',
		emptyMsg: "No topics to display",
	}),
	renderTo: Ext.getBody()
});

var testGrid2 = Ext.create('Ext.grid.Panel', {
	id: 'testGrid2',
	xtype: 'grid',
	title: 'Simpsons',
	closable: true,
	store: Ext.data.StoreManager.lookup('simpsonsStore'),
	columns: [{
		header: '姓名',
		dataIndex: 'name'
	},
	{
		header: '年龄',
		dataIndex: 'age'
	},
	{
		header: '性别',
		dataIndex: 'sex'
	},
	{
		header: '身份证',
		dataIndex: 'identify'
	},
	{
		header: '联系方式',
		dataIndex: 'phone'
	},
	{
		header: 'Email',
		dataIndex: 'email',
		flex: 1
	}],
	renderTo: Ext.getBody()
});
//test getGridPanel
var cols = [{
	header: '姓名',
	dataIndex: 'name'
},
{
	header: '年龄',
	dataIndex: 'age'
},
{
	header: '性别',
	dataIndex: 'sex'
},
{
	header: '身份证',
	dataIndex: 'identify'
},
{
	header: '联系方式',
	dataIndex: 'phone'
},
{
	header: 'Email',
	dataIndex: 'email',
	flex: 1
}];

function getGridPanel(identify, ti, cols, closeb) {
	// if the identify is already exist ,just return the obj
	tmpGrid = Ext.getCmp(identify);
	if (tmpGrid) {
		return tmpGrid;
	}
	// else create a new one
	var tmpGrid = Ext.create('Ext.grid.Panel', {
		id: identify,
		xtype: 'grid',
		title: ti,
		closable: !! closeb,
		store: Ext.data.StoreManager.lookup('simpsonsStore'),
		columns: cols,
		renderTo: Ext.getBody()
	});
	return tmpGrid;
}

/*
 * add tab to a tabpanel
 */
function add2tabpanel(tabs, obj) {
	// if already added to panel,do nothing
	if (tabs == obj.ownerCt) {
		// do something
	} else {
		tabs.add(obj);
	}
	// set the tab to be activity
	tabs.setActiveTab(obj);
}
function treeItemClick(view, record, item, index, e) {
	//alert(record.raw.id) ;
	//alert(record.raw.text) ;
	var n = mgrList[record.raw.id];
	switch (n) {

	case 0:
		add2tabpanel(mgrTabpanel, testGrid);
		break;
	case 1:
		add2tabpanel(mgrTabpanel, testGrid2);
		break;
	case 2:
		tabId = "tmp2";
		var cmp = Ext.getCmp(tabId);
		if (!cmp) {
			tmpGrid = getGridPanel(tabId, 'tmp2', cols, true);
			add2tabpanel(mgrTabpanel, tmpGrid);
		} else {
			//alert('aleray create the same id tab') ;
			mgrTabpanel.setActiveTab(Ext.getCmp(tabId))
		}
		break;
	case 3:
		//	add2tabpanel(mgrTabpanel, testGrid);
		break;
	case 4:
		//	add2tabpanel(mgrTabpanel, testGrid);
		break;
	case 5:
		//  add2tabpanel(mgrTabpanel, testGrid);
		break;
	case 6:
		//		add2tabpanel(mgrTabpanel, testGrid);
		break;
	default:
		alert(n);
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
			id: 'dayQuan',
			text: '日常量化',
			leaf: true
		},
		{
			id: 'money',
			text: '奖助学金',
			leaf: true
		},
		{
			id: 'stuInfo',
			text: '学生信息',
			leaf: true
		},
		{
			id: 'vacation',
			text: '学生请假',
			children: [{
				id: 'askVacation',
				text: '请假申请',
				leaf: true
			},
			{
				id: 'reviewAskVacation',
				text: '请假审批',
				leaf: true
			}]
		},
		{
			text: '在校情况',
			id: 'stuInSchool',
			children: [{
				id: 'inSchoolStu',
				text: '在校学生',
				leaf: true
			},
			{
				id: 'outSchoolStu',
				text: '离校学生',
				leaf: true
			}]

		}]
	}
});

Ext.onReady(function() {

	// setup the state provider, all state information will be saved to a cookie
	//Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
	teststore.loadPage(1); // this would send params page=1&start=0&limit=25
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
			mgrTree, {
				title: '系统管理',
				html: 'System Management'
			},
			{
				title: '在线帮助',
				html: 'Online Help'
			},
			{
				title: '其他',
				html: 'Other to Deal'
			}]
		},
		{
			region: 'center',
			layout: 'fit',
			items: [mgrTabpanel, ]
		}]
	});
});

