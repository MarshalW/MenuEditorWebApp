//需要加载的三方库
require.config({
    paths: {
        jquery: '/bower_components/jquery/dist/jquery.min',
        can: '/bower_components/canjs/amd/can',
        'can.fixture': '/bower_components/canjs/amd/can/util/fixture',
        'can.ejs': '/bower_components/canjs/amd/can/view/ejs',
        bootstrap: '/bower_components/bootstrap/dist/js/bootstrap.min'
    }
});

//业务代码
require(['can', 'can.fixture', 'can.ejs'], function (can) {
	//导航控件
	var NaviBarWidget=can.Control({
		init: function () {
            this.render();
        },
        render: function () {
            this.element.html(
                can.view('../views/navibar.ejs', this.options)
            );
        },
        'a click':function(el){
        	var command=el.attr("href");
        	this.setCommand(command);
        },
        setCommand:function(command){
        	for(var i in this.options.bars){
        		var bar=this.options.bars[i];
        		if(bar.anchor==command){
        			this.options.attr('currentIndex',i);
        			break;
        		}
        	}
        }
	});

	var naviBars=new can.Map({bars:[{title:'列表',anchor:'#list'},{title:'添加',anchor:'#create'}], currentIndex:0});

	//菜单列表控件
	var MenuListWidget=can.Control({
		init: function () {
            this.render();
        },
        render: function () {
            this.element.html(
                can.view('../views/menulist.ejs', this.options.menulist)
            );
        }
	});

	//菜单表单控件
	var MenuFormWidget=can.Control({
		init: function () {
            this.render();
        },
        render: function () {
            this.element.html(
                can.view('../views/menuform.ejs')
            );
        }
	});


	//集成页面控件的对象
	var AppWidgetWrapper=can.Control({
		init: function () {
            this.navibar=new NaviBarWidget('#navi',naviBars);
            this.setContentWidget();
            var self=this;
            naviBars.bind('change',function(event, attr, how, newVal, oldVal){
            	if(attr=='currentIndex'){
            		self.navibar.render();
            		self.setContentWidget();
            	}
            });
            $(window).on('hashchange', function() {
            	self.navibar.setCommand(window.location.hash);
            	self.navibar.render();
            	self.setContentWidget();
            });
        },
        setContentWidget:function(){
        	switch(naviBars.attr('currentIndex')){
        		case('0'):
        		case(0):
        			this.content=new MenuListWidget('#content');
        			break;
        		case('1'):
        		case(1):
        			this.content=new MenuFormWidget('#content');
        			break;
        	}
        }
	});

	//在页面创建控件
	new AppWidgetWrapper();
});