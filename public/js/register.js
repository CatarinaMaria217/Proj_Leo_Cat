        function register() {
            var newUser = document.getElementById("newUsername").value;
            var newPass = document.getElementById("newPassword").value;

            // Simples validação de campos vazios
            if (newUser === "" || newPass === "") {
                document.getElementById("registerMessage").innerText = "Por favor, preencha todos os campos!";
                return;
            }

            // Verificando se o usuário já existe (salvo no localStorage)
            var storedUser = localStorage.getItem(newUser);
            if (storedUser) {
                document.getElementById("registerMessage").innerText = "Usuário já existe!";
                return;
            }

            // Registrando o novo usuário
            localStorage.setItem(newUser, newPass);
            localStorage.setItem("username", newUser)
            console.log("Usuário registrado: ", newUser);
            console.log("Senha armazenada: ", newPass);
            console.log("Chave 'username' no localStorage: ", localStorage.getItem("username"));
            alert("Registro bem-sucedido! Agora você pode fazer login.");

            // Redireciona para o login
            window.location.href = "login.html";
        }