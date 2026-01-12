        function login() {
            var user = document.getElementById("username").value;
            var pass = document.getElementById("password").value;

            // Verificando se o usuário existe e a senha está correta
            var storedPass = localStorage.getItem(user);

            if (storedPass && storedPass === pass) {
                alert("Login bem-sucedido!");
                localStorage.setItem("userLogged", "true");
                localStorage.setItem("username", user);
                window.location.href = "../html/Airtable3.html"; // Redireciona para a página de conteúdo
            } else {
                document.getElementById("message").innerText = "Usuário ou senha incorretos!";
            }
        }