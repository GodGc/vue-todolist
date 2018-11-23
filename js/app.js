//防止命名冲突 => 匿名自调用函数
;(function () {
	//const todos =[
	//	{
	//		id:0,
	//		title:'Html',
	//		completed:false
	//	},
	//	{
	//		id:1,
	//		title:'CSS',
	//		completed:false
	//	},
	//	{
	//		id:2,
	//		title:'Javascript',
	//		completed:false
	//	}
	//]
	const app = new Vue({
		data:{
			todos : JSON.parse(window.localStorage.getItem('todos') || '[]'),
			currentEditing: null,
		},
		watch:{
			//方法名就是 成员变量的名字
			//todos (){
			//	console.log('浅层侦听todos');
			//}
			todos:{
				handler(val, oldVal){
					//当侦听到todos发生改变了(无论是何种变化),都会执行handler里的方法
					//val 新值,oldVal老值
					window.localStorage.setItem('todos',JSON.stringify(val))
				},
				deep:true
			}
		},

		computed:{
			//Vue提供了计算属性,是属性也是方法(本质),但是会把计算后的结果作为属性缓存起来
			//多次调用会使用第一次调用后的结果,在使用时当做属性去写变量名
			//简写模式
			//remainingCount (){
			//	return this.todos.filter(todo => !todo.completed).length
			//}
			//完整模式:
			remainingCount: {
				//获取值:当作为属性使用时会自动执行get方法
				get(){
					return this.todos.filter(todo => !todo.completed).length
				},
				//设置值:实例.remainingCount === xxx,会使用set方法(但是不会改变remainingCount的值)
				set(){
					console.log('remainingCount 的 set被调用了');
				}
			},
			ToggleAllStatus: {
				get(){
					return this.todos.every(todo => todo.completed)
				},
				set(){
					//当双向数据绑定时,每一次当前值的改变都会调用set方法
					// 我们只需要对改变之前的checked状态取反,就可以得到现在的选中状态
					// 比如之前是选中,改变=>未选中,所以只需要!选中就可以得到当前的状态
					// 使用get即可获取之前的状态,当然计算属性默认执行的就是get方法,
					const flag = !this.ToggleAllStatus;
					this.todos.forEach(item => {
						item.completed = flag;
					})
				}
			}
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
