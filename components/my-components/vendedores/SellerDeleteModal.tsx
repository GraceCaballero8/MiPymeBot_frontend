"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Seller } from "@/app/interfaces/seller.interface";
import { AlertTriangle } from "lucide-react";

interface SellerDeleteModalProps {
  open: boolean;
  seller: Seller;
  onClose: () => void;
  onSuccess: () => void;
}

export function SellerDeleteModal({
  open,
  seller,
  onClose,
  onSuccess,
}: SellerDeleteModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const loadingToast = toast.loading("Eliminando vendedor...");

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/users/${seller.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("¡Vendedor eliminado exitosamente!", {
        id: loadingToast,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al eliminar vendedor",
        {
          id: loadingToast,
        }
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Eliminar Vendedor
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-gray-700 mb-4">
            ¿Estás seguro de que deseas eliminar a{" "}
            <strong>
              {seller.first_name} {seller.last_name_paternal}
            </strong>
            ?
          </p>
          <p className="text-sm text-gray-500">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
