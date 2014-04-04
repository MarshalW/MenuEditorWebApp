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

    var MenuItem=can.Model({
        findAll: 'GET /menu'
    },{});

     // can.fixture({
     //    'GET /menu':function(){
     //        return {
     //            data:[
     //                {name:'意大利面条', price:'20'},
     //                {name:'肥牛饭', price:'22'}
     //            ]
     //        };
     //    }
     // });

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
        },
        'button click':function(el){
            window.location.hash='#list';
        }
	});

	//集成页面控件的对象
	var AppWidgetWrapper=can.Control({
		init: function () {
            this.checkCommand();
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
        checkCommand:function(){
            console.log(window.location.hash);
            if(window.location.hash=='#list'){
                naviBars.attr('currentIndex',0);
                return;
            }
            if(window.location.hash=='#create'){
                naviBars.attr('currentIndex',1);
                return;
            }
        },
        setContentWidget:function(){
            if(this.content){
                this.content.destroy();
            }

        	switch(naviBars.attr('currentIndex')){
        		case('0'):
        		case(0):
                    MenuItem.findAll({},function(menuItems){
                        this.content=new MenuListWidget('#content',{menulist:menuItems});
                    });
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