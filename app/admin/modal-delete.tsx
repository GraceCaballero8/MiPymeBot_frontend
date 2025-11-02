"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type props = {
  open: boolean;
  setOpen: Function;
  user: any;
  setUserToDelete: Function;
};

export function DialogUserDelete(props: props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:4000/api/users/${props.user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("User deleted:", props.user.id);
      props.setOpen(false);
      props.setUserToDelete(null);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error al eliminar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={props.open}
      onOpenChange={() => {
        props.setOpen(false);
        props.setUserToDelete(null);
      }}
    >
      <DialogContent className="sm:max-w-[500px] bg-linear-to-br from-red-50 to-pink-50 border-0 shadow-2xl">
        <DialogHeader className="pb-4 border-b border-red-100">
          <DialogTitle className="text-2xl font-bold bg-linear-to-br from-red-600 to-pink-600 bg-clip-text text-transparent">
            🗑️ Eliminar Usuario
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-red-100">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Usuario a eliminar:
            </p>
            <div className="space-y-2">
              <p className="text-lg font-bold text-gray-800">
                {props.user?.full_name}
              </p>
              <p className="text-sm text-gray-600">{props.user?.email}</p>
              <span className="inline-block text-xs font-medium bg-red-100 text-red-700 px-3 py-1 rounded-full">
                {props.user?.role?.alias}
              </span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800 flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <span>
                <strong>Advertencia:</strong> Todos los datos relacionados con
                este usuario se perderán permanentemente.
              </span>
            </p>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-4 border-t border-red-100">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-medium"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-linear-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-red-500/30 transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H4c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Eliminando...
              </span>
            ) : (
              "🗑️ Eliminar Usuario"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
