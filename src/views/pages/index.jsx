import logo from '../../assets/images/Logosimbolo-SENA-PRINCIPAL.png'

const Bienvenido = () => {
  return (
    <div className="container text-center mt-5">
      {/* Logo de la empresa */}
      <img 
        src={logo} 
        alt="Logo de la empresa" 
        className="mb-4" 
        style={{ width: "150px", height: "auto" }}
      />

      {/* Título y descripción */}
      <h1 className="fw-bold">Bienvenido al Sistema de Gestión</h1>
      <h2 className="text-secondary">
        Administra solicitudes de mantenimiento y reserva de espacios de manera eficiente.
      </h2>
      <p className="mt-3">
        Optimiza la gestión de espacios y el mantenimiento con nuestra plataforma diseñada para 
        facilitar el seguimiento y la organización de solicitudes de mantenimiento en el sena.
      </p>
    </div>
  );
};

export default Bienvenido;
