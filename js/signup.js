document
	.getElementById("signup-button")
	.addEventListener("click", async function () {
		document.getElementById("overlay").style.display = "flex";

		const username = document.getElementById("username").value.trim();
		const fullName = document.getElementById("FullName").value.trim();
		const dateOfBirth = document.getElementById("DateOfBirth").value.trim();
		const email = document.getElementById("email").value.trim();
		const userClass = document.getElementById("class").value.trim();
		const password = document.getElementById("password").value.trim();

		if (
			!username ||
			!fullName ||
			!dateOfBirth ||
			!email ||
			!userClass ||
			!password
		) {
			alert("Vui lòng điền đầy đủ các trường.");
			document.getElementById("overlay").style.display = "none";
			return;
		}

		const data = {
            username: username,
            fullName: fullName,
            dateOfBirth: dateOfBirth,
            email: email,
            class: userClass,
            password: password,
            scores: {
                math: { k1: { oral: '', test15: '', test1: '', finalTest: '' }, k2: { oral: '', test15: '', test1: '', finalTest: '' } },
                literature: { k1: { oral: '', test15: '', test1: '', finalTest: '' }, k2: { oral: '', test15: '', test1: '', finalTest: '' } },
                english: { k1: { oral: '', test15: '', test1: '', finalTest: '' }, k2: { oral: '', test15: '', test1: '', finalTest: '' } },
                geography: { k1: { oral: '', test15: '', test1: '', finalTest: '' }, k2: { oral: '', test15: '', test1: '', finalTest: '' } },
                physics: { k1: { oral: '', test15: '', test1: '', finalTest: '' }, k2: { oral: '', test15: '', test1: '', finalTest: '' } },
                chemistry: { k1: { oral: '', test15: '', test1: '', finalTest: '' }, k2: { oral: '', test15: '', test1: '', finalTest: '' } },
                biology: { k1: { oral: '', test15: '', test1: '', finalTest: '' }, k2: { oral: '', test15: '', test1: '', finalTest: '' } },
            },
        };
        

		const apiUrl =
			"https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/minhduc/users";

		try {
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (response.ok) {
				console.log("Success:", result);
				alert("Lưu thông tin thành công!");
				alert("ID học sinh:" + result.id);
				location.reload();
			} else {
				throw new Error(result.message || "Failed to save information.");
			}
		} catch (error) {
			console.error("Error:", error);
			alert("Đã xảy ra lỗi khi lưu thông tin.");
		} finally {
			document.getElementById("overlay").style.display = "none";
		}
	});

    document.getElementById("maintenanceMessage").onclick = function() {
        alert("Trang đang được bảo trì. Xin vui lòng quay lại sau!");
    };
    