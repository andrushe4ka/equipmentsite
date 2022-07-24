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
	app2.options = app.options
	//for (const idx in response) {
	//	app.options.push(response[idx].name)
	//}
})

Vue.component('equipment-item', {
	delimiters: ["[[","]]"],
	data: function () {
		return {
			mode: 0,
		}
	},
	template:
	'\
		<tr>\
			<td>\
				<select :disabled="[[ mode ]] == 0" v-model="type">\
					<option v-for="option in options" v-bind:value="option.id">\
						[[ option.name ]]\
					</option>\
				</select>\
			<td><input :disabled="[[ mode ]] == 0" v-model="serial_number"></td>\
			<td><input :disabled="[[ mode ]] == 0" v-model="note"></td>\
			<td>\
				<template v-if="[[ mode ]] == 0">\
					<button v-on:click="mode = 1">Изменить</button>\
					<button v-on:click="$emit(\'remove\')">Удалить</button>\
				</template>\
				<template v-if="[[ mode ]] == 1">\
					<button v-on:click="mode = 0; $emit(\'save\')">Сохранить</button>\
					<button v-on:click="mode = 0; $emit(\'reload\')">Отмена</button>\
				</template>\
			</td>\
		</tr>\
	',
	props: ['type', 'serial_number', 'note', 'options']
})

app2 = new Vue({
	el: '#formView',
	data: {
		searchText: '',
		equipments: [],
		options: [],
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
		remData: function (index) {
			console.log('Remove', index)
		},
		modData: function (index) {
			console.log('Modify', index)
		}
	}
})
