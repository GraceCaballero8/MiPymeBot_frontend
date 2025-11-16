export default function NotAuthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Acceso No Autorizado
      </h1>
      <p className="text-lg text-gray-700">
        Lo sentimos, no tienes permiso para acceder a esta sección.
      </p>
    </div>
  );
}
