# jsTpl
这个js是一个简单的js模板工具

使用说明：

1，将写好的html模板取出，传入模板函数 template（string）
例子
	<script id="tpl" type="text/plain">
		<p>Today:{date}</p>
		<a href="/{user.id|safe}">{user.company}</a>
	</script>
	
	var tpl = new Template(document.getElementById("tpl").innerHTML);
	
2，定义好你要替换的数据
例如
	var s = tpl.render({
		date: 20150101,
	    user: {
	        id: 'A-000&001',
	        company: 'AT&T'
	    }
	});
	这样，s就是转换后的html字符串
	
3，填充转换好的模板字符串
例如
document.getElementById("body").innerHTML = s;

谢谢
