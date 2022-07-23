function get_details(result) {
	var text = "";
	for (let key in result) text = text + key + " : " + result[key] + "\n";
	return text
}
function callAPI(requestOptions, relURL, action) {
	fetch("http://127.0.0.1:8000/api/" + relURL, requestOptions)
	.then(response => {
		console.log(response)
		if (response.ok){
			response.json()
			.then(function (result) {
				console.log(result);
				action(result);
			})
		} else{
			response.json()
			.then(result => {
				console.log(result)
				alert(
					"Server returned " + response.status + " : " + response.statusText + "\n" +
					get_details(result)
				);
			})
		}
	})
}

var app = new Vue({
	el: '#formAdd',
	data: {
		selected_type: '',
		serial_number: '',
		note: '',
		options: [],
	},
	methods: {
		sendData() {
			var serial_number = this.serial_number.trim().split(/\s+/);
			console.log(serial_number)
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					serial_number: serial_number,
					note: this.note,
					//type: "http://127.0.0.1:8000/api/equipment-type/" + this.selected_type.toString() + "/"
					type: this.selected_type
				})
			};
			console.log(requestOptions)
			fetch("http://127.0.0.1:8000/api/equipment/", requestOptions)
			.then(response => {
				console.log(response)
				if(response.ok){
					return response.json()    
				} else {
					response.json()
					.then(result => {
						console.log(result)
						function get_details(result) {
							var text = "";
							for (let key in result) text = text + key + " : " + result[key] + "\n";
							return text
						}
						alert(
							"Server returned " + response.status + " : " + response.statusText + "\n" +
							get_details(result)
						);
					})
				}
			})
		}
	}
})
fetch("http://127.0.0.1:8000/api/equipment-type/", {
	"method": "GET"
})
.then(response => {
	console.log(response)
	if(response.ok){
		return response.json()    
	} else{
		response.json()
		.then(result => {
			alert(
				"Server returned " + response.status + " : " + response.statusText + "\n" +
				result.detail
			);
		})
	}                
})
.then(response => {
	console.log(response)
	app.options = response
	//for (const idx in response) {
	//	app.options.push(response[idx].name)
	//}
})

Vue.component('equipment-item', {
	delimiters: ["[[","]]"],
	template:
	'\
		<tr>\
			<td>[[ type ]]</td>\
			<td>[[ serial_number ]]</td>\
			<td>[[ note ]]</td>\
			<td><button v-on:click="$emit(\'remove\')">Удалить</button></td>\
		</tr>\
	',
	props: ['type', 'serial_number', 'note']
})

app2 = new Vue({
	el: '#formView',
	data: {
		searchText: '',
		equipments: [],
	},
	methods: {
		getData: function () {
			if (this.searchText.replace(/\s/g, '') == "") {
				alert('Empty search string');
				return
			}
			const requestOptions = {
				method: "GET",
			};
			callAPI(
				requestOptions,
				'equipment/?search=' + this.searchText,
				function(response) {if (response.length > 0) app2.equipments = response; else alert('Nothing found')}
			)
		},
		remData: function () {
			console.log('Hello')
		}
	}
})
