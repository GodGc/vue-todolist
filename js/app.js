//防止命名冲突 => 匿名自调用函数
;(function () {
	const todos =[
		{
			id:0,
			title:'Html',
			completed:false
		},
		{
			id:1,
			title:'CSS',
			completed:false
		},
		{
			id:2,
			title:'Javascript',
			completed:false
		}
	]
	const app = new Vue({
		data:{
			todos,
			currentEditing: null,
		},
		methods:{
			handleAddNewTodo(e){
				//方式1:使用表单双向数据绑定
				//但是会增加vue工作,不推荐
				//if(!this.todoText){
				//	console.log('请输入有效的事项');
				//	return;
				//}
				//todos.unshift({
				//	id:this.todos[todos.length-1].id+1,
				//	title: this.todoText,
				//	completed: false
				//})
				//方式2:使用事件对象
				const value = e.target.value.trim()
				if(!value){
					window.alert('请输入有效的事项');
					return;
				}
				this.todos.push({
					id:this.todos.length?(this.todos[this.todos.length-1].id+1): 0,
					title: value,
					completed: false
				})
				//清空输入框
				e.target.value = ''
			},

			handleToggleAll(e){
				const flag = e.target.checked;
				this.todos.forEach(item => {
					item.completed = flag;
				})
			},

			handleDelTodo(index){
				this.todos.splice(index,1)
			},

			handleGetEditing(todo){
				//为了保证editing类名的唯一性,一次只有一个li有
				//设置一个中间变量记录当前双击的项目
				this.currentEditing = todo;
			},

			handleSaveEdit(todo, index, e){
				//1.获取编辑文本框的数据
				//2.数据校验
				//  如果过数据是空的,则直接删除该元素
				//	否则保存编辑
				let value = e.target.value.trim()
				if(!value.length){
					return this.todos.splice(index,1)
				}
				todo.title = value;
				this.currentEditing = null;
			},

			handleCancelEdit(){
				this.currentEditing = null
			},

			handleClearAllCompleted(){
				let tmpTodos = this.todos.filter(function (todo, index) {
					return todo.completed===false;
				})
				this.todos = tmpTodos
			}
		}
	}).$mount('#app')
})()
