function get_details(result) {
	var text = "";
	if (Array.isArray(result)) {
		result.forEach(function(item) {text = text + get_details(item)});
		return text
	}
	for (let key in result) text = text + key + " : " + result[key] + "\n";
	return text
}

const apiHost = document.location.origin + '/'

function callAPI(requestOptions, URL, action) {
	fetch(URL, requestOptions)
	.then(response => {
		console.log(response)
		if (response.ok){
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.indexOf("application/json") !== -1) {
				response.json()
				.then(function (result) {
					console.log(result);
					action(result);
				})
			} else action();
		} else{
			response.json()
			.then(result => {
				console.log(result)
				alert(
					"Server returned " + response.status + " : " + response.statusText + "\n" +
					get_details(result)
				);
			}, error => console.log(error))
		}
	})
}

callAPI(
	{"method": "GET"},
	apiHost + 'api/equipment-type/',
	function(response) {
		app.options = response
		app2.options = response
	}
)

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
			if (serial_number == "") {
				alert('Cерийные номера: некорректный ввод');
				return
			}
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					serial_number: serial_number,
					note: this.note,
					type: this.selected_type
				})
			};
			callAPI(
				requestOptions,
				apiHost + 'api/equipment/',
				function(response) {alert('Equipment successfully added')}
			)
		}
	}
})

Vue.component('equipment-item', {
	delimiters: ["[[","]]"],
	data: function () {
		return {
			mode: 0,
			type: this.equipment.type,
			serial_number: this.equipment.serial_number,
			note: this.equipment.note,
		}
	},
	template:
	'\
		<tr>\
			<td>\
				<select class="uk-select uk-form-width-medium" :disabled="mode == 0" v-model="type">\
					<option v-for="option in options" v-bind:value="option.id">\
						[[ option.name ]]\
					</option>\
				</select>\
			<td><input class="uk-input uk-form-width-medium" :readonly="mode == 0" v-model="serial_number"></td>\
			<td><input class="uk-input uk-form-width-medium" :readonly="mode == 0" v-model="note"></td>\
			<td>\
				<template v-if="mode == 0">\
					<button class="uk-button uk-button-default" v-on:click="mode = 1">Изменить</button>\
					<button class="uk-button uk-button-default" v-on:click="$emit(\'remove\')">Удалить</button>\
				</template>\
				<template v-if="mode == 1">\
					<button class="uk-button uk-button-default" v-on:click="save()">Сохранить</button>\
					<button class="uk-button uk-button-default" v-on:click="reload()">Отмена</button>\
				</template>\
			</td>\
		</tr>\
	',
	props: ['equipment', 'options'],
	methods: {
		reload :function () {
			console.log('reload', this.equipment.note);
			this.type = this.equipment.type;
			this.serial_number = this.equipment.serial_number;
			this.note = this.equipment.note;
			this.mode = 0;
		},
		save : function () {
			var serial_number = this.serial_number.trim();
			if (serial_number == "") {
				alert('Cерийный номер: некорректный ввод');
				return
			}
			this.$emit('modify', {
				type: this.type,
				serial_number: this.serial_number,
				note : this.note,
			})
		},
	}
})

app2 = new Vue({
	el: '#formView',
	data: {
		searchText: '',
		equipments: [],
		options: [],
		show_load_more: false,
		next_page_url: '',
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
				apiHost + 'api/equipment/?search=' + this.searchText,
				function(response) {
					app2.equipments = response.results;
					if (response.results.length == 0) alert('Nothing found');
					if (response.next) {
						app2.show_load_more = true;
						app2.next_page_url = response.next;
					} else {
						app2.show_load_more = false;
						app2.next_page_url = '';
					}
				}
			)
		},
		addData: function () {
			const requestOptions = {
				method: "GET",
			};
			callAPI(
				requestOptions,
				this.next_page_url,
				function(response) {
					app2.equipments = app2.equipments.concat(response.results);
					if (response.next) {
						app2.show_load_more = true;
						app2.next_page_url = response.next;
					} else {
						app2.show_load_more = false;
						app2.next_page_url = '';
					}
				}
			)
		},
		remData: function (id, index) {
			console.log('Remove', id)
			const requestOptions = {
				method: "DELETE",
			};
			callAPI(
				requestOptions,
				apiHost + 'api/equipment/' + id.toString() + '/',
				function(response) {app2.equipments.splice(index, 1)}
			)
		},
		modData: function (id, index, data) {
			console.log('Modify', id, data)
			const requestOptions = {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data)
			};
			callAPI(
				requestOptions,
				apiHost + 'api/equipment/' + id.toString() + '/',
				function(response) {app2.$refs.row[index].mode = 0}
			)
		}
	}
})
