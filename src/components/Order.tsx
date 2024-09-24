import Link from "next/link";
import { Order } from "@/types/Order";

export default function Order({ order }: { order: Order }) {
  return (
    <li>
      <Link href={`/mispedidos/${order.id}`}>
        <div className="stats shadow-xl">
          <div className="stat">
            <div className="stat-title">{order.status}</div>
            <div className="stat-value">${order.total}</div>
            <div className="stat-desc">
              Pedido realizado:{" "}
              <strong>{order.createdAt.toString().split("T")[0]}</strong>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
