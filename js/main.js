document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/minhduc/article';
    const articleTable = document.querySelector('#articleTable tbody');
    const addArticleBtn = document.getElementById("addArticleBtn");
    const addArticlePopup = document.getElementById("addArticlePopup");
    const closePopup = document.querySelector(".close");
    const addArticleForm = document.getElementById("addArticleForm");
    const imageInput = document.getElementById("image");
    const imagePreview = document.getElementById("imagePreview");


    imageInput.addEventListener("change", function() {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block"; 
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = "none"; 
        }
    });

   
    function validateForm(title, content) {
 
        if (title.length > 10) {
            alert("Chủ đề không được quá 10 ký tự.");
            return false;
        }


        const contentWords = content.trim().split(/\s+/);
        if (contentWords.length > 120) {
            alert("Nội dung không được quá 120 chữ.");
            return false;
        }

        return true;
    }


    function loadArticles() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                articleTable.innerHTML = '';
                data.forEach((article, index) => {
                    const articleId = article._id || article.id; 
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${article.content}</td>
                        <td>${article.title}</td>
                        <td><img src="${article.image}" alt="Image"></td>
                        <td><button class="delete-btn" data-id="${articleId}">Xóa</button></td>
                    `;
                    articleTable.appendChild(row);
                });

              
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const articleId = this.getAttribute('data-id');
                        deleteArticle(articleId);
                    });
                });
            })
            .catch(error => console.error('Error:', error));
    }

  
    addArticleBtn.onclick = function() {
        addArticlePopup.style.display = "flex";
    };


    closePopup.onclick = function() {
        addArticlePopup.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === addArticlePopup) {
            addArticlePopup.style.display = "none";
        }
    };


    addArticleForm.onsubmit = function(event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const content = document.getElementById("content").value.trim();
        const imageFile = document.getElementById("image").files[0];

        if (!title || !content || !imageFile) {
            alert("Vui lòng điền đủ thông tin và chọn ảnh!");
            return;
        }

        
        if (!validateForm(title, content)) {
            return; 
        }


        const reader = new FileReader();
        reader.onloadend = function() {
            const imageData = reader.result;


            const newArticle = {
                title: title,
                content: content,
                image: imageData
            };

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newArticle)
            })
            .then(response => response.json())
            .then(data => {
                alert("Bài báo đã được thêm thành công!");
                loadArticles();
                addArticlePopup.style.display = "none";
                addArticleForm.reset(); 
                imagePreview.style.display = "none"; 
            })
            .catch(error => console.error('Error:', error));
        };

        reader.readAsDataURL(imageFile);
    };

    function deleteArticle(articleId) {
        if (confirm("Bạn có chắc muốn xóa bài báo này?")) {
            fetch(`${apiUrl}/${articleId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert("Bài báo đã được xóa thành công!");
                loadArticles(); 
            })
            .catch(error => console.error('Error:', error));
        }
    }


    loadArticles();
});
