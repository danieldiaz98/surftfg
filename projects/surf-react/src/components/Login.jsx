
function Login () {
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Inicio de sesión</h2>

        <form>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Ingrese su email" />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" placeholder="Ingrese su contraseña" />
          </div>

          <button type="submit" className="btn mt-4 btn-primary w-100">
            Inicia Sesión
          </button>
        </form>
      </div>
    </div>
    )
}

export default Login;