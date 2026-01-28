// Esse código cria um store global com Zustand pra gerenciar dados do usuário (logado ou convidado).

import zustandStorage from "@/utils/zustandStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  isGuest: boolean;
  user: any;
  setIsGuest: (isGuest: boolean) => void;
  setUser: (user: any) => void;
}

const useUserStore = create<UserStore>()(
  // Middleware de persistência pra salvar o estado no armazenamento
  persist(
    (set) => ({
      // Estado inicial
      isGuest: false,
      user: null,
      // Funções pra atualizar o estado
      setIsGuest: (isGuest: boolean) => set({ isGuest }),
      setUser: (user: any) => set({ user }),
    }),
    {
      name: "user", // nome da chave no armazenamento
      storage: createJSONStorage(() => zustandStorage), // usando armazenamento customizado
    },
  ),
);

export default useUserStore;
