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
