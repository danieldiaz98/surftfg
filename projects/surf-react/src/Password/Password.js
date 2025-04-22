class Password {
    constructor(password, repeatPassword) {
        this.password = password;
        this.repeatPassword = repeatPassword;
    }

    isValid() {
        if (this.password.length < 6) {
            console.error("La contraseña debe tener al menos 6 caracteres");
            return false; // La contraseña es demasiado corta
        }
        else if (this.password.length >= 6 && !this.password === this.repeatPassword) {
            console.log("Las contraseñas no coinciden");
            return false; // La contraseña no coincide con la repetida
        } else if (this.password.length >= 6 && this.password === this.repeatPassword) {
            console.log("Las contraseñas coinciden");
            return true; // La contraseña es válida
        }
    }
}

export default Password;