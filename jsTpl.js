function Template(tpl){
	var 
		fn,
		match,
		code = ['var r=[];\nvar _html = function (str) { return str.replace(/&/g, \'&amp;\').replace(/"/g, \'&quot;\').replace(/\'/g, \'&#39;\').replace(/</g, \'&lt;\').replace(/>/g, \'&gt;\'); };'],// 存储运行的模板代码
		re = /\{\s*([a-zA-Z\.\_0-9()]+)(\s*\|\s*safe)?\s*\}/m,//正则，检出模板字符串中的{ something } 需要被替换的部分
		addLine = function(text){//在code 数组中新增元素，就是字符串
			// 每一行是一个push方法，同时把模板字符串中的的 \ 回车 tab 替换为转义后  的字符
			code.push('r.push(\'' + text.replace(/\'/g, '\\\'').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '\');');
		};
	while (match = re.exec(tpl)){//使用re正则匹配模板字符串
		if (match.index > 0){//大于零则表示匹配到{ something } 模板中需要被替换的部分
			addLine(tpl.slice(0, match.index));//将{ something }之前的HTML模板字符串 替换部分字符后 推入数组
		}
		if (match[2]){//匹配到第二组safe正则即不用转义的字符串，例如{ user.id|safe }
			code.push('r.push(String(this.' + match[1] + '));');// 将 this.something 推入
		}else{//无第二组正则，需要转义
			code.push('r.push(_html(String(this.' + match[1] + ')));');// 将 this.something 推入
		}
		tpl = tpl.substring(match.index + match[0].length);// 将模板字符串中的{something}剔除
	}
	// 不再匹配到{something} 循环结束
	addLine(tpl);//将模板字符串末尾推入数组
	code.push('return r.join(\'\')');//模板字符串全部推入后，推入连接方法
	fn = new Function(code.join('\n'));//创建函数，将推入的代码在apply的上下文环境中执行
	// new Function（‘source’） 和 function 创建函数的方式一样的，内部的source是函数体
	// 以下为实例
	// (function() {
	// var r=[];
	// r.push('<p>Today: ');
	// r.push(this.date);
	// r.push('</p>\n<a href="/{ user.id|safe }">');
	// r.push(this.user.company);
	// r.push('</a>');
	// return r.join('')
	// })
	this.render = function(model){
		return fn.apply(model)
	}
}

// 创建一个模板引擎:
// var tpl = new Template('<p>Today: { date }</p>\n<a href="/{ user.id|safe }">{ user.company }</a>');
// 渲染得到HTML片段:
// var model = {
//     date: 20150316,
//     user: {
//         id: 'A-000&001',
//         company: 'AT&T'
//     }
// };
// var html = tpl.render(model);
// console.log(html);