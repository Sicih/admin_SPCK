async function handleCreateAPIUser(url, params) {
	try {
		const data = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(params),
		});

		const res = await data.json();
		console.log(res);
	} catch (error) {
		console.error(error);
	} finally {
		console.log("Đã hoàn thành");
	}
}

const username = document.getElementById("username").value.trim();
const fullName = document.getElementById("FullName").value.trim();
const dateOfBirth = document.getElementById("DateOfBirth").value.trim();
const email = document.getElementById("email").value.trim();
const userClass = document.getElementById("class").value.trim();
const password = document.getElementById("password").value.trim();
const isStudent = document.getElementById("myCheck").checked;

const data = {
	username: username,
	fullName: fullName,
	dateOfBirth: dateOfBirth,
	email: email,
	password: password,
};

document
	.getElementById("button")
	.addEventListener(
		"click",
		handleCreateAPIUser(
			"https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/minhduc/admin",
			data
		)
	);

async function handleGetAPIUser(url) {
	try {
		const data = await fetch(url);
		const res = await data.json();

		console.log(res);
	} catch (error) {
		console.error(error);
	} finally {
		console.log("Đã hoàn thành");
	}
}

handleGetAPIUser('https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/minhduc/users');