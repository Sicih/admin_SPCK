document.getElementById("scoreboard").style.display = "none";
document.getElementById("semester").style.display = "none";

fetch("https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/minhduc/users", {
	method: "GET",
	headers: { "content-type": "application/json" },
})
	.then((res) => {
		if (res.ok) {
			return res.json();
		}
	})
	.then((tasks) => {
		const ro = document.getElementById("tableBody");
		ro.innerHTML = "";
		for (let i = 0; i < tasks.length; i++) {
			ro.innerHTML += `<tr><td>${[i + 1]}</td><td>${
				tasks[i].fullName
			}</td><td>${tasks[i].username}</td><td>${
				tasks[i].dateOfBirth
			}</td><td>${tasks[i].email}</td>
            <td>${tasks[i].class}</td>
            <td>${tasks[i].password}</td>
            <td>${tasks[i].id}</td>
            <td class="thaotac"><span onclick="handleEdit(${
					tasks[i].id
				})"><i class="fa-solid fa-square-pen"></i></span>  <span onclick="handleDelete(${
				tasks[i].id
			})"> <i class="fa-solid fa-trash"></i></span></td><tr>`;
		}
	})
	.catch((error) => {
		console.log(error);
	});

const handleEdit = async (id) => {
	await fetch(
		`https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/minhduc/users/${id}`
	)
		.then((res) => res.json())
		.then((user) => {
			localStorage.setItem("id", `${id}`);
			document.getElementById("scoreboard").style.display = "";
			document.getElementById("semester").style.display = "flex";
			document.getElementById("table_component").style.display = "none";
		})

		.catch((error) => console.error("Error fetching user data:", error));
};

const handleDelete = async (id) => {
	const checkDelete = confirm("Bạn có muốn xoá không?");
	if (checkDelete) {
		const response = await fetch(
			`https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/minhduc/users/${id}`,
			{
				method: "DELETE",
			}
		);
		if (response.ok) {
			location.reload();
		} else {
			console.error("Error deleting user:", response.statusText);
		}
	}
};

const apiUrl = "https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/minhduc/users";
let currentSubject = ""; 
let currentSemester = ""; 
let studentId = localStorage.getItem("id");

const scoreTableBody = document.getElementById("scoreTableBody");
scoreTableBody.innerHTML = "";

async function loadSemester(semester) {
    currentSemester = semester;
    try {
        const response = await fetch(`${apiUrl}/${studentId}`);
        const student = await response.json();
        const scores = student.scores || {}; // Đảm bảo scores tồn tại

        const scoreTableBody = document.getElementById("scoreTableBody");
        scoreTableBody.innerHTML = "";

        const subjects = [
            { name: "Toán", key: "math" },
            { name: "Văn", key: "literature" },
            { name: "Tiếng Anh", key: "english" },
            { name: "Địa", key: "geography" },
            { name: "Lý", key: "physics" },
            { name: "Hóa", key: "chemistry" },
            { name: "Sinh", key: "biology" },
        ];

        subjects.forEach((subject) => {
            // Kiểm tra xem môn học có trong dữ liệu scores hay không
            const score = scores[subject.key]?.[semester] || {};
            const avgScore = calculateAverageScore(score);

            const row = `<tr>
                            <td>${subject.name}</td>
                            <td id="oralScore">${score.oral || "-"}</td>
                            <td id="test15">${score.test15 || "-"}</td>
                            <td id="test1">${score.test1 || "-"}</td>
                            <td id="finalTest">${score.finalTest || "-"}</td>
                            <td>${avgScore}</td>
                            <td class="thaotac">
                                <span onclick="editScore('${
                                                subject.key
                                            }', '${semester}')"><i class="fa-solid fa-square-pen"></i></span>
                            </td>
                         </tr>`;
            scoreTableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


function calculateAverageScore(score) {
    
    const oral = Number(score.oral) || 0;
    const test15 = Number(score.test15) || 0;
    const test1 = Number(score.test1) || 0;
    const finalTest = Number(score.finalTest) || 0;

    const total = oral + test15 + test1 + finalTest;
    return (total / 4).toFixed(2);
}



async function editScore(subjectKey, semester) {
    try {
        const response = await fetch(`${apiUrl}/${studentId}`);
        const student = await response.json(); // Lấy dữ liệu sinh viên

        currentSubject = subjectKey;
        currentSemester = semester;

        // Kiểm tra xem môn học có trong dữ liệu scores hay không
        const score = student.scores?.[subjectKey]?.[semester] || {};

        // Gán giá trị vào các trường input, sử dụng giá trị mặc định nếu không có dữ liệu
        document.getElementById("oralScore").value = score.oral || "";
        document.getElementById("test15").value = score.test15 || "";
        document.getElementById("test1").value = score.test1 || "";
        document.getElementById("finalTest").value = score.finalTest || "";

        // Hiển thị popup
        document.getElementById("editPopup").style.display = "block";
    } catch (error) {
        console.error("Error fetching student data:", error);
    }
}



async function saveChanges() {
	const oralScore = document.getElementById("edit-oralScore").value;
	const test15 = document.getElementById("edit-shortTestScore").value;
	const test1 = document.getElementById("edit-longTestScore").value;
	const finalTest = document.getElementById("edit-semesterScore").value;


	await updateScores(currentSubject, currentSemester, {
		oral: oralScore,
		test15: test15,
		test1: test1,
		finalTest: finalTest,
	});

	closePopup();
	loadSemester(currentSemester);
}

async function updateScores(subjectKey, semester, newScores) {
    try {
        // Lấy dữ liệu người dùng hiện tại từ API
        const response = await fetch(`${apiUrl}/${studentId}`);
        const userData = await response.json();

        // Cập nhật chỉ phần scores cho môn học và học kỳ tương ứng
        userData.scores[subjectKey][semester] = {
            ...userData.scores[subjectKey][semester],
            ...newScores,
        };

        // Gửi dữ liệu đã cập nhật lên API
        const updateResponse = await fetch(`${apiUrl}/${studentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!updateResponse.ok) {
            throw new Error("Network response was not ok");
        }

        console.log("Scores updated successfully");
    } catch (error) {
        console.error("Error updating scores:", error);
    }
}



// Hàm đóng popup
function closePopup() {
	document.getElementById("editPopup").style.display = "none";
}

// Lắng nghe sự kiện cho nút lưu
document.getElementById("saveButton").addEventListener("click", saveChanges);

document.getElementById("maintenanceMessage").onclick = function() {
    alert("Trang đang được bảo trì. Xin vui lòng quay lại sau!");
};
