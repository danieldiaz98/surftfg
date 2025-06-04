class Password {
    constructor(password, repeatPassword) {
        this.password = password;
        this.repeatPassword = repeatPassword;
    }

    isValid() {
        if (this.password.length < 6) {
            console.error("La contraseña debe tener al menos 6 caracteres");
            return false;
        }
        else if (this.password.length >= 6 && !this.password === this.repeatPassword) {
            console.log("Las contraseñas no coinciden");
            return false;
        } else if (this.password.length >= 6 && this.password === this.repeatPassword) {
            console.log("Las contraseñas coinciden");
            return true;
        }
    }
}

export default Password;