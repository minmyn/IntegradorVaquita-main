// Archivo: login.js (¡Versión Corregida!)

document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector(".login-form");

  // CORRECCIÓN 1: Agregar el protocolo 'http://'
  const LOGIN_ENDPOINT = "http://localhost:8548/usuarios/login"; 

  form.addEventListener("submit", async function(event) { 
    event.preventDefault(); 

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    if (correo === "" || password === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      alert("Por favor, introduce un correo electrónico válido.");
      return;
    }
    
    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: correo,
          clave: password, 
        }),
      });

      const authData = await response.json(); 

      // 1. Verificamos respuesta 200 OK y estado interno 'true'
      if (response.ok && authData.estado) {
        
        const token = authData.token;
        const idUser = authData.idUser;
        
        // CORRECCIÓN 3: APLICAR REGLA DE ROL (no buscar data.rol)
        const rolUsuario = (idUser === 1) ? "admin" : "empleado"; 
        
        // Guardamos Token, ID y Rol
        localStorage.setItem("authToken", token); 
        localStorage.setItem("idUsuario", idUser); 
        localStorage.setItem("rolUsuario", rolUsuario); 
        
        // Redirección
        alert(`Inicio de sesión exitoso. ¡Bienvenido ${rolUsuario === "admin" ? "Administrador" : "Encargado"}!`);
        
        if (rolUsuario === "admin") {
          window.location.href = "../Page/home.html";
        } else { // Si es "empleado" o cualquier otro ID
          window.location.href = "../Page/homeEmpleado.html"; 
        }

      } else {
        // Fallo en la autenticación (401, 400, etc.)
        // Usamos authData.mensaje (el que manda la API) o el mensaje genérico
        alert(authData.mensaje || "Correo o contraseña incorrectos. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // Este mensaje aparece si el API no está corriendo o hay un error de red
      alert("Hubo un problema de conexión con el servidor. Verifica que la API esté corriendo en 8548.");
    }
  });
});