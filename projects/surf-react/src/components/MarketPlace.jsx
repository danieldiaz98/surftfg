import { UserAuth } from "../context/AuthContext";
import UserProducts from "./UserProducts";
import OtherUsersProducts from "./OtherUsersProducts";
import Navbar from "./Navbar";

function Marketplace() {
  const { session } = UserAuth();
  const userId = session?.user?.id;

  if (!userId) return <p>Cargando...</p>;

  return (
    <>
        <Navbar />
        <div className="container mt-5">
        <h2 className="mb-4">Marketplace</h2>

        <section className="mb-5">
            <h4>Tus productos en venta</h4>
            <UserProducts userId={userId} isOwnProfile={true} />
        </section>

        <section>
            <h4>Productos de otros usuarios</h4>
            <OtherUsersProducts currentUserId={userId} />
        </section>
        </div>
    </>
  );
}

export default Marketplace;
